import React from 'react';
import { useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Container, Hyperlink } from '@openedx/paragon';

import { selectSelectedCourseId, selectShowPreferences } from './data/selectors';
import messages from './messages';
import NotificationCoursesDropdown from './NotificationCoursesDropdown';
import NotificationPreferences from './NotificationPreferences';
import { useFeedbackWrapper } from '../hooks';

const NotificationSettings = () => {
  useFeedbackWrapper();
  const intl = useIntl();
  const showPreferences = useSelector(selectShowPreferences());
  const courseId = useSelector(selectSelectedCourseId());

  return (
    showPreferences && (
      <Container className="notification-preferences px-0">
        <h2 className="notification-heading mb-3">
          {intl.formatMessage(messages.notificationHeading)}
        </h2>
        <div className="text-gray-700 font-size-14 mb-3">
          {intl.formatMessage(messages.notificationCadenceDescription, {
            dailyTime: '22:00 UTC',
            weeklyTime: '22:00 UTC Every Sunday',
          })}
        </div>
        <div className="mb-5 text-gray-700 font-size-14">
          {intl.formatMessage(messages.notificationPreferenceGuideBody)}
          <Hyperlink
            destination="https://edx.readthedocs.io/projects/open-edx-learner-guide/en/latest/sfd_notifications/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-underline ml-1"
          >
            {intl.formatMessage(messages.notificationPreferenceGuideLink)}
          </Hyperlink>
        </div>
        <NotificationCoursesDropdown />
          {courseId && (
            <NotificationPreferences courseId={courseId} />
          )}
        <div className="border border-light-700 my-6" />
      </Container>
    )
  );
};

export default NotificationSettings;
