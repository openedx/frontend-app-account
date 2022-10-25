import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import { VerifiedNameContext } from '../../VerifiedNameContext';
import GetNameIdPanel from '../../panels/GetNameIdPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlGetNameIdPanel = injectIntl(GetNameIdPanel);

const history = createMemoryHistory();

describe('GetNameIdPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const IDVerificationContextValue = {
    nameOnAccount: 'test',
    userId: 3,
    idPhotoName: '',
    setIdPhotoName: jest.fn(),
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
  };

  const verifiedNameContextValue = {};

  const getPanel = async (idVerificationContextValue = IDVerificationContextValue) => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <VerifiedNameContext.Provider value={verifiedNameContextValue}>
            <IdVerificationContext.Provider value={idVerificationContextValue}>
              <IntlGetNameIdPanel {...defaultProps} />
            </IdVerificationContext.Provider>
          </VerifiedNameContext.Provider>
        </IntlProvider>
      </Router>
    )));
  };

  afterEach(() => {
    cleanup();
  });

  it('shows feedback message when user has an empty name', async () => {
    await getPanel();
    // Ensure the feedback message on name shows when the user has an empty name
    expect(await screen.queryByTestId('id-name-feedback-message')).toBeTruthy();
  });

  it('does not show feedback message when user has an non-empty name', async () => {
    const idVerificationContextValue = {
      ...IDVerificationContextValue,
      idPhotoName: 'test',
    };
    await getPanel(idVerificationContextValue);
    // Ensure the feedback message on name shows when the user has an empty name
    expect(await screen.queryByTestId('id-name-feedback-message')).toBeNull();
  });

  it('calls setIdPhotoName with correct name', async () => {
    await getPanel();

    const input = await screen.findByTestId('name-input');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(IDVerificationContextValue.setIdPhotoName).toHaveBeenCalledWith('test');
  });

  it('routes to SummaryPanel', async () => {
    await getPanel();

    const button = await screen.findByTestId('next-button');

    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/summary');
  });
});
