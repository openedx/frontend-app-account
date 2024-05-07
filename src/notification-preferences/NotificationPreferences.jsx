import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Icon, Spinner, Hyperlink,
} from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';
import {
  selectCourseListStatus,
  selectCourse,
  selectPreferenceAppsId,
  selectNotificationPreferencesStatus,
  selectCourseList,
} from './data/selectors';
import { fetchCourseList, fetchCourseNotificationPreferences } from './data/thunks';
import messages from './messages';
import NotificationPreferenceApp from './NotificationPreferenceApp';
import {
  FAILURE_STATUS,
  IDLE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
} from '../constants';
import { NotFoundPage } from '../account-settings';

const NotificationPreferences = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseStatus = useSelector(selectCourseListStatus());
  const coursesList = useSelector(selectCourseList());
  const course = useSelector(selectCourse(courseId));
  const notificationStatus = useSelector(selectNotificationPreferencesStatus());
  const preferenceAppsIds = useSelector(selectPreferenceAppsId());
  const isLoading = notificationStatus === LOADING_STATUS || courseStatus === LOADING_STATUS;

  const preferencesList = useMemo(() => (
    preferenceAppsIds.map(appId => (
      <NotificationPreferenceApp appId={appId} key={appId} />
    ))
  ), [preferenceAppsIds]);

  useEffect(() => {
    if ([IDLE_STATUS, FAILURE_STATUS].includes(courseStatus)) {
      dispatch(fetchCourseList());
    }
    dispatch(fetchCourseNotificationPreferences(courseId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (
    (courseStatus === SUCCESS_STATUS && coursesList.length === 0)
    || (notificationStatus === FAILURE_STATUS && coursesList.length !== 0)
  ) {
    return <NotFoundPage />;
  }

  return (
    <Container size="sm" className="notification-preferences">
      <h2 className="notification-heading mt-6 mb-4.5">
        {intl.formatMessage(messages.notificationHeading)}
      </h2>
      <div className="mb-6 text-gray-700 font-size-14 margin-bottom-32">
        {intl.formatMessage(messages.notificationPreferenceGuideBody)}
        <Hyperlink
          destination="https://edx.readthedocs.io/projects/open-edx-learner-guide/en/latest/sfd_notifications/managing_notifications.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-underline ml-1"
        >
          {intl.formatMessage(messages.notificationPreferenceGuideLink)}
        </Hyperlink>
      </div>
      <div className="h-100">
        <div className="d-flex mb-5">
          <Link to="/notifications">
            <Icon className="text-primary-500" src={ArrowBack} />
          </Link>
          <span className="notification-course-title ml-auto mr-auto text-primary-500">
            {course?.name}
          </span>
        </div>
        {preferencesList}
        {isLoading && (
          <div className="d-flex">
            <Spinner
              variant="primary"
              animation="border"
              className="mx-auto my-auto"
              size="lg"
              data-testid="loading-spinner"
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default NotificationPreferences;
