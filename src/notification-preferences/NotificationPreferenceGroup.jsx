import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible } from '@edx/paragon';
import { messages } from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  getPreferenceGroup,
  getSelectedCourse,
} from './data/selectors';
import NotificationPreferenceRow from './NotificationPreferenceRow';
import { updateGroupValue } from './data/actions';

const NotificationPreferenceGroup = ({ groupId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(getSelectedCourse());
  const preferenceGroup = useSelector(getPreferenceGroup(groupId));
  const [groupToggle, setGroupToggle] = useState(true);

  const preferences = useMemo(() => (
    preferenceGroup.map(preference => (
      <NotificationPreferenceRow
        key={preference.id}
        groupId={groupId}
        preferenceName={preference.id}
      />
    ))), [groupId, preferenceGroup]);

  const onChangeGroupSettings = useCallback((checked) => {
    setGroupToggle(checked);
    dispatch(updateGroupValue(courseId, groupId, checked));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  if (!courseId) {
    return null;
  }
  return (
    <Collapsible.Advanced open={groupToggle}>
      <Collapsible.Trigger>
        <div className="d-flex">
          <span className="ml-0 mr-auto">
            {intl.formatMessage(messages.notificationGroupTitle, { key: groupId })}
          </span>
          <span className="ml-auto mr-0">
            <ToggleSwitch value={groupToggle} onChange={onChangeGroupSettings} />
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

NotificationPreferenceGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceGroup);
