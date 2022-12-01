import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { ModalLayer, ModalCloseButton } from '@edx/paragon';

import messages from './messages';

export const SuccessModal = (props) => {
  const { status, intl, onClose } = props;
  return (

    <ModalLayer isOpen={status === 'deleted'} onClose={onClose}>
      <div className="mw-sm p-5 bg-white mx-auto my-3">
        <h3>
          {intl.formatMessage(messages['account.settings.delete.account.modal.after.header'])}
        </h3>
        <div className="p-3">
          <p className="h6">
            {intl.formatMessage(messages['account.settings.delete.account.modal.after.text'])}
          </p>
        </div>
        <p>
          <ModalCloseButton className="float-right" variant="link">Close</ModalCloseButton>
        </p>
      </div>

    </ModalLayer>

  );
};

SuccessModal.propTypes = {
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
};

SuccessModal.defaultProps = {
  status: null,
};

export default injectIntl(SuccessModal);
