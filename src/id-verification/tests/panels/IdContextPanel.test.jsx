import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import IdContextPanel from '@src/id-verification/panels/IdContextPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

describe('IdContextPanel', () => {
  const contextValue = {
    facePhotoFile: 'test.jpg',
    reachedSummary: false,
  };

  afterEach(() => {
    cleanup();
  });

  it('routes to TakeIdPhotoPanel normally', async () => {
    const user = userEvent.setup();

    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IdContextPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    await user.click(button);
    expect(window.location.pathname).toEqual('/take-id-photo');
  });

  it('routes to TakeIdPhotoPanel if reachedSummary is true', async () => {
    const user = userEvent.setup();

    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IdContextPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    await user.click(button);
    expect(window.location.pathname).toEqual('/take-id-photo');
  });
});
