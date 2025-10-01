import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import { injectIntl, IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '../../IdVerificationContext';
import { VerifiedNameContext } from '../../VerifiedNameContext';
import GetNameIdPanel from '../../panels/GetNameIdPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

const IntlGetNameIdPanel = injectIntl(GetNameIdPanel);

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
      <Router>
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
    expect(window.location.pathname).toEqual('/id-verification/summary');
  });
});
