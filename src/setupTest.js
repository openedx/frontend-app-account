import '@testing-library/jest-dom';

import { addAppConfigs, initializeMockApp } from '@openedx/frontend-base';

// Merges `site.config.test.tsx` into the site config, configures mock logging, auth and analytics
// services and the real i18n service, and signs in the user the legacy test setup used to provide.
initializeMockApp({
  authenticatedUser: {
    userId: 'abc123',
    username: 'Mock User',
    roles: [],
    administrator: false,
  },
});
addAppConfigs();

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
