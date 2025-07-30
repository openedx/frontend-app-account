import { updatePreferenceToggle } from './thunks';
import {
  updatePreferenceValue,
  fetchNotificationPreferenceSuccess,
  fetchNotificationPreferenceFailed,
} from './actions';
import { postPreferenceToggle } from './service';
import { EMAIL } from './constants';

jest.mock('./service', () => ({
  patchPreferenceToggle: jest.fn(),
  postPreferenceToggle: jest.fn(),
}));

jest.mock('./actions', () => ({
  updatePreferenceValue: jest.fn(),
  fetchNotificationPreferenceSuccess: jest.fn(),
  fetchNotificationPreferenceFailed: jest.fn(),
}));

describe('updatePreferenceToggle', () => {
  const dispatch = jest.fn();
  const courseId = 'course-v1:edX+DemoX+2023';
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
    expect(dispatch).toHaveBeenCalledWith(fetchNotificationPreferenceSuccess(null, { data: mockData }, true));
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
    expect(dispatch).toHaveBeenCalledWith(fetchNotificationPreferenceSuccess(courseId, { data: mockData }, false));
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
    expect(dispatch).toHaveBeenCalledWith(fetchNotificationPreferenceFailed());
  });
});
