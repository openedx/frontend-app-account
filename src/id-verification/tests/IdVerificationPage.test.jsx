import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import { render, act } from '@testing-library/react';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import IdVerificationPage from '../IdVerificationPage';
import * as selectors from '../data/selectors';

jest.mock('../data/selectors', () => jest.fn().mockImplementation(() => ({ idVerificationSelector: () => ({}) })));
jest.mock('../IdVerificationContextProvider', () => jest.fn(({ children }) => children));
jest.mock('../VerifiedNameContext', () => {
  const originalModule = jest.requireActual('../VerifiedNameContext');
  return {
    ...originalModule,
    VerifiedNameContextProvider: jest.fn(({ children }) => children),
  };
});
jest.mock('../panels/ReviewRequirementsPanel');
jest.mock('../panels/RequestCameraAccessPanel');
jest.mock('../panels/PortraitPhotoContextPanel');
jest.mock('../panels/TakePortraitPhotoPanel');
jest.mock('../panels/IdContextPanel');
jest.mock('../panels/GetNameIdPanel');
jest.mock('../panels/TakeIdPhotoPanel');
jest.mock('../panels/SummaryPanel');
jest.mock('../panels/SubmittedPanel');

const IntlIdVerificationPage = injectIntl(IdVerificationPage);

const mockStore = configureStore();
const history = createMemoryHistory();

describe('IdVerificationPage', () => {
  selectors.mockClear();
  jest.spyOn(Storage.prototype, 'setItem');
  const store = mockStore();
  const props = {
    intl: {},
  };

  it('decodes and stores course_id', async () => {
    history.push(`/?course_id=${encodeURIComponent('course-v1:edX+DemoX+Demo_Course')}`);
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <Provider store={store}>
            <IntlIdVerificationPage {...props} />
          </Provider>
        </IntlProvider>
      </Router>
    )));
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'courseId',
      'course-v1:edX+DemoX+Demo_Course',
    );
  });

  it('stores `next` value', async () => {
    history.push('/?next=dashboard');
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <Provider store={store}>
            <IntlIdVerificationPage {...props} />
          </Provider>
        </IntlProvider>
      </Router>
    )));
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'next',
      'dashboard',
    );
  });
});
