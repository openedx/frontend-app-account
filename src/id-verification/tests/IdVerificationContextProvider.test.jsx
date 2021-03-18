import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import { getProfileDataManager } from '../../account-settings/data/service';

import { getExistingIdVerification, getEnrollments } from '../data/service';
import IdVerificationContextProvider from '../IdVerificationContextProvider';

jest.mock('../../account-settings/data/service', () => ({
  getProfileDataManager: jest.fn(),
}));

jest.mock('../data/service', () => ({
  getExistingIdVerification: jest.fn(),
  getEnrollments: jest.fn(() => []),
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
    const context = { authenticatedUser: { userId: 3, roles: [] } };
    await act(async () => render((
      <AppContext.Provider value={context}>
        <IntlProvider locale="en">
          <IdVerificationContextProvider {...defaultProps} />
        </IntlProvider>
      </AppContext.Provider>
    )));
    expect(getExistingIdVerification).toHaveBeenCalled();
    expect(getEnrollments).toHaveBeenCalled();
  });

  it('calls getProfileDataManager if the user has any roles', async () => {
    const context = {
      authenticatedUser: {
        userId: 3,
        username: 'testname',
        roles: ['enterprise_learner'],
      },
    };
    await act(async () => render((
      <AppContext.Provider value={context}>
        <IntlProvider locale="en">
          <IdVerificationContextProvider {...defaultProps} />
        </IntlProvider>
      </AppContext.Provider>
    )));
    expect(getProfileDataManager).toHaveBeenCalledWith(
      context.authenticatedUser.username,
      context.authenticatedUser.roles,
    );
  });
});
