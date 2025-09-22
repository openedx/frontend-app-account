import { useIntl } from '@openedx/frontend-base';
import { ModalCloseButton, ModalLayer } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './messages';

export const SuccessModal = (props) => {
  const { status, onClose } = props;
  const intl = useIntl();

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
  onClose: PropTypes.func.isRequired,
};

SuccessModal.defaultProps = {
  status: null,
};

export default SuccessModal;
