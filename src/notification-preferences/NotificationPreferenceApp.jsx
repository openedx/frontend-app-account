import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible } from '@edx/paragon';
import { messages } from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  selectPreferenceAppToggleValue,
  selectPreferencesOfApp,
  selectSelectedCourseId,
} from './data/selectors';
import NotificationPreferenceRow from './NotificationPreferenceRow';
import { updateAppPreferenceToggle } from './data/thunks';

const NotificationPreferenceApp = ({ appId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const appPreferences = useSelector(selectPreferencesOfApp(appId));
  const appToggle = useSelector(selectPreferenceAppToggleValue(appId));

  const preferences = useMemo(() => (
    appPreferences.map(preference => (
      <NotificationPreferenceRow
        key={preference.id}
        appId={appId}
        preferenceName={preference.id}
      />
    ))), [appId, appPreferences]);

  const onChangeAppSettings = useCallback((event) => {
    dispatch(updateAppPreferenceToggle(courseId, appId, event.target.checked));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  if (!courseId) {
    return null;
  }
  return (
    <Collapsible.Advanced open={appToggle}>
      <Collapsible.Trigger>
        <div className="d-flex">
          <span className="ml-0 mr-auto">
            {intl.formatMessage(messages.notificationAppTitle, { key: appId })}
          </span>
          <span className="ml-auto mr-0">
            <ToggleSwitch
              name={appId}
              value={appToggle}
              onChange={onChangeAppSettings}
            />
          </span>
        </div>
        <hr />
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div className="d-flex flex-row notification-help-text">
          <span className="col-8 px-0">{intl.formatMessage(messages.notificationHelpType)}</span>
          <span className="d-flex col-4 px-0">
            <span className="ml-0 mr-auto">{intl.formatMessage(messages.notificationHelpWeb)}</span>
            <span className="mx-auto">{intl.formatMessage(messages.notificationHelpEmail)}</span>
            <span className="ml-auto mr-0 pr-2.5">{intl.formatMessage(messages.notificationHelpPush)}</span>
          </span>
        </div>
        <div className="mt-3 pb-5">
          { preferences }
        </div>
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
};

NotificationPreferenceApp.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceApp);
