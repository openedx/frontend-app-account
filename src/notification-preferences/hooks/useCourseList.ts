import { camelCaseObject } from '@openedx/frontend-base';
import { useQuery } from '@tanstack/react-query';
import { getCourseList } from '../data/service';
import { normalizeCourses } from '../data/utils';

const useCourseList = (page, pageSize) => {
  const queryKey = ['course-list'];
  if (page && pageSize) {
    queryKey.push(page, pageSize);
  }
  const courseListQuery = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const data = await getCourseList(page, pageSize);
      const normalizedData = normalizeCourses(camelCaseObject(data));
      return normalizedData;
    },
    staleTime: Infinity,
    retry: false,
  });
  return courseListQuery;
};
export { useCourseList };
