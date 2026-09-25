import React from 'react';

import PropTypes from 'prop-types';

import { InfoOutline } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';

import messages from './messages';
import { useIsOnMobile } from '../hooks';
import { notificationChannels } from './data/utils';

import { useAppPreferences, useShowEmailPreferences } from './data/hooks';
import NotificationPreferenceColumn from './NotificationPreferenceColumn';

const NotificationTypes = ({ appId }) => {
  const intl = useIntl();
  const preferences = useAppPreferences(appId);
  const showEmailPreferences = useShowEmailPreferences();
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels(showEmailPreferences);

  return (
    <div className="d-flex flex-column mr-auto px-0">
      {preferences.map(preference => (
        <React.Fragment key={preference.id}>
          <div
            className={`d-flex align-items-center line-height-36${mobileView ? ' my-3' : ' mb-2'}`}
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
          {mobileView && (
          <div className="d-flex">
            {Object.values(NOTIFICATION_CHANNELS).map((channel) => (
              <NotificationPreferenceColumn key={channel} appId={appId} channel={channel} appPreference={preference} />
            ))}
          </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

NotificationTypes.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default React.memo(NotificationTypes);
