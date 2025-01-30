import PropTypes from 'prop-types';
import EditableSelectField from './EditableSelectField';
import EditableField from './EditableField';
import EditableCheckboxField from './EditableCheckboxField';

const ExtendedProfileField = (props) => {
  const { field, ...editableFieldProps } = props;

  if (field.type === 'select') {
    return (
      <EditableSelectField
        name={field.name}
        type="select"
        value={field.field_value}
        options={field.options?.map((option) => ({ label: option[1], value: option[0] })) ?? []}
        label={field.label}
        emptyLabel={`Add a ${field.label}`}
        helpText={field.instructions}
        {...editableFieldProps}
      />
    );
  }

  if (field.type === 'checkbox') {
    return (
      <EditableCheckboxField
        name={field.name}
        value={field.field_value}
        label={field.label}
        emptyLabel={`Add a ${field.label}`}
        helpText={field.instructions}
        isEditable
        {...editableFieldProps}
      />
    );
  }

  return (
    <EditableField
      name={field.name}
      value={field.field_value}
      label={field.label}
      emptyLabel={`Add a ${field.label}`}
      helpText={field.instructions}
      isEditable
      {...editableFieldProps}
    />
  );
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
};

export default ExtendedProfileField;
