import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Collapsible } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/notification-preferences/messages';
import { useIsOnMobile } from '@src/hooks';
import NotificationTypes from '@src/notification-preferences/NotificationTypes';
import { notificationChannels, shouldHideAppPreferences } from '@src/notification-preferences/data/utils';
import NotificationPreferenceColumn from '@src/notification-preferences/NotificationPreferenceColumn';
import { useAppPreferences, usePreferenceApp, useShowEmailPreferences } from '@src/notification-preferences/data/hooks';

const NotificationPreferenceApp = ({ appId }) => {
  const intl = useIntl();
  const appToggle = usePreferenceApp(appId)?.enabled ?? false;
  const appPreferences = useAppPreferences(appId);
  const showEmailPreferences = useShowEmailPreferences();
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels(showEmailPreferences);
  const hideAppPreferences = shouldHideAppPreferences(appPreferences, appId) || false;

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
