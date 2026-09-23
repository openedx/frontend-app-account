import { getSiteConfig, mergeSiteConfig, setSiteConfig } from '@openedx/frontend-base';

import { dashboardRole, logoutRole } from './constants';
import { getDashboardUrl, getLogoutUrl } from './utils';

describe('route URLs', () => {
  let siteConfig;

  beforeEach(() => {
    siteConfig = getSiteConfig();
  });

  afterEach(() => {
    setSiteConfig(siteConfig);
  });

  describe('getDashboardUrl', () => {
    it('falls back to the LMS dashboard when the site provides no dashboard route', () => {
      expect(getDashboardUrl()).toBe(`${getSiteConfig().lmsBaseUrl}/dashboard`);
    });

    it('links to an external dashboard route', () => {
      mergeSiteConfig({
        externalRoutes: [{ role: dashboardRole, url: 'https://apps.example.com/learner-dashboard/' }],
      });

      expect(getDashboardUrl()).toBe('https://apps.example.com/learner-dashboard/');
    });

    it('links to the path of an installed dashboard app', () => {
      mergeSiteConfig({
        apps: [{
          appId: 'org.openedx.frontend.app.learnerDashboard',
          routes: [{ path: '/learner-dashboard', handle: { roles: [dashboardRole] } }],
        }],
      });

      expect(getDashboardUrl()).toBe('/learner-dashboard');
    });
  });

  describe('getLogoutUrl', () => {
    it('falls back to the configured logout URL when the site provides no logout route', () => {
      expect(getLogoutUrl()).toBe(getSiteConfig().logoutUrl);
    });

    it('links to the logout route', () => {
      mergeSiteConfig({
        externalRoutes: [{ role: logoutRole, url: 'https://sso.example.com/logout' }],
      });

      expect(getLogoutUrl()).toBe('https://sso.example.com/logout');
    });
  });
});
