import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, screen, act, fireEvent,
} from '@testing-library/react';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
// eslint-disable-next-line import/no-unresolved
import * as blazeface from '@tensorflow-models/blazeface';
import * as analytics from '@edx/frontend-platform/analytics';
import IdVerificationContext from '../IdVerificationContext';
import Camera from '../Camera';

jest.mock('jslib-html5-camera-photo');
jest.mock('@tensorflow-models/blazeface');
jest.mock('@edx/frontend-platform/analytics');

analytics.sendTrackEvent = jest.fn();

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
    blazeface.load = jest.fn().mockResolvedValue({ estimateFaces: jest.fn().mockResolvedValue([]) });
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
    blazeface.load = jest.fn().mockResolvedValue({ estimateFaces: jest.fn().mockResolvedValue([]) });
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
    blazeface.load = jest.fn().mockResolvedValue({ estimateFaces: jest.fn().mockResolvedValue([]) });

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
    setTimeout(() => { expect(blazeface.load).toHaveBeenCalled(); }, 2000);
  });

  it('sends tracking events on portrait photo page', async () => {
    blazeface.load = jest.fn().mockResolvedValue({ estimateFaces: jest.fn().mockResolvedValue([]) });

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
    expect(analytics.sendTrackEvent).toHaveBeenCalledWith('edx.id_verification.user_photo.face_detection_enabled');
    await fireEvent.click(checkbox);
    expect(analytics.sendTrackEvent).toHaveBeenCalledWith('edx.id_verification.user_photo.face_detection_disabled');
  });

  it('sends tracking events on id photo page', async () => {
    blazeface.load = jest.fn().mockResolvedValue({ estimateFaces: jest.fn().mockResolvedValue([]) });

    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...idProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    await fireEvent.loadedData(screen.queryByTestId('video'));
    const checkbox = await screen.findByLabelText('Enable Face Detection');
    await fireEvent.click(checkbox);
    expect(analytics.sendTrackEvent).toHaveBeenCalledWith('edx.id_verification.id_photo.face_detection_enabled');
    await fireEvent.click(checkbox);
    expect(analytics.sendTrackEvent).toHaveBeenCalledWith('edx.id_verification.id_photo.face_detection_disabled');
  });
});
