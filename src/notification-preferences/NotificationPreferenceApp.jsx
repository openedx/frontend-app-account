import React, { useCallback } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { Collapsible } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useIsOnMobile } from '../hooks';
import ToggleSwitch from './ToggleSwitch';
import { LOADING_STATUS } from '../constants';
import NotificationTypes from './NotificationTypes';
import { notificationChannels } from './data/utils';
import { updateAppPreferenceToggle } from './data/thunks';
import NotificationPreferenceColumn from './NotificationPreferenceColumn';
import { selectPreferenceAppToggleValue, selectSelectedCourseId, selectUpdatePreferencesStatus } from './data/selectors';

const NotificationPreferenceApp = ({ appId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const appToggle = useSelector(selectPreferenceAppToggleValue(appId));
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());
  const mobileView = useIsOnMobile();
  const NOTIFICATION_CHANNELS = notificationChannels();

  const onChangeAppSettings = useCallback((event) => {
    dispatch(updateAppPreferenceToggle(courseId, appId, event.target.checked));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  if (!courseId) {
    return null;
  }

  return (
    <Collapsible.Advanced
      open={appToggle}
      data-testid={`${appId}-app`}
      className={classNames({ 'mb-5': !mobileView && appToggle })}
    >
      <Collapsible.Trigger>
        <div className="d-flex align-items-center">
          <span className="mr-auto preference-app font-weight-bold">
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
        {!mobileView && <hr className="border-light-400 my-4" />}
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div className="d-flex flex-row justify-content-between">
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
  );
};

NotificationPreferenceApp.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceApp);
