import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Alert,
  Button,
  Col,
  Form,
  ModalDialog,
  StatefulButton,
} from '@openedx/paragon';

import { useAccountSettingsForm } from '../data/FormContext';
import { useAccountSettingsData } from '../data/hooks';

import { getNameChangeErrors, useRequestNameChange } from './data/hooks';
import messages from './messages';

const SAVE_STATES = {
  idle: null,
  pending: 'pending',
  success: 'complete',
  error: 'error',
};

const NO_ERRORS = {};

const NameChangeModal = ({ targetFormId }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { username } = getAuthenticatedUser();
  const { formValues } = useAccountSettingsData();
  const { closeForm, saveSettingsReset } = useAccountSettingsForm();
  const requestNameChange = useRequestNameChange();
  const { reset: resetRequest } = requestNameChange;
  const [verifiedNameInput, setVerifiedNameInput] = useState(formValues.verified_name || '');
  const [confirmedWarning, setConfirmedWarning] = useState(false);
  const [validationErrors, setValidationErrors] = useState(null);

  const saveState = SAVE_STATES[requestNameChange.status];
  let errors = NO_ERRORS;
  if (validationErrors) {
    errors = validationErrors;
  } else if (requestNameChange.isError) {
    errors = getNameChangeErrors(requestNameChange.error);
  }

  const resetLocalState = useCallback(() => {
    setConfirmedWarning(false);
    setValidationErrors(null);
    resetRequest();
  }, [resetRequest]);

  const handleChange = (e) => {
    setVerifiedNameInput(e.target.value);
  };

  const handleClose = useCallback(() => {
    resetLocalState();
    closeForm(targetFormId);
    saveSettingsReset();
  }, [closeForm, saveSettingsReset, resetLocalState, targetFormId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saveState === 'pending') {
      return;
    }

    if (!verifiedNameInput) {
      setValidationErrors({
        verified_name: intl.formatMessage(messages['account.settings.name.change.error.valid.name']),
      });
    } else {
      setValidationErrors(null);
      const draftProfileName = targetFormId === 'name' ? formValues.name : null;
      requestNameChange.mutate({ username, profileName: draftProfileName, verifiedName: verifiedNameInput });
    }
  };

  useEffect(() => {
    if (saveState === 'complete') {
      handleClose();
      navigate(`/id-verification?next=${encodeURIComponent('account/settings')}`);
    }
  }, [handleClose, navigate, saveState]);

  function renderErrors() {
    if (Object.keys(errors).length > 0) {
      return (
        <>
          {Object.entries(errors).map(([key, value]) => (
            <Form.Control.Feedback type="invalid" key={key}>
              {
                key === 'general_error'
                  ? intl.formatMessage(messages['account.settings.name.change.error.general'])
                  : value
              }
            </Form.Control.Feedback>
          ))}
        </>
      );
    }
    return null;
  }

  function renderTitle() {
    if (!confirmedWarning) {
      return intl.formatMessage(messages['account.settings.name.change.title.id']);
    }

    return intl.formatMessage(messages['account.settings.name.change.title.begin']);
  }

  function renderBody() {
    if (!confirmedWarning) {
      return (
        <Alert variant="warning">
          <p>
            {intl.formatMessage(messages['account.settings.name.change.warning.one'])}
          </p>
          <p>
            {intl.formatMessage(messages['account.settings.name.change.warning.two'])}
          </p>
        </Alert>
      );
    }

    return (
      <Form.Group as={Col} isInvalid={Object.keys(errors).length > 0}>
        <Form.Label>
          {intl.formatMessage(messages['account.settings.name.change.id.name.label'])}
        </Form.Label>
        <Form.Control
          type="text"
          name="verifiedName"
          placeholder={intl.formatMessage(messages['account.settings.name.change.id.name.placeholder'])}
          value={verifiedNameInput}
          onChange={handleChange}
        />
        {renderErrors()}
      </Form.Group>
    );
  }

  function renderContinueButton() {
    if (!confirmedWarning) {
      return (
        <Button variant="primary" onClick={() => setConfirmedWarning(true)}>
          {intl.formatMessage(messages['account.settings.name.change.continue'])}
        </Button>
      );
    }

    return (
      <StatefulButton
        type="submit"
        state={saveState}
        labels={{
          default: intl.formatMessage(messages['account.settings.name.change.continue']),
        }}
        disabledStates={[]}
      />
    );
  }

  return (
    <ModalDialog
      title={renderTitle()}
      isOpen
      hasCloseButton={false}
      onClose={handleClose}
    >

      <Form onSubmit={handleSubmit}>
        <ModalDialog.Header>
          <ModalDialog.Title>
            {renderTitle()}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body className="mb-3 overflow-hidden">
          {renderBody()}
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              {intl.formatMessage(messages['account.settings.name.change.cancel'])}
            </ModalDialog.CloseButton>
            {renderContinueButton()}
          </ActionRow>
        </ModalDialog.Footer>
      </Form>

    </ModalDialog>
  );
};

NameChangeModal.propTypes = {
  targetFormId: PropTypes.string.isRequired,
};

export default NameChangeModal;
