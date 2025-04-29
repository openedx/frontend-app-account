import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import {
  Button, Dropdown, ModalPopup, useToggle,
} from '@openedx/paragon';

import messages from './messages';
import { EMAIL_CADENCE_PREFERENCES, EMAIL_CADENCE } from './data/constants';
import { selectUpdatePreferencesStatus } from './data/selectors';
import { LOADING_STATUS } from '../constants';

const EmailCadences = ({
  email, onToggle, emailCadence, notificationType,
}) => {
  const intl = useIntl();
  const [isOpen, open, close] = useToggle(false);
  const [target, setTarget] = useState(null);
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());

  return (
    <>
      <Button
        ref={setTarget}
        variant="outline-primary"
        onClick={open}
        disabled={!email || updatePreferencesStatus === LOADING_STATUS}
        size="sm"
        iconAfter={isOpen ? ExpandLess : ExpandMore}
        className="border-light-300 justify-content-between ml-3.5 cadence-button"
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
          {Object.values(EMAIL_CADENCE_PREFERENCES).map((cadence) => (
            <Dropdown.Item
              key={cadence}
              as={Button}
              variant="tertiary"
              name={EMAIL_CADENCE}
              className="d-flex justify-content-start py-1.5 font-size-14 cadence-button"
              size="inline"
              active={cadence === emailCadence}
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
  emailCadence: PropTypes.oneOf(Object.values(EMAIL_CADENCE_PREFERENCES)).isRequired,
  notificationType: PropTypes.string.isRequired,
};

export default React.memo(EmailCadences);
