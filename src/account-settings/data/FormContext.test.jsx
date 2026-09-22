import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';

import {
  getAuthenticatedUser, getLocale, logError, updateLocale,
} from '@openedx/frontend-base';

import { createTestQueryClient, renderWithProviders } from '../../tests/renderWithProviders';
import { patchSettings } from './api';
import { patchPreferences, postSetLang } from '../site-language';
import { accountSettingsKeys } from './queryKeys';
import {
  AccountSettingsFormProvider, CLOSE_FORM_DELAY, useAccountSettingsForm, useEditableField,
} from './FormContext';

jest.mock('./api');
jest.mock('../site-language', () => ({
  siteLanguageList: [],
  patchPreferences: jest.fn(),
  postSetLang: jest.fn(),
}));
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedUser: jest.fn(),
  getLocale: jest.fn(),
  logError: jest.fn(),
  updateLocale: jest.fn(),
}));

const user = { username: 'edx', userId: 3, roles: [] };
const valuesKey = accountSettingsKeys.values(user.username);

let form;
let field;

const Probe = () => {
  form = useAccountSettingsForm();
  field = useEditableField('name');
  return <div data-testid="save-state">{String(form.saveState)}</div>;
};

const renderProvider = () => {
  const queryClient = createTestQueryClient({ staleTime: Infinity, gcTime: Infinity });
  queryClient.setQueryData(valuesKey, { name: 'Old Name', email: 'old@example.com' });
  renderWithProviders(<AccountSettingsFormProvider><Probe /></AccountSettingsFormProvider>, { queryClient });
  return queryClient;
};

const fieldError = (fieldErrors) => Object.assign(new Error('field errors'), { fieldErrors });

describe('AccountSettingsFormProvider', () => {
  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue(user);
    getLocale.mockReturnValue('en');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('opens, drafts and closes a form', () => {
    renderProvider();

    act(() => form.openForm('name'));
    expect(field.isEditing).toBe(true);

    act(() => form.updateDraft('name', 'New Name'));
    expect(form.drafts).toEqual({ name: 'New Name' });

    act(() => form.closeForm('name'));
    expect(field.isEditing).toBe(false);
    expect(form.drafts).toEqual({});
  });

  it('saves a field, merges the result into the cached values and closes the form after a beat', async () => {
    jest.useFakeTimers();
    patchSettings.mockResolvedValue({ name: 'New Name' });
    const queryClient = renderProvider();

    act(() => form.openForm('name'));
    act(() => form.saveSettings('name', 'New Name'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('complete'));
    expect(patchSettings).toHaveBeenCalledWith(user.username, { name: 'New Name' }, user.userId);
    expect(queryClient.getQueryData(valuesKey)).toEqual({ name: 'New Name', email: 'old@example.com' });
    expect(form.confirmationValues).toEqual({ name: 'New Name' });
    expect(field.isEditing).toBe(true);

    act(() => jest.advanceTimersByTime(CLOSE_FORM_DELAY));
    expect(field.isEditing).toBe(false);
  });

  it('leaves an empty values cache alone rather than seeding it with the saved fields', async () => {
    patchSettings.mockResolvedValue({ name: 'New Name' });
    const queryClient = renderProvider();
    queryClient.removeQueries({ queryKey: valuesKey });

    act(() => form.saveSettings('name', 'New Name'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('complete'));
    expect(queryClient.getQueryData(valuesKey)).toBeUndefined();
  });

  it('reports pending while the request is in flight', async () => {
    let resolveSave;
    patchSettings.mockReturnValue(new Promise((resolve) => { resolveSave = resolve; }));
    renderProvider();

    act(() => form.saveSettings('email', 'new@example.com'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('pending'));
    await act(async () => resolveSave({ email: 'new@example.com' }));
    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('complete'));
  });

  it('surfaces field errors on the field that caused them', async () => {
    patchSettings.mockRejectedValue(fieldError({ name: 'Too short' }));
    renderProvider();

    act(() => form.saveSettings('name', 'x'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('error'));
    expect(field.error).toBe('Too short');
    expect(form.nameChangeModal).toBe(false);
    expect(logError).not.toHaveBeenCalled();
  });

  it('opens the name change flow when the LMS demands verification', async () => {
    patchSettings.mockRejectedValue(fieldError({ name: 'This requires verification' }));
    renderProvider();

    act(() => form.saveSettings('name', 'Another Name'));

    await waitFor(() => expect(form.nameChangeModal).toEqual({ formId: 'name' }));
    expect(form.saveState).toBe('error');
  });

  it('logs unexpected errors and reports a failed save', async () => {
    const error = new Error('boom');
    patchSettings.mockRejectedValue(error);
    renderProvider();

    act(() => form.saveSettings('name', 'x'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('error'));
    expect(logError).toHaveBeenCalledWith(error);
    expect(form.errors).toEqual({});
  });

  it('switches the site language through the preference and setlang endpoints, in that order', async () => {
    const calls = [];
    patchPreferences.mockImplementation(async () => { calls.push('patchPreferences'); });
    postSetLang.mockImplementation(async () => { calls.push('postSetLang'); });
    getLocale.mockReturnValueOnce('en').mockReturnValue('fr');
    renderProvider();

    act(() => form.saveSettings('siteLanguage', 'fr'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('complete'));
    expect(calls).toEqual(['patchPreferences', 'postSetLang']);
    expect(patchPreferences).toHaveBeenCalledWith(user.username, { prefLang: 'fr' });
    expect(postSetLang).toHaveBeenCalledWith('fr');
    expect(updateLocale).toHaveBeenCalledWith('fr');
    expect(form.previousSiteLanguage).toBe('en');
    expect(patchSettings).not.toHaveBeenCalled();
  });

  it('refetches the verified name history after a certificate name choice', async () => {
    patchSettings.mockResolvedValue({});
    const queryClient = renderProvider();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    act(() => form.saveSettings('useVerifiedNameForCerts', true));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('complete'));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: accountSettingsKeys.verifiedNameHistory });
  });

  it('saves several fields in order and closes the form afterwards', async () => {
    jest.useFakeTimers();
    patchSettings.mockImplementation(async (username, commitData) => commitData);
    const queryClient = renderProvider();

    act(() => form.openForm('name'));
    act(() => form.saveMultipleSettings([
      { formId: 'name', commitValues: 'New Name' },
      { formId: 'useVerifiedNameForCerts', commitValues: true },
    ], 'name'));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('complete'));
    expect(patchSettings.mock.calls.map(([, commitData]) => commitData)).toEqual([
      { name: 'New Name' },
      { useVerifiedNameForCerts: true },
    ]);
    expect(queryClient.getQueryData(valuesKey)).toEqual(expect.objectContaining({
      name: 'New Name',
      useVerifiedNameForCerts: true,
    }));

    act(() => jest.advanceTimersByTime(CLOSE_FORM_DELAY));
    expect(field.isEditing).toBe(false);
  });

  it('stops a multiple save at the first failure', async () => {
    patchSettings
      .mockResolvedValueOnce({ name: 'New Name' })
      .mockRejectedValueOnce(fieldError({ useVerifiedNameForCerts: 'Nope' }));
    renderProvider();

    act(() => form.saveMultipleSettings([
      { formId: 'name', commitValues: 'New Name' },
      { formId: 'useVerifiedNameForCerts', commitValues: true },
      { formId: 'email', commitValues: 'x@y.z' },
    ]));

    await waitFor(() => expect(screen.getByTestId('save-state')).toHaveTextContent('error'));
    expect(patchSettings).toHaveBeenCalledTimes(2);
    expect(form.errors).toEqual({ useVerifiedNameForCerts: 'Nope' });
  });

  it('throws when used outside the provider', () => {
    const Orphan = () => {
      useAccountSettingsForm();
      return null;
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderWithProviders(<Orphan />)).toThrow('AccountSettingsFormProvider');
  });
});
