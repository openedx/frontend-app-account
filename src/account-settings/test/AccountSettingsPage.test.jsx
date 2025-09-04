import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { AppContext } from '@edx/frontend-platform/react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import AccountSettingsPage from '../AccountSettingsPage';
import mockData from './mockData';

const mockDispatch = jest.fn();
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackingLogEvent: jest.fn(),
  getCountryList: jest.fn(() => [{ code: 'US', name: 'United States' }]),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@edx/frontend-platform/auth');

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(() => ({
    SITE_NAME: 'edX',
    SUPPORT_URL: 'https://support.edx.org',
    ENABLE_ACCOUNT_DELETION: true,
    ENABLE_COPPA_COMPLIANCE: false,
    COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: [],
  })),
  getCountryList: jest.fn(() => [{ code: 'US', name: 'United States' }]),
  getLanguageList: jest.fn(() => [{ code: 'en', name: 'English' }]),
}));

const IntlAccountSettingsPage = injectIntl(AccountSettingsPage);

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('AccountSettingsPage', () => {
  let props = {};
  let store = {};
  const appContext = { locale: 'en', authenticatedUser: { userId: 3, roles: [] } };
  const reduxWrapper = children => (
    <AppContext.Provider value={appContext}>
      <Router>
        <IntlProvider locale="en">
          <Provider store={store}>
            {children}
          </Provider>
        </IntlProvider>
      </Router>
    </AppContext.Provider>
  );

  beforeEach(() => {
    store = mockStore(mockData);
    props = {
      loaded: true,
      siteLanguage: {},
      formValues: {
        username: 'test_username',
        accomplishments_shared: false,
        name: 'test_name',
        email: 'test_email@test.com',
        id: 534,
        extended_profile: [
          {
            field_name: 'work_experience',
            field_value: '',
          },
        ],
        country: 'US',
        level_of_education: 'b',
        gender: 'm',
        language_proficiencies: 'es',
        social_link_linkedin: 'https://linkedin.com/in/testuser',
        social_link_facebook: '',
        social_link_twitter: '',
        time_zone: 'America/New_York',
        state: 'NY',
        secondary_email_enabled: true,
        secondary_email: 'test_recovery@test.com',
        year_of_birth: '1990',
      },
      fetchSettings: jest.fn(),
      fetchSiteLanguages: jest.fn(),
      fetchNotificationPreferences: jest.fn(),
      saveSettings: jest.fn(),
      updateDraft: jest.fn(),
      beginNameChange: jest.fn(),
      saveMultipleSettings: jest.fn(),
      timeZoneOptions: [
        { label: 'America/New_York', value: 'America/New_York' },
      ],
      countryTimeZoneOptions: [
        { label: 'America/New_York', value: 'America/New_York' },
      ],
      siteLanguageOptions: [
        { label: 'English', value: 'en' },
      ],
      tpaProviders: [
        {
          id: 'oa2-google-oauth2',
          name: 'Google',
          connected: false,
          accepts_logins: true,
          connectUrl: 'http://localhost:18000/auth/login/google-oauth2/',
          disconnectUrl: 'http://localhost:18000/auth/disconnect/google-oauth2/',
        },
      ],
      isActive: true,
      staticFields: [],
      profileDataManager: null,
      verifiedName: null,
      mostRecentVerifiedName: {},
      verifiedNameHistory: [],
      countriesCodesList: ['US'],
    };
  });

  afterEach(() => jest.clearAllMocks());

  beforeAll(() => {
    global.lightningjs = {
      require: jest.fn().mockImplementation((module, url) => ({ moduleName: module, url })),
    };
  });

  afterAll(() => {
    delete global.lightningjs;
  });

  it('renders AccountSettingsPage correctly with editing enabled', async () => {
    const { getByText, rerender, getByLabelText } = render(reduxWrapper(<IntlAccountSettingsPage {...props} />));

    const workExperienceText = getByText('Work Experience');
    const workExperienceEditButton = workExperienceText.parentElement.querySelector('button');

    expect(workExperienceEditButton).toBeInTheDocument();

    store = mockStore({
      ...mockData,
      accountSettings: {
        ...mockData.accountSettings,
        openFormId: 'work_experience',
      },
    });
    rerender(reduxWrapper(<IntlAccountSettingsPage {...props} />));

    const submitButton = screen.getByText('Save');
    expect(submitButton).toBeInTheDocument();

    const workExperienceSelect = getByLabelText('Work Experience');

    // Use fireEvent.change to simulate changing the selected value
    fireEvent.change(workExperienceSelect, { target: { value: '4' } });

    fireEvent.click(submitButton);
  });

  it('renders Account Information section with correct field values', () => {
    render(reduxWrapper(<AccountSettingsPage {...props} />));

    expect(screen.getByText('test_username')).toBeInTheDocument();
    expect(screen.getByText('test_name')).toBeInTheDocument();
    expect(screen.getByText('test_email@test.com')).toBeInTheDocument();
    expect(screen.getByText('test_recovery@test.com')).toBeInTheDocument();
    expect(screen.getByText('1990')).toBeInTheDocument();
  });

  it('renders Profile Information section with correct field values', () => {
    render(reduxWrapper(<AccountSettingsPage {...props} />));

    expect(screen.getByText('Bachelor\'s Degree')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Add work experience')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('renders Social Media section with correct field values', () => {
    render(reduxWrapper(<AccountSettingsPage {...props} />));

    expect(screen.getByText('https://linkedin.com/in/testuser')).toBeInTheDocument();
    expect(screen.getByText('Add Facebook profile')).toBeInTheDocument();
    expect(screen.getByText('Add Twitter profile')).toBeInTheDocument();
  });

  it('renders Site Preferences section with correct field values', () => {
    render(reduxWrapper(<AccountSettingsPage {...props} />));

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('America/New_York')).toBeInTheDocument();
  });

  it('renders Delete Account section when enabled', () => {
    // eslint-disable-next-line global-require
    const { getConfig } = require('@edx/frontend-platform');
    jest.spyOn({ getConfig }, 'getConfig').mockImplementation(() => ({
      SITE_NAME: 'edX',
      SUPPORT_URL: 'https://support.edx.org',
      ENABLE_ACCOUNT_DELETION: true,
      ENABLE_COPPA_COMPLIANCE: false,
      COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: [],
    }));

    render(reduxWrapper(<AccountSettingsPage {...props} />));

    expect(screen.getByText('We\'re sorry to see you go!')).toBeInTheDocument();
  });

  it('does not render Delete Account section when disabled', () => {
    // eslint-disable-next-line global-require
    const { getConfig } = require('@edx/frontend-platform');
    jest.spyOn({ getConfig }, 'getConfig').mockImplementation(() => ({
      SITE_NAME: 'edX',
      SUPPORT_URL: 'https://support.edx.org',
      ENABLE_ACCOUNT_DELETION: false,
      ENABLE_COPPA_COMPLIANCE: false,
      COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: [],
    }));

    render(reduxWrapper(<AccountSettingsPage {...props} />));

    expect(screen.queryByText('We\'re sorry to see you go!')).not.toBeInTheDocument();
  });
});
