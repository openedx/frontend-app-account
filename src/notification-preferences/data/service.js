/* eslint-disable no-unused-vars */

// import { getConfig } from '@edx/frontend-platform';
// import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export async function getCourseNotificationPreferences(courseId) {
  // const url = `${getConfig().LMS_BASE_URL}/api/notifications/${courseId}`;
  // const { data } = await getAuthenticatedHttpClient().get(url);
  const data = {
    discussion: {
      new_post: {
        web: true,
        push: false,
        email: false,
      },
      new_comment: {
        web: true,
        push: false,
        email: false,
      },
    },
    coursework: {
      new_assignment: {
        web: true,
        push: false,
        email: false,
      },
      new_grade: {
        web: true,
        push: false,
        email: false,
      },
    },
  };
  return data;
}

export async function getCourseList() {
  // const url = `${getConfig().LMS_BASE_URL}/api/notifications/${courseId}`;
  // const { data } = await getAuthenticatedHttpClient().get(url);
  return [
    { id: 'course-v1:edX+Supply+Demo_Course', name: 'Supply Chain Analytics' },
    { id: 'course-v1:edX+Happiness+At+Work_Course', name: 'The Foundation of Happiness At Work' },
    { id: 'course-v1:edX+Empathy+At+Work_Course', name: 'Empathy and Emotional Intelligence At Work' },
  ];
}
