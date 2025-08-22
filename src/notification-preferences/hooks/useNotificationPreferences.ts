import { camelCaseObject } from '@openedx/frontend-base';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourseNotificationPreferences, patchPreferenceToggle, postPreferenceToggle } from '../data/service';
import { normalizePreferences } from '../data/utils';
import { EMAIL, EMAIL_CADENCE, EMAIL_CADENCE_PREFERENCES } from '../data/constants';

interface NotificationPreferenceMutationProps {
  courseId?: string,
  notificationApp: string,
  notificationType: string,
  notificationChannel: string,
  value: boolean,
  emailCadence?: string,
}

const useNotificationPreferencesState = () => {
  const queryClient = useQueryClient();
  const notificationPreferencesState = useQuery({
    queryKey: ['notification-preferences-state'],
    queryFn: () => ({
      selectedCourse: '',
    }),
    staleTime: Infinity,
  });

  const updateCourseListState = (newState) => {
    queryClient.setQueryData(['notification-preferences-state'], (old) => ({
      ...(old ?? {}),
      ...newState,
    }));
  };

  const setSelectedCourse = (courseId) => {
    updateCourseListState({ selectedCourse: courseId });
    queryClient.invalidateQueries({ queryKey: ['notification-preferences', courseId] });
  };
  return { notificationPreferencesState: notificationPreferencesState.data, updateCourseListState, setSelectedCourse };
};

const useNotificationPreferences = () => {
  const queryClient = useQueryClient();
  const { notificationPreferencesState } = useNotificationPreferencesState();
  const courseId = notificationPreferencesState?.selectedCourse;
  const notificationPreferencesQuery = useQuery({
    queryKey: ['notification-preferences', courseId],
    queryFn: async () => {
      const data = await getCourseNotificationPreferences(courseId);
      const normalizedData = normalizePreferences(camelCaseObject(data), courseId);
      return normalizedData;
    },
    enabled: !!notificationPreferencesState?.selectedCourse,
    staleTime: Infinity,
  });

  const notificationPreferencesMutation = useMutation({
    mutationFn: async (props: NotificationPreferenceMutationProps) => {
      const { courseId, notificationApp, notificationType, notificationChannel, value, emailCadence } = props;
      const togglePreference = async (channel, toggleValue, cadence) => {
        if (courseId) {
          return patchPreferenceToggle(
            courseId,
            notificationApp,
            notificationType,
            channel,
            channel === EMAIL_CADENCE ? cadence : toggleValue,
          );
        }

        return postPreferenceToggle(
          notificationApp,
          notificationType,
          channel,
          channel === EMAIL_CADENCE ? undefined : toggleValue,
          cadence,
        );
      };
      const data = await togglePreference(notificationChannel, value, emailCadence);
      let emailCadenceData;
      if (notificationChannel === EMAIL && value) {
        emailCadenceData = await togglePreference(
          EMAIL_CADENCE,
          courseId ? undefined : value,
          EMAIL_CADENCE_PREFERENCES.DAILY,
        );
      }
      return { data, emailCadenceData };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', variables.courseId] });
    },
  });

  return { notificationPreferencesQuery, notificationPreferencesState, notificationPreferencesMutation };
};

export { useNotificationPreferences, useNotificationPreferencesState };
