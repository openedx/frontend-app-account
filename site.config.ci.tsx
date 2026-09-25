import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { accountApp } from './src';

import '@openedx/frontend-base/shell/style';

const siteConfig: SiteConfig = {
  siteId: 'account-ci',
  siteName: 'Account CI',
  baseUrl: 'http://apps.local.openedx.io',
  lmsBaseUrl: 'http://local.openedx.io',
  loginUrl: 'http://local.openedx.io/login',
  logoutUrl: 'http://local.openedx.io/logout',

  environment: EnvironmentTypes.PRODUCTION,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    accountApp,
  ],
};

export default siteConfig;
