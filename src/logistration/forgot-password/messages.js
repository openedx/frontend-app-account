import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'logisration.forgot.password.page.heading': {
    id: 'logisration.forgot.password.page.heading',
    defaultMessage: 'Password assistance',
    description: 'The page heading for the forgot password page.',
  },
  'logisration.forgot.password.page.instructions': {
    id: 'logisration.forgot.password.page.instructions',
    defaultMessage: 'Please enter your log-in or recovery email address below and we will send you an email with instructions.',
    description: 'Instructions message for forgot password page.',
  },
  'logisration.forgot.password.page.invalid.email.message': {
    id: 'logisration.forgot.password.page.invalid.email.message',
    defaultMessage: "The email address you've provided isn't formatted correctly.",
    description: 'Invalid email address message for the forgot password page.',
  },
  'logisration.forgot.password.page.email.field.label': {
    id: 'logisration.forgot.password.page.email.field.label',
    defaultMessage: 'Email',
    description: 'Email field label for the forgot password page.',
  },
  'logisration.forgot.password.page.email.field.help.text': {
    id: 'logisration.forgot.password.page.email.field.help.text',
    defaultMessage: 'The email address you used to register with edX.',
    description: 'Email field help text for the forgot password page.',
  },
  'logisration.forgot.password.page.submit.button': {
    id: 'logisration.forgot.password.page.submit.button',
    defaultMessage: 'Recover my password',
    description: 'Submit button text for the forgot password page.',
  },
});

export default messages;
