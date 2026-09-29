import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import PortraitPhotoContextPanel from '@src/id-verification/panels/PortraitPhotoContextPanel';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

describe('PortraitPhotoContextPanel', () => {
  const contextValue = { reachedSummary: false };

  afterEach(() => {
    cleanup();
  });

  it('routes to TakePortraitPhotoPanel normally', async () => {
    const user = userEvent.setup();

    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <PortraitPhotoContextPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    await user.click(button);
    expect(window.location.pathname).toEqual('/take-portrait-photo');
  });

  it('routes to TakePortraitPhotoPanel if reachedSummary is true', async () => {
    const user = userEvent.setup();

    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <PortraitPhotoContextPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    await user.click(button);
    expect(window.location.pathname).toEqual('/take-portrait-photo');
  });
});
