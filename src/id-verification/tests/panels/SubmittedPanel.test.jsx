import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import { injectIntl, IntlProvider, getSiteConfig } from '@openedx/frontend-base';
import IdVerificationContext from '../../IdVerificationContext';
import SubmittedPanel from '../../panels/SubmittedPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

const IntlSubmittedPanel = injectIntl(SubmittedPanel);

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
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Your Dashboard/);
    expect(button).toHaveAttribute('href', `${getSiteConfig().lmsBaseUrl}/dashboard`);
  });

  it('links to course when courseId is stored', async () => {
    sessionStorage.setItem('courseId', 'course-v1:edX+DemoX+Demo_Course');
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return to Course/);
    expect(button).toHaveAttribute('href', `${getSiteConfig().lmsBaseUrl}/courses/course-v1:edX+DemoX+Demo_Course`);
  });

  it('links to specified page when `next` value is provided', async () => {
    sessionStorage.setItem('next', 'some_page');
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlSubmittedPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('return-button');
    expect(button).toHaveTextContent(/Return/);
    expect(button).toHaveAttribute('href', `${getSiteConfig().lmsBaseUrl}/some_page`);
  });
});
