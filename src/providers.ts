import { AppProvider } from '@openedx/frontend-base';

import { QueryProvider } from './providers/QueryProvider';

const providers: AppProvider[] = [
  QueryProvider,
];

export default providers;
