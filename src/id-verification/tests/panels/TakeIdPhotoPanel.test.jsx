import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import TakeIdPhotoPanel from '@src/id-verification/panels/TakeIdPhotoPanel';
import messages from '@src/id-verification/IdVerification.messages';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

jest.mock('@src/id-verification/Camera');

describe('TakeIdPhotoPanel', () => {
  const contextValue = {
    facePhotoFile: 'test.jpg',
    idPhotoFile: null,
    reachedSummary: false,
    setIdPhotoFile: jest.fn(),
    useCameraForId: false,
  };

  afterEach(() => {
    cleanup();
  });

  it('doesn\'t show next button before photo is taken', async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakeIdPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).not.toBeVisible();
  });

  it('shows next button after photo is taken and routes to GetNameIdPanel', async () => {
    contextValue.idPhotoFile = 'test.jpg';
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakeIdPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).toBeVisible();
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/get-name-id');
  });

  it('routes back to SummaryPanel if that was the source', async () => {
    contextValue.idPhotoFile = 'test.jpg';
    contextValue.reachedSummary = true;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakeIdPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/summary');
  });

  it('shows correct text if user should use upload', async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakeIdPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    // check that upload title and text are correct
    const title = await screen.findByText('Upload a Photo of Your Identification Card');
    expect(title).toBeVisible();

    const text = await screen.findByTestId('upload-text');
    expect(text.textContent).toContain('Please upload a photo of your identification card');
  });

  it('shows correct text if useCameraForId', async () => {
    contextValue.useCameraForId = true;
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <TakeIdPhotoPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));

    // check that upload title and text are correct
    const title = await screen.findByText(messages['id.verification.id.photo.title.camera'].defaultMessage);
    expect(title).toBeVisible();

    const text = await screen.findByText(messages['id.verification.id.photo.instructions.camera'].defaultMessage);
    expect(text).toBeVisible();
  });
});
