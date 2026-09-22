import {
  addAppConfigs, authenticatedLoader, getAppConfig, mergeSiteConfig,
} from '@openedx/frontend-base';
import siteConfig from 'site.config';

import app from './app';
import { accountRole, appId, idVerificationRole } from './constants';
import routes from './routes';
import slots from './slots';

const defaults = {
  SUPPORT_URL: null,
  SHOW_PUSH_CHANNEL: false,
  ENABLE_COPPA_COMPLIANCE: false,
  ENABLE_DOB_UPDATE: false,
  ENABLE_ACCOUNT_DELETION: true,
  COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: [],
  MARKETING_EMAILS_OPT_IN: false,
  PASSWORD_RESET_SUPPORT_LINK: null,
  SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT: 'https://help.edx.org/edxlearner/s/article/How-do-I-link-or-unlink-my-edX-account-to-a-social-media-account',
};

describe('accountApp', () => {
  it('declares the account appId, routes, and slots', () => {
    expect(app.appId).toBe(appId);
    expect(app.routes).toBe(routes);
    expect(app.slots).toBe(slots);
  });

  it('bundles the defaults that have to work out of the box', () => {
    expect(app.defaultConfig).toEqual(defaults);
  });

  it('leaves config to the operator', () => {
    expect(app.config).toBeUndefined();
  });
});

describe('routes', () => {
  const [main] = routes;

  it('mounts the settings page under the account role, behind authentication', () => {
    expect(main.path).toBe('account');
    expect(main.loader).toBe(authenticatedLoader);
    expect(main.handle?.roles).toEqual([accountRole]);
    expect(main.children?.find(route => route.index)).toBeDefined();
  });

  it('keeps ID verification at id-verification, where the LMS links to it', () => {
    const idVerification = main.children?.find(route => route.path === 'id-verification/*');
    expect(idVerification).toBeDefined();
    expect(idVerification?.handle?.roles).toEqual([idVerificationRole]);
  });

  it('lazy-loads the layout and the pages', async () => {
    const index = main.children?.find(route => route.index);
    const idVerification = main.children?.find(route => route.path === 'id-verification/*');

    await expect(main.lazy?.()).resolves.toEqual({ Component: (await import('./Main')).default });
    await expect(index?.lazy?.()).resolves.toEqual({
      Component: (await import('./account-settings/AccountSettingsPage')).default,
    });
    await expect(idVerification?.lazy?.()).resolves.toEqual({
      Component: (await import('./slots/IdVerificationPageSlot')).default,
    });
  });
});

describe('config resolution', () => {
  it('resolves the bundled defaults underneath the operator config', () => {
    mergeSiteConfig({ apps: [app] });
    addAppConfigs();

    const [testApp] = siteConfig.apps ?? [];
    expect(getAppConfig(appId)).toEqual({ ...defaults, ...testApp.config });
  });

  it('lets the operator per-app config beat a bundled default', () => {
    mergeSiteConfig({ apps: [{ ...app, config: { ENABLE_ACCOUNT_DELETION: false } }] });
    addAppConfigs();

    expect(getAppConfig(appId).ENABLE_ACCOUNT_DELETION).toBe(false);
    expect(getAppConfig(appId).SHOW_PUSH_CHANNEL).toBe(false);
  });
});
