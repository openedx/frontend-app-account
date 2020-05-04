import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'account.settings.field.phone_number': {
    id: 'account.settings.field.phone_number',
    defaultMessage: 'Phone Number',
    description: 'The label for a phone numbers setting in the user profile',
  },
  'account.settings.field.phone_number.empty': {
    id: 'account.settings.field.phone_number.empty',
    defaultMessage: 'Add a phone number',
    description: 'placeholder for a profiles empty phone number field',
  },
  'account.settings.field.coaching_consent': {
    id: 'account.settings.field.coaching_consent',
    defaultMessage: 'Coaching consent',
    description: 'The label for the coaching consent setting in the user profile',
  },
  'account.settings.field.coaching_consent.tooltip': {
    id: 'account.settings.field.coaching_consent.tooltip',
    defaultMessage: 'MicroBachelors programs include text message based coaching that helps you pair educational experiences with your career goals through one-on-one advice. Coaching services are included at no additional cost, and are available to learners with U.S. mobile phone numbers. Standard messaging rates apply. Text ‘STOP’ at anytime to opt-out of messages.',
    description: 'A tooltip explaining what coaching is and who it is for',
  },
  'account.settings.field.coaching_consent.error': {
    id: 'account.settings.field.coaching_consent.error',
    defaultMessage: 'A valid US phone number is required to opt into coaching',
    description: 'An error message that displays when a user attempts to consent to coaching without first providing a phone number in their profile',
  },
});

export default messages;
