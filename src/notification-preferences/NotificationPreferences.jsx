import React, { useMemo } from 'react';

import classNames from 'classnames';

import { useIntl } from '@openedx/frontend-base';
import { NavItem } from '@openedx/paragon';

import { useIsOnMobile } from '../hooks';
import messages from './messages';
import NotificationPreferenceApp from './NotificationPreferenceApp';
import { usePreferenceAppIds, useShowEmailPreferences } from './data/hooks';
import { notificationChannels } from './data/utils';

const NotificationPreferences = () => {
  const intl = useIntl();
  const preferenceAppsIds = usePreferenceAppIds();
  const showEmailPreferences = useShowEmailPreferences();
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels(showEmailPreferences);

  const preferencesList = useMemo(() => (
    preferenceAppsIds.map(appId => (
      <NotificationPreferenceApp appId={appId} key={appId} />
    ))
  ), [preferenceAppsIds]);

  if (preferenceAppsIds.length === 0) {
    return null;
  }

  return (
    <div className="h-100">
      {!mobileView && (
        <div className="d-flex flex-row justify-content-between float-right">
          <div className="d-flex">
            {Object.values(NOTIFICATION_CHANNELS).map((channel) => (
              <div className={classNames('d-flex flex-column channel-column')} key={channel}>
                <NavItem
                  id={channel}
                  className={classNames('header-label column-padding', {
                    'pr-0': channel === NOTIFICATION_CHANNELS[NOTIFICATION_CHANNELS.length - 1],
                    'mr-2': channel === 'web',
                    'email-channel ': channel === 'email',

                  })}
                >
                  {intl.formatMessage(messages.notificationChannel, { text: channel })}
                </NavItem>
              </div>
            ))}
          </div>
        </div>
      )}
      {preferencesList}
    </div>
  );
};

export default NotificationPreferences;
