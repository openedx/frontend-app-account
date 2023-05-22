import 'core-js/stable';
import 'regenerator-runtime/runtime';

import 'formdata-polyfill';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import {
  subscribe, initialize, APP_INIT_ERROR, APP_READY, mergeConfig,
} from '@edx/frontend-platform';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import configureStore from './data/configureStore';
import AccountSettingsPage, { NotFoundPage } from './account-settings';
import IdVerificationPage from './id-verification';
import CoachingConsent from './account-settings/coaching/CoachingConsent';
import messages from './i18n';

import './index.scss';
import Head from './head/Head';
import NotificationCourses from './notification-preferences/NotificationCourses';
import NotificationPreferences from './notification-preferences/NotificationPreferences';

subscribe(APP_READY, () => {
  const allowNotificationRoutes = false;
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Switch>
        <Route path="/coaching_consent" component={CoachingConsent} />
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <Header />
          <main className="flex-grow-1">
            <Switch>
              {allowNotificationRoutes && (
                <>
                  <Route path="/notifications/:courseId" component={NotificationPreferences} />
                  <Route path="/notifications" component={NotificationCourses} />
                </>
              )}
              <Route path="/id-verification" component={IdVerificationPage} />
              <Route exact path="/" component={AccountSettingsPage} />
              <Route path="/notfound" component={NotFoundPage} />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Switch>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL,
        COACHING_ENABLED: (process.env.COACHING_ENABLED || false),
        ENABLE_DEMOGRAPHICS_COLLECTION: (process.env.ENABLE_DEMOGRAPHICS_COLLECTION || false),
        DEMOGRAPHICS_BASE_URL: process.env.DEMOGRAPHICS_BASE_URL,
        ENABLE_COPPA_COMPLIANCE: (process.env.ENABLE_COPPA_COMPLIANCE || false),
        ENABLE_DOB_UPDATE: (process.env.ENABLE_DOB_UPDATE || false),
        MARKETING_EMAILS_OPT_IN: (process.env.MARKETING_EMAILS_OPT_IN || false),
        PASSWORD_RESET_SUPPORT_LINK: process.env.PASSWORD_RESET_SUPPORT_LINK,
      }, 'App loadConfig override handler');
    },
  },
});
