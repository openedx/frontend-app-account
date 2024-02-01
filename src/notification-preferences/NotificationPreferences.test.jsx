/* eslint-disable no-import-assign */
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import {
  fireEvent, render, screen, waitFor, act,
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
      id: 'newPost',
      appId: 'discussion',
      web: false,
      push: false,
      email: false,
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
  nonEditable: {},
};

const updateChannelPreferences = (toggleVal = false) => ({
  preferences: [
    {
      id: 'newPost', appId: 'discussion', web: toggleVal, push: toggleVal, email: toggleVal,
    },
    {
      id: 'newComment', appId: 'discussion', web: toggleVal, push: toggleVal, email: toggleVal,
    },
    {
      id: 'newAssignment', appId: 'coursework', web: toggleVal, push: toggleVal, email: toggleVal,
    },
    {
      id: 'newGrade', appId: 'coursework', web: toggleVal, push: toggleVal, email: toggleVal,
    },
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

const renderComponent = (store = {}) => (
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
    await render(renderComponent(store));
    expect(screen.queryAllByTestId('notification-app')).toHaveLength(2);
  });

  it('show spinner if api call is in progress', async () => {
    store = setupStore({ status: LOADING_STATUS });
    await render(renderComponent(store));
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('tests if all notification preferences are listed', async () => {
    await render(renderComponent(store));
    expect(screen.queryAllByTestId('notification-preference')).toHaveLength(4);
  });

  it('update group on click', async () => {
    const wrapper = await render(renderComponent(store));
    const element = wrapper.container.querySelector('#discussion-app-toggle');
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('update preference on click', async () => {
    const wrapper = await render(renderComponent(store));
    const element = wrapper.container.querySelector('#newPost-web');
    expect(element).not.toBeChecked();
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('show not found page if invalid course id is entered in url', async () => {
    store = setupStore({ status: FAILURE_STATUS, selectedCourse: 'invalid-course-id' });
    await render(renderComponent(store));
    expect(screen.queryByTestId('not-found-page')).toBeInTheDocument();
  });

  it.each([false, true])(
    'updates all preferences in the column on web channel click when toggle state is - %s',
    async (toggleState) => {
      store = setupStore(updateChannelPreferences(toggleState));
      const wrapper = render(renderComponent(store));

      const getCheckbox = (id) => screen.queryByTestId(`${id}-web`);
      const checkboxes = ['newPost', 'newComment', 'newAssignment', 'newGrade'];

      const verifyState = (expectedState) => {
        checkboxes.forEach((checkbox) => {
          if (expectedState) {
            expect(getCheckbox(checkbox)).toBeChecked();
          } else {
            expect(getCheckbox(checkbox)).not.toBeChecked();
          }
        });
      };

      verifyState(toggleState);

      const element = screen.queryAllByText('Web')[0];

      await act(async () => {
        await fireEvent.click(element);
      });

      store = setupStore(updateChannelPreferences(!toggleState));
      wrapper.rerender(renderComponent(store));

      await waitFor(() => {
        verifyState(!toggleState);
      });
    },
  );
});
