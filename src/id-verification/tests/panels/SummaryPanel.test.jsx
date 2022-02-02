import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import * as dataService from '../../data/service';
import IdVerificationContext from '../../IdVerificationContext';
import SummaryPanel from '../../panels/SummaryPanel';
import { VerifiedNameContext } from '../../VerifiedNameContext';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('../../data/service');
dataService.submitIdVerification = jest.fn().mockReturnValue({ success: true });

const IntlSummaryPanel = injectIntl(SummaryPanel);

const history = createMemoryHistory();

describe('SummaryPanel', () => {
  const defaultProps = {
    intl: {},
  };

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
      <Router history={history}>
        <IntlProvider locale="en">
          <VerifiedNameContext.Provider value={verifiedNameContextValue}>
            <IdVerificationContext.Provider value={appContextValue}>
              <IntlSummaryPanel {...defaultProps} />
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
    await getPanel();
    const button = await screen.findByTestId('portrait-retake');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-portrait-photo');
    expect(history.location.state.fromSummary).toEqual(true);
  });

  it('routes back to TakeIdPhotoPanel', async () => {
    await getPanel();
    const button = await screen.findByTestId('id-retake');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-id-photo');
    expect(history.location.state.fromSummary).toEqual(true);
  });

  it('allows user to upload ID photo', async () => {
    await getPanel();
    const collapsible = await screen.getAllByRole('button', { 'aria-expanded': false })[0];
    fireEvent.click(collapsible);
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
    const verificationData = {
      facePhotoFile: appContextValue.facePhotoFile,
      idPhotoFile: appContextValue.idPhotoFile,
      idPhotoName: appContextValue.idPhotoName,
      courseRunKey: null,
    };
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    fireEvent.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalledWith(verificationData);
    await waitFor(() => expect(appContextValue.stopUserMedia).toHaveBeenCalled());
  });

  it('submits a name if name is blank', async () => {
    appContextValue.idPhotoName = '';
    const verificationData = {
      facePhotoFile: appContextValue.facePhotoFile,
      idPhotoFile: appContextValue.idPhotoFile,
      courseRunKey: null,
      idPhotoName: appContextValue.nameOnAccount,
    };
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    fireEvent.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalledWith(verificationData);
  });

  it('submits a name if a name is unchanged', async () => {
    appContextValue.idPhotoName = null;
    const verificationData = {
      facePhotoFile: appContextValue.facePhotoFile,
      idPhotoFile: appContextValue.idPhotoFile,
      courseRunKey: null,
      idPhotoName: appContextValue.nameOnAccount,
    };
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    fireEvent.click(button);
    expect(dataService.submitIdVerification).toHaveBeenCalledWith(verificationData);
  });

  it('shows error when cannot submit', async () => {
    dataService.submitIdVerification = jest.fn().mockReturnValue({ success: false });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await act(async () => fireEvent.click(button));
    expect(dataService.submitIdVerification).toHaveBeenCalled();
    const error = await screen.getByTestId('submission-error');
    expect(error).toBeDefined();
  });

  it('displays correct error for missing portrait photo', async () => {
    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Missing required parameter face_image',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await act(async () => fireEvent.click(button));
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent('A photo of your face is required. Please retake your portrait photo.');
  });

  it('displays correct error for missing id photo', async () => {
    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Photo ID image is required if the user does not have an initial verification attempt.',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await act(async () => fireEvent.click(button));
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent('A photo of your ID card is required. Please retake your ID photo.');
  });

  it('displays correct error for missing account name', async () => {
    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Name must be at least 1 character long.',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await act(async () => fireEvent.click(button));
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent(
      'A valid account name is required. Please update your account name to match the name on your ID.',
    );
  });

  it('displays correct error for unsupported file type', async () => {
    dataService.submitIdVerification = jest.fn().mockReturnValue({
      success: false,
      status: 400,
      message: 'Image data is in an unsupported format.',
    });
    await getPanel();
    const button = await screen.findByTestId('submit-button');
    await act(async () => fireEvent.click(button));
    const error = await screen.getByTestId('submission-error');
    expect(error).toHaveTextContent(
      'One or more of the files you have uploaded is in an unsupported format. Please choose from the following:',
    );
  });
});
