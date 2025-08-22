import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { useIntl } from '@openedx/frontend-base';
import {
  ActionRow,
  Form,
  ModalDialog,
  StatefulButton,
} from '@openedx/paragon';
import { useMemo } from 'react';

import { useAccountSettings, useSettingsFormDataState } from '../hooks';

import commonMessages from '../messages';
import messages from './messages';

const CertificatePreference = ({
  fieldName
}) => {
  const intl = useIntl();
  const [checked, setChecked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { settingsFormDataState: {committedValues, formValues, saveState, verifiedNameForCertsDraft }, closeForm, updateVerifiedNameForCertsDraft } = useSettingsFormDataState();
  const { saveSettingsMutation } = useAccountSettings();

  const formId = 'useVerifiedNameForCerts';

  const originalFullName = committedValues?.name ?? ''
  const originalVerifiedName = committedValues?.verified_name ?? '';
  const useVerifiedNameForCerts = useMemo(() => {
    return verifiedNameForCertsDraft ?? formValues.useVerifiedNameForCerts ?? false;
  }, [verifiedNameForCertsDraft, formValues]);

  const handleCheckboxChange = () => {
    if (!checked) {
      if (fieldName === 'verified_name') {
        updateVerifiedNameForCertsDraft(true);
      } else {
        updateVerifiedNameForCertsDraft(false);
      }
    } else {
      setModalIsOpen(true);
    }
  };

  const handleCancel = () => {
    setModalIsOpen(false);
    updateVerifiedNameForCertsDraft(null);
  };

  const handleModalChange = (e) => {
    if (e.target.value === 'fullName') {
      updateVerifiedNameForCertsDraft(false);
    } else {
      updateVerifiedNameForCertsDraft(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saveState === 'pending') {
      return;
    }

    saveSettingsMutation.mutate({ formId, values: useVerifiedNameForCerts });
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

  return originalVerifiedName && (
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
  )
};

CertificatePreference.propTypes = {
  fieldName: PropTypes.string.isRequired,
};


export default CertificatePreference;
