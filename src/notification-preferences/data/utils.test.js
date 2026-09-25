import { camelCaseObject } from '@edx/frontend-platform';

import { EMAIL_CADENCE_PREFERENCES } from './constants';
import { applyPreferenceUpdate, normalizePreferences } from './utils';

const rawResponse = {
  status: 'success',
  show_preferences: true,
  show_email_preferences: false,
  data: {
    discussion: {
      enabled: true,
      notification_types: {
        new_comment: {
          web: false, push: true, email: false, info: 'Someone replied',
        },
        core: {
          web: true, push: true, email: true, email_cadence: 'Weekly',
        },
      },
      non_editable: { core: ['web', 'email'] },
    },
    coursework: {
      enabled: false,
      notification_types: {
        new_grade: { web: false, push: false, email: false },
      },
      non_editable: {},
    },
  },
};

describe('normalizePreferences', () => {
  const normalized = normalizePreferences(camelCaseObject(rawResponse));

  it('lists apps sorted by id with their enabled flag', () => {
    expect(normalized.apps).toEqual([
      { id: 'coursework', enabled: false },
      { id: 'discussion', enabled: true },
    ]);
  });

  it('flattens notification types into preferences with camel-cased ids', () => {
    expect(normalized.preferences).toEqual([
      {
        id: 'newComment', appId: 'discussion', web: false, push: true, email: false, info: 'Someone replied', emailCadence: EMAIL_CADENCE_PREFERENCES.DAILY,
      },
      {
        id: 'core', appId: 'discussion', web: true, push: true, email: true, info: '', emailCadence: 'Weekly',
      },
      {
        id: 'newGrade', appId: 'coursework', web: false, push: false, email: false, info: '', emailCadence: EMAIL_CADENCE_PREFERENCES.DAILY,
      },
    ]);
  });

  it('keeps the non-editable channels per app', () => {
    expect(normalized.nonEditable).toEqual({
      discussion: { core: ['web', 'email'] },
      coursework: {},
    });
  });

  it('carries the visibility flags through', () => {
    expect(normalized.showPreferences).toBe(true);
    expect(normalized.showEmailPreferences).toBe(false);
  });

  it('defaults the visibility flags when the response omits them', () => {
    const result = normalizePreferences(camelCaseObject({ data: {} }));
    expect(result).toEqual({
      apps: [],
      preferences: [],
      nonEditable: {},
      showPreferences: false,
      showEmailPreferences: true,
    });
  });
});

describe('applyPreferenceUpdate', () => {
  const normalized = normalizePreferences(camelCaseObject(rawResponse));

  it('sets the updated value on the matching preference and channel', () => {
    const result = applyPreferenceUpdate(normalized, camelCaseObject({
      data: {
        app: 'coursework', notification_type: 'new_grade', channel: 'web', updated_value: true,
      },
    }));

    expect(result.preferences.find(p => p.id === 'newGrade').web).toBe(true);
    expect(result).not.toBe(normalized);
    expect(normalized.preferences.find(p => p.id === 'newGrade').web).toBe(false);
  });

  it('maps the email_cadence channel onto emailCadence', () => {
    const result = applyPreferenceUpdate(normalized, camelCaseObject({
      data: {
        app: 'discussion', notification_type: 'new_comment', channel: 'email_cadence', updated_value: 'Weekly',
      },
    }));

    expect(result.preferences.find(p => p.id === 'newComment').emailCadence).toBe('Weekly');
  });

  it('leaves other preferences untouched', () => {
    const result = applyPreferenceUpdate(normalized, camelCaseObject({
      data: {
        app: 'discussion', notification_type: 'new_comment', channel: 'web', updated_value: true,
      },
    }));

    expect(result.preferences.filter(p => p.id !== 'newComment'))
      .toEqual(normalized.preferences.filter(p => p.id !== 'newComment'));
  });

  it('returns the input unchanged without cached data or an update payload', () => {
    expect(applyPreferenceUpdate(undefined, { data: {} })).toBeUndefined();
    expect(applyPreferenceUpdate(normalized, {})).toBe(normalized);
  });
});
