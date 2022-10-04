/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import { render, act } from '@testing-library/react';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { mount } from 'enzyme';
import IdVerificationPage from '../IdVerificationPage';
import * as selectors from '../data/selectors';

let wrapper;

jest.mock('../data/selectors', () => jest.fn().mockImplementation(() => ({ idVerificationSelector: () => ({}) })));
jest.mock('../IdVerificationContextProvider', () => jest.fn(({ children }) => children));
jest.mock('../VerifiedNameContext', () => {
  const originalModule = jest.requireActual('../VerifiedNameContext');
  return {
    ...originalModule,
    VerifiedNameContextProvider: jest.fn(({ children }) => children),
  };
});
jest.mock('../panels/ReviewRequirementsPanel', () => function () {
  return <></>;
});
jest.mock('../panels/RequestCameraAccessPanel', () => function () {
  return <></>;
});
jest.mock('../panels/PortraitPhotoContextPanel', () => function () {
  return <></>;
});
jest.mock('../panels/TakePortraitPhotoPanel', () => function () {
  return <></>;
});
jest.mock('../panels/IdContextPanel', () => function () {
  return <></>;
});
jest.mock('../panels/GetNameIdPanel', () => function () {
  return <></>;
});
jest.mock('../panels/TakeIdPhotoPanel', () => function () {
  return <></>;
});
jest.mock('../panels/SummaryPanel', () => function () {
  return <></>;
});
jest.mock('../panels/SubmittedPanel', () => function () {
  return <></>;
});

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

  beforeEach(() => {
    history.push('/id-verification');
    wrapper = mount(
      <Router history={history}>
        <IntlProvider locale="en">
          <Provider store={store}>
            <IntlIdVerificationPage {...props} />
          </Provider>
        </IntlProvider>
      </Router>,
    );
  });
  it('shows modal on click of button', () => {
    wrapper.find('.page__id-verification button').simulate('click');
    expect(wrapper.find('.pgn__modal-body-content').length).toBe(1);
    expect(wrapper.find('.pgn__modal-title').text()).toBe('Privacy Information');
    expect(wrapper.find('.pgn__modal-footer .pgn__action-row button').length).toBe(1);
  });

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
