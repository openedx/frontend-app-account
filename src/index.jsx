import 'core-js/stable';
import 'regenerator-runtime/runtime';

import 'formdata-polyfill';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import {
  subscribe, initialize, APP_INIT_ERROR, APP_READY, mergeConfig,
} from '@edx/frontend-platform';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, Outlet } from 'react-router-dom';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import { datadogRum } from '@datadog/browser-rum';

import configureStore from './data/configureStore';
import AccountSettingsPage, { NotFoundPage } from './account-settings';
import IdVerificationPage from './id-verification';
import messages from './i18n';

import './index.scss';
import Head from './head/Head';
import NotificationCourses from './notification-preferences/NotificationCourses';
import NotificationPreferences from './notification-preferences/NotificationPreferences';

subscribe(APP_READY, () => {
  datadogRum.init({
    applicationId: 'a3f99dcb-4955-4baa-8341-39a88603ab08',
    clientToken: 'pubf2e79d946cec4c4413965620ba0e0b72',
    site: 'datadoghq.com',
    service: 'edx-frontend-sandbox',
    env: 'staging',
    // Specify a version number to identify the deployed version of your application in Datadog
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Routes>
        <Route element={(
          <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Header />
            <main className="flex-grow-1" id="main">
              <Outlet />
            </main>
            <Footer />
          </div>
        )}
        >
          <Route path="/notifications/:courseId" element={<NotificationPreferences />} />
          <Route path="/notifications" element={<NotificationCourses />} />
          <Route path="/id-verification/*" element={<IdVerificationPage />} />
          <Route path="/" element={<AccountSettingsPage />} />
          <Route path="/notfound" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
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
        ENABLE_DEMOGRAPHICS_COLLECTION: (process.env.ENABLE_DEMOGRAPHICS_COLLECTION || false),
        DEMOGRAPHICS_BASE_URL: process.env.DEMOGRAPHICS_BASE_URL,
        ENABLE_COPPA_COMPLIANCE: (process.env.ENABLE_COPPA_COMPLIANCE || false),
        ENABLE_ACCOUNT_DELETION: (process.env.ENABLE_ACCOUNT_DELETION !== 'false'),
        ENABLE_DOB_UPDATE: (process.env.ENABLE_DOB_UPDATE || false),
        MARKETING_EMAILS_OPT_IN: (process.env.MARKETING_EMAILS_OPT_IN || false),
        PASSWORD_RESET_SUPPORT_LINK: process.env.PASSWORD_RESET_SUPPORT_LINK,
        LEARNER_FEEDBACK_URL: process.env.LEARNER_FEEDBACK_URL,
      }, 'App loadConfig override handler');
    },
  },
});
