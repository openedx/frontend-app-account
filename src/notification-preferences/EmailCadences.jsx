import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Dropdown, ModalPopup, Button, useToggle,
} from '@openedx/paragon';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import messages from './messages';
import { EMAIL_CADENCE } from './data/constants';

const EmailCadences = ({
  email, onToggle, emailCadence, notificationType,
}) => {
  const intl = useIntl();
  const [isOpen, open, close] = useToggle(false);
  const [target, setTarget] = useState(null);

  return (
    <>
      <Button
        ref={setTarget}
        variant="outline-primary"
        onClick={open}
        disabled={!email}
        size="sm"
        iconAfter={isOpen ? ExpandLess : ExpandMore}
        className="border-light-300 text-primary-500 justify-content-between ml-3.5 cadence-button"
      >
        {intl.formatMessage(messages.emailCadence, { text: emailCadence })}
      </Button>
      <ModalPopup
        onClose={close}
        positionRef={target}
        isOpen={isOpen}
      >
        <div
          className="bg-white shadow d-flex flex-column margin-left-2"
          data-testid="email-cadence-dropdown"
        >
          {Object.values(EMAIL_CADENCE).map((cadence) => (
            <Dropdown.Item
              key={cadence}
              name="email_cadence"
              className="d-flex justify-content-start py-1.5"
              as={Button}
              variant="primary"
              size="inline"
              autoFocus={cadence === emailCadence}
              onClick={(event) => {
                onToggle(event, notificationType);
                close();
              }}
            >
              {intl.formatMessage(messages.emailCadence, { text: cadence })}
            </Dropdown.Item>
          ))}
        </div>
      </ModalPopup>
    </>
  );
};

EmailCadences.propTypes = {
  email: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  emailCadence: PropTypes.oneOf(Object.values(EMAIL_CADENCE)).isRequired,
  notificationType: PropTypes.string.isRequired,
};

export default React.memo(EmailCadences);
