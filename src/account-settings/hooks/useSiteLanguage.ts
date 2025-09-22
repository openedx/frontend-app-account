import { getAuthenticatedUser, getLocale, handleRtl, LOCALE_CHANGED, publish } from '@openedx/frontend-base';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SAVE_STATE_STATUS } from '../../constants';
import { patchPreferences, postSetLang } from '../site-language';

const useSiteLanguage = () => {
  const queryClient = useQueryClient();
  const languageState = useQuery({
    queryKey: ['site-language'],
    queryFn: () => ({
      siteLanguage: getLocale(),
      siteLanguageDraft: null,
      prevSiteLanguage: null,
      saveSiteLanguageStatus: SAVE_STATE_STATUS.NULL,
      isSiteLanguageEditing: false,
    }),
    staleTime: Infinity,
  });

  const updateLanguageState = (newState) => {
    queryClient.setQueryData(['site-language'], (old) => ({
      ...(old ?? {}),
      ...newState,
    }));
  };

  const openSiteLanguage = () => {
    updateLanguageState({ isSiteLanguageEditing: true });
  };

  const closeSiteLanguage = () => {
    updateLanguageState({ isSiteLanguageEditing: false });
  };

  const mutation = useMutation({
    mutationFn: async (newLanguage) => {
      updateLanguageState({ saveLanguageStatus: SAVE_STATE_STATUS.PENDING });
      const { username } = getAuthenticatedUser();
      const prevSiteLanguage = getLocale();
      // The following two requests need to be done sequentially, with patching preferences before
      // the post to setlang.  They used to be done in parallel, but this might create ambiguous
      // behavior.
      await patchPreferences(username, { prefLang: newLanguage });
      await postSetLang(newLanguage);
      const newSiteLanguage = getLocale();
      updateLanguageState({ siteLanguage: newSiteLanguage, prevSiteLanguage });
      return newSiteLanguage;
    },
    onError: (error) => {
      updateLanguageState({ saveLanguageStatus: SAVE_STATE_STATUS.ERROR });
      return error;
    },
    onSuccess: (data) => {
      updateLanguageState({ saveLanguageStatus: SAVE_STATE_STATUS.COMPLETE, siteLanguageDraft: null });
      publish(LOCALE_CHANGED, data);
      handleRtl();
      setTimeout(closeSiteLanguage, 1000);
    }
  });
  return { languageState: languageState.data, updateLanguageState, mutation, openSiteLanguage, closeSiteLanguage };
};

export { useSiteLanguage };
