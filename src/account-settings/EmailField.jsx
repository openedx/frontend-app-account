import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, StatefulButton, Form,
} from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Alert from './Alert';
import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';

import {
  openForm,
  closeForm,
} from './data/actions';
import { editableFieldSelector } from './data/selectors';

const EmailField = (props) => {
  const {
    name,
    label,
    emptyLabel,
    value,
    confirmationMessageDefinition,
    helpText,
    onSubmit,
    onChange,
    isEditable,
  } = props;
  const id = `field-${name}`;
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    error, confirmationValue, saveState, isEditing = false,
  } = useSelector(state => editableFieldSelector(state, props));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, new FormData(e.target).get(name));
  };

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const handleEdit = () => {
    dispatch(openForm(name));
  };

  const handleCancel = () => {
    dispatch(closeForm(name));
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) {
      return null;
    }
    return (
      <Alert
        className="alert-warning mt-n2"
        icon={<FontAwesomeIcon className="mr-2 h6" icon={faExclamationTriangle} />}
      >
        <h6 aria-level="3">
          {intl.formatMessage(messages['account.settings.email.field.confirmation.header'])}
        </h6>
        {intl.formatMessage(confirmationMessageDefinition, { value: confirmationValue })}
      </Alert>
    );
  };

  const renderConfirmationValue = () => (
    <span>
      {confirmationValue}
      <span className="ml-3 text-muted small">
        <FormattedMessage
          id="account.settings.email.field.confirmation.header"
          defaultMessage="Pending confirmation"
          description="The label next to a new pending email address"
        />
      </span>
    </span>
  );

  const renderEmptyLabel = () => {
    if (isEditable) {
      return <Button variant="link" onClick={handleEdit} className="p-0">{emptyLabel}</Button>;
    }
    return <span className="text-muted">{emptyLabel}</span>;
  };

  const renderValue = () => {
    if (confirmationValue) {
      return renderConfirmationValue();
    }
    return value || renderEmptyLabel();
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
              <Form.Label className="h6 d-block" htmlFor={id}>{label}</Form.Label>
              <Form.Control
                data-hj-suppress
                name={name}
                id={id}
                type="email"
                value={value}
                onChange={handleChange}
              />
              {!!helpText && <Form.Text>{helpText}</Form.Text>}
              {error != null && <Form.Control.Feedback hasIcon={false}>{error}</Form.Control.Feedback>}
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
              <h6 aria-level="3">{label}</h6>
              {isEditable ? (
                <Button variant="link" onClick={handleEdit} className="ml-3">
                  <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />
                  {intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                </Button>
              ) : null}
            </div>
            <p data-hj-suppress>{renderValue()}</p>
            {renderConfirmationMessage() || <p className="small text-muted mt-n2">{helpText}</p>}
          </div>
        ),
      }}
    />
  );
};

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyLabel: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  confirmationMessageDefinition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  helpText: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
};

EmailField.defaultProps = {
  value: undefined,
  label: undefined,
  emptyLabel: undefined,
  confirmationMessageDefinition: undefined,
  helpText: undefined,
  isEditable: true,
};

export default EmailField;
