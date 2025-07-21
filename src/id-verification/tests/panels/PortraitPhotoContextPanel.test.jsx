import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PortraitPhotoContextPanel from '../../panels/PortraitPhotoContextPanel';
import IdVerificationContext from '../../IdVerificationContext';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

describe('PortraitPhotoContextPanel', () => {
  const contextValue = { reachedSummary: false };

  afterEach(() => {
    cleanup();
  });

  it('routes to TakePortraitPhotoPanel normally', async () => {
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
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/id-verification/take-portrait-photo');
  });

  it('routes to TakePortraitPhotoPanel if reachedSummary is true', async () => {
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
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/id-verification/take-portrait-photo');
  });
});
