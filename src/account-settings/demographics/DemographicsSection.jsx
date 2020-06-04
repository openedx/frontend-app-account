import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import memoize from 'memoize-one';

import { demographicsSectionSelector } from '../data/selectors';
import { saveSettings, updateDraft } from '../data/actions';
import EditableField from '../EditableField';
import messages from './DemographicsSection.messages';
import {
  SELF_DESCRIBE,
  DEMOGRAPHICS_GENDER_OPTIONS,
  DEMOGRAPHICS_ETHNICITY_OPTIONS,
  DEMOGRAPHICS_INCOME_OPTIONS,
  DEMOGRAPHICS_MILITARY_HISTORY_OPTIONS,
  DEMOGRAPHICS_EDUCATION_LEVEL_OPTIONS,
  DEMOGRAPHICS_WORK_STATUS_OPTIONS,
  DEMOGRAPHICS_WORK_SECTOR_OPTIONS,
  DECLINED,
} from '../data/constants';

class DemographicsSection extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      showSelfDescribe: false
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

  handleEditableFieldChange = (name, value) => {
    // Temporary hack until backend hooked up
    if (name == 'demographics_gender') {
      let showSelfDescribe = value == SELF_DESCRIBE;
      this.setState({ showSelfDescribe })
    }

    this.props.updateDraft(name, value);
  };

  handleSubmit = (formId, values) => {
    this.props.saveSettings(formId, values);
  };

  render() {
    const editableFieldProps = {
      onChange: this.handleEditableFieldChange,
      onSubmit: this.handleSubmit,
    };

    const {
      yearOfBirthOptions,
      demographicsGenderOptions,
      demographicsEthnicityOptions,
      demographicsIncomeOptions,
      demographicsMilitaryHistoryOptions,
      demographicsEducationLevelOptions,
      demographicsWorkStatusOptions,
      demographicsWorkSectorOptions,
    } = this.getLocalizedOptions(this.context.locale);

    // // TODO: This is what it will be when we have things coming back from the server. Hack for now.
    // const showSelfDescribe = this.props.formValues.demographics_gender == 'self-describe'

    return (
      <div className="account-section" id="demographics-information">
        <h2 className="section-heading">
          {this.props.intl.formatMessage(messages['account.settings.section.demographics.information'])}
        </h2>

        <EditableField
          name="demographics_gender"
          type="select"
          value={this.props.formValues.demographics_gender}
          options={demographicsGenderOptions}
          label={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender'])}
          emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender.empty'])}
          {...editableFieldProps}
        />
        {this.state.showSelfDescribe &&
          <EditableField
            name="demographics_gender_description"
            type="text"
            value={this.props.formValues.demographics_gender_description}
            label={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender_description'])}
            emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.gender_description.empty'])}
            {...editableFieldProps}
          />
        }
        <EditableField
          name="demographics_ethnicity"
          type="select"
          value={this.props.formValues.demographics_ethnicity}
          options={demographicsEthnicityOptions}
          label={this.props.intl.formatMessage(messages['account.settings.field.demographics.ethnicity'])}
          emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.ethnicity.empty'])}
          {...editableFieldProps}
        />
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
          options={demographicsWorkStatusOptions}
          label={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status'])}
          emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.demographics.work_status.empty'])}
          {...editableFieldProps}
        />
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
}

DemographicsSection.propTypes = {
  intl: intlShape.isRequired,
  formValues: PropTypes.shape({
    demographics_gender: PropTypes.string,
    demographics_ethnicity: PropTypes.string,
    demographics_income: PropTypes.string,
    demographics_military_history: PropTypes.string,
    demographics_learner_education_level: PropTypes.string,
    demographics_parent_education_level: PropTypes.string,
    demographics_work_status: PropTypes.string,
    demographics_current_work_sector: PropTypes.string,
    demographics_future_work_sector: PropTypes.string,
  }).isRequired,
  saveSettings: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired
};

// DemographicsSection.defaultProps = {
//
// };

export default connect(demographicsSectionSelector, {
  saveSettings,
  updateDraft,
})(injectIntl(DemographicsSection))
