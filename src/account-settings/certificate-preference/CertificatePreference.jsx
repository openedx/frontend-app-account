import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  ActionRow,
  Form,
  ModalDialog,
  StatefulButton,
} from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { useAccountSettingsForm } from '../data/FormContext';
import { useAccountSettingsData } from '../data/hooks';

import commonMessages from '../AccountSettingsPage.messages';
import messages from './messages';

const CertificatePreference = ({ fieldName }) => {
  const { committedValues, formValues, verifiedName } = useAccountSettingsData();
  const {
    saveState, closeForm, resetDrafts, saveSettings, updateDraft,
  } = useAccountSettingsForm();
  const originalFullName = committedValues?.name || '';
  const originalVerifiedName = verifiedName?.verified_name || '';
  const useVerifiedNameForCerts = formValues.useVerifiedNameForCerts || false;
  const [checked, setChecked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const formId = 'useVerifiedNameForCerts';
  const intl = useIntl();

  const handleCheckboxChange = () => {
    if (!checked) {
      if (fieldName === 'verified_name') {
        updateDraft(formId, true);
      } else {
        updateDraft(formId, false);
      }
    } else {
      setModalIsOpen(true);
    }
  };

  const handleCancel = () => {
    setModalIsOpen(false);
    resetDrafts();
  };

  const handleModalChange = (e) => {
    if (e.target.value === 'fullName') {
      updateDraft(formId, false);
    } else {
      updateDraft(formId, true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saveState === 'pending') {
      return;
    }

    saveSettings(formId, useVerifiedNameForCerts);
  };

  useEffect(() => {
    if (originalVerifiedName) {
      if (fieldName === 'verified_name') {
        setChecked(useVerifiedNameForCerts);
      } else {
        setChecked(!useVerifiedNameForCerts);
      }
    }
  }, [originalVerifiedName, fieldName, useVerifiedNameForCerts]);

  useEffect(() => {
    if (originalVerifiedName) {
      if (modalIsOpen && saveState === 'complete') {
        setModalIsOpen(false);
        closeForm(fieldName);
      }
    }
  }, [closeForm, originalVerifiedName, fieldName, modalIsOpen, saveState]);

  // If the user doesn't have an approved verified name, do not display this component

  return originalVerifiedName ? (
    <>
      <Form.Checkbox className="mt-1 mb-4" checked={checked} onChange={handleCheckboxChange}>
        {intl.formatMessage(messages['account.settings.field.name.checkbox.certificate.select'])}
      </Form.Checkbox>

      <ModalDialog
        title={intl.formatMessage(messages['account.settings.field.name.modal.certificate.title'])}
        isOpen={modalIsOpen}
        onClose={handleCancel}
        size="lg"
        hasCloseButton
        isFullscreenOnMobile
      >
        <Form onSubmit={handleSubmit}>
          <ModalDialog.Header>
            <ModalDialog.Title>
              {intl.formatMessage(messages['account.settings.field.name.modal.certificate.title'])}
            </ModalDialog.Title>
          </ModalDialog.Header>

          <ModalDialog.Body className="overflow-hidden">
            <Form.Group className="mb-4">
              <Form.Label>
                {intl.formatMessage(messages['account.settings.field.name.modal.certificate.select'])}
              </Form.Label>
              <Form.RadioSet
                name={formId}
                value={useVerifiedNameForCerts ? 'verifiedName' : 'fullName'}
                onChange={handleModalChange}
              >
                <Form.Radio value="fullName">
                  {originalFullName}{' '}
                  ({intl.formatMessage(messages['account.settings.field.name.modal.certificate.option.full'])})
                </Form.Radio>
                <Form.Radio value="verifiedName">
                  {originalVerifiedName}{' '}
                  ({intl.formatMessage(messages['account.settings.field.name.modal.certificate.option.verified'])})
                </Form.Radio>
              </Form.RadioSet>
            </Form.Group>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ActionRow>
              <ModalDialog.CloseButton variant="outline-primary" disabled={saveState === 'pending'}>
                {intl.formatMessage(commonMessages['account.settings.editable.field.action.cancel'])}
              </ModalDialog.CloseButton>
              <StatefulButton
                type="submit"
                state={saveState}
                labels={{
                  default: intl.formatMessage(messages['account.settings.field.name.modal.certificate.button.choose']),
                }}
                disabledStates={[]}
              />
            </ActionRow>
          </ModalDialog.Footer>
        </Form>
      </ModalDialog>
    </>
  ) : null;
};

CertificatePreference.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default CertificatePreference;
