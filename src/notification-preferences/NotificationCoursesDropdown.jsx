import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@openedx/paragon';

import { IDLE_STATUS, SUCCESS_STATUS } from '../constants';
import { selectCourseList, selectCourseListStatus, selectSelectedCourseId } from './data/selectors';
import { fetchCourseList, setSelectedCourse } from './data/thunks';
import messages from './messages';

const NotificationCoursesDropdown = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const coursesList = useSelector(selectCourseList());
  const courseListStatus = useSelector(selectCourseListStatus());
  const selectedCourseId = useSelector(selectSelectedCourseId());
  const selectedCourse = useMemo(
    () => coursesList.find((course) => course.id === selectedCourseId),
    [coursesList, selectedCourseId],
  );

  const handleCourseSelection = useCallback((courseId) => {
    dispatch(setSelectedCourse(courseId));
  }, [dispatch]);

  const fetchCourses = useCallback((page = 1, pageSize = 99999) => {
    dispatch(fetchCourseList(page, pageSize));
  }, [dispatch]);

  useEffect(() => {
    if (courseListStatus === IDLE_STATUS) {
      fetchCourses();
    }
  }, [courseListStatus, fetchCourses]);

  return (
    courseListStatus === SUCCESS_STATUS && (
      <div className="mb-5">
        <h5 className="text-primary-500 mb-3">{intl.formatMessage(messages.notificationDropdownlabel)}</h5>
        <Dropdown className="course-dropdown">
          <Dropdown.Toggle
            variant="outline-primary"
            id="course-dropdown-btn"
            className="w-100 justify-content-between small"
          >
            {selectedCourse?.name}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            {coursesList.map((course) => (
              <Dropdown.Item
                className="w-100"
                key={course.id}
                active={course.id === selectedCourse?.id}
                eventKey={course.id}
                onSelect={handleCourseSelection}
              >
                {course.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <span className="x-small text-gray-500">
          {selectedCourse?.name === 'Select Course'
            && intl.formatMessage(messages.notificationDropdownSelectCourse)}
        </span>
      </div>
    )
  );
};

export default NotificationCoursesDropdown;
