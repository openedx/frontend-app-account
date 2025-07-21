import { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { Button, Hyperlink } from '@openedx/paragon';

import { betaLanguageBannerSelector } from './data/selectors';
import messages from './AccountSettingsPage.messages';
import { saveSettings } from './data/actions';
import { TRANSIFEX_LANGUAGE_BASE_URL } from './data/constants';
import Alert from './Alert';

const BetaLanguageBanner = ({ siteLanguage = null, siteLanguageList }) => {
  const intl = useIntl();
  const { locale } = useContext(AppContext);

  const getSiteLanguageEntry = (languageCode) => siteLanguageList.filter(l => l.code === languageCode)[0];

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

  /**
   * Returns a link to the Transifex URL where contributors can provide translations.
   * This code is tightly coupled to how Transifex chooses to design its URLs.
   */
  const getTransifexLink = (languageCode) => TRANSIFEX_LANGUAGE_BASE_URL + getTransifexURLPath(languageCode);

  const handleRevertLanguage = () => {
    const previousSiteLanguage = siteLanguage.previousValue;
    saveSettings('siteLanguage', previousSiteLanguage);
  };

  const savedLanguage = getSiteLanguageEntry(locale);
  if (!savedLanguage) {
    return null;
  }
  const isSavedLanguageReleased = savedLanguage.released === true;
  const noPreviousLanguageSet = siteLanguage.previousValue === null;
  if (isSavedLanguageReleased || noPreviousLanguageSet) {
    return null;
  }

  const previousLanguage = getSiteLanguageEntry(siteLanguage.previousValue);
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

BetaLanguageBanner.contextType = AppContext;

BetaLanguageBanner.propTypes = {
  siteLanguage: PropTypes.shape({
    previousValue: PropTypes.string,
    draft: PropTypes.string,
  }),
  siteLanguageList: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    released: PropTypes.bool,
  })).isRequired,
};

export default connect(
  betaLanguageBannerSelector,
  {
    saveSettings,
  },
)(BetaLanguageBanner);
