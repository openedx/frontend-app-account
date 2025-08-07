import React from 'react';
import { render, cleanup, act } from '@testing-library/react';

import { IntlProvider } from '@openedx/frontend-base';
import { SiteContext } from '@openedx/frontend-base';

import { getProfileDataManager } from '../../account-settings/data/service';

import { getExistingIdVerification, getEnrollments } from '../data/service';
import IdVerificationContextProvider from '../IdVerificationContextProvider';
import { VerifiedNameContext } from '../VerifiedNameContext';

jest.mock('../../account-settings/data/service', () => ({
  getProfileDataManager: jest.fn(),
  getVerifiedNameHistory: jest.fn(),
}));

jest.mock('../data/service', () => ({
  getExistingIdVerification: jest.fn(() => ({})),
  getEnrollments: jest.fn(() => ({})),
}));

describe('IdVerificationContextProvider', () => {
  const defaultProps = {
    children: <div />,
    intl: {},
  };

  afterEach(() => {
    cleanup();
  });

  it('renders correctly and calls getExistingIdVerification + getEnrollments', async () => {
    const appContext = { authenticatedUser: { userId: 3, roles: [] } };
    const verifiedNameContext = { verifiedName: '' };
    await act(async () => render((
      <SiteContext.Provider value={appContext}>
        <VerifiedNameContext.Provider value={verifiedNameContext}>
          <IntlProvider locale="en">
            <IdVerificationContextProvider {...defaultProps} />
          </IntlProvider>
        </VerifiedNameContext.Provider>
      </SiteContext.Provider>
    )));
    expect(getExistingIdVerification).toHaveBeenCalled();
    expect(getEnrollments).toHaveBeenCalled();
  });

  it('calls getProfileDataManager if the user has any roles', async () => {
    const appContext = {
      authenticatedUser: {
        userId: 3,
        username: 'testname',
        roles: ['enterprise_learner'],
      },
    };
    const verifiedNameContext = { verifiedName: '' };
    await act(async () => render((
      <SiteContext.Provider value={appContext}>
        <VerifiedNameContext.Provider value={verifiedNameContext}>
          <IntlProvider locale="en">
            <IdVerificationContextProvider {...defaultProps} />
          </IntlProvider>
        </VerifiedNameContext.Provider>
      </SiteContext.Provider>
    )));
    expect(getProfileDataManager).toHaveBeenCalledWith(
      appContext.authenticatedUser.username,
      appContext.authenticatedUser.roles,
    );
  });
});
