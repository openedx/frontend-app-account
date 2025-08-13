import 'core-js/stable';
import 'regenerator-runtime/runtime';

import 'formdata-polyfill';
import { Provider as ReduxProvider } from 'react-redux';
import { CurrentAppProvider, SiteProvider } from '@openedx/frontend-base';
import { Outlet } from 'react-router-dom';
import { appId } from './constants';

/* import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer'; */

import configureStore from './data/configureStore';
import './app.scss';

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <ReduxProvider store={configureStore()}>
      {/*<div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Header />*/}
      <main className="flex-grow-1" id="main">
        <Outlet />
      </main>
      {/*<FooterSlot />
      </div>*/}
    </ReduxProvider>
  </CurrentAppProvider>
);

export default Main;


// TODO: remove comented code
/*
subscribe(APP_INIT_ERROR, (error) => {
  rootNode.render(<ErrorPage message={error.message} />);
});

initialize({
  messages,
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL,
        SHOW_EMAIL_CHANNEL: process.env.SHOW_EMAIL_CHANNEL || 'false',
        ENABLE_COPPA_COMPLIANCE: (process.env.ENABLE_COPPA_COMPLIANCE || false),
        ENABLE_ACCOUNT_DELETION: (process.env.ENABLE_ACCOUNT_DELETION !== 'false'),
        COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: JSON.parse(process.env.COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED || '[]'),
        ENABLE_DOB_UPDATE: (process.env.ENABLE_DOB_UPDATE || false),
        MARKETING_EMAILS_OPT_IN: (process.env.MARKETING_EMAILS_OPT_IN || false),
        PASSWORD_RESET_SUPPORT_LINK: process.env.PASSWORD_RESET_SUPPORT_LINK,
        LEARNER_FEEDBACK_URL: process.env.LEARNER_FEEDBACK_URL,
      }, 'App loadConfig override handler');
    },
  },
});
*/
