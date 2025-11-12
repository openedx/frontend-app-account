import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  notificationHeading: {
    id: 'notification.preference.heading',
    defaultMessage: 'Notifications',
    description: 'Notification title',
  },
  notificationAppTitle: {
    id: 'notification.preference.app.title',
    defaultMessage: `{
      key, select,
      discussion {Discussions}
      coursework {Course Work}
      updates {Updates}
      grading {Grading}
      other {{key}}
    }`,
    description: 'Display text for Notification Types',
  },
  notificationTitle: {
    id: 'notification.preference.title',
    defaultMessage: `{
      text, select,
      core {Activity notifications}
      newDiscussionPost {New discussion posts}
      newQuestionPost {New question posts}
      contentReported {Reported content}
      courseUpdates {Course updates}
      oraStaffNotifications {New ORA submission for staff grading}
      oraGradeAssigned {Essay assignment grade received}
      other {{text}}
    }`,
    description: 'Display text for Notification Types',
  },
  notificationChannel: {
    id: 'notification.preference.channel',
    defaultMessage: `{
      text, select,
      web {Web}
      email {Email}
      push {Push}
      other {{text}}
    }`,
    description: 'Display text for Notification Channel',
  },
  emailCadence: {
    id: 'notification.preference.emailCadence',
    defaultMessage: `{
      text, select,
      Daily {Daily}
      Weekly {Weekly}
      Immediately {Immediately}
      other {{text}}
    }`,
    description: 'Display text for Email Cadence',
  },
  typeLabel: {
    id: 'notification.preference.type.label',
    defaultMessage: 'Type',
    description: 'Display text for type',
  },
  webLabel: {
    id: 'notification.preference.web.label',
    defaultMessage: 'Web',
    description: 'Display text for web',
  },
  notificationHelpEmail: {
    id: 'notification.preference.help.email',
    defaultMessage: 'Email',
    description: 'Display text for email',
  },
  notificationHelpPush: {
    id: 'notification.preference.help.push',
    defaultMessage: 'Push',
    description: 'Display text for push',
  },
  loadMoreCourses: {
    id: 'notification.preference.load.more.courses',
    defaultMessage: 'Load more courses',
    description: 'Load more button to load more courses',
  },
  notificationPreferenceGuideLink: {
    id: 'notification.preference.guide.link',
    defaultMessage: 'as detailed here',
    description: 'Link of the notification preference for learner guide',
  },
  notificationPreferenceGuideBody: {
    id: 'notification.preference.guide.body',
    defaultMessage: 'Notifications for certain activities are enabled by default,',
    description: 'Body of the notification preferences for learner guide',
  },
  accountNotificationDescription: {
    id: 'account.notification.description',
    defaultMessage: 'Account-level settings apply to all courses. Notifications for individual courses can be changed within each course and will override account-level settings.',
    description: 'Account notification description',
  },
  notificationCadenceDescription: {
    id: 'notification.cadence.description',
    defaultMessage: 'Daily notifications are delivered at {dailyTime}. Weekly notifications are delivered at {weeklyTime}.',
    description: 'Notification cadence description',
  },
  notificationDefaultInfo: {
    id: 'notification.default.info',
    defaultMessage: 'Notifications for certain activities are enabled by default, as detailed here',
    description: 'Default notification info',
  },
  notificationDropdownlabel: {
    id: 'notification.dropdown.label',
    defaultMessage: 'Select notifications for',
    description: 'Dropdown label',
  },
  notificationDropdownSelectCourse: {
    id: 'notification.dropdown.select.course',
    defaultMessage: 'Select a course you’re enrolled in to view its notification preferences.',
    description: 'Dropdown description',
  },
});

export default messages;
