import { useCallback, useMemo } from 'react';

import { useIntl } from '@openedx/frontend-base';
import { Dropdown } from '@openedx/paragon';
import { useCourseList } from './hooks/useCourseList';
import { useNotificationPreferencesState } from './hooks/useNotificationPreferences';

import messages from './messages';

const NotificationCoursesDropdown = () => {
  const intl = useIntl();
  const { data , error, loaded } = useCourseList();
  const { notificationPreferencesState, setSelectedCourse } = useNotificationPreferencesState();
  const coursesList = useMemo(() => data?.courses || [], [data, loaded]);
  const selectedCourseId = useMemo(() => notificationPreferencesState?.selectedCourse, [notificationPreferencesState]);
  const selectedCourse = useMemo(
    () => coursesList.find((course) => course.id === selectedCourseId),
    [coursesList, selectedCourseId],
  );

  const handleCourseSelection = useCallback((courseId) => {
    setSelectedCourse(courseId);
  }, [setSelectedCourse]);

  return (
    loaded && !error && (
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
          {selectedCourse?.name === 'Account'
            ? intl.formatMessage(messages.notificationDropdownApplies)
            : intl.formatMessage(messages.notificationCourseDropdownApplies)}
        </span>
      </div>
    )
  );
};

export default NotificationCoursesDropdown;
