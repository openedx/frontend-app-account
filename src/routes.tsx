import { authenticatedLoader, RoleRouteObject } from '@openedx/frontend-base';

import { accountRole, idVerificationRole } from './constants';

const routes: RoleRouteObject[] = [
  {
    id: 'org.openedx.frontend.route.account.main',
    path: 'account',
    loader: authenticatedLoader,
    handle: {
      roles: [accountRole],
    },
    async lazy() {
      const module = await import(/* webpackChunkName: "account-main" */ './Main');
      return { Component: module.default };
    },
    children: [
      {
        index: true,
        async lazy() {
          const module = await import(/* webpackChunkName: "account-settings" */ './account-settings/AccountSettingsPage');
          return { Component: module.default };
        },
      },
      {
        // The LMS links to `${ACCOUNT_MICROFRONTEND_URL}/id-verification`, so this path is fixed.
        path: 'id-verification/*',
        handle: {
          roles: [idVerificationRole],
        },
        async lazy() {
          const module = await import(/* webpackChunkName: "account-id-verification" */ './plugin-slots/IdVerificationPageSlot');
          return { Component: module.default };
        },
      },
    ],
  },
];

export default routes;
