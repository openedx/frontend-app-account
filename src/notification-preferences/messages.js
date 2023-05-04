import { defineMessages } from '@edx/frontend-platform/i18n';

// eslint-disable-next-line import/prefer-default-export
export const messages = defineMessages({
  notificationHeading: {
    id: 'notification.preference.heading',
    defaultMessage: 'Notifications',
    description: 'Notification title',
  },
  notificationGroupTitle: {
    id: 'notification.preference.group.title',
    defaultMessage: `{
        key, select,
        discussion {Discussions}
        coursework {Course Work}
        other {{key}}
    }`,
    description: 'Display text for Notification Types',
  },
  notificationTitle: {
    id: 'notification.preference.title',
    defaultMessage: `{
        text, select,
        newPost {New Post}
        newComment {New Comment}
        newAssignment {New Assignment}
        newGrade {New Grade}
        other {{text}}
    }`,
    description: 'Display text for Notification Types',
  },
  notificationHelpType: {
    id: 'notification.preference.help.type',
    defaultMessage: 'Type',
    description: 'Display text for type',
  },
  notificationHelpWeb: {
    id: 'notification.preference.help.web',
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
});
