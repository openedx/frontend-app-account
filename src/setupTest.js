import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import siteConfig from 'site.config';
import { mergeSiteConfig } from '@openedx/frontend-base';

import MockedPluginSlot from './tests/MockedPluginSlot';

mergeSiteConfig(siteConfig);

jest.mock('@openedx/frontend-plugin-framework', () => ({
  ...jest.requireActual('@openedx/frontend-plugin-framework'),
  Plugin: () => 'Plugin',
  PluginSlot: MockedPluginSlot,
}));
