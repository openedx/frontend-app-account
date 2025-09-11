import { useMemo } from 'react';

import classNames from 'classnames';

import { useIntl } from '@openedx/frontend-base';
import { NavItem, Spinner } from '@openedx/paragon';

import { useIsOnMobile } from '../hooks';
import { notificationChannels } from './data/utils';
import { useNotificationPreferences, useCourseList } from './hooks';
import messages from './messages';
import NotificationPreferenceApp from './NotificationPreferenceApp';

const NotificationPreferences = () => {
  const intl = useIntl();
  const { isLoading: isLoadingCourses } = useCourseList();
  const { notificationPreferencesQuery } = useNotificationPreferences();
  const { data: notificationsData, isLoading: isLoadingNotificationPreferences} = notificationPreferencesQuery;
  const preferenceAppsIds = useMemo(() => notificationsData?.apps?.map(app => app.id), [notificationsData]);
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels();
  const isLoading = isLoadingNotificationPreferences || isLoadingCourses;

  const preferencesList = useMemo(() => (
    preferenceAppsIds?.map(appId => (
      <NotificationPreferenceApp appId={appId} key={appId} />
    ))
  ), [preferenceAppsIds]);


  if (preferenceAppsIds?.length === 0) {
    return null;
  }

  return (
    <div className="h-100">
      {!mobileView && !isLoading && (
        <div className="d-flex flex-row justify-content-between float-right">
          <div className="d-flex">
            {Object.values(NOTIFICATION_CHANNELS).map((channel) => (
              <div className={classNames('d-flex flex-column channel-column')}>
                <NavItem
                  id={channel}
                  key={channel}
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
      {isLoading && (
        <div className="d-flex">
          <Spinner
            variant="primary"
            animation="border"
            className="mx-auto my-auto"
            size="lg"
            data-testid="loading-spinner"
          />
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;
