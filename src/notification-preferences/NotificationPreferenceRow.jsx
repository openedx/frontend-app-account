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
} from './data/selectors';
import { updatePreferenceToggle } from './data/thunks';

const NotificationPreferenceRow = ({ appId, preferenceName }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const preference = useSelector(selectPreference(appId, preferenceName));
  const nonEditable = useSelector(selectPreferenceNonEditableChannels(appId, preferenceName));

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
    <div className="d-flex flex-row mb-3">
      <span className="d-flex align-items-center col-8 px-0">
        {intl.formatMessage(messages.notificationTitle, { text: preferenceName })}
        {
          preference.info !== '' && (
            <OverlayTrigger
              id={tooltipId}
              className="d-inline"
              placement="top"
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
          )
        }
      </span>
      <span className="d-flex col-4 px-0">
        {
          ['web', 'email', 'push'].map((channel) => (
            <span
              className={classNames(
                { 'ml-0 mr-auto': channel === 'web' },
                { 'mx-auto': channel === 'email' },
                { 'ml-auto mr-0': channel === 'push' },
              )}
            >
              <ToggleSwitch
                name={channel}
                value={preference[channel]}
                onChange={onToggle}
                disabled={nonEditable.includes(channel)}
              />
            </span>
          ))
        }
      </span>
    </div>
  );
};

NotificationPreferenceRow.propTypes = {
  appId: PropTypes.string.isRequired,
  preferenceName: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceRow);
