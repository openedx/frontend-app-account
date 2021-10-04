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

  const verifiedNameContextValue = {
    verifiedNameEnabled: false,
  };

  const getPanel = async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <VerifiedNameContext.Provider value={verifiedNameContextValue}>
            <IdVerificationContext.Provider value={IDVerificationContextValue}>
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

  it('edits', async () => {
    await getPanel();

    const yesButton = await screen.findByTestId('name-matches-yes');
    const noButton = await screen.findByTestId('name-matches-no');
    const input = await screen.findByTestId('name-input');
    const nextButton = await screen.findByTestId('next-button');
    const errorMessageQuery = await screen.queryByTestId('id-name-feedback-message');

    expect(input).toHaveAttribute('readonly');
    expect(errorMessageQuery).toBeNull();

    fireEvent.click(noButton);
    expect(input).not.toHaveAttribute('readonly');
    expect(nextButton.classList.contains('disabled')).toBe(true);
    expect(nextButton).toHaveAttribute('aria-disabled');

    fireEvent.change(input, { target: { value: 'test change' } });
    expect(IDVerificationContextValue.setIdPhotoName).toHaveBeenCalled();
    // Ensure the feedback message on name shows when the user says the name does not match ID
    expect(await screen.queryByTestId('id-name-feedback-message')).toBeTruthy();

    fireEvent.click(yesButton);
    expect(input).toHaveAttribute('readonly');
    expect(IDVerificationContextValue.setIdPhotoName).toHaveBeenCalled();
  });

  it('disables radio buttons + next button and enables input if account name is blank', async () => {
    IDVerificationContextValue.nameOnAccount = '';
    await getPanel();

    const yesButton = await screen.findByTestId('name-matches-yes');
    const noButton = await screen.findByTestId('name-matches-no');
    const input = await screen.findByTestId('name-input');
    const nextButton = await screen.findByTestId('next-button');
    const errorMessageQuery = await screen.queryByTestId('id-name-feedback-message');

    expect(yesButton).toBeDisabled();
    expect(noButton).toBeDisabled();
    expect(input).not.toHaveAttribute('readonly');
    expect(nextButton.classList.contains('disabled')).toBe(true);
    expect(nextButton).toHaveAttribute('aria-disabled');
    expect(errorMessageQuery).toBeTruthy();
  });

  it('blocks the user from changing account name if managed by a third party', async () => {
    IDVerificationContextValue.profileDataManager = 'test-org';
    await getPanel();

    const noButton = await screen.findByTestId('name-matches-no');
    const input = await screen.findByTestId('name-input');
    const nextButton = await screen.findByTestId('next-button');

    fireEvent.click(noButton);
    expect(input).toHaveAttribute('readonly');
    expect(nextButton.classList.contains('disabled')).toBe(true);
    expect(nextButton).toHaveAttribute('aria-disabled');
    const warning = await screen.getAllByText('test-org');
    expect(warning.length).toEqual(1);
  });

  it('routes to SummaryPanel', async () => {
    await getPanel();

    const button = await screen.findByTestId('next-button');

    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/summary');
  });
});
