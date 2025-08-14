import { mergeSiteConfig } from '@openedx/frontend-base';
import '@testing-library/jest-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import siteConfig from 'site.config';

import MockedSlot from './tests/MockedSlot';

mergeSiteConfig(siteConfig);

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  Plugin: () => 'Plugin',
  Slot: MockedSlot,
}));
