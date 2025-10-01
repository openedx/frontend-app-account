import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import { injectIntl, IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '../../IdVerificationContext';
import IdContextPanel from '../../panels/IdContextPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

const IntlIdContextPanel = injectIntl(IdContextPanel);

describe('IdContextPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    facePhotoFile: 'test.jpg',
    reachedSummary: false,
  };

  afterEach(() => {
    cleanup();
  });

  it('routes to TakeIdPhotoPanel normally', async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlIdContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/id-verification/take-id-photo');
  });

  it('routes to TakeIdPhotoPanel if reachedSummary is true', async () => {
    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlIdContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/id-verification/take-id-photo');
  });
});
