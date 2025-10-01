import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { accountApp } from './src';

import './src/app.scss';

const siteConfig: SiteConfig = {
  siteId: 'account-dev',
  siteName: 'Account Dev',
  baseUrl: 'http://apps.local.openedx.io:1997',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  basename: '/account',
  apps: [
    shellApp,
    headerApp,
    footerApp,
    accountApp
  ],
  externalRoutes: [
    {
      role: 'org.openedx.frontend.role.profile',
      url: 'http://apps.local.openedx.io:1995/profile/'
    },
    {
      role: 'org.openedx.frontend.role.account',
      url: 'http://apps.local.openedx.io:1997/account/'
    },
    {
      role: 'org.openedx.frontend.role.logout',
      url: 'http://local.openedx.io:8000/logout'
    },
    {
      role: 'org.openedx.frontend.role.learnerDashboard',
      url: 'http://apps.local.openedx.io:1996/learner-dashboard'
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
