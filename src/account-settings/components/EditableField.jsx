import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Button } from '@edx/paragon';

import Input from './temp/Input';
import ValidationFormGroup from './temp/ValidationFormGroup';
import SwitchContent from './temp/SwitchContent';


import {
  openForm,
  closeForm,
  updateDraft,
  saveAccount,
} from '../actions';
import { formSelector } from '../selectors';


function EditableField(props) {
  const {
    name,
    label,
    type,
    value,
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
    intl,
    ...others
  } = props;
  const id = `field-${name}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    new FormData(e.target).forEach((v, k) => { data[k] = v; });
    onSubmit(name, data);
  };

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const handleEdit = () => {
    onEdit(name);
  };

  const handleCancel = () => {
    onCancel(name);
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) return null;
    return intl.formatMessage(confirmationMessageDefinition, { value: confirmationValue });
  };

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        editing: (
          <form onSubmit={handleSubmit}>
            <ValidationFormGroup
              for={id}
              invalid={error != null}
              invalidMessage={error}
              helpText={helpText}
            >
              <label className="h6 d-block" htmlFor={id}>{label}</label>
              <Input
                name={name}
                id={id}
                type={type}
                value={value}
                onChange={handleChange}
                {...others}
              />
            </ValidationFormGroup>
            <p>
              <Button type="submit" className="btn-primary mr-2">
                <FormattedMessage
                  id="account.settings.editable.field.action.save"
                  defaultMessage="Save"
                  description="The save button an editable field"
                />
              </Button>
              <Button
                onClick={handleCancel}
                className="btn-outline-primary"
              >
                <FormattedMessage
                  id="account.settings.editable.field.action.cancel"
                  defaultMessage="Cancel"
                  description="The cancel button an editable field"
                />
              </Button>
            </p>
          </form>
        ),
        default: (
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-start">
              <h6>{label}</h6>
              {isEditable ? (
                <Button onClick={handleEdit} className="btn-link">
                  <FormattedMessage
                    id="account.settings.editable.field.action.edit"
                    defaultMessage="Edit"
                    description="The edit button an editable field"
                  />
                </Button>
              ) : null}
            </div>
            <p className="m-0">{value}</p>
            <p className="small text-muted">{renderConfirmationMessage() || helpText}</p>
          </div>
        ),
      }}
    />
  );
}


EditableField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  intl: intlShape.isRequired,
};

EditableField.defaultProps = {
  value: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
};


export default connect(formSelector, {
  onEdit: openForm,
  onCancel: closeForm,
  onChange: updateDraft,
  onSubmit: saveAccount,
})(injectIntl(EditableField));
