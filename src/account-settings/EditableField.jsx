import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from '@openedx/frontend-base';
import {
  Button, Form, StatefulButton,
} from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import SwitchContent from './SwitchContent';
import { useSettingsFormDataState } from './hooks';
import messages from './messages';


import CertificatePreference from './certificate-preference/CertificatePreference';

const EditableField = (props) => {
  const {
    name,
    label,
    emptyLabel,
    type,
    value,
    userSuppliedValue,
    confirmationMessageDefinition,
    helpText,
    onSubmit,
    isEditable,
    isGrayedOut,
    ...others
  } = props;
  const intl = useIntl();
  const { settingsFormDataState, openForm: onEdit, closeForm: onCancel } = useSettingsFormDataState();
  const id = `field-${name}`;
  const { isEditing, confirmationValue, error, saveState } = useMemo(() => (
    {
      isEditing: settingsFormDataState?.openFormId === name,
      confirmationValue: settingsFormDataState?.confirmationValues?.[name],
      error: settingsFormDataState?.errors?.[name],
      saveState: settingsFormDataState?.saveState,
    }
  ), [settingsFormDataState]);

  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, new FormData(e.target).get(name));
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleEdit = () => {
    onEdit(name);
  };

  const handleCancel = () => {
    onCancel(name);
  };

  const renderEmptyLabel = () => {
    if (isEditable) {
      return <Button variant="link" onClick={handleEdit} className="p-0">{emptyLabel}</Button>;
    }
    return <span className="text-muted">{emptyLabel}</span>;
  };

  const renderValue = (rawValue) => {
    if (!rawValue) {
      return renderEmptyLabel();
    }
    let finalValue = rawValue;

    if (userSuppliedValue) {
      finalValue += `: ${userSuppliedValue}`;
    }

    return finalValue;
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
          <>
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={id}
                isInvalid={error != null}
              >
                <Form.Label size="sm" className="h6 d-block" htmlFor={id}>{label}</Form.Label>
                <Form.Control
                  data-hj-suppress
                  name={name}
                  id={id}
                  type={type}
                  value={localValue}
                  onChange={handleChange}
                  {...others}
                />
                {!!helpText && <Form.Text>{helpText}</Form.Text>}
                {error != null && <Form.Control.Feedback hasIcon={false}>{error}</Form.Control.Feedback>}
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
            {['name', 'verified_name'].includes(name) && <CertificatePreference fieldName={name} />}
          </>
        ),
        default: (
          <div className="form-group">
            <div className="d-flex align-items-start">
              <h6 aria-level="3">{label}</h6>
              {isEditable ? (
                <Button variant="link" onClick={handleEdit} className="ml-3">
                  <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />{intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                </Button>
              ) : null}
            </div>
            <p data-hj-suppress className={classNames('text-truncate', { 'grayed-out': isGrayedOut })}>{renderValue(value)}</p>
            <p className="small text-muted mt-n2">{renderConfirmationMessage() || helpText}</p>
          </div>
        ),
      }}
    />
  );
};

EditableField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  emptyLabel: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userSuppliedValue: PropTypes.string,
  confirmationMessageDefinition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  helpText: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
  isGrayedOut: PropTypes.bool,
};

EditableField.defaultProps = {
  value: undefined,
  label: undefined,
  emptyLabel: undefined,
  confirmationMessageDefinition: undefined,
  helpText: undefined,
  isEditable: true,
  isGrayedOut: false,
  userSuppliedValue: undefined,
};

export default EditableField;
