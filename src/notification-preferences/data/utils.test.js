import { getConfig } from '@edx/frontend-platform';

import { notificationChannels, shouldHideAppPreferences } from './utils';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('notificationChannels', () => {
  beforeEach(() => {
    getConfig.mockReturnValue({ SHOW_PUSH_CHANNEL: '' });
  });

  it('always includes WEB channel', () => {
    const channels = notificationChannels();
    expect(channels).toMatchObject({ WEB: 'web' });
  });

  it('includes EMAIL channel when showEmailPreferences is true (default)', () => {
    const channels = notificationChannels();
    expect(channels).toMatchObject({ EMAIL: 'email' });
  });

  it('includes EMAIL channel when showEmailPreferences is explicitly true', () => {
    const channels = notificationChannels(true);
    expect(channels).toMatchObject({ EMAIL: 'email' });
  });

  it('excludes EMAIL channel when showEmailPreferences is false', () => {
    const channels = notificationChannels(false);
    expect(channels).not.toHaveProperty('EMAIL');
  });

  it('excludes PUSH channel when SHOW_PUSH_CHANNEL env var is not set', () => {
    getConfig.mockReturnValue({ SHOW_PUSH_CHANNEL: '' });
    const channels = notificationChannels();
    expect(channels).not.toHaveProperty('PUSH');
  });

  it('includes PUSH channel when SHOW_PUSH_CHANNEL env var is true', () => {
    getConfig.mockReturnValue({ SHOW_PUSH_CHANNEL: 'true' });
    const channels = notificationChannels();
    expect(channels).toMatchObject({ PUSH: 'push' });
  });

  it('returns WEB, EMAIL but not PUSH when only email is enabled', () => {
    getConfig.mockReturnValue({ SHOW_PUSH_CHANNEL: '' });
    const channels = notificationChannels(true);
    expect(Object.values(channels)).toEqual(['web', 'email']);
  });

  it('returns only WEB when email is disabled and push is not set', () => {
    getConfig.mockReturnValue({ SHOW_PUSH_CHANNEL: '' });
    const channels = notificationChannels(false);
    expect(Object.values(channels)).toEqual(['web']);
  });
});

describe('shouldHideAppPreferences', () => {
  const preferences = [
    { id: 'newPost', appId: 'discussion' },
    { id: 'newComment', appId: 'discussion' },
    { id: 'newAssignment', appId: 'coursework' },
  ];

  it('returns false when app has matching preferences', () => {
    expect(shouldHideAppPreferences(preferences, 'discussion')).toBe(false);
  });

  it('returns true when app has no matching preferences', () => {
    expect(shouldHideAppPreferences(preferences, 'unknown-app')).toBe(true);
  });

  it('returns true for empty preferences array', () => {
    expect(shouldHideAppPreferences([], 'discussion')).toBe(true);
  });
});
