import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import IdContextPanel from '../../panels/IdContextPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlIdContextPanel = injectIntl(IdContextPanel);

const history = createMemoryHistory();

describe('IdContextPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    optimizelyExperimentName: '',
    facePhotoFile: 'test.jpg',
    reachedSummary: false,
  };

  afterEach(() => {
    cleanup();
  });

  it('routes to TakeIdPhotoPanel normally', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlIdContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-id-photo');
  });

  it('routes to TakeIdPhotoPanel if reachedSummary is true', async () => {
    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlIdContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-id-photo');
  });

  it('does not show help text for photo upload if not part of experiment', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlIdContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const title = await screen.queryByText('What if I want to upload a photo instead?');
    expect(title).not.toBeInTheDocument();
  });

  it('shows help text for photo upload if part of experiment', async () => {
    contextValue.optimizelyExperimentName = 'test';
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlIdContextPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const title = await screen.queryByText('What if I want to upload a photo instead?');
    expect(title).toBeInTheDocument();
  });
});
