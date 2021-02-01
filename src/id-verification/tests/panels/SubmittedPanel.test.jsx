import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import SubmittedPanel from '../../panels/SubmittedPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlSubmittedPanel = injectIntl(SubmittedPanel);

const history = createMemoryHistory();

describe('SubmittedPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
  };

  beforeEach(() => {
    global.sessionStorage.getItem = jest.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('links to dashboard without courseRunKey', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Your Dashboard/);
  });
});
