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
import {
  getNotificationPreferences,
  postPreferenceToggle,
} from './data/service';

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
      email: true,
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
        'web', 'email',
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
      SHOW_EMAIL_CHANNEL: '',
    });

    store = setupStore({
      ...defaultPreferences,
      status: SUCCESS_STATUS,
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

  it('update account preference on click', async () => {
    store = setupStore({
      ...defaultPreferences,
      status: SUCCESS_STATUS,
    });
    await render(notificationPreferences(store));
    const element = screen.getByTestId('toggle-core-web');
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('test non editable', async () => {
    setConfig({
      SHOW_EMAIL_CHANNEL: 'true',
    });
    store = setupStore({
      ...defaultPreferences,
      status: SUCCESS_STATUS,
      selectedCourse: '',
    });
    await render(notificationPreferences(store));
    expect(screen.getByTestId('toggle-core-web')).toBeDisabled();
    expect(screen.getByTestId('toggle-core-email')).toBeDisabled();
    expect(screen.getAllByTestId('email-cadence-button')[0]).toBeDisabled();
    expect(screen.getByTestId('toggle-newGrade-web')).not.toBeDisabled();
  });
});

describe('Notification Preferences API v2 Logic', () => {
  const LMS_BASE_URL = 'https://lms.example.com';
  let mockHttpClient;

  beforeEach(() => {
    jest.clearAllMocks();

    mockHttpClient = {
      get: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      patch: jest.fn().mockResolvedValue({ data: {} }),
    };
    auth.getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);

    setConfig({ LMS_BASE_URL });
  });

  describe('getNotificationPreferences', () => {
    it('should call the v2 configurations URL', async () => {
      const expectedUrl = `${LMS_BASE_URL}/api/notifications/v2/configurations/`;

      await getNotificationPreferences();

      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('postPreferenceToggle', () => {
    it('should call the v2 configurations URL with PUT method', async () => {
      const expectedUrl = `${LMS_BASE_URL}/api/notifications/v2/configurations/`;
      const testArgs = ['app_name', 'notification_type', 'web', true, 'daily'];

      await postPreferenceToggle(...testArgs);

      expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
      expect(mockHttpClient.put).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });
  });
});
