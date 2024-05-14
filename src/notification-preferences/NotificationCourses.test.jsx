/* eslint-disable no-import-assign */
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

import * as auth from '@edx/frontend-platform/auth';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { defaultState } from './data/reducers';
import NotificationCourses from './NotificationCourses';
import { LOADING_STATUS, SUCCESS_STATUS } from '../constants';

const mockStore = configureStore();

jest.mock('@edx/frontend-platform/auth');

const courseList = [
  { id: 'course-id-1', name: 'Course Name 1' },
  { id: 'course-id-2', name: 'Course Name 2' },
  { id: 'course-id-3', name: 'Course Name 3' },
];

const setupStore = (override = {}) => {
  const storeState = defaultState;
  storeState.courses = {
    ...storeState.courses,
    ...override,
  };
  const store = mockStore({
    notificationPreferences: storeState,
  });
  return store;
};

const renderComponent = (store = {}) => (
  render(
    <Router>
      <IntlProvider locale="en">
        <Provider store={store}>
          <NotificationCourses />
        </Provider>
      </IntlProvider>
    </Router>,
  )
);

describe('Notification Courses', () => {
  let store;
  beforeEach(() => {
    store = setupStore({
      courses: courseList,
      status: SUCCESS_STATUS,
      pagination: {
        count: 3,
        currentPage: 1,
        hasMore: false,
        totalPages: 1,
      },
    });

    auth.getAuthenticatedHttpClient = jest.fn(() => ({
      patch: async () => ({
        data: { status: 200 },
        catch: () => {},
      }),
    }));
    auth.getAuthenticatedUser = jest.fn(() => ({ userId: 3 }));
    window.lightningjs = null;
  });

  afterEach(() => jest.clearAllMocks());

  it('tests if all courses are available', async () => {
    await renderComponent(store);
    expect(screen.queryByTestId('courses-list').children).toHaveLength(3);
  });

  it('show spinner if api call is in progress', async () => {
    store = setupStore({ status: LOADING_STATUS });
    await renderComponent(store);
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('show not found page if course list is empty', async () => {
    store = setupStore({ status: SUCCESS_STATUS, courses: [] });
    await renderComponent(store);
    expect(screen.queryByTestId('not-found-page')).toBeInTheDocument();
  });

  it('show load more courses button when hasMore True', async () => {
    store = setupStore({ status: SUCCESS_STATUS, pagination: { ...store.pagination, hasMore: true, totalPages: 2 } });
    await renderComponent(store);

    expect(screen.queryByText('Load more courses')).toBeInTheDocument();
  });
});
