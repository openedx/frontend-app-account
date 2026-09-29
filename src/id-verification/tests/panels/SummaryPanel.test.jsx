/* eslint-disable no-import-assign */
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import * as dataService from '@src/id-verification/data/api';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import SummaryPanel from '@src/id-verification/panels/SummaryPanel';
import { VerifiedNameContext } from '@src/id-verification/VerifiedNameContext';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

jest.mock('@src/id-verification/data/api');
dataService.submitIdVerification = jest.fn().mockReturnValue({ success: true });

describe('SummaryPanel', () => {
  const appContextValue = {
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
    nameOnAccount: 'test name',
    idPhotoName: 'test name',
    stopUserMedia: jest.fn(),
    setReachedSummary: jest.fn(),
  };

  const verifiedNameContextValue = {};

  const getPanel = async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <VerifiedNameContext.Provider value={verifiedNameContextValue}>
            <IdVerificationContext.Provider value={appContextValue}>
              <SummaryPanel />
            </IdVerificationContext.Provider>
          </VerifiedNameContext.Provider>
        </IntlProvider>
      </Router>
    )));
  };

  afterEach(() => {
    cleanup();
  });

  it('routes back to TakePortraitPhotoPanel', async () => {
    const user = userEvent.setup();

    await getPanel();
    const button = await screen.findByTestId('portrait-retake');
    await user.click(button);
    expect(window.location.pathname).toEqual('/take-portrait-photo');
  });

  it('routes back to TakeIdPhotoPanel', async () => {
    const user = userEvent.setup();

    await getPanel();
    const button = await screen.findByTestId('id-retake');
    await user.click(button);
    expect(window.location.pathname).toEqual('/take-id-photo');
  });

  it('allows user to upload ID photo', async () => {
    const user = userEvent.setup();

    await getPanel();
    const collapsible = await screen.getAllByRole('button', { 'aria-expanded': false })[0];
    await user.click(collapsible);
    const uploadButton = await screen.getByTestId('fileUpload');
    expect(uploadButton).toBeVisible();
  });

  it('displays warning if account is managed by a third party', async () => {
    appContextValue.profileDataManager = 'test-org';
    await getPanel();
    const warning = await screen.getAllByText('test-org');
    expect(warning.length).toEqual(1);
  });

  it('submits', async () => {
    const user = userEvent.setup();

    const verificationData = {
      facePhotoFile: appContextValue.facePhotoFile,
      idPhotoFile: appContextValue.idPhotoFile,
      idPhotoName: appContextValue.idPhotoName,
      courseRunKey: null,
    };
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalledWith(verificationData);
    await waitFor(() => expect(appContextValue.stopUserMedia).toHaveBeenCalled());
  });

  it('submits a name if name is blank', async () => {
    const user = userEvent.setup();

    appContextValue.idPhotoName = '';
    const verificationData = {
      facePhotoFile: appContextValue.facePhotoFile,
      idPhotoFile: appContextValue.idPhotoFile,
      courseRunKey: null,
      idPhotoName: appContextValue.nameOnAccount,
    };
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalledWith(verificationData);
  });

  it('submits a name if a name is unchanged', async () => {
    const user = userEvent.setup();

    appContextValue.idPhotoName = null;
    const verificationData = {
      facePhotoFile: appContextValue.facePhotoFile,
      idPhotoFile: appContextValue.idPhotoFile,
      courseRunKey: null,
      idPhotoName: appContextValue.nameOnAccount,
    };
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalledWith(verificationData);
  });

  it('shows error when cannot submit', async () => {
    const user = userEvent.setup();

    dataService.submitIdVerification = jest.fn().mockReturnValue({ success: false });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalled();
    const error = await screen.getByTestId('submission-error');
    expect(error).toBeDefined();
  });

  it('displays correct error for missing portrait photo', async () => {
    const user = userEvent.setup();

    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Missing required parameter face_image',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent('A photo of your face is required. Please retake your portrait photo.');
  });

  it('displays correct error for missing id photo', async () => {
    const user = userEvent.setup();

    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Photo ID image is required if the user does not have an initial verification attempt.',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent('A photo of your ID card is required. Please retake your ID photo.');
  });

  it('displays correct error for missing account name', async () => {
    const user = userEvent.setup();

    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Name must be at least 1 character long.',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent(
      'A valid account name is required. Please update your account name to match the name on your ID.',
    );
  });

  it('displays correct error for unsupported file type', async () => {
    const user = userEvent.setup();

    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Image data is in an unsupported format.',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await user.click(button);
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent(
      'One or more of the files you have uploaded is in an unsupported format. Please choose from the following:',
    );
  });
});
