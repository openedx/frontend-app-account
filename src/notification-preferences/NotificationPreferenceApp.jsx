import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible } from '@openedx/paragon';
import messages from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  selectPreferenceAppToggleValue,
  selectSelectedCourseId,
  selectUpdatePreferencesStatus,
} from './data/selectors';
import NotificationPreferenceColumn from './NotificationPreferenceColumn';
import { updateAppPreferenceToggle } from './data/thunks';
import { LOADING_STATUS } from '../constants';
import { NOTIFICATION_CHANNELS } from './data/constants';
import NotificationTypes from './NotificationTypes';

const NotificationPreferenceApp = ({ appId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const appToggle = useSelector(selectPreferenceAppToggleValue(appId));
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());

  const onChangeAppSettings = useCallback((event) => {
    dispatch(updateAppPreferenceToggle(courseId, appId, event.target.checked));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  if (!courseId) {
    return null;
  }

  return (
    <Collapsible.Advanced open={appToggle} data-testid={`${appId}-app`} className="mb-5">
      <Collapsible.Trigger>
        <div className="d-flex align-items-center">
          <span className="mr-auto">
            {intl.formatMessage(messages.notificationAppTitle, { key: appId })}
          </span>
          <span className="d-flex" id={`${appId}-app-toggle`}>
            <ToggleSwitch
              name={appId}
              value={appToggle}
              onChange={onChangeAppSettings}
              disabled={updatePreferencesStatus === LOADING_STATUS}
            />
          </span>
        </div>
        <hr className="border-light-400 my-3" />
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div className="d-flex flex-row justify-content-between">
          <NotificationTypes appId={appId} />
          <div className="d-flex">
            {Object.values(NOTIFICATION_CHANNELS).map((channel) => (
              <NotificationPreferenceColumn key={channel} appId={appId} channel={channel} />
            ))}
          </div>
        </div>
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
};

NotificationPreferenceApp.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceApp);
