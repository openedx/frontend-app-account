import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, Form, StatefulButton,
} from '@openedx/paragon';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';

import {
  openForm,
  closeForm,
} from './data/actions';
import { nameFieldSelector } from './data/selectors';
import CertificatePreference from './certificate-preference/CertificatePreference';

/**
 * This field shows concatenated user's first name and last name as their full name
 * and splits the name into first name and last name fields on edit.
 * @param props
 * @returns {Element}
 * @constructor
 */
const NameField = (props) => {
  const {
    name,
    label,
    emptyLabel,
    type,
    fullNameValue,
    firstNameValue,
    lastNameValue,
    verifiedName,
    pendingNameChange,
    userSuppliedValue,
    saveState,
    error,
    firstNameError,
    lastNameError,
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

  const firstNameFieldAttributes = {
    name: 'first_name',
    id: 'field-firstName',
    label: intl.formatMessage(messages['account.settings.field.first.name']),
  };

  const lastNameFieldAttributes = {
    name: 'last_name',
    id: 'field-lastName',
    label: intl.formatMessage(messages['account.settings.field.last.name']),
  };

  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fieldError, setFieldError] = useState('');

  /**
   * Concatenates first and last name and generates full name.
   * @param first
   * @param last
   * @returns {`${string} ${string}`}
   */
  const generateFullName = (first, last) => {
    if (first && last) {
      return `${first} ${last}`;
    }
    return first || last;
  };

  /**
   * Splits a full name into first name and last name such that the first word
   * is the firstName and rest of the name is last name.
   * - If the full name is "John Doe Hamilton", the splitting will be
   *   e.g., fullName = John Doe => firstName = John, lastName = Doe Hamilton
   * @param {string} nameValue The full name to split.
   * @returns {object} An object containing the firstName and lastName.
  */
  const splitFullName = (nameValue) => {
    const [first, ...lastNameArr] = nameValue.trim().split(' ');
    const last = lastNameArr.join(' ');
    return { first, last };
  };

  /**
   * UseEffect for setting first and last name.
   */
  useEffect(() => {
    if (firstNameValue || lastNameValue) {
      setFirstName(firstNameValue);
      setLastName(lastNameValue);
    } else {
      const { first, last } = splitFullName(fullNameValue);
      setFirstName(first);
      setLastName(last);
    }
  }, [firstNameValue, fullNameValue, lastNameValue]);

  /**
   * UseEffect for setting full name.
   */
  useEffect(() => {
    if (verifiedName?.status === 'submitted' && pendingNameChange) {
      setFullName(pendingNameChange);
    } else if (firstNameValue || lastNameValue) {
      setFullName(generateFullName(firstNameValue, lastNameValue));
    } else {
      setFullName(fullNameValue);
    }
  }, [firstNameValue, fullNameValue, lastNameValue, pendingNameChange, verifiedName?.status]);

  /**
   * UseEffect for setting error
   */
  useEffect(() => {
    setFieldError(error || firstNameError || lastNameError);
  }, [error, firstNameError, lastNameError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstNameVal = formData.get(firstNameFieldAttributes.name).trim();
    const lastNameVal = formData.get(lastNameFieldAttributes.name).trim();
    const fullNameVal = generateFullName(firstName, lastName);

    onSubmit(name, fullNameVal, firstNameVal, lastNameVal);
  };

  const handleChange = (e, fieldName) => {
    onChange(fieldName, e.target.value);
    // Updating full name along with the updates to first and last name
    if (fieldName === firstNameFieldAttributes.name) {
      onChange(name, generateFullName(e.target.value.trim(), lastNameValue));
    } else if (fieldName === lastNameFieldAttributes.name) {
      onChange(name, generateFullName(firstNameValue, e.target.value.trim()));
    }
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
                isInvalid={fieldError != null}
              >
                <Form.Group
                  controlId={firstNameFieldAttributes.id}
                  isInvalid={firstNameError || error}
                  className="d-inline-block mb-0"
                >
                  <Form.Label size="sm" className="h6 d-block" htmlFor={firstNameFieldAttributes.id}>
                    {firstNameFieldAttributes.label}
                  </Form.Label>
                  <Form.Control
                    data-hj-suppress
                    name={firstNameFieldAttributes.name}
                    id={firstNameFieldAttributes.id}
                    type={type}
                    value={firstName}
                    onChange={(e) => { handleChange(e, firstNameFieldAttributes.name); }}
                    {...others}
                  />
                </Form.Group>
                <Form.Group
                  controlId={lastNameFieldAttributes.id}
                  isInvalid={lastNameError || error}
                  className="d-inline-block mb-0"
                >
                  <Form.Label size="sm" className="h6 d-block" htmlFor={lastNameFieldAttributes.id}>
                    {lastNameFieldAttributes.label}
                  </Form.Label>
                  <Form.Control
                    data-hj-suppress
                    name={lastNameFieldAttributes.name}
                    id={lastNameFieldAttributes.id}
                    type={type}
                    value={lastName}
                    onChange={(e) => { handleChange(e, lastNameFieldAttributes.name); }}
                    {...others}
                  />
                </Form.Group>
                {!!helpText && <Form.Text>{helpText}</Form.Text>}
                {fieldError != null && <Form.Control.Feedback hasIcon={false}>{fieldError}</Form.Control.Feedback>}
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
                  <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />
                  {intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                </Button>
              ) : null}
            </div>
            <p data-hj-suppress className={classNames('text-truncate', { 'grayed-out': isGrayedOut })}>
              {renderValue(fullName)}
            </p>
            <p className="small text-muted mt-n2">{renderConfirmationMessage() || helpText}</p>
          </div>
        ),
      }}
    />
  );
};

NameField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  emptyLabel: PropTypes.node,
  type: PropTypes.string.isRequired,
  fullNameValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  firstNameValue: PropTypes.string,
  lastNameValue: PropTypes.string,
  pendingNameChange: PropTypes.string,
  verifiedName: PropTypes.shape({
    verified_name: PropTypes.string,
    status: PropTypes.string,
    proctored_exam_attempt_id: PropTypes.number,
  }),
  userSuppliedValue: PropTypes.string,
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  error: PropTypes.string,
  firstNameError: PropTypes.string,
  lastNameError: PropTypes.string,
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

NameField.defaultProps = {
  fullNameValue: undefined,
  firstNameValue: undefined,
  lastNameValue: undefined,
  pendingNameChange: null,
  verifiedName: null,
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: null,
  firstNameError: null,
  lastNameError: null,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
  isGrayedOut: false,
  userSuppliedValue: undefined,
};

export default connect(nameFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(injectIntl(NameField));
