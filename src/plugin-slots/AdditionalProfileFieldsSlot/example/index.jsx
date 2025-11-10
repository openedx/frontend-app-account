import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from '@openedx/paragon';

/**
 * Straightforward example of how you could use the pluginProps provided by
 * the AdditionalProfileFieldsSlot to create a custom profile field.
 *
 * Here you can set a 'favorite_color' field with radio buttons and
 * save it to the user's profile, especifically to their `meta` in
 * the user's model. For more information, see the documentation:
 *
 * https://github.com/openedx/edx-platform/blob/master/openedx/core/djangoapps/user_api/README.rst#persisting-optional-user-metadata
 */
const Example = ({
  updateUserProfile, profileFieldValues, profileFieldErrors, formComponents: { SwitchContent } = {},
}) => {
  const [formMode, setFormMode] = useState('default');

  // Get current favorite color from profileFieldValues
  const currentColorField = profileFieldValues?.find(field => field.fieldName === 'favorite_color');
  const currentColor = currentColorField ? currentColorField.fieldValue : '';

  const [value, setValue] = useState(currentColor);
  const handleChange = e => setValue(e.target.value);

  // Get any validation errors for the favorite_color field
  const colorFieldError = profileFieldErrors?.favorite_color;

  const handleSubmit = () => {
    try {
      updateUserProfile({ extendedProfile: [{ fieldName: 'favorite_color', fieldValue: value }] });
      setFormMode('default');
    } catch (error) {
      setFormMode('edit');
    }
  };

  return (
    <div className="border .border-accent-500 p-3">
      <h3 className="h3">Example Additional Profile Fields Slot</h3>

      <SwitchContent
        expression={formMode}
        cases={{
          default: (
            <>
              <h3 className="text-muted">
                {value ? `Selected value: ${value}` : 'No color selected'}
              </h3>
              <Button onClick={() => setFormMode('edit')}>Edit</Button>
            </>
          ),
          edit: (
            <>
              <Form.Group>
                <Form.Label>Which Color?</Form.Label>
                <Form.RadioSet
                  name="colors"
                  onChange={handleChange}
                  value={value}
                  isInvalid={!!colorFieldError}
                >
                  <Form.Radio value="red">Red</Form.Radio>
                  <Form.Radio value="green">Green</Form.Radio>
                  <Form.Radio value="blue">Blue</Form.Radio>
                </Form.RadioSet>
                {colorFieldError && (
                  <Form.Control.Feedback type="invalid">
                    {colorFieldError}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button onClick={handleSubmit} disabled={!value}>
                Save
              </Button>
            </>
          ),
        }}
      />

    </div>
  );
};
Example.propTypes = {
  updateUserProfile: PropTypes.func.isRequired,
  profileFieldValues: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      fieldValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number,
      ]).isRequired,
    }),
  ),
  profileFieldErrors: PropTypes.objectOf(PropTypes.string),
  formComponents: PropTypes.shape({
    SwitchContent: PropTypes.elementType.isRequired,
  }),
};

export default Example;
