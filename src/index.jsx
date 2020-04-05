import 'babel-polyfill';
import 'formdata-polyfill';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { subscribe, initialize, APP_INIT_ERROR, APP_READY, mergeConfig } from '@edx/frontend-platform';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import configureStore from './data/configureStore';
import AccountSettingsPage, { NotFoundPage } from './account-settings';
import CoachingConsent from './account-settings/coaching/CoachingConsent';
import appMessages from './i18n';

import './index.scss';
import './assets/favicon.ico';

const HeaderFooterLayout = ({ children }) => (
  <div>
    <Header />
      <main>
        {children}
      </main>
    <Footer />
  </div>
);

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Switch>
        <Route path="coaching_consent" component={CoachingConsent} />
        <HeaderFooterLayout>
          <Route exact path="" component={AccountSettingsPage} />
          <Route path="notfound" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </HeaderFooterLayout>
      </Switch>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL,
        COACHING_ENABLED: (process.env.COACHING_ENABLED || false),
      }, 'App loadConfig override handler');
    },
  },
});
