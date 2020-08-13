import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, act, screen, fireEvent, waitFor } from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import '@testing-library/jest-dom/extend-expect';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { submitIdVerification } from '../../data/service';
import { IdVerificationContext } from '../../IdVerificationContext';
import SummaryPanel from '../../panels/SummaryPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('../../data/service', () => ({
  submitIdVerification: jest.fn(() => ({ success: true, message: null })),
}));

const IntlSummaryPanel = injectIntl(SummaryPanel);

const history = createMemoryHistory();

describe('SummaryPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
    nameOnAccount: '',
    idPhotoName: '',
    stopUserMedia: jest.fn(),
  };

  beforeEach(async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSummaryPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
  });

  afterEach(() => {
    cleanup();
  });

  it('routes back to TakePortraitPhotoPanel', async () => {
    const button = await screen.findByTestId('portrait-retake');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-portrait-photo');
    expect(history.location.state.fromSummary).toEqual(true);
  });

  it('routes back to TakeIdPhotoPanel', async () => {
    const button = await screen.findByTestId('id-retake');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/take-id-photo');
    expect(history.location.state.fromSummary).toEqual(true);
  });

  it('allows user to upload ID photo', async () => {
    const collapsible = await screen.getAllByRole('button', { 'aria-expanded': false })[0];
    fireEvent.click(collapsible);
    const uploadButton = await screen.getByTestId('fileUpload');
    expect(uploadButton).toBeVisible();
  });

  it('submits', async () => {
    const button = await screen.findByTestId('submit-button');
    fireEvent.click(button);
    expect(submitIdVerification).toHaveBeenCalled();
    await waitFor(() => expect(contextValue.stopUserMedia).toHaveBeenCalled())
  });
});
