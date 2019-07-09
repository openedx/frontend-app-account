import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-i18n';
import { Modal } from '@edx/paragon';

import messages from './messages';

export const SuccessModal = (props) => {
  const { open, intl, onClose } = props;
  return (
    <Modal
      open={open}
      title={intl.formatMessage(messages['account.settings.delete.account.modal.after.header'])}
      body={
        <div>
          <p className="h6">
            {intl.formatMessage(messages['account.settings.delete.account.modal.after.text'])}
          </p>
        </div>
      }
      closeText={intl.formatMessage(messages['account.settings.delete.account.modal.after.button'])}
      renderHeaderCloseButton={false}
      onClose={onClose}
    />
  );
};

SuccessModal.propTypes = {
  open: PropTypes.bool,
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
};

SuccessModal.defaultProps = {
  open: false,
};

export default injectIntl(SuccessModal);
