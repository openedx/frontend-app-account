import { getSupportedLanguageList, useIntl } from '@openedx/frontend-base';
import { Button, Hyperlink } from '@openedx/paragon';
import { useMemo } from 'react';

import Alert from './Alert';
import { TRANSIFEX_LANGUAGE_BASE_URL } from './data/constants';
import { useSiteLanguage } from './hooks';
import messages from './messages';

const BetaLanguageBanner = () => {
  const intl = useIntl();
  const { languageState, mutation: languageMutation } = useSiteLanguage();
  const siteLanguageList = useMemo(() => getSupportedLanguageList(), []);

  const getSiteLanguageEntry = (languageCode) => {
    return siteLanguageList.find(l => l.code === languageCode);
  };

  /**
   * Returns a link to the Transifex URL where contributors can provide translations.
   * This code is tightly coupled to how Transifex chooses to design its URLs.
   */
  const getTransifexLink = (languageCode) => {
    return TRANSIFEX_LANGUAGE_BASE_URL + getTransifexURLPath(languageCode);
  };

  /**
   * Returns the URL path that Transifex chooses to use for its language sub-pages.
   *
   * For extended language codes, it returns the 2nd half capitalized, replacing
   * hyphen (-) with underscore (_).
   *     example: pt-br -> pt_BR
   *
   * For short language codes, it returns the code as is.
   *     example: fr -> fr
   */
  const getTransifexURLPath = (languageCode) => {
    const tokenizedCode = languageCode.split('-');
    if (tokenizedCode.length > 1) {
      return `${tokenizedCode[0]}_${tokenizedCode[1].toUpperCase()}`;
    }
    return tokenizedCode[0];
  };

  const handleRevertLanguage = () => {
    if (languageState?.prevSiteLanguage) {
      const previousSiteLanguage = languageState.prevSiteLanguage;
      languageMutation.mutate(previousSiteLanguage);
    }
  };

  const savedLanguage = getSiteLanguageEntry(languageState?.siteLanguage);
  if (!savedLanguage) {
    return null;
  }
  
  const isSavedLanguageReleased = savedLanguage.released === true;
  const noPreviousLanguageSet = languageState?.prevSiteLanguage === null;
  if (isSavedLanguageReleased || noPreviousLanguageSet) {
    return null;
  }

  const previousLanguage = getSiteLanguageEntry(languageState.prevSiteLanguage ?? '');
  
  if (!previousLanguage) {
    return null;
  }

  return (
    <div>
      <Alert className="beta_language_alert alert alert-warning" role="alert">
        <p>
          {intl.formatMessage(messages['account.settings.banner.beta.language'], {
            beta_language: savedLanguage.name,
          })}
        </p>
        <div>
          <Button onClick={handleRevertLanguage} className="mr-2">
            {intl.formatMessage(
              messages['account.settings.banner.beta.language.action.switch.back'],
              { previous_language: previousLanguage.name },
            )}
          </Button>
          <Hyperlink
            destination={getTransifexLink(savedLanguage.code)}
            className="btn btn-outline-secondary"
            target="_blank"
          >
            {intl.formatMessage(
              messages['account.settings.banner.beta.language.action.help.translate'],
              { beta_language: savedLanguage.name },
            )}
          </Hyperlink>
        </div>
      </Alert>
    </div>
  );
};

export default BetaLanguageBanner;
