import React, { useCallback } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { NavItem } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import messages from './messages';
import { useIsOnMobile } from '../hooks';
import ToggleSwitch from './ToggleSwitch';
import EmailCadences from './EmailCadences';
import {
  useAppNonEditableChannels,
  useAppPreferences,
  useIsUpdatingPreferences,
  useShowEmailPreferences,
  useUpdatePreferenceToggle,
} from './data/hooks';
import { notificationChannels, shouldHideAppPreferences } from './data/utils';
import { EMAIL, EMAIL_CADENCE } from './data/constants';

const NotificationPreferenceColumn = ({ appId, channel, appPreference }) => {
  const intl = useIntl();
  const appPreferences = useAppPreferences(appId);
  const isUpdating = useIsUpdatingPreferences();
  const nonEditable = useAppNonEditableChannels(appId);
  const { mutate: updatePreferenceToggle } = useUpdatePreferenceToggle();
  const mobileView = useIsOnMobile();
  const showEmailPreferences = useShowEmailPreferences();
  const NOTIFICATION_CHANNELS = Object.values(notificationChannels(showEmailPreferences));
  const hideAppPreferences = shouldHideAppPreferences(appPreferences, appId) || false;

  const getValue = useCallback((notificationChannel, innerText, checked) => {
    if (notificationChannel === EMAIL_CADENCE) {
      return innerText;
    }
    return checked;
  }, []);

  const getEmailCadence = useCallback((notificationChannel, innerText, emailCadence) => {
    if (notificationChannel === EMAIL_CADENCE) {
      return innerText;
    }

    return emailCadence;
  }, []);

  const onToggle = useCallback((event, notificationType) => {
    const { name: notificationChannel, checked, innerText } = event.target;
    const appNotificationPreference = appPreferences.find(preference => preference.id === notificationType);

    const value = getValue(notificationChannel, innerText, checked);
    const emailCadence = getEmailCadence(
      notificationChannel,
      innerText,
      appNotificationPreference.emailCadence,
    );

    updatePreferenceToggle({
      notificationApp: appId,
      notificationType,
      notificationChannel,
      value,
      emailCadence,
    });
  }, [appPreferences, getValue, getEmailCadence, updatePreferenceToggle, appId]);

  const renderPreference = (preference) => (
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
        disabled={isUpdating || nonEditable[preference.id]?.includes(channel)}
        id={`toggle-${preference.id}-${channel}`}
        className="my-1"
      />
      {channel === EMAIL && (
      <EmailCadences
        email={preference.email}
        onToggle={onToggle}
        emailCadence={preference.emailCadence}
        notificationType={preference.id}
        disabled={nonEditable[preference.id]?.includes(channel)}
      />
      )}
    </div>
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
