import { act, renderHook, waitFor } from '@testing-library/react';

import { camelCaseObject, logError } from '@openedx/frontend-base';

import { createTestQueryClient, createWrapper } from '../../tests/renderWithProviders';
import { getNotificationPreferences, postPreferenceToggle } from './api';
import { useNotificationPreferences, useUpdatePreferenceToggle } from './hooks';
import { notificationPreferencesKeys } from './queryKeys';
import { normalizePreferences } from './utils';

jest.mock('./api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  logError: jest.fn(),
}));

const rawResponse = {
  status: 'success',
  show_preferences: true,
  show_email_preferences: true,
  data: {
    coursework: {
      enabled: true,
      notification_types: {
        new_grade: {
          web: false, push: false, email: false, info: '', email_cadence: 'Daily',
        },
      },
      non_editable: {},
    },
  },
};

const toggleResponse = ({
  app = 'coursework', type = 'new_grade', channel, value,
}) => ({
  status: 'success',
  show_preferences: true,
  data: {
    updated_value: value, notification_type: type, channel, app,
  },
});

const newGradeVariables = (overrides) => ({
  notificationApp: 'coursework',
  notificationType: 'newGrade',
  notificationChannel: 'web',
  value: true,
  emailCadence: 'Daily',
  ...overrides,
});

afterEach(() => jest.clearAllMocks());

describe('useNotificationPreferences', () => {
  it('fetches and normalizes the configurations', async () => {
    getNotificationPreferences.mockResolvedValue(rawResponse);

    const { result } = renderHook(() => useNotificationPreferences(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(normalizePreferences(camelCaseObject(rawResponse)));
    expect(getNotificationPreferences).toHaveBeenCalledTimes(1);
  });
});

describe('useUpdatePreferenceToggle', () => {
  let queryClient;
  let wrapper;
  const cachedPreference = () => (
    queryClient.getQueryData(notificationPreferencesKeys.all).preferences.find(p => p.id === 'newGrade')
  );

  beforeEach(() => {
    // Nothing observes the seeded query here, so keep it from being garbage collected.
    queryClient = createTestQueryClient({ staleTime: Infinity, gcTime: Infinity });
    queryClient.setQueryData(notificationPreferencesKeys.all, normalizePreferences(camelCaseObject(rawResponse)));
    wrapper = createWrapper({ queryClient });
  });

  it('saves the toggle and applies the reported value to the cache', async () => {
    postPreferenceToggle.mockResolvedValue(toggleResponse({ channel: 'web', value: true }));
    const { result } = renderHook(() => useUpdatePreferenceToggle(), { wrapper });

    act(() => result.current.mutate(newGradeVariables()));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(postPreferenceToggle).toHaveBeenCalledTimes(1);
    expect(postPreferenceToggle).toHaveBeenCalledWith('coursework', 'newGrade', 'web', true, 'Daily');
    expect(cachedPreference().web).toBe(true);
  });

  it('asserts the email cadence after turning email on', async () => {
    postPreferenceToggle
      .mockResolvedValueOnce(toggleResponse({ channel: 'email', value: true }))
      .mockResolvedValueOnce(toggleResponse({ channel: 'email_cadence', value: 'Weekly' }));
    const { result } = renderHook(() => useUpdatePreferenceToggle(), { wrapper });

    act(() => result.current.mutate(newGradeVariables({ notificationChannel: 'email', emailCadence: 'Weekly' })));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(postPreferenceToggle).toHaveBeenCalledTimes(2);
    expect(postPreferenceToggle).toHaveBeenNthCalledWith(1, 'coursework', 'newGrade', 'email', true, 'Weekly');
    expect(postPreferenceToggle).toHaveBeenNthCalledWith(2, 'coursework', 'newGrade', 'email_cadence', undefined, 'Weekly');
    expect(cachedPreference()).toEqual(expect.objectContaining({ email: true, emailCadence: 'Weekly' }));
  });

  it('does not touch the cadence when turning email off', async () => {
    postPreferenceToggle.mockResolvedValue(toggleResponse({ channel: 'email', value: false }));
    const { result } = renderHook(() => useUpdatePreferenceToggle(), { wrapper });

    act(() => result.current.mutate(newGradeVariables({ notificationChannel: 'email', value: false })));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(postPreferenceToggle).toHaveBeenCalledTimes(1);
  });

  it('logs the error and leaves the cache alone when the save fails', async () => {
    const error = new Error('Network Error');
    postPreferenceToggle.mockRejectedValue(error);
    const before = queryClient.getQueryData(notificationPreferencesKeys.all);
    const { result } = renderHook(() => useUpdatePreferenceToggle(), { wrapper });

    act(() => result.current.mutate(newGradeVariables()));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(logError).toHaveBeenCalledWith(error);
    expect(queryClient.getQueryData(notificationPreferencesKeys.all)).toBe(before);
  });
});
