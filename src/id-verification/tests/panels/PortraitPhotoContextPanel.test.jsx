import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import PortraitPhotoContextPanel from '../../panels/PortraitPhotoContextPanel';
import IdVerificationContext from '../../IdVerificationContext';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlPortraitPhotoContextPanel = injectIntl(PortraitPhotoContextPanel);

const history = createMemoryHistory();

describe('PortraitPhotoContextPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = { reachedSummary: false };

  afterEach(() => {
    cleanup();
  });

  it('routes to TakePortraitPhotoPanel normally', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlPortraitPhotoContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-portrait-photo');
  });

  it('routes to TakePortraitPhotoPanel if reachedSummary is true', async () => {
    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlPortraitPhotoContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-portrait-photo');
  });
});
