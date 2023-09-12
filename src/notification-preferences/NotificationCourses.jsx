import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, Icon, Spinner, Button,
} from '@edx/paragon';
import { ArrowForwardIos } from '@edx/paragon/icons';
import { fetchCourseList } from './data/thunks';
import { selectCourseListStatus, selectCourseList, selectPagination } from './data/selectors';
import {
  IDLE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
} from '../constants';
import { messages } from './messages';
import { NotFoundPage } from '../account-settings';
import { useFeedbackWrapper } from '../hooks';

const NotificationCourses = ({ intl }) => {
  useFeedbackWrapper();
  const dispatch = useDispatch();
  const coursesList = useSelector(selectCourseList());
  const courseListStatus = useSelector(selectCourseListStatus());
  const { hasMore, currentPage } = useSelector(selectPagination());

  const loadMore = useCallback((page = 1, pageSize = 10) => {
    dispatch(fetchCourseList(page, pageSize));
  }, [dispatch]);

  useEffect(() => {
    if (courseListStatus === IDLE_STATUS) { loadMore(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (courseListStatus === SUCCESS_STATUS && coursesList.length === 0) {
    return <NotFoundPage />;
  }

  return (
    <Container size="md">
      <h2 className="notification-heading mt-6 mb-5.5">
        {intl.formatMessage(messages.notificationHeading)}
      </h2>
      <div data-testid="courses-list">
        {coursesList.map(course => (
          <Link
            key={course.id}
            to={`/notifications/${course.id}`}
            className="text-decoration-none"
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
        ))}
      </div>
      {courseListStatus === LOADING_STATUS ? (
        <div className="d-flex">
          <Spinner
            variant="primary"
            animation="border"
            className="mx-auto my-auto"
            size="lg"
            data-testid="loading-spinner"
          />
        </div>
      ) : hasMore && (
        <Button variant="primary" className="w-100 bg-primary-500" onClick={() => loadMore(currentPage + 1)}>
          {intl.formatMessage(messages.loadMoreCourses)}
        </Button>
      )}
    </Container>
  );
};

NotificationCourses.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotificationCourses);
