import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, screen, act,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as analytics from '@edx/frontend-platform/analytics';
import IdVerificationContext from '../IdVerificationContext';
import CollapsibleImageHelp from '../CollapsibleImageHelp';

jest.mock('jslib-html5-camera-photo');
jest.mock('@tensorflow-models/blazeface');
jest.mock('@edx/frontend-platform/analytics');

// eslint-disable-next-line no-import-assign
analytics.sendTrackEvent = jest.fn();

window.HTMLMediaElement.prototype.play = () => {};

describe('CollapsibleImageHelpPanel', () => {
  const contextValue = {
    useCameraForId: true,
    setUseCameraForId: jest.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  it('shows the correct text if user should switch to upload', async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <CollapsibleImageHelp />
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
    contextValue.useCameraForId = false;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <CollapsibleImageHelp />
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
});
