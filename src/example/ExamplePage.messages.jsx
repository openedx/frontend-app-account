import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'example.page.heading': {
    id: 'example.page.heading',
    defaultMessage: 'Example Page',
    description: 'The page heading for a example page.',
  },
  'example.loading.message': {
    id: 'example.loading.message',
    defaultMessage: 'Loading',
    description: 'Message when data is being loaded',
  },
  'example.loading.error': {
    id: 'example.loading.error',
    defaultMessage: 'Error: {error}',
    description: 'Message when data failed to load',
  },
});

export default messages;
