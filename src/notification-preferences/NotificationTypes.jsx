import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import messages from './messages';
import { selectPreferencesOfApp } from './data/selectors';

const NotificationTypes = ({ appId }) => {
  const intl = useIntl();
  const preferences = useSelector(selectPreferencesOfApp(appId));

  return (
    <div className="d-flex flex-column col-5 px-0">
      <span className="mb-3">{intl.formatMessage(messages.typeLabel)}</span>
      {preferences.map(preference => (
        <div
          key={preference.id}
          className="d-flex mb-2 align-items-center line-height-36"
          data-testid="notification-preference"
        >
          {intl.formatMessage(messages.notificationTitle, { text: preference.id })}
          {preference.info !== '' && (
            <OverlayTrigger
              id={`${preference.id}-tooltip`}
              className="d-inline"
              placement="right"
              overlay={(
                <Tooltip id={`${preference.id}-tooltip`}>
                  {preference.info}
                </Tooltip>
              )}
            >
              <span className="ml-2">
                <Icon src={InfoOutline} />
              </span>
            </OverlayTrigger>
          )}
        </div>
      ))}
    </div>
  );
};

NotificationTypes.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default React.memo(NotificationTypes);
