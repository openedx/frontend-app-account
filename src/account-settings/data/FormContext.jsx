import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getAuthenticatedUser, logError, updateSiteLanguage,
} from '@openedx/frontend-base';

import { patchSettings } from './api';
import { accountSettingsKeys, accountSettingsMutationKeys } from './queryKeys';
import {
  BEGIN_NAME_CHANGE,
  CLOSE_FORM,
  formReducer,
  initialFormState,
  OPEN_FORM,
  RESET_DRAFTS,
  SAVE_BEGIN,
  SAVE_FAILURE,
  SAVE_RESET,
  SAVE_SUCCESS,
  UPDATE_DRAFT,
} from './formReducer';

// How long a saved field stays in its "complete" state before the form closes itself.
export const CLOSE_FORM_DELAY = 1000;

/**
 * @typedef {object} AccountSettingsForm
 * @property {string | null} openFormId the field being edited, if any
 * @property {Record<string, unknown>} drafts unsaved values by field name
 * @property {Record<string, string>} errors validation errors by field name
 * @property {Record<string, unknown>} confirmationValues saved values awaiting confirmation
 * @property {'pending' | 'complete' | 'error' | null} saveState the outcome of the last save
 * @property {false | { formId: string }} nameChangeModal the field whose name change is in progress
 * @property {(formId: string) => void} openForm
 * @property {(formId: string) => void} closeForm
 * @property {(name: string, value: unknown) => void} updateDraft
 * @property {() => void} resetDrafts
 * @property {(formId: string) => void} beginNameChange
 * @property {() => void} saveSettingsReset
 * @property {(formId: string | null, commitValues: unknown, extendedProfile?: object) => void} saveSettings
 * @property {(settingsArray: { formId: string, commitValues: unknown }[], form?: string | null) => void} saveMultipleSettings
 */

/** @type {import('react').Context<AccountSettingsForm | null>} */
export const AccountSettingsFormContext = createContext(null);

/**
 * Saves one field. The site language is special: it is not an account setting but the site's
 * language, so frontend-base switches it, the same way the shell's language menu does.
 */
export const saveSettingsRequest = async ({ formId, commitValues, extendedProfile = {} }) => {
  const { username, userId } = getAuthenticatedUser();
  const commitData = Object.keys(extendedProfile).length > 0 ? extendedProfile : { [formId]: commitValues };

  if (formId === 'siteLanguage') {
    await updateSiteLanguage(commitValues);
    return { savedValues: commitData, commitData };
  }

  const savedValues = await patchSettings(username, commitData, userId);
  return { savedValues, commitData };
};

export const AccountSettingsFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const queryClient = useQueryClient();
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const closeForm = useCallback((formId) => dispatch({ type: CLOSE_FORM, formId }), []);

  const scheduleCloseForm = useCallback((formId) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => closeForm(formId), CLOSE_FORM_DELAY);
  }, [closeForm]);

  const applySavedValues = useCallback((savedValues, commitData) => {
    const { username } = getAuthenticatedUser();
    // Merge into what is cached; if nothing is, leave it to the next fetch rather than seed the
    // cache with a partial account.
    queryClient.setQueryData(
      accountSettingsKeys.values(username),
      (current) => (current ? { ...current, ...savedValues } : current),
    );
    if ('useVerifiedNameForCerts' in commitData) {
      queryClient.invalidateQueries({ queryKey: accountSettingsKeys.verifiedNameHistory });
    }
    dispatch({ type: SAVE_SUCCESS, confirmationValues: commitData });
  }, [queryClient]);

  const handleSaveError = useCallback((error) => {
    if (error.fieldErrors) {
      // The LMS refuses a name change while a verified name exists; the learner has to go through
      // the name-change flow instead.
      if (error.fieldErrors.name?.includes('verification')) {
        dispatch({ type: BEGIN_NAME_CHANGE, formId: 'name' });
      }
      dispatch({ type: SAVE_FAILURE, errors: error.fieldErrors });
    } else {
      logError(error);
      dispatch({ type: SAVE_FAILURE });
    }
  }, []);

  const saveMutation = useMutation({
    mutationKey: accountSettingsMutationKeys.saveSettings,
    mutationFn: saveSettingsRequest,
    onMutate: () => dispatch({ type: SAVE_BEGIN }),
    onSuccess: ({ savedValues, commitData }, { formId }) => {
      applySavedValues(savedValues, commitData);
      scheduleCloseForm(formId);
    },
    onError: handleSaveError,
  });

  // Saves several fields in order, stopping at the first failure.
  const saveMultipleMutation = useMutation({
    mutationKey: accountSettingsMutationKeys.saveMultipleSettings,
    mutationFn: async ({ settingsArray }) => {
      const { username, userId } = getAuthenticatedUser();
      for (let i = 0; i < settingsArray.length; i += 1) {
        const { formId, commitValues } = settingsArray[i];
        const commitData = { [formId]: commitValues };
        // Each iteration ends in SAVE_SUCCESS, so the next one has to put the form back into its
        // pending state; an onMutate dispatch would only cover the first field.
        dispatch({ type: SAVE_BEGIN });
        // eslint-disable-next-line no-await-in-loop
        const savedValues = await patchSettings(username, commitData, userId);
        applySavedValues(savedValues, commitData);
      }
    },
    onSuccess: (data, { form }) => {
      dispatch({ type: SAVE_SUCCESS });
      if (form) {
        scheduleCloseForm(form);
      }
    },
    onError: handleSaveError,
  });

  const { mutate: mutateSave } = saveMutation;
  const { mutate: mutateSaveMultiple } = saveMultipleMutation;

  const value = useMemo(() => ({
    ...state,
    openForm: (formId) => dispatch({ type: OPEN_FORM, formId }),
    closeForm,
    updateDraft: (name, draftValue) => dispatch({ type: UPDATE_DRAFT, name, value: draftValue }),
    resetDrafts: () => dispatch({ type: RESET_DRAFTS }),
    beginNameChange: (formId) => dispatch({ type: BEGIN_NAME_CHANGE, formId }),
    saveSettingsReset: () => dispatch({ type: SAVE_RESET }),
    saveSettings: (formId, commitValues, extendedProfile = {}) => (
      mutateSave({ formId, commitValues, extendedProfile })
    ),
    saveMultipleSettings: (settingsArray, form = null) => mutateSaveMultiple({ settingsArray, form }),
  }), [state, closeForm, mutateSave, mutateSaveMultiple]);

  return (
    <AccountSettingsFormContext.Provider value={value}>
      {children}
    </AccountSettingsFormContext.Provider>
  );
};

AccountSettingsFormProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAccountSettingsForm = () => {
  const context = useContext(AccountSettingsFormContext);
  if (context === null) {
    throw new Error('useAccountSettingsForm must be used within an AccountSettingsFormProvider');
  }
  return context;
};

/**
 * What one editable field needs to know about the form it belongs to.
 */
export const useEditableField = (name) => {
  const {
    openFormId, errors, confirmationValues, saveState, openForm, closeForm,
  } = useAccountSettingsForm();

  return {
    isEditing: openFormId === name,
    error: errors[name],
    confirmationValue: confirmationValues[name],
    saveState,
    openForm,
    closeForm,
  };
};
