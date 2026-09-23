import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { accountApp } from './src';

import '@openedx/frontend-base/shell/style';

const siteConfig: SiteConfig = {
  siteId: 'account-dev',
  siteName: 'Account Dev',
  baseUrl: 'http://apps.local.openedx.io:1997',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    {
      ...accountApp,
      config: {
        SUPPORT_URL: 'http://local.openedx.io:8000/support',
        PASSWORD_RESET_SUPPORT_LINK: 'mailto:support@example.com',
        SHOW_PUSH_CHANNEL: true,
      },
    },
  ],
  externalRoutes: [
    {
      role: 'org.openedx.frontend.role.dashboard',
      url: 'http://apps.local.openedx.io:1996/learner-dashboard/',
    },
    {
      role: 'org.openedx.frontend.role.profile',
      url: 'http://apps.local.openedx.io:1995/profile/',
    },
    {
      role: 'org.openedx.frontend.role.logout',
      url: 'http://local.openedx.io:8000/logout',
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
