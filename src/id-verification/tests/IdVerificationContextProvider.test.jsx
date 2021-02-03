import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { getExistingIdVerification, getEnrollments } from '../data/service';
import IdVerificationContextProvider from '../IdVerificationContextProvider';

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
    await act(async () => render((
      <AppContext.Provider value={{ authenticatedUser: { userId: 3 } }}>
        <IntlProvider locale="en">
          <IdVerificationContextProvider {...defaultProps} />
        </IntlProvider>
      </AppContext.Provider>
    )));
    expect(getExistingIdVerification).toHaveBeenCalled();
    expect(getEnrollments).toHaveBeenCalled();
  });
});
