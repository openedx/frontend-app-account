import { authenticatedLoader, RoleRouteObject } from '@openedx/frontend-base';

import { accountRole, idVerificationRole } from '@src/constants';

// The lazy imports stay relative: tsc-alias takes the chunk name in the webpack comment for the
// module path, so an `@src` specifier there would survive into the published build unresolved.
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
          const module = await import(/* webpackChunkName: "account-id-verification" */ './slots/IdVerificationPageSlot');
          return { Component: module.default };
        },
      },
    ],
  },
];

export default routes;
