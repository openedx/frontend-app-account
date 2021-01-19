import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'account.settings.delete.account.header': {
    id: 'account.settings.delete.account.header',
    defaultMessage: 'Delete My Account',
    description: 'Header for the user account deletion area',
  },
  'account.settings.delete.account.subheader': {
    id: 'account.settings.delete.account.subheader',
    defaultMessage: 'We\'re sorry to see you go!',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.1': {
    id: 'account.settings.delete.account.text.1',
    defaultMessage: 'Please note: Deletion of your account and personal data is permanent and cannot be undone. Zollege will not be able to recover your account or the data that is deleted.',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.2': {
    id: 'account.settings.delete.account.text.2',
    defaultMessage: 'Once your account is deleted, you cannot use it to take courses on the Zollege app, zollege.com, or any other site hosted by Zollege.',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.3.link': {
    id: 'account.settings.delete.account.text.3.link',
    defaultMessage: 'follow the instructions for printing or downloading a certificate',
    description: 'This text will be a link to a technical support page; it will go in the phrase If you want to make a copy of these for your records, ______ .',
  },
  'account.settings.delete.account.text.warning': {
    id: 'account.settings.delete.account.text.warning',
    defaultMessage: 'Warning: Account deletion is permanent. Please read the above carefully before proceeding. This is an irreversible action, and you will no longer be able to use the same email on Zollege.',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.change.instead': {
    id: 'account.settings.delete.account.text.change.instead',
    defaultMessage: 'Want to change your email, name, or password instead?',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.button': {
    id: 'account.settings.delete.account.button',
    defaultMessage: 'Delete My Account',
    description: 'Button label to permanently delete your Zollege account',
  },
  'account.settings.delete.account.please.activate': {
    id: 'account.settings.delete.account.please.activate',
    defaultMessage: 'activate your account',
    description: 'This is the text on a link that goes to the support page.  It is part of this sentence: Before proceeding, please activate your account.',
  },
  'account.settings.delete.account.please.unlink': {
    id: 'account.settings.delete.account.please.unlink',
    defaultMessage: 'unlink all social media accounts',
    description: 'This is the text on a link that goes to the support page.  It is part of this sentence: Before proceeding, please unlink all social media accounts.',
  },
  'account.settings.delete.account.modal.header': {
    id: 'account.settings.delete.account.modal.header',
    defaultMessage: 'Are you sure?',
    description: 'Title of the dialog asking user to confirm that they want to delete their entire account',
  },
  'account.settings.delete.account.modal.text.1': {
    id: 'account.settings.delete.account.modal.text.1',
    defaultMessage: 'You have selected "Delete My Account". Deletion of your account and personal data is permanent and cannot be undone. Zollege will not be able to recover your account or the data that is deleted.',
    description: 'Messaging in the dialog asking user to confirm that they want to delete their entire account',
  },
  'account.settings.delete.account.modal.text.2': {
    id: 'account.settings.delete.account.modal.text.2',
    defaultMessage: 'If you proceed, you will be unable to use this account to take courses on the Zollege app, zollege.com, or any other site hosted by Zollege.',
    description: 'Messaging in the dialog asking user to confirm that they want to delete their entire account',
  },
  'account.settings.delete.account.modal.enter.password': {
    id: 'account.settings.delete.account.modal.enter.password',
    defaultMessage: 'If you still wish to continue and delete your account, please enter your account password:',
    description: 'Asking for the user\'s account password',
  },
  'account.settings.delete.account.modal.confirm.delete': {
    id: 'account.settings.delete.account.modal.confirm.delete',
    defaultMessage: 'Yes, Delete',
    description: 'Button label for user to confirm it is okay to delete their account',
  },
  'account.settings.delete.account.modal.confirm.cancel': {
    id: 'account.settings.delete.account.modal.confirm.cancel',
    defaultMessage: 'Cancel',
    description: 'The cancel button on the delete my account modal confirmation',
  },
  'account.settings.delete.account.error.unable.to.delete': {
    id: 'account.settings.delete.account.error.unable.to.delete',
    defaultMessage: 'Unable to delete account',
    description: 'Error message when account deletion failed',
  },
  'account.settings.delete.account.error.no.password': {
    id: 'account.settings.delete.account.error.no.password',
    defaultMessage: 'A password is required',
    description: 'Error message when user has not entered their password',
  },
  'account.settings.delete.account.error.unable.to.delete.details': {
    id: 'account.settings.delete.account.error.unable.to.delete.details',
    defaultMessage: 'Sorry, there was an error trying to process your request. Please try again later.',
    description: 'Error message when account deletion failed',
  },
  'account.settings.delete.account.modal.after.header': {
    id: 'account.settings.delete.account.modal.after.header',
    defaultMessage: 'We\'re sorry to see you go!  Your account will be deleted shortly.',
    description: 'Title displayed after user account is deleted',
  },
  'account.settings.delete.account.modal.after.text': {
    id: 'account.settings.delete.account.modal.after.text',
    defaultMessage: 'Account deletion, including removal from email lists, may take a few weeks to fully process through our system. If you want to opt-out of emails before then, please unsubscribe from the footer of any email.',
    description: 'Text displayed after user account is deleted',
  },
  'account.settings.delete.account.modal.after.button': {
    id: 'account.settings.delete.account.modal.after.button',
    defaultMessage: 'Close',
    description: 'Label on button to close a dialog',
  },
});

export default messages;
