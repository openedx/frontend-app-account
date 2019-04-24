import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from '@edx/paragon';

import Input from './temp/Input';
import ValidationFormGroup from './temp/ValidationFormGroup';
import SwitchContent from './temp/SwitchContent';


// Actions
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
    helpText,
    onEdit,
    onCancel,
    onSubmit,
    onChange,
    isEditing,
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

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        editing: (
          <form onSubmit={handleSubmit} onChange={handleChange}>
            <ValidationFormGroup
              for={id}
              invalid={error != null}
              invalidMessage={error}
              helpText={helpText}
            >
              <label className="edit-field-header" htmlFor={id}>{label}</label>
              <Input
                name={name}
                id={id}
                type={type}
                value={value}
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
            <div className="d-flex justify-content-between">
              <h6 className="edit-field-header">{label}</h6>
              <Button onClick={handleEdit} className="mt-n3 btn-link px-0">
                <FormattedMessage
                  id="account.settings.editable.field.action.edit"
                  defaultMessage="Edit"
                  description="The edit button an editable field"
                />
              </Button>
            </div>
            <p className="m-0">{value}</p>
            <p className="small text-muted">{helpText}</p>
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
  helpText: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

EditableField.defaultProps = {
  value: undefined,
  error: undefined,
  helpText: undefined,
  isEditing: false,
};


export default connect(formSelector, {
  onEdit: openForm,
  onCancel: closeForm,
  onChange: updateDraft,
  onSubmit: saveAccount,
})(EditableField);
