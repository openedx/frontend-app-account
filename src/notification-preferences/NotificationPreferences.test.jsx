import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider, initializeMockApp } from '@openedx/frontend-base';
import { fireEvent, render, screen } from '@testing-library/react';
import NotificationPreferences from './NotificationPreferences';
import { useNotificationPreferences, useCourseList, useNotificationPreferencesState} from './hooks';
import userErvent from '@testing-library/user-event';

const courseId = 'selected-course-id';

jest.mock('./hooks', () => ({
  useNotificationPreferences: jest.fn(),
  useCourseList: jest.fn(),
  useNotificationPreferencesState: jest.fn(),
}));

const defaultPreferences = {
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


describe('Notification Preferences', () => {
  let queryClient;
  const getNotificationPreferences = (store = {}) => (
    <Router>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <NotificationPreferences />
        </IntlProvider>
      </QueryClientProvider>
    </Router>
);

  const mockUseCourseList = (isLoading = false) => {
    useCourseList.mockReturnValue({
      isLoading,
    });
  };

  const mockUseNotificationPreferences = (data = defaultPreferences, isLoading = false, isPending = false, mockDispatch = jest.fn()) => {
    useNotificationPreferences.mockReturnValue({
      notificationPreferencesQuery: {
        data,
        isLoading,
      },
      notificationPreferencesMutation: { mutate: mockDispatch, isPending },
    });
  };

  const mockUseNotificationPreferencesState = (selectedCourse = courseId) => { 
    useNotificationPreferencesState.mockReturnValue({
      notificationPreferencesState: {
        selectedCourse,
      },
      setSelectedCourse: jest.fn(),
    });
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    initializeMockApp({
      authenticatedUser: {
        userId: 123,
        username: 'test-user',
        administrator: true,
        roles: [],
      },
    });

    mockUseCourseList();
    mockUseNotificationPreferences();
    mockUseNotificationPreferencesState();
  });

  afterEach(() => jest.clearAllMocks());

  it('tests if all notification apps are listed', async () => {
    await render(getNotificationPreferences());
    expect(screen.queryByTestId('discussion-app')).toBeInTheDocument();
    expect(screen.queryByTestId('coursework-app')).toBeInTheDocument();
  });

  it('show spinner if api call is in progress', async () => {
    mockUseCourseList(true);
    await render(getNotificationPreferences());
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('tests if all notification preferences are listed', async () => {
    await render(getNotificationPreferences());
    expect(screen.queryAllByTestId('notification-preference')).toHaveLength(4);
  });

  it('update preference on click', async () => {
    const user = userErvent.setup();
    const mockDispatch = jest.fn();
    mockUseNotificationPreferences(defaultPreferences, false, false, mockDispatch);
    const wrapper = await render(getNotificationPreferences());
    const element = wrapper.container.querySelector('#core-web');
    expect(element).not.toBeChecked();
    expect(element).toBeEnabled();
    await user.click(element.firstChild.firstChild.firstChild);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('update account preference on click', async () => {
    const mockDispatch = jest.fn();
    mockUseNotificationPreferences(defaultPreferences, false, false, mockDispatch);
    mockUseNotificationPreferencesState('');
    await render(getNotificationPreferences());
    const element = screen.getByTestId('core-web');
    await fireEvent.click(element);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
