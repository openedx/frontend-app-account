import React, { useCallback } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { NavItem } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useIsOnMobile } from '../hooks';
import ToggleSwitch from './ToggleSwitch';
import EmailCadences from './EmailCadences';
import { LOADING_STATUS } from '../constants';
import { updatePreferenceToggle } from './data/thunks';
import { selectAppPreferences, selectSelectedCourseId, selectUpdatePreferencesStatus } from './data/selectors';
import { notificationChannels, shouldHideAppPreferences } from './data/utils';

const NotificationPreferenceColumn = ({ appId, channel, appPreference }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const appPreferences = useSelector(selectAppPreferences(appId));
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = Object.values(notificationChannels());
  const hideAppPreferences = shouldHideAppPreferences(appPreferences, appId) || false;

  const onToggle = useCallback((event, notificationType) => {
    const { name: notificationChannel } = event.target;
    const value = notificationChannel === 'email_cadence' ? event.target.innerText : event.target.checked;

    dispatch(updatePreferenceToggle(
      courseId,
      appId,
      notificationType,
      notificationChannel,
      value,
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  const renderPreference = (preference) => (
    (preference?.coreNotificationTypes?.length > 0 || preference.id !== 'core') && (
    <div
      key={`${preference.id}-${channel}`}
      id={`${preference.id}-${channel}`}
      className={classNames(
        'd-flex align-items-center justify-content-center mb-2 h-4.5 column-padding',
        {
          'pl-0': channel === 'web' && mobileView,
        },
      )}
    >
      <ToggleSwitch
        name={channel}
        value={preference[channel]}
        onChange={(event) => onToggle(event, preference.id)}
        disabled={updatePreferencesStatus === LOADING_STATUS}
        id={`${preference.id}-${channel}`}
        className="my-1"
      />
      {channel === 'email' && (
      <EmailCadences
        email={preference.email}
        onToggle={onToggle}
        emailCadence={preference.emailCadence}
        notificationType={preference.id}
      />
      )}
    </div>
    )
  );

  return (
    <div className={classNames('d-flex flex-column border-right channel-column')}>
      {!hideAppPreferences && mobileView && (
      <NavItem
        id={channel}
        key={channel}
        role="button"
        className={classNames('mb-3 header-label column-padding', {
          'pr-0': channel === NOTIFICATION_CHANNELS[NOTIFICATION_CHANNELS.length - 1],
          'pl-0': channel === 'web',
        })}
      >
        {intl.formatMessage(messages.notificationChannel, { text: channel })}
      </NavItem>
      )}
      {appPreference
        ? renderPreference(appPreference)
        : appPreferences.map((preference) => (renderPreference(preference)))}
    </div>
  );
};

NotificationPreferenceColumn.propTypes = {
  appId: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  appPreference: PropTypes.shape({
    id: PropTypes.string,
    emailCadence: PropTypes.string,
    appId: PropTypes.string,
    info: PropTypes.string,
    email: PropTypes.bool,
    push: PropTypes.bool,
    web: PropTypes.bool,
  }),
};

NotificationPreferenceColumn.defaultProps = {
  appPreference: null,
};

export default React.memo(NotificationPreferenceColumn);
