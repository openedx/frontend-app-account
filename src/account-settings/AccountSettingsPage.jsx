import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from '@edx/frontend-i18n';
import { Hyperlink } from '@edx/paragon';

import messages from './AccountSettingsPage.messages';

import { configuration } from '../environment';
import { fetchSettings, saveSettings, updateDraft } from './actions';
import { accountSettingsPageSelector } from './selectors';

import { PageLoading } from '../common';
import JumpNav from './components/JumpNav';
import Alert from './components/Alert';
import DeleteMyAccount from './components/DeleteMyAccount';
import EditableField from './components/EditableField';
import PasswordReset from './components/PasswordReset';
import ThirdPartyAuth from './components/ThirdPartyAuth';
import BetaLanguageBanner from './components/BetaLanguageBanner';
import EmailField from './components/EmailField';
import {
  YEAR_OF_BIRTH_OPTIONS,
  EDUCATION_LEVELS,
  GENDER_OPTIONS,
} from './constants/';
import { fetchSiteLanguages } from '../site-language';

class AccountSettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.educationLevels = EDUCATION_LEVELS.map(key => ({
      value: key,
      label: props.intl.formatMessage(messages[`account.settings.field.education.levels.${key}`]),
    }));
    this.genderOptions = GENDER_OPTIONS.map(key => ({
      value: key,
      label: props.intl.formatMessage(messages[`account.settings.field.gender.options.${key}`]),
    }));
  }

  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchSiteLanguages();
  }

  getTimeZoneOptions = memoize((timeZoneOptions, countryTimeZoneOptions) => {
    const concatTimeZoneOptions = [{
      label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.default']),
      value: '',
    }];
    if (countryTimeZoneOptions.length) {
      concatTimeZoneOptions.push({
        label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.country']),
        group: countryTimeZoneOptions,
      });
    }
    concatTimeZoneOptions.push({
      label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.all']),
      group: timeZoneOptions,
    });
    return concatTimeZoneOptions;
  });

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId, values) => {
    this.props.saveSettings(formId, values);
  };

  renderDuplicateTpaProviderMessage() {
    if (!this.props.duplicateTpaProvider) {
      return null;
    }

    return (
      <div>
        <Alert className="alert alert-danger" role="alert">
          <FormattedMessage
            id="account.settings.message.duplicate.tpa.provider"
            defaultMessage="The {provider} account you selected is already linked to another edX account."
            description="alert message informing the user that the third-party account they attempted to link is already linked to another edX account"
            values={{
              provider: <b>{this.props.duplicateTpaProvider}</b>,
            }}
          />
        </Alert>
      </div>
    );
  }

  renderManagedProfileMessage() {
    if (!this.props.profileDataManager) {
      return null;
    }

    return (
      <div>
        <Alert className="alert alert-primary" role="alert">
          <FormattedMessage
            id="account.settings.message.managed.settings"
            defaultMessage="Your profile settings are managed by {managerTitle}. Contact your administrator or {support} for help."
            description="alert message informing the user their account data is managed by a third party"
            values={{
              managerTitle: <b>{this.props.profileDataManager}</b>,
              support: (
                <Hyperlink destination={configuration.SUPPORT_URL} target="_blank">
                  <FormattedMessage
                    id="account.settings.message.managed.settings.support"
                    defaultMessage="support"
                    description="website support"
                  />
                </Hyperlink>
              ),
            }}
          />
        </Alert>
      </div>
    );
  }

  renderSecondaryEmailField(editableFieldProps) {
    if (this.props.hiddenFields.includes('secondary_email')) {
      return null;
    }

    return (
      <EmailField
        name="secondary_email"
        label={this.props.intl.formatMessage(messages['account.settings.field.secondary.email'])}
        value={this.props.formValues.secondary_email}
        confirmationMessageDefinition={messages['account.settings.field.secondary.email.confirmation']}
        {...editableFieldProps}
      />
    );
  }

  renderContent() {
    const editableFieldProps = {
      onChange: this.handleEditableFieldChange,
      onSubmit: this.handleSubmit,
    };

    const timeZoneOptions = this.getTimeZoneOptions(
      this.props.timeZoneOptions,
      this.props.countryTimeZoneOptions,
    );

    const hasLinkedSocial = this.props.providers && this.props.providers.length > 0;

    return (
      <React.Fragment>
        <section id="basic-information">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.account.information'])}
          </h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>
          {this.renderManagedProfileMessage()}

          <EditableField
            name="username"
            type="text"
            value={this.props.formValues.username}
            label={this.props.intl.formatMessage(messages['account.settings.field.username'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.username.help.text'])}
            isEditable={false}
            {...editableFieldProps}
          />
          <EditableField
            name="name"
            type="text"
            value={this.props.formValues.name}
            label={this.props.intl.formatMessage(messages['account.settings.field.full.name'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text'])}
            isEditable={!this.props.staticFields.includes('name')}
            {...editableFieldProps}
          />
          <EmailField
            name="email"
            label={this.props.intl.formatMessage(messages['account.settings.field.email'])}
            value={this.props.formValues.email}
            confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.email.help.text'])}
            isEditable={!this.props.staticFields.includes('email')}
            {...editableFieldProps}
          />
          {this.renderSecondaryEmailField(editableFieldProps)}
          <PasswordReset />
          <EditableField
            name="year_of_birth"
            type="select"
            label={this.props.intl.formatMessage(messages['account.settings.field.dob'])}
            value={this.props.formValues.year_of_birth}
            options={YEAR_OF_BIRTH_OPTIONS}
            {...editableFieldProps}
          />
          <EditableField
            name="country"
            type="select"
            value={this.props.formValues.country}
            options={this.props.countryOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.country'])}
            isEditable={!this.props.staticFields.includes('country')}
            {...editableFieldProps}
          />
        </section>

        <section id="profile-information">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <EditableField
            name="level_of_education"
            type="select"
            value={this.props.formValues.level_of_education}
            options={this.educationLevels}
            label={this.props.intl.formatMessage(messages['account.settings.field.education'])}
            {...editableFieldProps}
          />
          <EditableField
            name="gender"
            type="select"
            value={this.props.formValues.gender}
            options={this.genderOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.gender'])}
            {...editableFieldProps}
          />
          <EditableField
            name="language_proficiencies"
            type="select"
            value={this.props.formValues.language_proficiencies}
            options={this.props.languageProficiencyOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
            {...editableFieldProps}
          />
        </section>

        <section id="social-media">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.social.media'])}
          </h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.social.media.description'])}</p>

          <EditableField
            name="social_link_linkedin"
            type="text"
            value={this.props.formValues.social_link_linkedin}
            label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_facebook"
            type="text"
            value={this.props.formValues.social_link_facebook}
            label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.facebook'])}
            {...editableFieldProps}
          />
          <EditableField
            name="social_link_twitter"
            type="text"
            value={this.props.formValues.social_link_twitter}
            label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.twitter'])}
            {...editableFieldProps}
          />
        </section>

        <section id="site-preferences">
          <h2 className="section-heading">
            {this.props.intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <BetaLanguageBanner />
          <EditableField
            name="siteLanguage"
            type="select"
            options={this.props.siteLanguageOptions}
            value={this.props.siteLanguage.draftOrSavedValue}
            label={this.props.intl.formatMessage(messages['account.settings.field.site.language'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
            {...editableFieldProps}
          />
          <EditableField
            name="time_zone"
            type="select"
            value={this.props.formValues.time_zone || ''}
            options={timeZoneOptions}
            label={this.props.intl.formatMessage(messages['account.settings.field.time.zone'])}
            helpText={this.props.intl.formatMessage(messages['account.settings.field.time.zone.description'])}
            {...editableFieldProps}
            onSubmit={(formId, value) => {
              // the endpoint will not accept an empty string. it must be null
              this.handleSubmit(formId, value || null);
            }}
          />
        </section>

        <section id="linked-accounts">
          <h2 className="section-heading">{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts.description'])}</p>
          <ThirdPartyAuth />
        </section>

        <section id="delete-account">
          <DeleteMyAccount
            isVerifiedAccount={this.props.isActive}
            hasLinkedSocial={hasLinkedSocial}
          />
        </section>

      </React.Fragment>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['account.settings.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <PageLoading srMessage={this.props.intl.formatMessage(messages['account.settings.loading.message'])} />
    );
  }

  render() {
    const {
      loading,
      loaded,
      loadingError,
    } = this.props;

    return (
      <div className="page__account-settings container-fluid py-5">
        {this.renderDuplicateTpaProviderMessage()}
        <h1 className="mb-4">
          {this.props.intl.formatMessage(messages['account.settings.page.heading'])}
        </h1>
        <div>
          <div className="row">
            <div className="col-md-3">
              <JumpNav />
            </div>
            <div className="col-md-9">
              {loading ? this.renderLoading() : null}
              {loaded ? this.renderContent() : null}
              {loadingError ? this.renderError() : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AccountSettingsPage.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,

  // Form data
  formValues: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    secondary_email: PropTypes.string,
    year_of_birth: PropTypes.number,
    country: PropTypes.string,
    level_of_education: PropTypes.string,
    gender: PropTypes.string,
    language_proficiencies: PropTypes.string,
    social_link_linkedin: PropTypes.string,
    social_link_facebook: PropTypes.string,
    social_link_twitter: PropTypes.string,
    time_zone: PropTypes.string,
  }).isRequired,
  siteLanguage: PropTypes.shape({
    previousValue: PropTypes.string,
    draftOrSavedValue: PropTypes.string,
    savedValue: PropTypes.string,
  }),
  siteLanguageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  countryOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  languageProficiencyOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  profileDataManager: PropTypes.string,
  providers: PropTypes.arrayOf(PropTypes.object),
  staticFields: PropTypes.arrayOf(PropTypes.string),
  hiddenFields: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,

  timeZoneOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  countryTimeZoneOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  fetchSiteLanguages: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  duplicateTpaProvider: PropTypes.string,
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  siteLanguage: null,
  siteLanguageOptions: [],
  countryOptions: [],
  timeZoneOptions: [],
  countryTimeZoneOptions: [],
  languageProficiencyOptions: [],
  profileDataManager: null,
  providers: [],
  staticFields: [],
  hiddenFields: ['secondary_email'],
  duplicateTpaProvider: null,
  isActive: true,
};


export default connect(accountSettingsPageSelector, {
  fetchSettings,
  saveSettings,
  updateDraft,
  fetchSiteLanguages,
})(injectIntl(AccountSettingsPage));
