import { addAppConfigs, mergeSiteConfig } from '@openedx/frontend-base';
import '@testing-library/jest-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import siteConfig from 'site.config';

mergeSiteConfig(siteConfig);
addAppConfigs();
