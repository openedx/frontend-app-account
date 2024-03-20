import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import messages from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  selectPreference,
  selectPreferenceNonEditableChannels,
  selectSelectedCourseId,
  selectUpdatePreferencesStatus,
} from './data/selectors';
import { NOTIFICATION_CHANNELS } from './data/constants';
import { updatePreferenceToggle } from './data/thunks';
import { LOADING_STATUS } from '../constants';
import EmailCadences from './EmailCadences';

const NotificationPreferenceRow = ({ appId, preferenceName }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const preference = useSelector(selectPreference(appId, preferenceName));
  const nonEditable = useSelector(selectPreferenceNonEditableChannels(appId, preferenceName));
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());

  const onToggle = useCallback((event) => {
    const { name: notificationChannel } = event.target;
    const value = notificationChannel === 'email_cadence' ? event.target.innerText : event.target.checked;

    dispatch(updatePreferenceToggle(
      courseId,
      appId,
      preferenceName,
      notificationChannel,
      value,
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, preferenceName]);
  const tooltipId = `${preferenceName}-tooltip`;

  if (appId === 'grading' && preferenceName === 'core') {
    return null;
  }

  return (
    <div className="d-flex mb-3.5" data-testid="notification-preference">
      <div className="d-flex align-items-center col-5 px-0">
        {intl.formatMessage(messages.notificationTitle, { text: preferenceName })}
        {preference.info !== '' && (
          <OverlayTrigger
            id={tooltipId}
            className="d-inline"
            placement="right"
            overlay={(
              <Tooltip id={tooltipId}>
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
      <div className="d-flex flex-row align-items-center col-7 px-0 justify-content-end">
        {Object.values(NOTIFICATION_CHANNELS).map((channel) => (
          <div
            id={`${preferenceName}-${channel}`}
            className={classNames(
              'd-flex px-0 align-items-center justify-content-center',
              { 'col-6 pl-4.5': channel === 'email', 'col-3 px-4.5': channel !== 'email' },
            )}
          >
            <ToggleSwitch
              name={channel}
              value={preference[channel]}
              onChange={onToggle}
              disabled={nonEditable.includes(channel) || updatePreferencesStatus === LOADING_STATUS}
              id={`${preferenceName}-${channel}`}
            />
            {channel === 'email' && <EmailCadences email={preference.email} onToggle={onToggle} />}
          </div>
        ))}
      </div>
    </div>
  );
};

NotificationPreferenceRow.propTypes = {
  appId: PropTypes.string.isRequired,
  preferenceName: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceRow);
