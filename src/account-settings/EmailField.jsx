import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Button, Card, StatefulButton, Form, Tooltip, OverlayTrigger,
} from '@openedx/paragon';
import { EditOutline } from '@openedx/paragon/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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
  } = props;
  const id = `field-${name}`;
  const intl = useIntl();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, new FormData(e.target).get(name));
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
    <Card className="mb-4">
      <SwitchContent
        expression={isEditing ? 'editing' : 'default'}
        cases={{
          editing: (
            <Card.Body>
              <Card.Section>
                <Form onSubmit={handleSubmit}>
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
                </Form>
              </Card.Section>
            </Card.Body>
          ),
          default: (
            <>
              <Card.Header
                title={label}
                subtitle={(
                  <OverlayTrigger
                    placement="top"
                    overlay={(
                      <Tooltip id={`tooltip-${name}`} variant="light" className="d-sm-none">
                        {renderValue()}
                      </Tooltip>
                  )}
                  >
                    <p data-hj-suppress className="text-truncate">{renderValue()}</p>
                  </OverlayTrigger>
              )}
                actions={isEditable && (
                <ActionRow>
                  <Button variant="outline-primary" onClick={handleEdit} data-testid="editable-field-edit" data-clicked="edit" iconBefore={EditOutline}>
                    {intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                  </Button>
                </ActionRow>
                )}
              />
              <Card.Body>
                <Card.Section>
                  <p className="small text-muted mt-n2">{renderConfirmationMessage() || helpText}</p>
                </Card.Section>
              </Card.Body>
            </>
          ),
        }}
      />
    </Card>
  );
};

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyLabel: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
};

EmailField.defaultProps = {
  value: undefined,
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
};

export default connect(editableFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(EmailField);
