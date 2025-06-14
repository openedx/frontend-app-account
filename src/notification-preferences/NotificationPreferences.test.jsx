/* eslint-disable no-import-assign */
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

import { setConfig } from '@edx/frontend-platform';
import * as auth from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, screen } from '@testing-library/react';

import { defaultState } from './data/reducers';
import NotificationPreferences from './NotificationPreferences';
import { LOADING_STATUS, SUCCESS_STATUS } from '../constants';

const courseId = 'selected-course-id';

const mockStore = configureStore();

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('@edx/frontend-platform/auth');

const defaultPreferences = {
  status: SUCCESS_STATUS,
  selectedCourse: courseId,
  apps: [
    { id: 'discussion', enabled: true },
    { id: 'coursework', enabled: true },
  ],
  preferences: [
    {
      id: 'core',
      appId: 'discussion',
      web: true,
      push: true,
      email: true,
      coreNotificationTypes: ['new_comment'],
    },
    {
      id: 'newComment',
      appId: 'discussion',
      web: false,
      push: false,
      email: false,
      coreNotificationTypes: [],
    },
    {
      id: 'newAssignment',
      appId: 'coursework',
      web: false,
      push: false,
      email: false,
      coreNotificationTypes: [],
    },
    {
      id: 'newGrade',
      appId: 'coursework',
      web: false,
      push: false,
      email: false,
      coreNotificationTypes: [],
    },
  ],
  nonEditable: {
    discussion: {
      core: [
        'web',
      ],
    },
  },
};

const setupStore = (override = {}) => {
  const storeState = defaultState;
  storeState.courses = {
    status: SUCCESS_STATUS,
    courses: [
      { id: '', name: 'Account' },
      { id: 'selected-course-id', name: 'Selected Course' },
    ],
  };
  storeState.preferences = {
    ...storeState.preferences,
    ...override,
  };
  const store = mockStore({
    notificationPreferences: storeState,
  });
  return store;
};

const notificationPreferences = (store = {}) => (
  <Router>
    <IntlProvider locale="en">
      <Provider store={store}>
        <NotificationPreferences />
      </Provider>
    </IntlProvider>
  </Router>
);

describe('Notification Preferences', () => {
  let store;

  beforeEach(() => {
    setConfig({
      SHOW_IMMEDIATE_EMAIL_CADENCE: false,
      SHOW_EMAIL_CHANNEL: '',
    });

    store = setupStore({
      ...defaultPreferences,
      status: SUCCESS_STATUS,
      selectedCourse: courseId,
    });

    auth.getAuthenticatedHttpClient = jest.fn(() => ({
      patch: async () => ({
        data: { status: 200 },
        catch: () => {},
      }),
    }));
    auth.getAuthenticatedUser = jest.fn(() => ({ userId: 3 }));
  });

  afterEach(() => jest.clearAllMocks());

  it('tests if all notification apps are listed', async () => {
    await render(notificationPreferences(store));
    expect(screen.queryByTestId('discussion-app')).toBeInTheDocument();
    expect(screen.queryByTestId('coursework-app')).toBeInTheDocument();
  });

  it('show spinner if api call is in progress', async () => {
    store = setupStore({ status: LOADING_STATUS });
    await render(notificationPreferences(store));
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('tests if all notification preferences are listed', async () => {
    await render(notificationPreferences(store));
    expect(screen.queryAllByTestId('notification-preference')).toHaveLength(4);
  });

  it('update preference on click', async () => {
    const wrapper = await render(notificationPreferences(store));
    const element = wrapper.container.querySelector('#core-web');
    expect(element).not.toBeChecked();
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('update account preference on click', async () => {
    store = setupStore({
      ...defaultPreferences,
      status: SUCCESS_STATUS,
      selectedCourse: '',
    });
    await render(notificationPreferences(store));
    const element = screen.getByTestId('core-web');
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test.each([
    { SHOW_IMMEDIATE_EMAIL_CADENCE: false },
    { SHOW_IMMEDIATE_EMAIL_CADENCE: true },
  ])('test immediate cadence is visible iff SHOW_IMMEDIATE_EMAIL_CADENCE is true', async (
    { SHOW_IMMEDIATE_EMAIL_CADENCE },
  ) => {
    setConfig({
      SHOW_IMMEDIATE_EMAIL_CADENCE,
      SHOW_EMAIL_CHANNEL: 'true',
    });
    store = setupStore({
      ...defaultPreferences,
      status: SUCCESS_STATUS,
      selectedCourse: '',
    });
    await render(notificationPreferences(store));
    const button = screen.queryAllByTestId('email-cadence-button')[0];
    await fireEvent.click(button);
    const option = screen.queryByTestId('email-cadence-Immediately');
    if (SHOW_IMMEDIATE_EMAIL_CADENCE) {
      expect(option).toBeInTheDocument();
    } else {
      expect(option).not.toBeInTheDocument();
    }
  });
});
