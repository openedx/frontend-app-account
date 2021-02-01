import React from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { Button, Hyperlink } from '@edx/paragon';

import { betaLanguageBannerSelector } from './data/selectors';
import messages from './AccountSettingsPage.messages';
import { saveSettings } from './data/actions';
import { TRANSIFEX_LANGUAGE_BASE_URL } from './data/constants';
import Alert from './Alert';

class BetaLanguageBanner extends React.Component {
  getSiteLanguageEntry(languageCode) {
    return this.props.siteLanguageList.filter(l => l.code === languageCode)[0];
  }

  /**
   * Returns a link to the Transifex URL where contributors can provide translations.
   * This code is tightly coupled to how Transifex chooses to design its URLs.
   */
  getTransifexLink(languageCode) {
    return TRANSIFEX_LANGUAGE_BASE_URL + this.getTransifexURLPath(languageCode);
  }

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
  getTransifexURLPath(languageCode) {
    const tokenizedCode = languageCode.split('-');
    if (tokenizedCode.length > 1) {
      return `${tokenizedCode[0]}_${tokenizedCode[1].toUpperCase()}`;
    }
    return tokenizedCode[0];
  }

  handleRevertLanguage = () => {
    const previousSiteLanguage = this.props.siteLanguage.previousValue;
    this.props.saveSettings('siteLanguage', previousSiteLanguage);
  };

  render() {
    const savedLanguage = this.getSiteLanguageEntry(this.context.locale);
    const isSavedLanguageReleased = savedLanguage.released === true;
    const noPreviousLanguageSet = this.props.siteLanguage.previousValue === null;
    if (isSavedLanguageReleased || noPreviousLanguageSet) {
      return null;
    }

    const previousLanguage = this.getSiteLanguageEntry(this.props.siteLanguage.previousValue);
    return (
      <div>
        <Alert className="beta_language_alert alert alert-warning" role="alert">
          <p>
            {this.props.intl.formatMessage(messages['account.settings.banner.beta.language'], {
              beta_language: savedLanguage.name,
            })}
          </p>
          <div>
            <Button onClick={this.handleRevertLanguage} className="mr-2">
              {this.props.intl.formatMessage(
                messages['account.settings.banner.beta.language.action.switch.back'],
                { previous_language: previousLanguage.name },
              )}
            </Button>
            <Hyperlink
              destination={this.getTransifexLink(savedLanguage.code)}
              className="btn btn-outline-secondary"
              target="_blank"
            >
              {this.props.intl.formatMessage(
                messages['account.settings.banner.beta.language.action.help.translate'],
                { beta_language: savedLanguage.name },
              )}
            </Hyperlink>
          </div>
        </Alert>
      </div>
    );
  }
}

BetaLanguageBanner.contextType = AppContext;

BetaLanguageBanner.propTypes = {
  intl: intlShape.isRequired,
  siteLanguage: PropTypes.shape({
    previousValue: PropTypes.string,
    draft: PropTypes.string,
  }),
  siteLanguageList: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    released: PropTypes.bool,
  })).isRequired,
  saveSettings: PropTypes.func.isRequired,
};

BetaLanguageBanner.defaultProps = {
  siteLanguage: null,
};

export default connect(
  betaLanguageBannerSelector,
  {
    saveSettings,
  },
)(injectIntl(BetaLanguageBanner));
