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
    <Collapsible.Advanced open={appToggle} data-testid="notification-app" className="mb-5">
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
            />
          </span>
        </div>
        <hr className="border-light-400 my-3" />
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div className="d-flex flex-row header-label">
          <span className="col-8 px-0">{intl.formatMessage(messages.typeLabel)}</span>
          <span className="d-flex col-4 px-0">
            <span className="ml-auto">{intl.formatMessage(messages.webLabel)}</span>
          </span>
        </div>
        <div className="my-3">
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
