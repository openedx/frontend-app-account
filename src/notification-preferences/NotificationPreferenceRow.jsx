import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, OverlayTrigger, Tooltip } from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';
import { messages } from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  selectPreference,
  selectPreferenceNonEditableChannels,
  selectSelectedCourseId,
  selectNotificationPreferencesStatus,
} from './data/selectors';
import { updatePreferenceToggle } from './data/thunks';
import { LOADING_STATUS } from '../constants';

const NotificationPreferenceRow = ({ appId, preferenceName }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const preference = useSelector(selectPreference(appId, preferenceName));
  const nonEditable = useSelector(selectPreferenceNonEditableChannels(appId, preferenceName));
  const preferencesStatus = useSelector(selectNotificationPreferencesStatus());

  const onToggle = useCallback((event) => {
    const {
      checked,
      name: notificationChannel,
    } = event.target;
    dispatch(updatePreferenceToggle(
      courseId,
      appId,
      preferenceName,
      notificationChannel,
      checked,
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, preferenceName]);

  const tooltipId = `${preferenceName}-tooltip`;
  return (
    <div className="d-flex mb-3" data-testid="notification-preference">
      <div className="d-flex align-items-center mr-auto">
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
      <div className="d-flex align-items-center">
        {['web'].map((channel) => (
          <div
            id={`${preferenceName}-${channel}`}
            className={classNames(
              'd-flex',
              { 'ml-auto': channel === 'web' },
              { 'mx-auto': channel === 'email' },
              { 'ml-auto mr-0': channel === 'push' },
            )}
          >
            <ToggleSwitch
              name={channel}
              value={preference[channel]}
              onChange={onToggle}
              disabled={nonEditable.includes(channel) || preferencesStatus === LOADING_STATUS}
            />
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
