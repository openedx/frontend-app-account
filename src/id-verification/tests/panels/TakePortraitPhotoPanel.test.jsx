/* eslint-disable react/jsx-no-useless-fragment */
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import TakePortraitPhotoPanel from '@src/id-verification/panels/TakePortraitPhotoPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

jest.mock('@src/id-verification/Camera', () => function CameraMock() {
  return <></>;
});

describe('TakePortraitPhotoPanel', () => {
  const contextValue = {
    facePhotoFile: null,
    idPhotoFile: null,
    reachedSummary: false,
    setFacePhotoFile: jest.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  it('doesn\'t show next button before photo is taken', async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakePortraitPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).not.toBeVisible();
  });

  it('shows next button after photo is taken and routes to IdContextPanel', async () => {
    contextValue.facePhotoFile = 'test.jpg';
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakePortraitPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).toBeVisible();
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/id-context');
  });

  it('routes back to SummaryPanel if that was the source', async () => {
    contextValue.facePhotoFile = 'test.jpg';
    contextValue.idPhotoFile = 'test.jpg';
    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakePortraitPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/summary');
  });
});
