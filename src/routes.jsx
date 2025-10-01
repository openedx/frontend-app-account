import AccountSettingsPage, { NotFoundPage } from './account-settings';
import IdVerificationPageSlot from './slots/IdVerificationPageSlot';
import Main from './Main';

const routes = [
  {
    id: 'org.openedx.frontend.route.account.main',
    Component: Main,
    children: [
        {
            path: '/',
            element: (<AccountSettingsPage />)
        },
        {
            path: '/notfound',
            element: (<NotFoundPage />)
        },
        {
            path: '/id-verification/*',
            element: (<IdVerificationPageSlot />)
        },
        {
            path: '*',
            element: (<NotFoundPage />)
        },
    ]
  }
];
export default routes;
