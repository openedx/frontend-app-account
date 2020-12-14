import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, act, screen } from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { IdVerificationContext } from '../../IdVerificationContext';
import SubmittedPanel from '../../panels/SubmittedPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlSubmittedPanel = injectIntl(SubmittedPanel);

const history = createMemoryHistory();

describe('SubmittedPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
  };

  const getPanel = async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
  };

  beforeEach(() => {
    global.sessionStorage.getItem = jest.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('links to dashboard without courseRunKey', async () => {
    await getPanel();
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Your Dashboard/);
    expect(button.getAttribute('href')).toEqual(`${getConfig().LMS_BASE_URL}/dashboard`);
  });

  it('links to course with courseRunKey', async () => {
    Storage.prototype.getItem = jest.fn(() => 'test');
    await getPanel();
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Course/);
    expect(button.getAttribute('href')).toEqual(`${getConfig().LMS_BASE_URL}/courses/test`);
  });
});
