import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import {
  render, cleanup, screen, act, fireEvent,
} from '@testing-library/react';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import * as analytics from '@edx/frontend-platform/analytics';
import IdVerificationContext from '../IdVerificationContext';
import CollapsibleImageHelp from '../CollapsibleImageHelp';

jest.mock('jslib-html5-camera-photo');
jest.mock('@tensorflow-models/blazeface');
jest.mock('@edx/frontend-platform/analytics');

analytics.sendTrackEvent = jest.fn();

window.HTMLMediaElement.prototype.play = () => {};

const IntlCollapsible = injectIntl(CollapsibleImageHelp);

const history = createMemoryHistory();

describe('CollapsibleImageHelpPanel', () => {
  const defaultProps = {
    intl: {},
    isPortrait: true,
  };

  const contextValue = {
    shouldUseCamera: true,
    setShouldUseCamera: jest.fn(),
    optimizelyExperimentName: '',
    mediaAccess: 'granted',
  };

  afterEach(() => {
    cleanup();
  });

  it('does not return if not part of experiment', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCollapsible {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    const titleText = screen.queryByText('Upload a Photo Instead');
    expect(titleText).not.toBeInTheDocument();
  });

  it('does not return if media access denied or unsupported', async () => {
    let titleText = '';
    contextValue.mediaAccess = 'denied';
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCollapsible {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    titleText = screen.queryByText('Upload a Photo Instead');
    expect(titleText).not.toBeInTheDocument();

    contextValue.mediaAccess = 'unsupported';
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCollapsible {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    titleText = screen.queryByText('Upload a Photo Instead');
    expect(titleText).not.toBeInTheDocument();
  });

  it('shows the correct text if user should switch to upload', async () => {
    contextValue.optimizelyExperimentName = 'test';
    contextValue.mediaAccess = 'granted';
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCollapsible {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    const titleText = screen.getByText('Upload a Photo Instead');
    expect(titleText).toBeInTheDocument();
    const helpText = screen.getByTestId('help-text');
    expect(helpText.textContent).toContain('If you are having trouble using the photo capture above');
    const button = screen.getByTestId('toggle-button');
    expect(button).toHaveTextContent('Switch to Upload Mode');
  });

  it('shows the correct text if user should switch to camera', async () => {
    contextValue.optimizelyExperimentName = 'test';
    contextValue.mediaAccess = 'granted';
    contextValue.shouldUseCamera = false;
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCollapsible {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    const titleText = screen.getByText('Use Your Camera Instead');
    expect(titleText).toBeInTheDocument();
    const helpText = screen.getByTestId('help-text');
    expect(helpText.textContent).toContain('If you are having trouble uploading a photo above');
    const button = screen.getByTestId('toggle-button');
    expect(button).toHaveTextContent('Switch to Camera Mode');
  });

  it('shows the correct text if user should switch to camera with pending media access', async () => {
    contextValue.optimizelyExperimentName = 'test';
    contextValue.mediaAccess = 'pending';
    contextValue.shouldUseCamera = false;
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCollapsible {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    const titleText = screen.getByText('Use Your Camera Instead');
    expect(titleText).toBeInTheDocument();
    const helpText = screen.getByTestId('help-text');
    expect(helpText.textContent).toContain('If you are having trouble uploading a photo above');
    const accessLink = screen.getByTestId('access-link');
    fireEvent.click(accessLink);
    expect(history.location.pathname).toEqual('/request-camera-access');
  });
});
