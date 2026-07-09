import { updatePreferenceToggle, fetchNotificationPreferences } from './thunks';
import {
  updatePreferenceValue,
  fetchNotificationPreferenceSuccess,
  fetchNotificationPreferenceFailed,
  fetchNotificationPreferenceFetching,
} from './actions';
import { postPreferenceToggle, getNotificationPreferences } from './service';
import { EMAIL } from './constants';

jest.mock('./service', () => ({
  patchPreferenceToggle: jest.fn(),
  postPreferenceToggle: jest.fn(),
  getNotificationPreferences: jest.fn(),
}));

jest.mock('./actions', () => ({
  updatePreferenceValue: jest.fn(),
  fetchNotificationPreferenceSuccess: jest.fn(),
  fetchNotificationPreferenceFailed: jest.fn(),
  fetchNotificationPreferenceFetching: jest.fn(),
}));

describe('updatePreferenceToggle', () => {
  const dispatch = jest.fn();
  const notificationApp = 'app';
  const notificationType = 'type';
  const notificationChannel = 'channel';
  const value = true;
  const emailCadence = 'daily';

  const mockData = {
    updated_value: false,
    notification_type: 'ora_grade_assigned',
    channel: 'email',
    app: 'grading',
    successfully_updated_courses: [
      {
        course_id: 'course-v1:ACCA+ColSid+1T2024',
        current_setting: {
          web: false,
          push: false,
          email: false,
          email_cadence: 'Weekly',
        },
      },
      {
        course_id: 'course-v1:arbisoft_acca+cs1023+2021_T4',
        current_setting: {
          web: false,
          push: false,
          email: false,
          email_cadence: 'Weekly',
        },
      },
    ],
    total_updated: 2,
    total_courses: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update preference globally', async () => {
    postPreferenceToggle.mockResolvedValue({ data: mockData });
    await updatePreferenceToggle(
      notificationApp,
      notificationType,
      notificationChannel,
      value,
      emailCadence,
    )(dispatch);

    expect(dispatch).toHaveBeenCalledWith(updatePreferenceValue(
      notificationApp,
      notificationType,
      notificationChannel,
      !value,
    ));
    expect(postPreferenceToggle).toHaveBeenCalledWith(
      notificationApp,
      notificationType,
      notificationChannel,
      value,
      emailCadence,
    );
    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledWith(
      expect.any(Object),
      undefined,
      true,
      true,
    );
  });

  it('propagates showEmailPreferences: false from API response', async () => {
    postPreferenceToggle.mockResolvedValue({ show_email_preferences: false, data: mockData });
    await updatePreferenceToggle(
      notificationApp,
      notificationType,
      notificationChannel,
      value,
      emailCadence,
    )(dispatch);

    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledWith(
      expect.any(Object),
      undefined,
      false,
      true,
    );
  });

  it('should handle email preferences separately', async () => {
    postPreferenceToggle.mockResolvedValue({ data: mockData });
    await updatePreferenceToggle(notificationApp, notificationType, EMAIL, value, emailCadence)(dispatch);

    expect(postPreferenceToggle).toHaveBeenCalledWith(
      notificationApp,
      notificationType,
      EMAIL,
      true,
      emailCadence,
    );
    // handleSuccessResponse is called twice: once for EMAIL, once for EMAIL_CADENCE
    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledTimes(2);
    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledWith(
      expect.any(Object),
      undefined,
      true,
      true,
    );
  });

  it('should dispatch fetchNotificationPreferenceFailed on error', async () => {
    postPreferenceToggle.mockRejectedValue(new Error('Network Error'));
    await updatePreferenceToggle(
      notificationApp,
      notificationType,
      notificationChannel,
      value,
      emailCadence,
    )(dispatch);

    expect(dispatch).toHaveBeenCalledWith(updatePreferenceValue(
      notificationApp,
      notificationType,
      notificationChannel,
      !value,
    ));
    expect(fetchNotificationPreferenceFailed).toHaveBeenCalled();
  });
});

describe('fetchNotificationPreferences', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches fetching then success with showEmailPreferences from API response', async () => {
    getNotificationPreferences.mockResolvedValue({
      show_preferences: true,
      show_email_preferences: true,
      data: {},
    });

    await fetchNotificationPreferences()(dispatch);

    expect(fetchNotificationPreferenceFetching).toHaveBeenCalled();
    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledWith(
      { apps: [], preferences: [], nonEditable: {} },
      true,
      true,
    );
    expect(fetchNotificationPreferenceFailed).not.toHaveBeenCalled();
  });

  it('defaults showEmailPreferences to true when API does not return it', async () => {
    getNotificationPreferences.mockResolvedValue({
      show_preferences: false,
      data: {},
    });

    await fetchNotificationPreferences()(dispatch);

    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledWith(
      expect.any(Object),
      false,
      true,
    );
  });

  it('sets showEmailPreferences to false when API returns show_email_preferences: false', async () => {
    getNotificationPreferences.mockResolvedValue({
      show_preferences: true,
      show_email_preferences: false,
      data: {},
    });

    await fetchNotificationPreferences()(dispatch);

    expect(fetchNotificationPreferenceSuccess).toHaveBeenCalledWith(
      expect.any(Object),
      true,
      false,
    );
  });

  it('dispatches failure and not success on API error', async () => {
    getNotificationPreferences.mockRejectedValue(new Error('Network Error'));

    await fetchNotificationPreferences()(dispatch);

    expect(fetchNotificationPreferenceFailed).toHaveBeenCalled();
    expect(fetchNotificationPreferenceSuccess).not.toHaveBeenCalled();
  });
});
