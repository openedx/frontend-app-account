import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import MockedPluginSlot from './tests/MockedPluginSlot';

jest.mock('@openedx/frontend-plugin-framework', () => ({
  ...jest.requireActual('@openedx/frontend-plugin-framework'),
  Plugin: () => 'Plugin',
  PluginSlot: MockedPluginSlot,
}));
