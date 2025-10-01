import { getAuthenticatedUser } from '@openedx/frontend-base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSettingsFormDataState } from '.';
import { SAVE_STATE_STATUS } from '../../constants';
import { getAccount, getCountryList, getPreferences, getProfileDataManager, getTimeZones, getVerifiedNameHistory, patchSettings } from '../data/service';
import { getCommitedValues, transformFormValues } from './utils';

const useAccountSettings = () => {
  const { settingsFormDataState, updateSettingsFormData, closeForm, beginNameChange } = useSettingsFormDataState();

  const { data, isFetched: isSettingsFetched, isLoading: isSettingsLoading, error: settingsError, isError: isSettingsError } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { username, roles } = getAuthenticatedUser();
      const fetchesResult = await Promise.all([
        getAccount(username),
        getPreferences(username),
        getProfileDataManager(username, roles),
        getCountryList(),
        getVerifiedNameHistory(),
        getTimeZones()
      ]);
      const [account, preferences, profileData, countryList, verifiedNameHistory, timezones] = fetchesResult;
      const formValues = transformFormValues({ ...account, ...preferences }, {});
      updateSettingsFormData({ formValues });
      const committedValues = getCommitedValues(account, settingsFormDataState?.confirmationValues ?? {}, verifiedNameHistory);
      updateSettingsFormData({ committedValues });
      const result = {
        timezones: timezones?.map(({ time_zone, description }) => ({
          value: time_zone, label: description,
        })),
        profileDataManager: profileData,
        verifiedNameHistory,
        countriesCodesList: countryList,
      };
      return result;
    },
    retry: false,
    refetchOnMount: false,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: { formId: string, values: any, extendedProfile: Record<string, any> }) => {
      const { formId, values, extendedProfile = {} } = newSettings;
      updateSettingsFormData({ errors: {}, saveState: SAVE_STATE_STATUS.PENDING });
      const { username } = getAuthenticatedUser();
      const commitData = Object.keys(extendedProfile).length > 0 ? extendedProfile : { [formId]: values };
      const savedValues = await patchSettings(username, commitData);
      return { savedValues, commitData };
    },
    onSuccess: (data, variables) => {
      const newState = {
        saveState: SAVE_STATE_STATUS.COMPLETE,
        formValues: { ...settingsFormDataState?.formValues, ...data.savedValues },
        errors: {},
        confirmationValues: { ...settingsFormDataState?.confirmationValues, ...data.commitData }
      };
      updateSettingsFormData(newState);
      setTimeout(() => closeForm(variables.formId), 1000);
    },
    onError: (error, variables) => {
      if ('fieldErrors' in error && error.fieldErrors && typeof error.fieldErrors === 'object') {
        if (
          'name' in error.fieldErrors
          && (error.fieldErrors.name as string[]).includes('verification')
        ) {
          beginNameChange('name');
        }
        const newErrorState = {
          saveState: SAVE_STATE_STATUS.ERROR,
          errors: { ...settingsFormDataState?.errors, ...error.fieldErrors },
        };
        updateSettingsFormData(newErrorState);
      } else {
        const newErrorState = {
          saveState: SAVE_STATE_STATUS.ERROR,
          errors: { ...settingsFormDataState?.errors, [variables.formId]: error.message },
        };
        updateSettingsFormData(newErrorState);
      }
    }
  });

  const saveMultipleSettingsMutation = useMutation({
    mutationFn: async ({ settingsArray }: { settingsArray: { formId: string, commitValues: object }[], form: string }) => {
      updateSettingsFormData({ errors: {}, saveState: SAVE_STATE_STATUS.PENDING });
      const { username } = getAuthenticatedUser();
      const result: { savedSettings: object, commitData: object }[] = [];
      for (const setting of settingsArray) {
        const { formId, commitValues } = setting;
        const commitData = { [formId]: commitValues };
        const savedSettings = await patchSettings(username, commitData);
        result.push({ savedSettings, commitData });
      }
      return result;
    },
    onSuccess: (data, variables) => {
      for (const row of data) {
        const { savedSettings, commitData } = row;
        const newState = {
          saveState: SAVE_STATE_STATUS.COMPLETE,
          formValues: { ...settingsFormDataState?.formValues, ...savedSettings },
          errors: {},
          confirmationValues: { ...settingsFormDataState?.confirmationValues, ...commitData }
        };
        updateSettingsFormData(newState);
      }
      if (variables.form) {
        setTimeout(() => closeForm(variables.form), 1000);
      }
    },
    onError: (error, variables) => {
      if ('fieldErrors' in error && error.fieldErrors && typeof error.fieldErrors === 'object') {
        if (
          'name' in error.fieldErrors
          && (error.fieldErrors.name as string[]).includes('verification')
        ) {
          beginNameChange('name');
        }
        const newErrorState = {
          saveState: SAVE_STATE_STATUS.ERROR,
          errors: { ...settingsFormDataState?.errors, ...error.fieldErrors },
        };
        updateSettingsFormData(newErrorState);
      } else {
        const newErrorState = {
          saveState: SAVE_STATE_STATUS.ERROR,
          errors: { ...settingsFormDataState?.errors, [variables.form]: error.message },
        };
        updateSettingsFormData(newErrorState);
      }
    }
  });

  return {
    settingsData: data,
    isSettingsFetched,
    isSettingsLoading,
    settingsError,
    isSettingsError,
    saveSettingsMutation,
    saveMultipleSettingsMutation
  };
};

export { useAccountSettings };
