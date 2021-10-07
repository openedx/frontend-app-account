import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
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

  beforeEach(() => {
    const mockStorage = {};
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn(key => mockStorage[key]);
  });

  afterEach(() => {
    global.Storage.prototype.setItem.mockReset();
    global.Storage.prototype.getItem.mockReset();
    cleanup();
  });

  it('links to dashboard without courseId or next value', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Your Dashboard/);
    expect(button).toHaveAttribute('href', `${process.env.LMS_BASE_URL}/dashboard`);
  });

  it('links to course when courseId is stored', async () => {
    sessionStorage.setItem('courseId', 'course-v1:edX+DemoX+Demo_Course');
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Course/);
    expect(button).toHaveAttribute('href', `${process.env.LMS_BASE_URL}/courses/course-v1:edX+DemoX+Demo_Course`);
  });

  it('links to specified page when `next` value is provided', async () => {
    sessionStorage.setItem('next', 'some_page');
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return/);
    expect(button).toHaveAttribute('href', `${process.env.LMS_BASE_URL}/some_page`);
  });
});
