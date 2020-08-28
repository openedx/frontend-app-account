import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, screen, act, fireEvent } from '@testing-library/react';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { IdVerificationContext } from '../IdVerificationContext';
import Camera from '../Camera';

jest.mock('jslib-html5-camera-photo');
jest.mock('@tensorflow-models/coco-ssd');

window.HTMLMediaElement.prototype.play = () => {};

const IntlCamera = injectIntl(Camera);

const history = createMemoryHistory();

describe('SubmittedPanel', () => {
  const defaultProps = {
    intl: {},
    onImageCapture: jest.fn(),
    isPortrait: true,
  };

  const idProps = {
    intl: {},
    onImageCapture: jest.fn(),
    isPortrait: false,
  };

  const contextValue = {};

  afterEach(() => {
    cleanup();
  });

  it('takes photo', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByRole('button');
    expect(button).toHaveTextContent('Take Photo');
    fireEvent.click(button);
    expect(defaultProps.onImageCapture).toHaveBeenCalled();
  });

  it('shows correct help text for portrait photo capture', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const helpText = screen.getByTestId('videoDetectionHelpText');
    expect(helpText.textContent).toEqual(expect.stringContaining('Your face can be seen clearly'));
  });

  it('shows correct help text for id photo capture', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...idProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const helpText = screen.getByTestId('videoDetectionHelpText');
    expect(helpText.textContent).toEqual(expect.stringContaining('The face can be seen clearly'));
  });

  it('shows spinner when loading face detection', async () => {
    cocoSsd.load = jest.fn().mockResolvedValue({ detect: jest.fn().mockResolvedValue([]) });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    await fireEvent.loadedData(screen.queryByTestId('video'));
    const checkbox = await screen.findByLabelText('Enable Face Detection');
    fireEvent.click(checkbox);
    expect(screen.queryByTestId('spinner')).toBeDefined();
  });

  it('canvas is visible when detection is enabled', async () => {
    cocoSsd.load = jest.fn().mockResolvedValue({ detect: jest.fn().mockResolvedValue([]) });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    await fireEvent.loadedData(screen.queryByTestId('video'));
    expect(screen.queryByTestId('detection-canvas')).toHaveStyle('display:none');
    const checkbox = await screen.findByLabelText('Enable Face Detection');
    await fireEvent.click(checkbox);
    expect(screen.queryByTestId('detection-canvas')).toHaveStyle('display:block');
  });

  it('blazeface is called when detection is enabled', async () => {
    cocoSsd.load = jest.fn().mockResolvedValue({ detect: jest.fn().mockResolvedValue([]) });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    await fireEvent.loadedData(screen.queryByTestId('video'));
    const checkbox = await screen.findByLabelText('Enable Face Detection');
    await fireEvent.click(checkbox);
    setTimeout(() => { expect(cocoSsd.load).toHaveBeenCalled(); }, 2000);
  });
});
