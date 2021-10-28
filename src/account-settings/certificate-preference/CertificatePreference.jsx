import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  ActionRow,
  Form,
  ModalDialog,
  StatefulButton,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import {
  closeForm,
  resetDrafts,
  saveSettings,
  updateDraft,
} from '../data/actions';
import { certPreferenceSelector } from '../data/selectors';

import commonMessages from '../AccountSettingsPage.messages';
import messages from './messages';

function CertificatePreference({
  intl,
  fieldName,
  originalFullName,
  originalVerifiedName,
  saveState,
  useVerifiedNameForCerts,
}) {
  if (!originalVerifiedName) {
    // If the user doesn't have an approved verified name, do not display this component
    return null;
  }

  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const formId = 'useVerifiedNameForCerts';

  function handleCheckboxChange() {
    if (!checked) {
      if (fieldName === 'verified_name') {
        dispatch(updateDraft(formId, true));
      } else {
        dispatch(updateDraft(formId, false));
      }
    } else {
      setModalIsOpen(true);
    }
  }

  function handleCancel() {
    setModalIsOpen(false);
    dispatch(resetDrafts());
  }

  function handleModalChange(e) {
    if (e.target.value === 'fullName') {
      dispatch(updateDraft(formId, false));
    } else {
      dispatch(updateDraft(formId, true));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (saveState === 'pending') {
      return;
    }

    dispatch(saveSettings(formId, useVerifiedNameForCerts));
  }

  useEffect(() => {
    if (fieldName === 'verified_name') {
      setChecked(useVerifiedNameForCerts);
    } else {
      setChecked(!useVerifiedNameForCerts);
    }
  }, [useVerifiedNameForCerts]);

  useEffect(() => {
    if (modalIsOpen && saveState === 'complete') {
      setModalIsOpen(false);
      dispatch(closeForm(fieldName));
    }
  }, [modalIsOpen, saveState]);

  return (
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
  );
}

CertificatePreference.propTypes = {
  intl: intlShape.isRequired,
  fieldName: PropTypes.string.isRequired,
  originalFullName: PropTypes.string,
  originalVerifiedName: PropTypes.string,
  saveState: PropTypes.string,
  useVerifiedNameForCerts: PropTypes.bool,
};

CertificatePreference.defaultProps = {
  originalFullName: '',
  originalVerifiedName: '',
  saveState: null,
  useVerifiedNameForCerts: false,
};

export default connect(certPreferenceSelector)(injectIntl(CertificatePreference));
