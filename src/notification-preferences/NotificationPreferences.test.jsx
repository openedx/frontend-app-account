/* eslint-disable no-import-assign */
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import {
  fireEvent, render, screen, waitFor, act, within,
} from '@testing-library/react';
import * as auth from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import NotificationPreferences from './NotificationPreferences';
import { defaultState } from './data/reducers';
import { FAILURE_STATUS, LOADING_STATUS, SUCCESS_STATUS } from '../constants';

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
    },
    {
      id: 'newComment',
      appId: 'discussion',
      web: false,
      push: false,
      email: false,
    },
    {
      id: 'newAssignment',
      appId: 'coursework',
      web: false,
      push: false,
      email: false,
    },
    {
      id: 'newGrade',
      appId: 'coursework',
      web: false,
      push: false,
      email: false,
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

const updateChannelPreferences = (toggleVal = false) => ({
  preferences: [
    { id: 'core', appId: 'discussion', web: true },
    { id: 'newComment', appId: 'discussion', web: toggleVal },
    { id: 'newAssignment', appId: 'coursework', web: toggleVal },
  ],
});

const setupStore = (override = {}) => {
  const storeState = defaultState;
  storeState.courses = {
    status: SUCCESS_STATUS,
    courses: [
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

  it('update group on click', async () => {
    const wrapper = await render(notificationPreferences(store));
    const element = wrapper.container.querySelector('#discussion-app-toggle');
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('update preference on click', async () => {
    const wrapper = await render(notificationPreferences(store));
    const element = wrapper.container.querySelector('#core-web');
    expect(element).not.toBeChecked();
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('show not found page if invalid course id is entered in url', async () => {
    store = setupStore({ status: FAILURE_STATUS, selectedCourse: 'invalid-course-id' });
    await render(notificationPreferences(store));
    expect(screen.queryByTestId('not-found-page')).toBeInTheDocument();
  });

  it('updates all preferences in the column on web channel click', async () => {
    store = setupStore(updateChannelPreferences(true));
    const wrapper = render(notificationPreferences(store));

    const getChannelSwitch = (id) => screen.queryByTestId(`${id}-web`);
    const notificationTypes = ['newComment', 'newAssignment'];

    const verifyState = (toggleState) => {
      notificationTypes.forEach((notificationType) => {
        if (toggleState) {
          expect(getChannelSwitch(notificationType)).toBeChecked();
        } else {
          expect(getChannelSwitch(notificationType)).not.toBeChecked();
        }
      });
    };

    verifyState(true);
    expect(getChannelSwitch('core')).toBeChecked();

    const discussionApp = screen.queryByTestId('discussion-app');
    const webChannel = within(discussionApp).queryByText('Web');

    await act(async () => {
      await fireEvent.click(webChannel);
    });

    store = setupStore(updateChannelPreferences(false));
    wrapper.rerender(notificationPreferences(store));

    await waitFor(() => {
      verifyState(false);
      expect(getChannelSwitch('core')).toBeChecked();
    });
  });
});
