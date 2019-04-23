import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'account.settings.page.heading': {
    id: 'account.settings.page.heading',
    defaultMessage: 'Account Settings',
    description: 'The page heading for the account settings page.',
  },
  'account.settings.loading.message': {
    id: 'account.settings.loading.message',
    defaultMessage: 'Loading',
    description: 'Message when data is being loaded',
  },
  'account.settings.loading.error': {
    id: 'account.settings.loading.error',
    defaultMessage: 'Error: {error}',
    description: 'Message when data failed to load',
  },
});

export default messages;
