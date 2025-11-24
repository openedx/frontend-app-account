import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import { initialize, mergeConfig } from '@edx/frontend-platform';
import { MockAuthService } from '@edx/frontend-platform/auth';

import MockedPluginSlot from './tests/MockedPluginSlot';

jest.mock('@openedx/frontend-plugin-framework', () => ({
  ...jest.requireActual('@openedx/frontend-plugin-framework'),
  Plugin: () => 'Plugin',
  PluginSlot: MockedPluginSlot,
}));

mergeConfig({
  SUPPORT_URL: process.env.SUPPORT_URL || 'https://support.example.com',
  SHOW_PUSH_CHANNEL: process.env.SHOW_PUSH_CHANNEL || false,
  SHOW_EMAIL_CHANNEL: process.env.SHOW_EMAIL_CHANNEL || false,
  ENABLE_COPPA_COMPLIANCE: (process.env.ENABLE_COPPA_COMPLIANCE || false),
  ENABLE_ACCOUNT_DELETION: (process.env.ENABLE_ACCOUNT_DELETION !== 'false'),
  COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: JSON.parse(process.env.COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED || '[]'),
  ENABLE_DOB_UPDATE: (process.env.ENABLE_DOB_UPDATE || false),
  MARKETING_EMAILS_OPT_IN: (process.env.MARKETING_EMAILS_OPT_IN || false),
  PASSWORD_RESET_SUPPORT_LINK: process.env.PASSWORD_RESET_SUPPORT_LINK || 'https://support.example.com/password-reset',
  LEARNER_FEEDBACK_URL: process.env.LEARNER_FEEDBACK_URL || 'https://support.example.com/feedback',
}, 'App loadConfig override handler');

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        authenticatedUser: {
          userId: 'abc123',
          username: 'Mock User',
          roles: [],
          administrator: false,
        },
      });
    },
  },
  messages: [],
  authService: MockAuthService,
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
