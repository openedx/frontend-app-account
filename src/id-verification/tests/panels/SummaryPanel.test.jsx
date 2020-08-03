import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, act, screen, fireEvent } from '@testing-library/react';
import '@edx/frontend-platform/analytics';
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
  };

  afterEach(() => {
    cleanup();
  });

  it('submits', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSummaryPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('submit-button');
    fireEvent.click(button);
    expect(submitIdVerification).toHaveBeenCalled();
  });
});
