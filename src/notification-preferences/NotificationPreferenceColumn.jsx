import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { NavItem } from '@openedx/paragon';
import messages from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  selectNonEditablePreferences,
  selectSelectedCourseId,
  selectUpdatePreferencesStatus,
  selectPreferencesOfApp,
} from './data/selectors';
import { updatePreferenceToggle, updateChannelPreferenceToggle } from './data/thunks';
import { LOADING_STATUS } from '../constants';
import EmailCadences from './EmailCadences';

const NotificationPreferenceColumn = ({ appId, channel }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const appPreferences = useSelector(selectPreferencesOfApp(appId));
  const nonEditable = useSelector(selectNonEditablePreferences(appId));
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());

  const onChannelToggle = useCallback((event) => {
    const { id: notificationChannel } = event.target;
    const isPreferenceNonEditable = (preference) => nonEditable?.[preference.id]?.includes(notificationChannel);

    const hasActivePreferences = appPreferences.some(
      (preference) => preference[notificationChannel] && !isPreferenceNonEditable(preference),
    );

    dispatch(updateChannelPreferenceToggle(courseId, appId, notificationChannel, !hasActivePreferences));
  }, [appId, appPreferences, courseId, dispatch, nonEditable]);

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

  return (
    <div className={classNames('d-flex flex-column', { 'border-right': channel !== 'email' })}>
      <NavItem
        id={channel}
        key={channel}
        role="button"
        onClick={onChannelToggle}
        className={classNames('mb-3', {
          'pl-4.5': channel === 'email', 'px-4.5': channel !== 'email',
        })}
      >
        {intl.formatMessage(messages.notificationChannel, { text: channel })}
      </NavItem>
      {appPreferences.map((preference) => (
        <div
          key={`${preference.id}-${channel}`}
          id={`${preference.id}-${channel}`}
          className={classNames(
            'd-flex px-0 align-items-center justify-content-center mb-2 h-4.5',
            { 'pl-4.5': channel === 'email', 'px-4.5': channel !== 'email' },
          )}
        >
          <ToggleSwitch
            name={channel}
            value={preference[channel]}
            onChange={(event) => onToggle(event, preference.id)}
            disabled={nonEditable?.[preference.id]?.includes(channel) || updatePreferencesStatus === LOADING_STATUS}
            id={`${preference.id}-${channel}`}
            className="my-1"
          />
          {channel === 'email' && <EmailCadences email={preference.email} onToggle={onToggle} />}
        </div>
      ))}
    </div>
  );
};

NotificationPreferenceColumn.propTypes = {
  appId: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceColumn);
