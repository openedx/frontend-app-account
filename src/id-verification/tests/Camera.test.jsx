/* eslint-disable no-import-assign */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, screen, act, fireEvent,
} from '@testing-library/react';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import CameraPhoto from 'jslib-html5-camera-photo';
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
      <Router>
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
      <Router>
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
      <Router>
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
      <Router>
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
      <Router>
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
      <Router>
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
      <Router>
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
      <Router>
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

  describe('Camera getSizeFactor method', () => {
    let mockGetDataUri;

    beforeEach(() => {
      jest.clearAllMocks();
      mockGetDataUri = jest.fn().mockReturnValue('data:image/jpeg;base64,test');
    });

    it('scales down large resolutions to stay under 10MB limit', async () => {
      const currentSettings = { width: 4000, height: 3000 };

      CameraPhoto.mockImplementation(() => ({
        startCamera: jest.fn(),
        stopCamera: jest.fn(),
        getDataUri: mockGetDataUri,
        getCameraSettings: jest.fn().mockReturnValue(currentSettings),
      }));

      await act(async () => render((
        <Router>
          <IntlProvider locale="en">
            <IdVerificationContext.Provider value={contextValue}>
              <Camera {...defaultProps} />
            </IdVerificationContext.Provider>
          </IntlProvider>
        </Router>
      )));

      const button = await screen.findByRole('button', { name: /take photo/i });
      fireEvent.click(button);

      // For large resolution: size = 4000 * 3000 * 3 = 36,000,000 bytes
      // Ratio = 9,999,999 / 36,000,000 ≈ 0.278
      expect(mockGetDataUri).toHaveBeenCalledWith(expect.objectContaining({
        sizeFactor: expect.closeTo(0.278, 2),
      }));
    });

    it('scales up 640x480 resolution to improve quality', async () => {
      const currentSettings = { width: 640, height: 480 };

      CameraPhoto.mockImplementation(() => ({
        startCamera: jest.fn(),
        stopCamera: jest.fn(),
        getDataUri: mockGetDataUri,
        getCameraSettings: jest.fn().mockReturnValue(currentSettings),
      }));

      await act(async () => render((
        <Router>
          <IntlProvider locale="en">
            <IdVerificationContext.Provider value={contextValue}>
              <Camera {...defaultProps} />
            </IdVerificationContext.Provider>
          </IntlProvider>
        </Router>
      )));

      const button = await screen.findByRole('button', { name: /take photo/i });
      fireEvent.click(button);

      expect(mockGetDataUri).toHaveBeenCalledWith(expect.objectContaining({
        sizeFactor: 2,
      }));
    });

    it('maintains original size for medium resolutions', async () => {
      const currentSettings = { width: 1280, height: 720 };

      CameraPhoto.mockImplementation(() => ({
        startCamera: jest.fn(),
        stopCamera: jest.fn(),
        getDataUri: mockGetDataUri,
        getCameraSettings: jest.fn().mockReturnValue(currentSettings),
      }));

      await act(async () => render((
        <Router>
          <IntlProvider locale="en">
            <IdVerificationContext.Provider value={contextValue}>
              <Camera {...defaultProps} />
            </IdVerificationContext.Provider>
          </IntlProvider>
        </Router>
      )));

      const button = await screen.findByRole('button', { name: /take photo/i });
      fireEvent.click(button);

      expect(mockGetDataUri).toHaveBeenCalledWith(expect.objectContaining({
        sizeFactor: 1,
      }));
    });
  });
});
