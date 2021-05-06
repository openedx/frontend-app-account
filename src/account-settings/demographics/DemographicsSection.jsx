import { getConfig } from '@edx/frontend-platform';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import { Hyperlink, Input } from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import memoize from 'memoize-one';
import { demographicsSectionSelector } from '../data/selectors';
import EditableField from '../EditableField';
import Checkboxes from './Checkboxes';
import Alert from '../Alert';
import { saveMultipleSettings, updateDraft } from '../data/actions';
import {
  OTHER,
  SELF_DESCRIBE,
} from '../data/constants';
import messages from './DemographicsSection.messages';

class DemographicsSection extends React.Component {
  // We check the `demographicsOptions` prop to see if it is empty before we attempt to extract and
  // format the available options for each question from the API response.
  getApiOptions = memoize((demographicsOptions) => (this.hasRetrievedDemographicsOptions() && {
    demographicsGenderOptions: this.addDefaultOption('account.settings.field.demographics.gender.options.empty')
      .concat(demographicsOptions.actions.POST.gender.choices.map(key => ({
        value: key.value,
        label: key.display_name,
      }))),
    /* Ethnicity options don't need the blank/default option */
    demographicsEthnicityOptions: demographicsOptions.actions.POST.user_ethnicity.child.children.ethnicity.choices.map(
      key => ({
        value: key.value,
        label: key.display_name,
      }),
    ),
    demographicsIncomeOptions: this.addDefaultOption('account.settings.field.demographics.income.options.empty')
      .concat(demographicsOptions.actions.POST.income.choices.map(key => ({
        value: key.value,
        label: key.display_name,
      }))),
    demographicsMilitaryHistoryOptions: this.addDefaultOption('account.settings.field.demographics.military_history.options.empty')
      .concat(demographicsOptions.actions.POST.military_history.choices.map(key => ({
        value: key.value,
        label: key.display_name,
      }))),
    demographicsEducationLevelOptions: this.addDefaultOption('account.settings.field.demographics.education_level.options.empty')
      .concat(demographicsOptions.actions.POST.learner_education_level.choices.map(key => ({
        value: key.value,
        label: key.display_name,
      }))),
    demographicsWorkStatusOptions: this.addDefaultOption('account.settings.field.demographics.work_status.options.empty')
      .concat(demographicsOptions.actions.POST.work_status.choices.map(key => ({
        value: key.value,
        label: key.display_name,
      }))),
    demographicsWorkSectorOptions: this.addDefaultOption('account.settings.field.demographics.work_sector.options.empty')
      .concat(demographicsOptions.actions.POST.current_work_sector.choices.map(key => ({
        value: key.value,
        label: key.display_name,
      }))),
  }));

  ethnicityFieldDisplay = (demographicsEthnicityOptions) => {
    let ethnicities = [];
    if (get(this, 'props.formValues.demographics_user_ethnicity')) {
      ethnicities = this.props.formValues.demographics_user_ethnicity;
    }
    return ethnicities.map((e) => {
      const matchingOption = demographicsEthnicityOptions.filter(option => option.value === e)[0];
      return matchingOption && matchingOption.label;
    }).join(', ');
  }

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId) => {
    // We have some custom fields in this section. Instead of relying on the
    // submitted values, submit the values stored in 'drafts'.
    const { drafts } = this.props;
    const settingsArray = Object.entries(drafts).map(([field, value]) => ({
      formId: field,
      commitValues: value,
    }));

    this.props.saveMultipleSettings(settingsArray, formId);
  };

  /**
   * Utility method that adds the specified message as a default option to the list of available
   * choices.
   *
   * @param {*} messageId id of message matching desired default label text
   */
  addDefaultOption(messageId) {
    return [{
      value: '',
      label: this.props.intl.formatMessage(messages[messageId]),
    }];
  }

  /**
   * Utility method that helps determine if we were able to retrieve the available options for
   * the Demographics questions. Returns true if the `demographicsOptions` prop is _not_ empty,
   * otherwise false. This prop being empty is indicative of a failure communicating with the
   * Demographics IDA's API.
   */
  hasRetrievedDemographicsOptions() {
    return !isEmpty(this.props.formValues.demographicsOptions);
  }

  /**
   * If an error is encountered when trying to communicate with the Demographics IDA then we will
   * display an Alert letting the user know that their info will not be displayed and temporarily
   * cannot be updated.
   */
  renderDemographicsServiceIssueWarning() {
    if (!isEmpty(this.props.formErrors.demographicsError)
        || !this.hasRetrievedDemographicsOptions()) {
      return (
        <div
          tabIndex="-1"
          ref={this.alertRef}
        >
          <Alert className="alert alert-danger" role="alert">
            <FormattedMessage
              id="account.settings.message.demographics.service.issue"
              defaultMessage="An error occurred attempting to retrieve or save your account information. Please try again later."
              description="alert message informing the user that the there is a problem retrieving or updating information from the Demographics microservice"
            />
          </Alert>
        </div>
      );
    }
    return null;
  }

  render() {
    const editableFieldProps = {
      onChange: this.handleEditableFieldChange,
      onSubmit: this.handleSubmit,
    };

    const {
      demographicsGenderOptions,
      demographicsEthnicityOptions,
      demographicsIncomeOptions,
      demographicsMilitaryHistoryOptions,
      demographicsEducationLevelOptions,
      demographicsWorkStatusOptions,
      demographicsWorkSectorOptions,
    } = this.getApiOptions(this.props.formValues.demographicsOptions);

    const showSelfDescribe = this.props.formValues.demographics_gender === SELF_DESCRIBE;
    const showWorkStatusDescribe = this.props.formValues.demographics_work_status === OTHER;

    return (
      <div className="account-section" id="demographics-information" ref={this.props.forwardRef}>
        <h2 className="section-heading">
          {this.props.intl.formatMessage(messages['account.settings.section.demographics.information'])}
        </h2>
        <p>
          <Hyperlink
            destination={`${getConfig().MARKETING_SITE_BASE_URL}/demographics`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.intl.formatMessage(
              messages['account.settings.section.demographics.why'],
              {
                siteName: getConfig().SITE_NAME,
              },
            )}
          </Hyperlink>
        </p>
        {this.renderDemographicsServiceIssueWarning()}
        {/*
          If the demographicsOptions props are empty then there is no need to display the fields as
          the user will not have any choices available to select, nor will they be able to update
          their answers.
        */}
        {this.hasRetrievedDemographicsOptions() && (
          <div id="demographics-fields">
            <EditableField
              name="demographics_gender"
              type="select"
              value={this.props.formValues.demographics_gender}
              userSuppliedValue={showSelfDescribe ? this.props.formValues.demographics_gender_description : null}
              options={demographicsGenderOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender.empty'])}
              {...editableFieldProps}
            >
              {showSelfDescribe && (
                <Input
                  name="demographics_gender_description"
                  id="field-demographics_gender_description"
                  type="text"
                  placeholder={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender_description.empty'])}
                  value={this.props.formValues.demographics_gender_description}
                  onChange={(e) => this.handleEditableFieldChange('demographics_gender_description', e.target.value)}
                  aria-label={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender_description'])}
                  className="mt-1"
                />
              )}
            </EditableField>
            <EditableField
              name="demographics_user_ethnicity"
              type="select"
              hidden
              value={this.ethnicityFieldDisplay(demographicsEthnicityOptions)}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.ethnicity'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.ethnicity.empty'])}
              {...editableFieldProps}
            >
              <Checkboxes
                id="demographics_user_ethnicity"
                options={demographicsEthnicityOptions}
                values={this.props.formValues.demographics_user_ethnicity}
                {...editableFieldProps}
              />
            </EditableField>
            <EditableField
              name="demographics_income"
              type="select"
              value={this.props.formValues.demographics_income}
              options={demographicsIncomeOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.income'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.income.empty'])}
              {...editableFieldProps}
            />
            <EditableField
              name="demographics_military_history"
              type="select"
              value={this.props.formValues.demographics_military_history}
              options={demographicsMilitaryHistoryOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.military_history'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.military_history.empty'])}
              {...editableFieldProps}
            />
            <EditableField
              name="demographics_learner_education_level"
              type="select"
              value={this.props.formValues.demographics_learner_education_level}
              options={demographicsEducationLevelOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.learner_education_level'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.learner_education_level.empty'])}
              {...editableFieldProps}
            />
            <EditableField
              name="demographics_parent_education_level"
              type="select"
              value={this.props.formValues.demographics_parent_education_level}
              options={demographicsEducationLevelOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.parent_education_level'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.parent_education_level.empty'])}
              {...editableFieldProps}
            />
            <EditableField
              name="demographics_work_status"
              type="select"
              value={this.props.formValues.demographics_work_status}
              userSuppliedValue={showWorkStatusDescribe
                ? this.props.formValues.demographics_work_status_description
                : null}
              options={demographicsWorkStatusOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status.empty'])}
              {...editableFieldProps}
            >
              {showWorkStatusDescribe && (
                <Input
                  name="demographics_work_status_description"
                  id="field-demographics_work_status_description"
                  type="text"
                  placeholder={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status_description.empty'])}
                  value={this.props.formValues.demographics_work_status_description}
                  onChange={(e) => this.handleEditableFieldChange('demographics_work_status_description', e.target.value)}
                  aria-label={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status_description'])}
                  className="mt-1"
                />
              )}
            </EditableField>
            <EditableField
              name="demographics_current_work_sector"
              type="select"
              value={this.props.formValues.demographics_current_work_sector}
              options={demographicsWorkSectorOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.current_work_sector'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.current_work_sector.empty'])}
              {...editableFieldProps}
            />
            <EditableField
              name="demographics_future_work_sector"
              type="select"
              value={this.props.formValues.demographics_future_work_sector}
              options={demographicsWorkSectorOptions}
              label={this.props.intl.formatMessage(messages['account.settings.field.demographics.future_work_sector'])}
              emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.future_work_sector.empty'])}
              {...editableFieldProps}
            />
          </div>
        )}
      </div>
    );
  }
}

DemographicsSection.propTypes = {
  intl: intlShape.isRequired,
  formValues: PropTypes.shape({
    demographics_gender: PropTypes.string,
    demographics_user_ethnicity: PropTypes.array,
    demographics_income: PropTypes.string,
    demographics_military_history: PropTypes.string,
    demographics_learner_education_level: PropTypes.string,
    demographics_parent_education_level: PropTypes.string,
    demographics_work_status: PropTypes.string,
    demographics_current_work_sector: PropTypes.string,
    demographics_future_work_sector: PropTypes.string,
    demographics_work_status_description: PropTypes.string,
    demographics_gender_description: PropTypes.string,
    demographicsOptions: PropTypes.object,
  }).isRequired,
  drafts: PropTypes.shape({
    demographics_gender: PropTypes.string,
    demographics_user_ethnicity: PropTypes.array,
    demographics_income: PropTypes.string,
    demographics_military_history: PropTypes.string,
    demographics_learner_education_level: PropTypes.string,
    demographics_parent_education_level: PropTypes.string,
    demographics_work_status: PropTypes.string,
    demographics_current_work_sector: PropTypes.string,
    demographics_future_work_sector: PropTypes.string,
    demographics_work_status_description: PropTypes.string,
    demographics_gender_description: PropTypes.string,
    demographicsOptions: PropTypes.object,
  }).isRequired,
  formErrors: PropTypes.shape({
    demographicsError: PropTypes.string,
  }).isRequired,
  forwardRef: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  saveMultipleSettings: PropTypes.func.isRequired,
};

export default connect(demographicsSectionSelector, {
  saveMultipleSettings,
  updateDraft,
})(injectIntl(DemographicsSection));
