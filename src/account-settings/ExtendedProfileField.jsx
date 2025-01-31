import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import EditableSelectField from './EditableSelectField';
import EditableField from './EditableField';
import EditableCheckboxField from './EditableCheckboxField';

import messages from './AccountSettingsPage.messages';

const ExtendedProfileField = (props) => {
  const { field, ...editableFieldProps } = props;

  const commonProps = {
    name: field.name,
    type: field.type,
    value: field.field_value,
    label: field.label,
    helpText: field.instructions,
    isEditable: true,
    emptyLabel: props.intl.formatMessage(messages['account.settings.dynamic.field.empty'], {
      field: field.label,
    }),
    ...editableFieldProps,
  };

  switch (field.type) {
    case 'select':
      return (
        <EditableSelectField
          options={field.options?.map((option) => ({ label: option[1], value: option[0] })) ?? []}
          {...commonProps}

        />
      );

    case 'checkbox':
      return <EditableCheckboxField {...commonProps} />;

    default:
      return <EditableField {...commonProps} />;
  }
};

ExtendedProfileField.propTypes = {
  field: PropTypes.exact({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    error_message: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    default: PropTypes.any,
    placeholder: PropTypes.any,
    restrictions: PropTypes.objectOf(PropTypes.any),
    options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    field_value: PropTypes.string,
  }).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ExtendedProfileField);
