import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, Form, StatefulButton,
} from '@openedx/paragon';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Parser } from 'html-to-react';

import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';

import {
  openForm,
  closeForm,
} from './data/actions';
import { editableFieldSelector } from './data/selectors';

const htmlToReactParser = new Parser();

const EditableCheckboxField = (props) => {
  const {
    name,
    label,
    emptyLabel,
    type,
    value,
    userSuppliedValue,
    saveState,
    error,
    confirmationMessageDefinition,
    confirmationValue,
    helpText,
    onEdit,
    onCancel,
    onSubmit,
    onChange,
    isEditing,
    isEditable,
    isGrayedOut,
    intl,
    ...others
  } = props;
  const id = `field-${name}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, new FormData(e.target).get(name));
  };

  const handleChange = (e) => {
    onChange(name, e.target.checked);
  };

  const handleEdit = () => {
    onEdit(name);
  };

  const handleCancel = () => {
    onCancel(name);
  };

  const renderValue = (rawValue) => {
    let finalValue = rawValue;

    if (userSuppliedValue) {
      finalValue += `: ${userSuppliedValue}`;
    }

    return finalValue === 'on' ? 'Yes' : 'No';
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) {
      return null;
    }
    return intl.formatMessage(confirmationMessageDefinition, {
      value: confirmationValue,
    });
  };

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        editing: (
          <form onSubmit={handleSubmit}>
            <Form.Group
              controlId={id}
              isInvalid={error != null}
            >
              <Form.Checkbox
                data-hj-suppress
                name={name}
                id={id}
                checked={value}
                onChange={handleChange}
                {...others}
              >
                {htmlToReactParser.parse(label)}
              </Form.Checkbox>
              {!!helpText && <Form.Text>{helpText}</Form.Text>}
              {error != null && <Form.Control.Feedback>{error}</Form.Control.Feedback>}
              {others.children}
            </Form.Group>
            <p>
              <StatefulButton
                type="submit"
                className="mr-2"
                state={saveState}
                labels={{
                  default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                }}
                onClick={(e) => {
                  // Swallow clicks if the state is pending.
                  // We do this instead of disabling the button to prevent
                  // it from losing focus (disabled elements cannot have focus).
                  // Disabling it would causes upstream issues in focus management.
                  // Swallowing the onSubmit event on the form would be better, but
                  // we would have to add that logic for every field given our
                  // current structure of the application.
                  if (saveState === 'pending') { e.preventDefault(); }
                }}
                disabledStates={[]}
              />
              <Button
                variant="outline-primary"
                onClick={handleCancel}
              >
                {intl.formatMessage(messages['account.settings.editable.field.action.cancel'])}
              </Button>
            </p>
          </form>
        ),
        default: (
          <div className="form-group">
            <div className="d-flex align-items-start">
              <h6 aria-level="3">{htmlToReactParser.parse(label)}</h6>
              {isEditable ? (
                <Button variant="link" onClick={handleEdit} className="ml-3">
                  <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />{intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                </Button>
              ) : null}
            </div>
            <p data-hj-suppress className={isGrayedOut ? 'grayed-out' : null}>{renderValue(value)}</p>
            <p className="small text-muted mt-n2">{renderConfirmationMessage() || helpText}</p>
          </div>
        ),
      }}
    />
  );
};

EditableCheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  emptyLabel: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userSuppliedValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  error: PropTypes.string,
  confirmationMessageDefinition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  confirmationValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isEditable: PropTypes.bool,
  isGrayedOut: PropTypes.bool,
  intl: intlShape.isRequired,
};

EditableCheckboxField.defaultProps = {
  value: undefined,
  options: [],
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
  isGrayedOut: false,
  userSuppliedValue: undefined,
};

export default connect(editableFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(injectIntl(EditableCheckboxField));
