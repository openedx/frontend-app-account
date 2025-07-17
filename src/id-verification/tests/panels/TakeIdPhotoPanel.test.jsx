import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import TakeIdPhotoPanel from '../../panels/TakeIdPhotoPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('../../Camera');

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
    expect(window.location.pathname).toEqual('/id-verification/get-name-id');
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
    expect(window.location.pathname).toEqual('/id-verification/summary');
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
});
