import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'account.settings.field.name.checkbox.certificate.select': {
    id: 'account.settings.field.name.certificate.select',
    defaultMessage: 'If checked, this name will appear on your certificates and public-facing records.',
    description: 'Label for checkbox describing that the selected name will appear on the user‘s certificates.',
  },
  'account.settings.field.name.modal.certificate.title': {
    id: 'account.settings.field.name.modal.certificate.title',
    defaultMessage: 'Choose a preferred name for certificates and public-facing records',
    description: 'Title instructing the user to choose a preferred name.',
  },
  'account.settings.field.name.modal.certificate.select': {
    id: 'account.settings.field.name.modal.certificate.select',
    defaultMessage: 'Select a name',
    description: 'Label instructing the user to select a name.',
  },
  'account.settings.field.name.modal.certificate.option.full': {
    id: 'account.settings.field.name.modal.certificate.option.full',
    defaultMessage: 'Full Name',
    description: 'Option representing the user’s full name.',
  },
  'account.settings.field.name.modal.certificate.option.verified': {
    id: 'account.settings.field.name.modal.certificate.option.verified',
    defaultMessage: 'Verified Name',
    description: 'Option representing the user’s verified name.',
  },
  'account.settings.field.name.modal.certificate.button.choose': {
    id: 'account.settings.field.name.modal.certificate.button.choose',
    defaultMessage: 'Choose name',
    description: 'Button to confirm the user’s name choice.',
  },
});

export default messages;
