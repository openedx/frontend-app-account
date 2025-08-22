import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import 'formdata-polyfill';
import { Provider as ReduxProvider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { appId } from './constants';

import './app.scss';
import configureStore from './data/configureStore';

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <ReduxProvider store={configureStore()}>
      <main className="flex-grow-1" id="main">
        <Outlet />
      </main>
      { getAppConfig(appId).NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> }
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
