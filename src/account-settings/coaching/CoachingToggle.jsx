import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';
import messages from './CoachingToggle.messages';
import { editableFieldSelector } from '../data/selectors';
import { saveSettings, updateDraft, saveMultipleSettings } from '../data/actions';
import EditableField from '../EditableField';

const CoachingToggle = (props) => (
  <>
    <EditableField
      name="phone_number"
      type="text"
      value={props.phone_number}
      label={props.intl.formatMessage(messages['account.settings.field.phone_number'])}
      emptyLabel={props.intl.formatMessage(messages['account.settings.field.phone_number.empty'])}
      onChange={props.updateDraft}
      onSubmit={() => {
        const { coaching } = props;
        if (coaching.coaching_consent === true) {
          return props.saveMultipleSettings([
            {
              formId: 'coaching',
              commitValues: {
                ...coaching,
                phone_number: props.phone_number,
              },
            },
            {
              formId: 'phone_number',
              commitValues: props.phone_number,
            },
          ], 'phone_number');
        }
        return props.saveSettings('phone_number', props.phone_number);
      }}
    />
    <Form.Group
      isInvalid={!!props.error}
      className="custom-control custom-switch"
    >
      <Form.Switch
        name={props.name}
        className="custom-control-input"
        disabled={props.saveState === 'pending'}
        type="checkbox"
        id="coachingConsent"
        checked={props.coaching.coaching_consent}
        helperText={props.intl.formatMessage(messages['account.settings.field.coaching_consent.tooltip'])}
        value={props.coaching.coaching_consent}
        onChange={async (e) => {
          const { name } = e.target;
          // eslint-disable-next-line camelcase
          const { user, eligible_for_coaching } = props.coaching;
          const value = {
            user,
            // eslint-disable-next-line camelcase
            eligible_for_coaching,
            coaching_consent: e.target.checked,
          };
          props.saveSettings(name, value);
        }}
      >
        {props.intl.formatMessage(messages['account.settings.field.coaching_consent'])}
      </Form.Switch>
      {!!props.error && (
        <Form.Control.Feedback>
          {props.intl.formatMessage(messages['account.settings.field.coaching_consent.error'])}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  </>
);

CoachingToggle.defaultProps = {
  phone_number: '',
  error: '',
  saveState: undefined,
};

CoachingToggle.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  coaching: PropTypes.shape({
    coaching_consent: PropTypes.bool.isRequired,
    user: PropTypes.number.isRequired,
    eligible_for_coaching: PropTypes.bool.isRequired,
  }).isRequired,
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  saveSettings: PropTypes.func.isRequired,
  saveMultipleSettings: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  phone_number: PropTypes.string,
};

export default connect(editableFieldSelector, {
  saveSettings,
  updateDraft,
  saveMultipleSettings,
})(injectIntl(CoachingToggle));
