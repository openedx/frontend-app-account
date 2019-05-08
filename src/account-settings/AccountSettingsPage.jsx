import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-i18n'; // eslint-disable-line

import messages from './AccountSettingsPage.messages';

import { fetchAccount, fetchThirdPartyAuthProviders, updateDraft, saveAccount } from './actions';
import { accountSettingsPageSelector } from './selectors';

import { PageLoading } from '../common';
import EditableField from './components/EditableField';
import PasswordReset from './components/PasswordReset';
import ThirdPartyAuth from './components/ThirdPartyAuth';
import EmailField from './components/EmailField';
import {
  YEAR_OF_BIRTH_OPTIONS,
  EDUCATION_LEVELS,
  GENDER_OPTIONS,
  TIME_ZONES,
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
    this.timeZoneOptions = Array.concat(
      [{ value: '', label: Intl.DateTimeFormat().resolvedOptions().timeZone }],
      // eslint-disable-next-line no-unused-vars
      TIME_ZONES.map(([label, value]) => ({ value, label: value })),
    );
  }

  componentDidMount() {
    this.props.fetchAccount();
    this.props.fetchThirdPartyAuthProviders();
    this.props.fetchSiteLanguages();
  }

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  }

  handleSubmit = (formId, values) => {
    this.props.saveAccount(formId, values);
  }

  renderContent() {
    const editableFieldProps = {
      onChange: this.handleEditableFieldChange,
      onSubmit: this.handleSubmit,
    };

    return (
      <div>
        <div className="row">
          <div className="col-md-8 col-lg-6">
            <h2>{this.props.intl.formatMessage(messages['account.settings.section.account.information'])}</h2>
            <p>{this.props.intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>

            <EditableField
              name="username"
              type="text"
              value={this.props.formValues.username}
              label={this.props.intl.formatMessage(messages['account.settings.field.username'])}
              isEditable={false}
              {...editableFieldProps}
            />
            <EditableField
              name="name"
              type="text"
              value={this.props.formValues.name}
              label={this.props.intl.formatMessage(messages['account.settings.field.full.name'])}
              {...editableFieldProps}
            />
            <EmailField
              name="email"
              label={this.props.intl.formatMessage(messages['account.settings.field.email'])}
              value={this.props.formValues.email}
              confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
              {...editableFieldProps}
            />
            <EditableField
              name="year_of_birth"
              type="select"
              label={this.props.intl.formatMessage(messages['account.settings.field.dob'])}
              value={this.props.formValues.year_of_birth}
              options={YEAR_OF_BIRTH_OPTIONS}
              {...editableFieldProps}
            />
            <PasswordReset />
            <EditableField
              name="siteLanguage"
              type="select"
              options={this.props.siteLanguageOptions}
              value={this.props.siteLanguage}
              label={this.props.intl.formatMessage(messages['account.settings.field.site.language'])}
              helpText={this.props.intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
              {...editableFieldProps}
            />
            <EditableField
              name="country"
              type="select"
              value={this.props.formValues.country}
              options={this.props.countryOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.country'])}
              {...editableFieldProps}
            />
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
            <ThirdPartyAuth />

            <h2>{this.props.intl.formatMessage(messages['account.settings.section.social.media'])}</h2>
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
            <EditableField
              name="time_zone"
              type="select"
              value={this.props.formValues.time_zone || ''}
              options={this.timeZoneOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.time.zone'])}
              {...editableFieldProps}
            />

          </div>
        </div>
      </div>
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
        <h1>
          {this.props.intl.formatMessage(messages['account.settings.page.heading'])}
        </h1>
        {loading ? this.renderLoading() : null}
        {loaded ? this.renderContent() : null}
        {loadingError ? this.renderError() : null}
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
  siteLanguage: PropTypes.string,
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

  fetchAccount: PropTypes.func.isRequired,
  fetchThirdPartyAuthProviders: PropTypes.func.isRequired,
  fetchSiteLanguages: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  saveAccount: PropTypes.func.isRequired,
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  siteLanguage: null,
  siteLanguageOptions: [],
  countryOptions: [],
  languageProficiencyOptions: [],
};


export default connect(accountSettingsPageSelector, {
  fetchAccount,
  updateDraft,
  saveAccount,
  fetchSiteLanguages,
  fetchThirdPartyAuthProviders,
})(injectIntl(AccountSettingsPage));
