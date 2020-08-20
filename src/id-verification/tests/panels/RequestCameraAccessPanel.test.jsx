import React from 'react';
import { Router } from 'react-router-dom';
import Bowser from 'bowser';
import { createMemoryHistory } from 'history';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { IdVerificationContext } from '../../IdVerificationContext';
import RequestCameraAccessPanel from '../../panels/RequestCameraAccessPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('bowser');

const history = createMemoryHistory();

const IntlRequestCameraAccessPanel = injectIntl(RequestCameraAccessPanel);

describe('RequestCameraAccessPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    tryGetUserMedia: jest.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with media access pending', async () => {
    contextValue.mediaAccess = 'pending';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: '' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.getByRole('button');
    expect(button).toHaveTextContent(/Enable Camera/);
  });

  it('renders correctly with media access granted and routes to PortraitPhotoContextPanel', async () => {
    contextValue.mediaAccess = 'granted';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: '' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-access-success');
    expect(text).toHaveTextContent(/Looks like your camera is working and ready./);
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/portrait-photo-context');
  });

  it('renders correctly with media access denied', async () => {
    contextValue.mediaAccess = 'denied';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: '' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-access-failure');
    expect(text).toHaveTextContent(/It looks like we're unable to access your camera./);
  });

  it('renders correctly with media access unsupported', async () => {
    contextValue.mediaAccess = 'unsupported';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: '' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-access-failure');
    expect(text).toHaveTextContent(/It looks like we're unable to access your camera./);
  });

  it('renders correct directions for Chrome with media access denied', async () => {
    contextValue.mediaAccess = 'denied';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: 'Chrome' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-failure-instructions');
    expect(text).toHaveTextContent(/Open Chrome./);
  });

  it('renders correct directions for Firefox with media access denied', async () => {
    contextValue.mediaAccess = 'denied';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: 'Firefox' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-failure-instructions');
    expect(text).toHaveTextContent(/Open Firefox./);
  });

  it('renders correct directions for Safari with media access denied', async () => {
    contextValue.mediaAccess = 'denied';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: 'Safari' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-failure-instructions');
    expect(text).toHaveTextContent(/Open Safari./);
  });

  it('renders correct directions for IE11 with media access denied', async () => {
    contextValue.mediaAccess = 'denied';
    Bowser.parse = jest.fn().mockReturnValue({ browser: { name: 'Internet Explorer' } });
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlRequestCameraAccessPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const text = await screen.findByTestId('camera-failure-instructions');
    expect(text).toHaveTextContent(/Open the Flash Player/);
  });
});
