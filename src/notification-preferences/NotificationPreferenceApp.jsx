import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';
import { Collapsible } from '@openedx/paragon';
import { useIsOnMobile } from '../hooks';
import NotificationPreferenceColumn from './NotificationPreferenceColumn';
import NotificationTypes from './NotificationTypes';
import { notificationChannels, shouldHideAppPreferences } from './data/utils';
import messages from './messages';

const NotificationPreferenceApp = ({ appId }) => {
  const intl = useIntl();
  const {notificationPreferencesQuery: {data}} = useNotificationPreferences();
  const appPreferences = useMemo(() => data?.preferences?.filter(preference => preference.appId === appId), [data, appId]);
  const appToggle = useMemo(() => data?.apps?.find(app => app.id === appId)?.enabled, [data, appId]);
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels();
  const hideAppPreferences = useMemo(() => shouldHideAppPreferences(appPreferences, appId) || false, [appPreferences, appId]);

  return (
    !hideAppPreferences && (
    <Collapsible.Advanced
      open={appToggle}
      data-testid={`${appId}-app`}
      className={classNames({ 'mb-4.5': !mobileView && appToggle })}
    >
      <Collapsible.Trigger>
        <div className="d-flex align-items-center">
          <span className={classNames('mr-auto preference-app font-weight-bold', { 'mb-2': !mobileView })}>
            {intl.formatMessage(messages.notificationAppTitle, { key: appId })}
          </span>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div className="d-flex flex-row justify-content-between w-100">
          <NotificationTypes appId={appId} />
          {!mobileView && (
          <div className="d-flex">
            {Object.values(NOTIFICATION_CHANNELS).map((channel) => (
              <NotificationPreferenceColumn key={channel} appId={appId} channel={channel} />
            ))}
          </div>
          )}
        </div>
        {mobileView && <hr className="border-light-400 my-4.5" />}
      </Collapsible.Body>
    </Collapsible.Advanced>
    )
  );
};

NotificationPreferenceApp.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceApp);
