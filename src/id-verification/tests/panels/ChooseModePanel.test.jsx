import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import ChooseModePanel from '../../panels/ChooseModePanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlChooseModePanel = injectIntl(ChooseModePanel);

const history = createMemoryHistory();

describe('ChooseModePanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    optimizelyExperimentName: 'test',
    shouldUseCamera: false,
    reachedSummary: false,
  };

  afterEach(() => {
    cleanup();
  });

  it('renders correctly', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlChooseModePanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    // check that radio button for upload is selected
    const uploadRadioButton = await screen.findByLabelText('Upload photos from my device');
    expect(uploadRadioButton).toBeChecked();

    // check that if upload is selected, next button goes to correct screen
    const nextButton = await screen.findByTestId('next-button');
    expect(nextButton.getAttribute('href')).toEqual('/take-portrait-photo');
  });

  it('renders correctly if user wants to use camera', async () => {
    contextValue.shouldUseCamera = true;

    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlChooseModePanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    // check that radio button for camera is selected
    const cameraRadioButton = await screen.findByLabelText('Take pictures using my camera');
    expect(cameraRadioButton).toBeChecked();

    // check that if upload is selected, next button goes to correct screen
    const nextButton = await screen.findByTestId('next-button');
    expect(nextButton.getAttribute('href')).toEqual('/request-camera-access');
  });

  it('reroutes correctly if reachedSummary is true', async () => {
    contextValue.shouldUseCamera = true;
    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlChooseModePanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const nextButton = await screen.findByTestId('next-button');
    fireEvent.click(nextButton);
    expect(history.location.pathname).toEqual('/request-camera-access');
  });

  it('redirects if user is not part of experiment', async () => {
    contextValue.optimizelyExperimentName = '';

    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlChooseModePanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    // check that radio button is not in document
    const cameraRadioButton = await screen.queryByLabelText('Take pictures using my camera');
    expect(cameraRadioButton).not.toBeInTheDocument();
  });
});
