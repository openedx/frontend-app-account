import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { ValidationFormGroup, Input } from '@edx/paragon';
import messages from './CoachingToggle.messages';
import { editableFieldSelector } from '../data/selectors';
import { saveSettings, updateDraft } from '../data/actions';
import EditableField from '../EditableField';


const CoatchingToggle = props => (
  <>
    <EditableField
      name="phone_number"
      type="text"
      value={props.phone_number}
      label={props.intl.formatMessage(messages['account.settings.field.phone_number'])}
      emptyLabel={props.intl.formatMessage(messages['account.settings.field.phone_number.empty'])}
      onChange={props.updateDraft}
      onSubmit={props.saveSettings}
    />
    <ValidationFormGroup
      for="coachingConsent"
      helpText={props.intl.formatMessage(messages['account.settings.field.coaching_consent.tooltip'])}
      invalid={!!props.error}
      invalidMessage={props.intl.formatMessage(messages['account.settings.field.coaching_consent.error'])}
      className="custom-control custom-switch"
    >
      <Input
        name={props.name}
        className="custom-control-input"
        disabled={props.saveState === 'pending'}
        type="checkbox"
        id="coachingConsent"
        checked={props.coaching.coaching_consent}
        value={props.coaching.coaching_consent}
        onChange={async (e) => {
          const { name } = e.target;
          const value = {
            ...props.coaching,
            phone_number: props.phone_number,
            coaching_consent: e.target.checked,
          };
          props.saveSettings(name, value);
        }}
      />
      <label className="custom-control-label" htmlFor="coachingConsent">{props.intl.formatMessage(messages['account.settings.field.coaching_consent'])}</label>
    </ValidationFormGroup>
  </>
);

CoatchingToggle.defaultProps = {
  phone_number: '',
  error: '',
};

CoatchingToggle.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  coaching: PropTypes.objectOf(PropTypes.shape({
    coaching_consent: PropTypes.string.isRequired,
    user: PropTypes.number.isRequired,
    eligible_for_coaching: PropTypes.bool.isRequired,
  })).isRequired,
  saveState: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  phone_number: PropTypes.string,
};

export default connect(editableFieldSelector, {
  saveSettings,
  updateDraft,
})(injectIntl(CoatchingToggle));
