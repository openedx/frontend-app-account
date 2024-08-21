import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'account.settings.name.change.title.id': {
    id: 'account.settings.name.change.title.id',
    defaultMessage: 'This name change requires identity verification',
    description: 'Inform the user that changing their name requires identity verification',
  },
  'account.settings.name.change.title.begin': {
    id: 'account.settings.name.change.title.begin',
    defaultMessage: 'Before we begin',
    description: 'Title before beginning the ID verification process',
  },
  'account.settings.name.change.warning.one': {
    id: 'account.settings.name.change.warning.one',
    defaultMessage: 'Warning: This action updates the name that appears on all certificates that have been earned on this account in the past and any certificates you are currently earning or will earn in the future.',
    description: 'Warning informing the user that a name change will update the name on all of their certificates.',
  },
  'account.settings.name.change.warning.two': {
    id: 'account.settings.name.change.warning.two',
    defaultMessage: 'This action cannot be undone without verifying your identity.',
    description: 'Warning informing the user that a name change cannot be undone without ID verification.',
  },
  'account.settings.name.change.id.name.label': {
    id: 'account.settings.name.change.id.name.label',
    defaultMessage: 'Enter your name as it appears on your identification card.',
    description: 'Form label instructing the user to enter the name on their ID.',
  },
  'account.settings.name.change.id.name.placeholder': {
    id: 'account.settings.name.change.id.name.placeholder',
    defaultMessage: 'Enter the name on your photo ID',
    description: 'Form label instructing the user to enter the name on their ID.',
  },
  'account.settings.name.change.error.valid.name': {
    id: 'account.settings.name.change.error.valid.name',
    defaultMessage: 'Please enter a valid name.',
    description: 'Error that appears when the user doesn’t enter a valid name.',
  },
  'account.settings.name.change.error.general': {
    id: 'account.settings.name.change.error.general',
    defaultMessage: 'A technical error occurred. Please try again.',
    description: 'Generic error message.',
  },
  'account.settings.name.change.continue': {
    id: 'account.settings.name.change.continue',
    defaultMessage: 'Continue',
    description: 'Continue button.',
  },
  'account.settings.name.change.cancel': {
    id: 'account.settings.name.change.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button.',
  },
});

export default messages;
