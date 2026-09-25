import React from 'react';
import {
  fireEvent, screen, waitFor, within,
} from '@testing-library/react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { renderWithProviders } from '../../tests/renderWithProviders';
import { getNotificationPreferences } from '../../notification-preferences/data/api';
import {
  getAccount,
  getCountryList,
  getPreferences,
  getProfileDataManager,
  getTimeZones,
  getVerifiedNameHistory,
  patchSettings,
} from '../data/api';
import { getThirdPartyAuthError, getThirdPartyAuthProviders } from '../third-party-auth/data/api';
import AccountSettingsPage from '../AccountSettingsPage';
import messages from '../AccountSettingsPage.messages';

jest.mock('../data/api');
jest.mock('../third-party-auth/data/api');
jest.mock('../../notification-preferences/data/api');
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackingLogEvent: jest.fn(),
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  ...jest.requireActual('@edx/frontend-platform/auth'),
  getAuthenticatedUser: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(),
}));
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getCountryList: jest.fn(() => [{ code: 'US', name: 'United States' }]),
  getLanguageList: jest.fn(() => [{ code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }]),
}));

const config = {
  SITE_NAME: 'edX',
  SUPPORT_URL: 'https://support.edx.org',
  ENABLE_ACCOUNT_DELETION: true,
  ENABLE_COPPA_COMPLIANCE: false,
  COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: [],
};

const user = { username: 'test_username', userId: 3, roles: [] };

const account = {
  username: 'test_username',
  accomplishments_shared: false,
  name: 'test_name',
  email: 'test_email@test.com',
  id: 534,
  is_active: true,
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
  social_link_x: '',
  state: 'NY',
  secondary_email_enabled: true,
  secondary_email: 'test_recovery@test.com',
  year_of_birth: '1990',
};

const timeZones = [{ time_zone: 'America/New_York', description: 'America/New_York (EST, UTC-0500)' }];

const renderPage = () => renderWithProviders(<AccountSettingsPage />, {
  appContext: { locale: 'en', authenticatedUser: user },
});

const findLoadedPage = () => screen.findByText('test_username');

describe('AccountSettingsPage', () => {
  beforeAll(() => {
    global.lightningjs = {
      require: jest.fn().mockImplementation((module, url) => ({ moduleName: module, url })),
    };
  });

  afterAll(() => {
    delete global.lightningjs;
  });

  beforeEach(() => {
    getConfig.mockReturnValue(config);
    getAuthenticatedUser.mockReturnValue(user);
    getAccount.mockResolvedValue(account);
    getPreferences.mockResolvedValue({ time_zone: 'America/New_York', 'pref-lang': 'en' });
    getVerifiedNameHistory.mockResolvedValue({ use_verified_name_for_certs: false, results: [] });
    getProfileDataManager.mockResolvedValue(null);
    getTimeZones.mockResolvedValue(timeZones);
    getCountryList.mockResolvedValue(['US']);
    getThirdPartyAuthProviders.mockResolvedValue([{
      id: 'oa2-google-oauth2',
      name: 'Google',
      connected: false,
      accepts_logins: true,
      connectUrl: 'http://localhost:18000/auth/login/google-oauth2/',
      disconnectUrl: 'http://localhost:18000/auth/disconnect/google-oauth2/',
    }]);
    getThirdPartyAuthError.mockResolvedValue(null);
    getNotificationPreferences.mockResolvedValue({ show_preferences: false, data: {} });
    patchSettings.mockImplementation(async (username, commitData) => commitData);
  });

  afterEach(() => jest.clearAllMocks());

  it('shows a loading indicator until the settings arrive', async () => {
    renderPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
    await findLoadedPage();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('edits and saves a field', async () => {
    renderPage();
    await findLoadedPage();

    const workExperienceText = screen.getByText('Work Experience');
    fireEvent.click(within(workExperienceText.parentElement).getByRole('button'));

    const workExperienceSelect = screen.getByLabelText('Work Experience');
    fireEvent.change(workExperienceSelect, { target: { value: '4' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(patchSettings).toHaveBeenCalledWith(
      'test_username',
      { extended_profile: [{ field_name: 'work_experience', field_value: '4' }] },
      3,
    ));
    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
  });

  it('renders Account Information section with correct field values', async () => {
    renderPage();
    await findLoadedPage();

    expect(screen.getByText('test_name')).toBeInTheDocument();
    expect(screen.getByText('test_email@test.com')).toBeInTheDocument();
    expect(screen.getByText('test_recovery@test.com')).toBeInTheDocument();
    expect(screen.getByText('1990')).toBeInTheDocument();
  });

  it('renders Profile Information section with correct field values', async () => {
    renderPage();
    await findLoadedPage();

    expect(screen.getByText('Bachelor\'s Degree')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Add work experience')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });

  it('renders Social Media section with correct field values', async () => {
    renderPage();
    await findLoadedPage();

    expect(screen.getByText('https://linkedin.com/in/testuser')).toBeInTheDocument();
    expect(screen.getByText('Add Facebook profile')).toBeInTheDocument();
    expect(screen.getByText(messages['account.settings.field.social.platform.name.xTwitter.empty'].defaultMessage)).toBeInTheDocument();
  });

  it('renders Site Preferences section with correct field values', async () => {
    renderPage();
    await findLoadedPage();

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('America/New_York')).toBeInTheDocument();
  });

  it('renders Delete Account section when enabled', async () => {
    renderPage();
    await findLoadedPage();

    expect(screen.getByText('We\'re sorry to see you go!')).toBeInTheDocument();
  });

  it('does not render Delete Account section when disabled', async () => {
    getConfig.mockReturnValue({ ...config, ENABLE_ACCOUNT_DELETION: false });
    renderPage();
    await findLoadedPage();

    expect(screen.queryByText('We\'re sorry to see you go!')).not.toBeInTheDocument();
  });

  it('renders the third-party auth error message reported by the LMS', async () => {
    getThirdPartyAuthError.mockResolvedValue('The Google account you selected is already linked to another edX account.');
    renderPage();
    await findLoadedPage();

    expect(
      screen.getByText('The Google account you selected is already linked to another edX account.'),
    ).toBeInTheDocument();
  });

  it('does not render a third-party auth error message when there is none', async () => {
    renderPage();
    await findLoadedPage();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders a graceful loading error message instead of raw error text', async () => {
    getAccount.mockRejectedValue(Object.assign(
      new Error('Missing required request headers: x-enterprise-uuid'),
      { response: { status: 403 } },
    ));
    renderPage();

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We could not load this page. Refresh the page and try again.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /support/ })).not.toBeInTheDocument();
    expect(screen.queryByText('Missing required request headers: x-enterprise-uuid')).not.toBeInTheDocument();
  });
});
