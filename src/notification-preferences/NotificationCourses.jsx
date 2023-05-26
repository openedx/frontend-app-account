import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Container, Icon, Spinner } from '@edx/paragon';
import { ArrowForwardIos } from '@edx/paragon/icons';
import { fetchCourseList } from './data/thunks';
import { selectCourseListStatus, selectCourseList } from './data/selectors';
import {
  IDLE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
} from '../constants';
import { messages } from './messages';
import { NotFoundPage } from '../account-settings';

const NotificationCourses = ({ intl }) => {
  const dispatch = useDispatch();
  const coursesList = useSelector(selectCourseList());
  const courseListStatus = useSelector(selectCourseListStatus());

  useEffect(() => {
    if (courseListStatus === IDLE_STATUS) {
      dispatch(fetchCourseList());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (courseListStatus === SUCCESS_STATUS && coursesList.length === 0) {
    return <NotFoundPage />;
  }

  if (courseListStatus === LOADING_STATUS) {
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
        {
          coursesList.map(course => (
            <Link
              key={course.id}
              to={`/notifications/${course.id}`}
            >
              <div className="mb-4 d-flex text-gray-700">
                <span className="ml-0 mr-auto">
                  {course.name}
                </span>
                <span className="ml-auto mr-0">
                  <Icon src={ArrowForwardIos} />
                </span>
              </div>
            </Link>
          ))
        }
      </div>
    </Container>
  );
};

NotificationCourses.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotificationCourses);
