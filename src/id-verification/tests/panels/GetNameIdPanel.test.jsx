import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, act, screen, fireEvent } from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { IdVerificationContext } from '../../IdVerificationContext';
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

  afterEach(() => {
    cleanup();
  });

  it('edits', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlGetNameIdPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const yesButton = await screen.findByTestId('name-matches-yes');
    const noButton = await screen.findByTestId('name-matches-no');
    const input = await screen.findByTestId('name-input');
    expect(input).toHaveProperty('readOnly', true);
    fireEvent.click(noButton);
    expect(input).toHaveProperty('readOnly', false);
    fireEvent.change(input, { target: { value: 'test change' } });
    expect(contextValue.setIdPhotoName).toHaveBeenCalled();
    fireEvent.click(yesButton);
    expect(input).toHaveProperty('readOnly', true);
    expect(contextValue.setIdPhotoName).toHaveBeenCalled();
  });

  it('routes to SummaryPanel', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlGetNameIdPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/summary');
  });
});
