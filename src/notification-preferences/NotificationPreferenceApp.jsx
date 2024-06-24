import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Collapsible } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import { useIsOnMobile } from '../hooks';
import NotificationTypes from './NotificationTypes';
import { notificationChannels, shouldHideAppPreferences } from './data/utils';
import NotificationPreferenceColumn from './NotificationPreferenceColumn';
import { selectPreferenceAppToggleValue, selectSelectedCourseId, selectAppPreferences } from './data/selectors';

const NotificationPreferenceApp = ({ appId }) => {
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const appToggle = useSelector(selectPreferenceAppToggleValue(appId));
  const appPreferences = useSelector(selectAppPreferences(appId));
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels();
  const hideAppPreferences = shouldHideAppPreferences(appPreferences, appId) || false;

  if (!courseId) {
    return null;
  }

  return (
    !hideAppPreferences && (
    <Collapsible.Advanced
      open={appToggle}
      data-testid={`${appId}-app`}
      className={classNames({ 'mb-5': !mobileView && appToggle })}
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
