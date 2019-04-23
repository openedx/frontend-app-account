import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'feature.page.heading': {
    id: 'feature.page.heading',
    defaultMessage: 'Feature Page',
    description: 'The page heading for a feature page.',
  },
  'feature.loading.message': {
    id: 'feature.loading.message',
    defaultMessage: 'Loading',
    description: 'Message when data is being loaded',
  },
  'feature.loading.error': {
    id: 'feature.loading.error',
    defaultMessage: 'Error: {error}',
    description: 'Message when data failed to load',
  },
});

export default messages;
