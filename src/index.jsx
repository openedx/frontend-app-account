import 'babel-polyfill';
import 'url-polyfill';
import 'formdata-polyfill';
import { App, AppProvider, APP_ERROR, APP_READY, ErrorPage } from '@edx/frontend-base';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import configureStore from './data/configureStore';

import AccountSettingsPage, { NotFoundPage } from './account-settings';
import appMessages from './i18n';

import './index.scss';
import './assets/favicon.ico';

/**
 * We need to merge the application configuration with some initial state
 * so that we can hand it all to the redux store's initializer.
 */
function createInitialState() {
  const errors = {};
  const url = new URL(window.location.href);

  // Extract duplicate third-party auth provider message from query string
  errors.duplicateTpaProvider = url.searchParams.get('duplicate_provider');
  if (errors.duplicateTpaProvider) {
    // Remove the duplicate_provider query param to avoid bookmarking.
    window.history.replaceState(null, '', `${url.protocol}//${url.host}${url.pathname}`);
  }

  return { errors };
}

App.subscribe(APP_READY, () => {
  const store = configureStore(createInitialState());
  ReactDOM.render(
    <AppProvider store={store}>
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={AccountSettingsPage} />
          <Route path="/notfound" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

App.subscribe(APP_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

App.initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  overrideHandlers: {
    loadConfig: () => {
      App.mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL,
      }, 'App loadConfig override handler');
    },
  },
});
