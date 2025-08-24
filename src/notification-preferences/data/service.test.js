import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getNotificationPreferences, postPreferenceToggle } from './service';

jest.mock('@edx/frontend-platform', () => {
  const actual = jest.requireActual('@edx/frontend-platform');
  return {
    ...actual,
    getConfig: jest.fn(),
  };
});

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

describe('Notification Preferences Service', () => {
  let mockHttpClient;

  beforeEach(() => {
    jest.resetAllMocks();

    getConfig.mockReturnValue({ LMS_BASE_URL: 'http://test.lms' });

    mockHttpClient = {
      get: jest.fn(),
      put: jest.fn(),
    };

    getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
  });

  describe('getNotificationPreferences', () => {
    it('fetches preferences and returns data', async () => {
      const mockData = { results: [{ id: 1 }] };
      mockHttpClient.get.mockResolvedValue({ data: mockData });

      const result = await getNotificationPreferences();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://test.lms/api/notifications/v2/configurations/',
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('postPreferenceToggle', () => {
    it('sends snake-cased payload and returns data', async () => {
      const mockData = { success: true };
      mockHttpClient.put.mockResolvedValue({ data: mockData });

      const result = await postPreferenceToggle(
        'appName',
        'someType',
        'email',
        true,
        'daily',
      );

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        'http://test.lms/api/notifications/v2/configurations/',
        expect.objectContaining({
          notification_app: 'appName',
          notification_type: 'some_type',
          notification_channel: 'email',
          value: true,
          email_cadence: 'daily',
        }),
      );
      expect(result).toEqual(mockData);
    });
  });
});
