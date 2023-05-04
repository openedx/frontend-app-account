import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { messages } from './messages';
import ToggleSwitch from './ToggleSwitch';
import { getPreferenceAttribute } from './data/selectors';
import { updatePreferenceValue } from './data/actions';

const NotificationPreferenceRow = ({ groupId, preferenceName }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const preference = useSelector(getPreferenceAttribute(groupId, preferenceName));
  const onToggle = useCallback((checked, notificationChannel) => {
    dispatch(updatePreferenceValue(groupId, preferenceName, notificationChannel, checked));
  }, [dispatch, groupId, preferenceName]);
  return (
    <div className="d-flex flex-row mb-3">
      <span className="col-8 px-0">
        {intl.formatMessage(messages.notificationTitle, { text: preferenceName })}
      </span>
      <span className="d-flex col-4 px-0">
        <span className="ml-0 mr-auto">
          <ToggleSwitch
            value={preference.web}
            onChange={(checked) => onToggle(checked, 'web')}
          />
        </span>
        <span className="mx-auto">
          <ToggleSwitch
            value={preference.email}
            onChange={(checked) => onToggle(checked, 'email')}
          />
        </span>
        <span className="ml-auto mr-0">
          <ToggleSwitch
            value={preference.push}
            onChange={(checked) => onToggle(checked, 'push')}
          />
        </span>
      </span>
    </div>
  );
};

NotificationPreferenceRow.propTypes = {
  groupId: PropTypes.string.isRequired,
  preferenceName: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceRow);
