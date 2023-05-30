import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Container, Icon, Spinner } from '@edx/paragon';
import { ArrowBack } from '@edx/paragon/icons';
import {
  courseListStatus,
  getCourse,
  getPreferenceGroupIds,
  notificationPreferencesStatus,
} from './data/selectors';
import { fetchCourseList, fetchCourseNotificationPreferences } from './data/thunks';
import { messages } from './messages';
import NotificationPreferenceGroup from './NotificationPreferenceGroup';
import { updateSelectedCourse } from './data/actions';
import { LOADING_STATUS, SUCCESS_STATUS } from '../constants';

const NotificationPreferences = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseStatus = useSelector(courseListStatus());
  const notificationStatus = useSelector(notificationPreferencesStatus());
  const course = useSelector(getCourse(courseId));
  const preferenceGroups = useSelector(getPreferenceGroupIds());

  const preferencesList = useMemo(() => (
    preferenceGroups.map(key => (
      <NotificationPreferenceGroup groupId={key} key={key} />
    ))
  ), [preferenceGroups]);

  useEffect(() => {
    dispatch(updateSelectedCourse(courseId));
    if (courseStatus !== SUCCESS_STATUS) {
      dispatch(fetchCourseList());
    }
    if (notificationStatus !== SUCCESS_STATUS) {
      dispatch(fetchCourseNotificationPreferences(courseId));
    }
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
