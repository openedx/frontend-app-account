import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Alert,
  Button,
  Col,
  Form,
  ModalDialog,
  StatefulButton,
} from '@edx/paragon';

import { closeForm, saveSettingsReset } from '../data/actions';
import { nameChangeSelector } from '../data/selectors';

import { requestNameChange, requestNameChangeFailure, requestNameChangeReset } from './data/actions';
import messages from './messages';

function NameChangeModal({
  targetFormId,
  errors,
  formValues,
  intl,
  saveState,
}) {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { username } = getAuthenticatedUser();
  const [verifiedNameInput, setVerifiedNameInput] = useState(formValues.verified_name || '');
  const [confirmedWarning, setConfirmedWarning] = useState(false);

  function resetLocalState() {
    setConfirmedWarning(false);
    dispatch(requestNameChangeReset());
  }

  function handleChange(e) {
    setVerifiedNameInput(e.target.value);
  }

  function handleClose() {
    resetLocalState();
    dispatch(closeForm(targetFormId));
    dispatch(saveSettingsReset());
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (saveState === 'pending') {
      return;
    }

    if (!verifiedNameInput) {
      dispatch(requestNameChangeFailure({
        verified_name: intl.formatMessage(messages['account.settings.name.change.error.valid.name']),
      }));
    } else {
      const draftProfileName = targetFormId === 'name' ? formValues.name : null;
      dispatch(requestNameChange(username, draftProfileName, verifiedNameInput));
    }
  }

  useEffect(() => {
    if (saveState === 'complete') {
      handleClose();
      push(`/id-verification?next=${encodeURIComponent('account/settings')}`);
    }
  }, [saveState]);

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
}

NameChangeModal.propTypes = {
  targetFormId: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  formValues: PropTypes.shape({
    name: PropTypes.string,
    verified_name: PropTypes.string,
  }).isRequired,
  saveState: PropTypes.string,
  intl: intlShape.isRequired,
};

NameChangeModal.defaultProps = {
  saveState: null,
};

export default connect(nameChangeSelector)(injectIntl(NameChangeModal));
