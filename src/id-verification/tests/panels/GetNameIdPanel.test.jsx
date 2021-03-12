import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
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

  const contextValue = {
    nameOnAccount: 'test',
    userId: 3,
    idPhotoName: '',
    setIdPhotoName: jest.fn(),
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
  };

  const getPanel = async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlGetNameIdPanel {...defaultProps} />
          </IdVerificationContext.Provider>
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

    expect(input).toHaveProperty('readOnly');

    fireEvent.click(noButton);
    expect(input).toHaveProperty('readOnly', false);
    expect(nextButton.classList.contains('disabled')).toBe(true);

    fireEvent.change(input, { target: { value: 'test change' } });
    expect(contextValue.setIdPhotoName).toHaveBeenCalled();

    fireEvent.click(yesButton);
    expect(input).toHaveProperty('readOnly');
    expect(contextValue.setIdPhotoName).toHaveBeenCalled();
  });

  it('disables radio buttons + next button and enables input if account name is blank', async () => {
    contextValue.nameOnAccount = '';
    await getPanel();

    const yesButton = await screen.findByTestId('name-matches-yes');
    const noButton = await screen.findByTestId('name-matches-no');
    const input = await screen.findByTestId('name-input');
    const nextButton = await screen.findByTestId('next-button');

    expect(yesButton).toHaveProperty('disabled');
    expect(noButton).toHaveProperty('disabled');
    expect(input).toHaveProperty('readOnly', false);
    expect(nextButton.classList.contains('disabled')).toBe(true);
  });

  it('blocks the user from changing account name if managed by a third party', async () => {
    contextValue.profileDataManager = 'test-org';
    await getPanel();

    const noButton = await screen.findByTestId('name-matches-no');
    const input = await screen.findByTestId('name-input');
    const nextButton = await screen.findByTestId('next-button');

    fireEvent.click(noButton);
    expect(input).toHaveProperty('readOnly');
    expect(nextButton.classList.contains('disabled')).toBe(true);
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
