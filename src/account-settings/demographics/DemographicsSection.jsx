import {
  DECLINED,
  DEMOGRAPHICS_EDUCATION_LEVEL_OPTIONS,
  DEMOGRAPHICS_ETHNICITY_OPTIONS,
  DEMOGRAPHICS_GENDER_OPTIONS,
  DEMOGRAPHICS_INCOME_OPTIONS,
  DEMOGRAPHICS_MILITARY_HISTORY_OPTIONS,
  DEMOGRAPHICS_WORK_SECTOR_OPTIONS,
  DEMOGRAPHICS_WORK_STATUS_OPTIONS,
  OTHER,
  SELF_DESCRIBE,
} from '../data/constants';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { saveMultipleSettings, updateDraft } from '../data/actions';

import Alert from '../Alert';
import Checkboxes from './Checkboxes';
import EditableField from '../EditableField';
import { Input } from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { demographicsSectionSelector } from '../data/selectors';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import memoize from 'memoize-one';
import messages from './DemographicsSection.messages';

class DemographicsSection extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.alert = null;

    this.setAlertRef = element => {
      this.alert = element;
    }

    this.focusAlert = () => {
      if (this.alert) this.alert.focus();
    }
  }

  componentDidUpdate() {
    if(!isEmpty(this.props.formErrors)) {
      this.focusAlert();
    }
  }

  getLocalizedOptions = memoize((locale) => ({
    demographicsGenderOptions: DEMOGRAPHICS_GENDER_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.gender.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
    demographicsEthnicityOptions: DEMOGRAPHICS_ETHNICITY_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.ethnicity.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
    demographicsIncomeOptions: DEMOGRAPHICS_INCOME_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.income.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
    demographicsMilitaryHistoryOptions: DEMOGRAPHICS_MILITARY_HISTORY_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.military_history.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
    demographicsEducationLevelOptions: DEMOGRAPHICS_EDUCATION_LEVEL_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.education_level.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
    demographicsWorkStatusOptions: DEMOGRAPHICS_WORK_STATUS_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.work_status.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
    demographicsWorkSectorOptions: DEMOGRAPHICS_WORK_SECTOR_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.work_sector.options.${key || 'empty'}`]),
    })).concat(this.getDeclinedOption()),
  }));

  getDeclinedOption() {
    return [{
      value: DECLINED,
      label: this.props.intl.formatMessage(messages[`account.settings.field.demographics.options.declined`])
    }]
  }

  ethnicityFieldDisplay = () => {
    if (get(this, 'props.formValues.demographics_user_ethnicity')) {
      const ethnicities = this.props.formValues.demographics_user_ethnicity;
      return ethnicities.map((e) => {
        if (e == DECLINED) {
          return this.props.intl.formatMessage(messages[`account.settings.field.demographics.options.declined`]);
        }
        return this.props.intl.formatMessage(messages[`account.settings.field.demographics.ethnicity.options.${e}`]);
      }).join(", ")
    }
  }

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId, values) => {
    // We have some custom fields in this section. Instead of relying on the
    // submitted values, submit the values stored in 'drafts'.
    const drafts = this.props.drafts;
    const settingsArray = []
    for (let field in drafts) {
      settingsArray.push({
        formId: field,
        commitValues: drafts[field]
      })
    }

    this.props.saveMultipleSettings(settingsArray, formId);
  };

  /**
   * If an error is encountered when trying to communicate with the Demographics IDA then we will
   * display an Alert letting the user know that their info will not be retrieved or displayed
   * and temporarily cannot be updated.
   */
  renderDemographicsServiceIssueWarning() {    
    if (!isEmpty(this.props.formErrors)) {
      return (
        <div 
          tabIndex="-1"
          ref={this.setAlertRef}>
          <Alert className="alert alert-danger" role="alert">
            <FormattedMessage
              id="account.settings.message.demographics.service.issue"
              defaultMessage="An error occurred attempting to retrieve or save your account information. Please try again later."
              description="alert message informing the user that the there is a problem retrieving or updating information from the Demographics microservice"
            />
          </Alert>
        </div>
      );
    } else {
      return null;
    }
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
    } = this.getLocalizedOptions(this.context.locale);

    const showSelfDescribe = this.props.formValues.demographics_gender == SELF_DESCRIBE;
    const showWorkStatusDescribe = this.props.formValues.demographics_work_status == OTHER;

    return (
      <div className="account-section" id="demographics-information">
        <h2 className="section-heading">
          {this.props.intl.formatMessage(messages['account.settings.section.demographics.information'])}
        </h2>
        {this.renderDemographicsServiceIssueWarning()}

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
          {showSelfDescribe &&
            <Input
              name='demographics_gender_description'
              id='field-demographics_gender_description'
              type='text'
              placeholder={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender_description.empty'])}
              value={this.props.formValues.demographics_gender_description}
              onChange={(e) => this.handleEditableFieldChange(`demographics_gender_description`, e.target.value)}
              aria-label={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender_description'])}
              className="mt-1"
            />
          }
        </EditableField>
        <EditableField
          name="demographics_user_ethnicity"
          type="select"
          hidden
          value={this.ethnicityFieldDisplay()}
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
          userSuppliedValue={showWorkStatusDescribe ? this.props.formValues.demographics_work_status_description : null}
          options={demographicsWorkStatusOptions}
          label={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status'])}
          emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status.empty'])}
          {...editableFieldProps}
        >
          {showWorkStatusDescribe &&
            <Input
              name='demographics_work_status_description'
              id='field-demographics_work_status_description'
              type='text'
              placeholder={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status_description.empty'])}
              value={this.props.formValues.demographics_work_status_description}
              onChange={(e) => this.handleEditableFieldChange(`demographics_work_status_description`, e.target.value)}
              aria-label={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status_description'])}
              className="mt-1"
            />
          }
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
    )
  }
};

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
  }).isRequired,
  formErrors: PropTypes.shape({
    demographicsError: PropTypes.string,
  }).isRequired,
  updateDraft: PropTypes.func.isRequired
};

export default connect(demographicsSectionSelector, {
  saveMultipleSettings,
  updateDraft,
})(injectIntl(DemographicsSection));
