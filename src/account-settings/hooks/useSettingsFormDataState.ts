import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SAVE_STATE_STATUS } from '../../constants';

const useSettingsFormDataState = () => {
  const queryClient = useQueryClient();
  const settingsFormDataState = useQuery({
    queryKey: ['settings-form-data'],
    queryFn: () => ({
      verifiedNameForCertsDraft: null,
      formValues: {},
      committedValues: {},
      confirmationValues: {},
      errors: {},
      openFormId: null,
      saveState: SAVE_STATE_STATUS.NULL,
      nameChangeModal: false,
    }),
    staleTime: Infinity,
  });

  const updateSettingsFormData = (newState) => {
    queryClient.setQueryData(['settings-form-data'], (old) => ({
      ...(old ?? {}),
      ...newState,
    }));
  };

  const openForm = (formId) => {
    const newState = {
      openFormId: formId,
      errors: {},
      verifiedNameForCertsDraft: null,
    };
    updateSettingsFormData(newState);
  };

  const closeForm = (formId) => {
    if (formId === settingsFormDataState?.data?.openFormId) {
      const newState = {
        openFormId: null,
        saveState: SAVE_STATE_STATUS.NULL,
        errors: {},
        verifiedNameForCertsDraft: null,
        nameChangeModal: false,

      };
      updateSettingsFormData(newState);
    }
  };

  const beginNameChange = (formId) => {
    const newState = {
      saveState: SAVE_STATE_STATUS.ERROR,
      nameChangeModal: {
        formId: formId,
      }
    };
    updateSettingsFormData(newState);
  };

  const updateVerifiedNameForCertsDraft = (value) => {
    const newState = {
      verifiedNameForCertsDraft: value
    };
    updateSettingsFormData(newState);
  };

  return { settingsFormDataState: settingsFormDataState.data, updateSettingsFormData, openForm, closeForm, beginNameChange, updateVerifiedNameForCertsDraft };
};

export { useSettingsFormDataState };
