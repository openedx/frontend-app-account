import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';
import { NavItem } from '@openedx/paragon';

import { useIsOnMobile } from '../hooks';
import {
  EMAIL, EMAIL_CADENCE, EMAIL_CADENCE_PREFERENCES, MIXED,
} from './data/constants';
import { notificationChannels, shouldHideAppPreferences } from './data/utils';
import EmailCadences from './EmailCadences';
import { useNotificationPreferences } from './hooks';
import messages from './messages';
import ToggleSwitch from './ToggleSwitch';

const NotificationPreferenceColumn = ({ appId, channel, appPreference }) => {
  const intl = useIntl();
  const { notificationPreferencesQuery: { data }, notificationPreferencesState, notificationPreferencesMutation} = useNotificationPreferences();
  const courseId = notificationPreferencesState?.selectedCourse;
  const { appPreferences, hideAppPreferences } = useMemo(() => { 
    const appPreferences = data?.preferences?.filter(preference => preference.appId === appId); 
    const hideAppPreferences = shouldHideAppPreferences(appPreferences, appId) || false;
    return { appPreferences, hideAppPreferences };
  }, [data, appId]);
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = Object.values(notificationChannels());

  const getValue = useCallback((notificationChannel, innerText, checked) => {
    if (notificationChannel === EMAIL_CADENCE && courseId) {
      return innerText;
    }
    return checked;
  }, [courseId]);

  const getEmailCadence = useCallback((notificationChannel, checked, innerText, emailCadence) => {
    if (notificationChannel === EMAIL_CADENCE) {
      return innerText;
    }
    if (notificationChannel === EMAIL && checked) {
      return EMAIL_CADENCE_PREFERENCES.DAILY;
    }
    return emailCadence;
  }, []);

  const onToggle = useCallback((event, notificationType) => {
    const { name: notificationChannel, checked, innerText } = event.target;
    const appNotificationPreference = appPreferences.find(preference => preference.id === notificationType);

    const value = getValue(notificationChannel, innerText, checked);
    const emailCadence = getEmailCadence(
      notificationChannel,
      checked,
      innerText,
      appNotificationPreference.emailCadence,
    );

    notificationPreferencesMutation.mutate({
      courseId,
      appId,
      notificationType,
      notificationChannel,
      value,
      emailCadence: emailCadence !== MIXED ? emailCadence : undefined,
    });
  }, [appPreferences, getValue, getEmailCadence, notificationPreferencesMutation, courseId, appId]);

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
        disabled={notificationPreferencesMutation.isPending}
        id={`${preference.id}-${channel}`}
        className="my-1"
      />
      {channel === EMAIL && (
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
        : appPreferences?.map((preference) => (renderPreference(preference)))}
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
