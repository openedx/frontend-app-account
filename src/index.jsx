import 'babel-polyfill';
import 'url-polyfill';
import 'formdata-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  configureAnalytics,
  identifyAnonymousUser,
  identifyAuthenticatedUser,
  initializeSegment,
  sendPageEvent,
  sendTrackingLogEvent,
} from '@edx/frontend-analytics';
import { configureLoggingService, NewRelicLoggingService } from '@edx/frontend-logging';
import { getAuthenticatedAPIClient } from '@edx/frontend-auth';
import { configure as configureI18n } from '@edx/frontend-i18n';

import { configuration } from './environment';
import configureStore from './store';
import { configureUserAccountApiService } from './common';
import { configureService as configureAccountSettingsApiService } from './account-settings';
import messages from './i18n';

import './index.scss';
import App from './components/App';

const apiClient = getAuthenticatedAPIClient({
  appBaseUrl: configuration.BASE_URL,
  authBaseUrl: configuration.LMS_BASE_URL,
  loginUrl: configuration.LOGIN_URL,
  logoutUrl: configuration.LOGOUT_URL,
  csrfTokenApiPath: configuration.CSRF_TOKEN_API_PATH,
  refreshAccessTokenEndpoint: configuration.REFRESH_ACCESS_TOKEN_ENDPOINT,
  accessTokenCookieName: configuration.ACCESS_TOKEN_COOKIE_NAME,
  userInfoCookieName: configuration.USER_INFO_COOKIE_NAME,
  csrfCookieName: configuration.CSRF_COOKIE_NAME,
  loggingService: NewRelicLoggingService,
});

/**
 * We need to merge the application configuration with the authentication state
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

  return Object.assign({}, { configuration }, apiClient.getAuthenticationState(), { errors });
}

function configure() {
  configureI18n(configuration, messages);

  const { store, history } = configureStore(createInitialState(), configuration.ENVIRONMENT);

  configureLoggingService(NewRelicLoggingService);
  configureAccountSettingsApiService(configuration, apiClient);
  configureUserAccountApiService(configuration, apiClient);
  initializeSegment(configuration.SEGMENT_KEY);
  configureAnalytics({
    loggingService: NewRelicLoggingService,
    authApiClient: apiClient,
    analyticsApiBaseUrl: configuration.LMS_BASE_URL,
  });

  return {
    store,
    history,
  };
}

apiClient.ensurePublicOrAuthenticationAndCookies(
  window.location.pathname,
  (accessToken) => {
    const { store, history } = configure();

    ReactDOM.render(<App store={store} history={history} />, document.getElementById('root'));

    if (accessToken) {
      identifyAuthenticatedUser(accessToken.userId);
    } else {
      identifyAnonymousUser();
    }
    sendPageEvent();

    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: accessToken ? accessToken.userId : null,
    });
  },
);
