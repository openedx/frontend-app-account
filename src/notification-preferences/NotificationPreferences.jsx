import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Container, Icon, Spinner } from '@edx/paragon';
import { ArrowBack } from '@edx/paragon/icons';
import {
  selectCourseListStatus,
  selectCourse,
  selectPreferenceAppsId,
  selectNotificationPreferencesStatus,
  selectCourseList,
} from './data/selectors';
import { fetchCourseList, fetchCourseNotificationPreferences } from './data/thunks';
import { messages } from './messages';
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

  if (notificationStatus === LOADING_STATUS) {
    return (
      <div className="d-flex h-100">
        <Spinner
          variant="primary"
          animation="border"
          className="mx-auto my-auto"
          style={{ width: '4rem', height: '4rem' }}
        />
      </div>
    );
  }

  if (
    (courseStatus === SUCCESS_STATUS && coursesList.length === 0)
    || (notificationStatus === FAILURE_STATUS && coursesList.length !== 0)
  ) {
    return <NotFoundPage />;
  }

  return (
    <Container size="md">
      <h2 className="notification-heading mt-6 mb-5.5">
        {intl.formatMessage(messages.notificationHeading)}
      </h2>
      <div>
        <div className="d-flex mb-4">
          <Link to="/notifications">
            <Icon className="d-inline-block align-bottom ml-1" src={ArrowBack} />
          </Link>
          <span className="notification-course-title ml-auto mr-auto">
            {course?.name}
          </span>
        </div>
        { preferencesList }
      </div>
    </Container>
  );
};

export default NotificationPreferences;
