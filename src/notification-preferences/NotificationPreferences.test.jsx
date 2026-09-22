import {
  fireEvent, screen, waitFor, within,
} from '@testing-library/react';

import { logError, mergeAppConfig } from '@openedx/frontend-base';

import { renderWithProviders } from '../tests/renderWithProviders';
import NotificationPreferences from './NotificationPreferences';
import { getNotificationPreferences, postPreferenceToggle } from './data/api';
import { appId } from '../constants';

jest.mock('./data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  logError: jest.fn(),
}));

const rawResponse = {
  status: 'success',
  show_preferences: true,
  show_email_preferences: true,
  data: {
    discussion: {
      enabled: true,
      notification_types: {
        core: {
          web: true, push: true, email: true, info: '',
        },
        new_comment: {
          web: false, push: false, email: false, info: '',
        },
      },
      non_editable: { core: ['web', 'email'] },
    },
    coursework: {
      enabled: true,
      notification_types: {
        new_assignment: {
          web: false, push: false, email: true, info: '',
        },
        new_grade: {
          web: false, push: false, email: false, info: '',
        },
      },
      non_editable: {},
    },
  },
};

const toggleResponse = ({
  app, type, channel, value,
}) => ({
  status: 'success',
  show_preferences: true,
  data: {
    updated_value: value, notification_type: type, channel, app,
  },
});

const renderPreferences = () => renderWithProviders(<NotificationPreferences />);

describe('Notification Preferences', () => {
  beforeEach(() => {
    mergeAppConfig(appId, { SHOW_PUSH_CHANNEL: '' });
    getNotificationPreferences.mockResolvedValue(rawResponse);
  });

  afterEach(() => jest.clearAllMocks());

  it('lists all notification apps', async () => {
    renderPreferences();

    expect(await screen.findByTestId('discussion-app')).toBeInTheDocument();
    expect(screen.getByTestId('coursework-app')).toBeInTheDocument();
  });

  it('renders nothing until the preferences arrive', async () => {
    getNotificationPreferences.mockReturnValue(new Promise(() => {}));
    const { container } = renderPreferences();

    expect(container).toBeEmptyDOMElement();
  });

  it('lists all notification preferences', async () => {
    renderPreferences();

    expect(await screen.findAllByTestId('notification-preference')).toHaveLength(4);
  });

  it('saves a toggle and reflects the value the API reports back', async () => {
    let resolveToggle;
    postPreferenceToggle.mockReturnValue(new Promise((resolve) => { resolveToggle = resolve; }));
    renderPreferences();

    const toggle = await screen.findByTestId('toggle-newGrade-web');
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);

    await waitFor(() => (
      expect(postPreferenceToggle).toHaveBeenCalledWith('coursework', 'newGrade', 'web', true, 'Daily')
    ));
    // Every toggle waits for the server, so a learner cannot queue conflicting changes.
    await waitFor(() => expect(toggle).toBeDisabled());
    expect(screen.getByTestId('toggle-newComment-web')).toBeDisabled();
    expect(toggle).not.toBeChecked();

    resolveToggle(toggleResponse({
      app: 'coursework', type: 'new_grade', channel: 'web', value: true,
    }));

    await waitFor(() => expect(toggle).toBeChecked());
    expect(toggle).not.toBeDisabled();
    expect(screen.getByTestId('toggle-newComment-web')).not.toBeDisabled();
  });

  it('also asserts the email cadence when email is turned on', async () => {
    postPreferenceToggle
      .mockResolvedValueOnce(toggleResponse({
        app: 'coursework', type: 'new_grade', channel: 'email', value: true,
      }))
      .mockResolvedValueOnce(toggleResponse({
        app: 'coursework', type: 'new_grade', channel: 'email_cadence', value: 'Daily',
      }));
    renderPreferences();

    fireEvent.click(await screen.findByTestId('toggle-newGrade-email'));

    await waitFor(() => expect(postPreferenceToggle).toHaveBeenCalledTimes(2));
    expect(postPreferenceToggle).toHaveBeenNthCalledWith(1, 'coursework', 'newGrade', 'email', true, 'Daily');
    expect(postPreferenceToggle).toHaveBeenNthCalledWith(2, 'coursework', 'newGrade', 'email_cadence', undefined, 'Daily');
    await waitFor(() => expect(screen.getByTestId('toggle-newGrade-email')).toBeChecked());
  });

  it('keeps the current value and logs the error when saving fails', async () => {
    const error = new Error('nope');
    postPreferenceToggle.mockRejectedValue(error);
    renderPreferences();

    const toggle = await screen.findByTestId('toggle-newGrade-web');
    fireEvent.click(toggle);

    await waitFor(() => expect(logError).toHaveBeenCalledWith(error));
    expect(toggle).not.toBeChecked();
    expect(toggle).not.toBeDisabled();
    expect(screen.getByTestId('coursework-app')).toBeInTheDocument();
  });

  it('disables non-editable channels', async () => {
    renderPreferences();

    expect(await screen.findByTestId('toggle-core-web')).toBeDisabled();
    const coreEmail = screen.getByTestId('toggle-core-email');
    expect(coreEmail).toBeDisabled();
    expect(within(coreEmail.closest('#core-email')).getByTestId('email-cadence-button')).toBeDisabled();
    expect(screen.getByTestId('toggle-newGrade-web')).not.toBeDisabled();
    const newAssignmentEmail = screen.getByTestId('toggle-newAssignment-email');
    expect(within(newAssignmentEmail.closest('#newAssignment-email')).getByTestId('email-cadence-button')).not.toBeDisabled();
  });

  it('does not render the push channel when SHOW_PUSH_CHANNEL is off', async () => {
    renderPreferences();

    await screen.findByTestId('toggle-core-web');
    expect(screen.queryByTestId('toggle-core-push')).not.toBeInTheDocument();
  });

  it('renders the push channel when SHOW_PUSH_CHANNEL is on', async () => {
    mergeAppConfig(appId, { SHOW_PUSH_CHANNEL: 'true' });
    renderPreferences();

    expect(await screen.findByTestId('toggle-core-push')).toBeInTheDocument();
  });

  it('does not render the email channel when show_email_preferences is false', async () => {
    getNotificationPreferences.mockResolvedValue({ ...rawResponse, show_email_preferences: false });
    renderPreferences();

    await screen.findByTestId('toggle-core-web');
    expect(screen.queryByTestId('toggle-core-email')).not.toBeInTheDocument();
  });

  it('renders the email channel when show_email_preferences is true', async () => {
    renderPreferences();

    expect(await screen.findByTestId('toggle-core-email')).toBeInTheDocument();
  });
});
