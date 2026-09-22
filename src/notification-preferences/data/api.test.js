import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { getNotificationPreferences, postPreferenceToggle } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getSiteConfig: jest.fn(),
  getAuthenticatedHttpClient: jest.fn(),
}));

describe('Notification Preferences API', () => {
  let mockHttpClient;

  beforeEach(() => {
    jest.resetAllMocks();

    getSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://test.lms' });

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
        'http://test.lms/api/notifications/v3/configurations/',
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('postPreferenceToggle', () => {
    it('sends snake-cased payload and returns data', async () => {
      const mockData = { success: true };
      mockHttpClient.put.mockResolvedValue({ data: mockData });

      const result = await postPreferenceToggle(
        'app_name',
        'someType',
        'email',
        true,
        'daily',
      );

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        'http://test.lms/api/notifications/v3/configurations/',
        expect.objectContaining({
          notification_app: 'app_name',
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
