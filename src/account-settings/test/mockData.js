const mockData = {
  accountSettings: {
    loading: false,
    loaded: true,
    loadingError: null,
    data: null,
    values: {
      username: 'test_username',
      country: 'AD',
      accomplishments_shared: false,
      name: 'test_name',
      email: 'test_email@test.com',
      id: 533,
      verified_name: null,
      extended_profile: [
        {
          field_name: 'work_experience',
          field_value: '',
        },
      ],
      gender: null,
      'pref-lang': 'en',
    },
    errors: {},
    confirmationValues: {},
    drafts: {},
    saveState: null,
    timeZones: [
      {
        time_zone: 'Africa/Abidjan',
        description: 'Africa/Abidjan (GMT, UTC+0000)',
      },
    ],
    countryTimeZones: [
      {
        time_zone: 'Europe/Andorra',
        description: 'Europe/Andorra (CET, UTC+0100)',
      },
    ],
    previousSiteLanguage: null,
    deleteAccount: {
      status: null,
      errorType: null,
    },
    siteLanguage: {
      loading: false,
      loaded: true,
      loadingError: null,
      siteLanguageList: [
        {
          code: 'en',
          name: 'English',
          released: true,
        },
      ],
    },
    resetPassword: {
      status: null,
    },
    nameChange: {
      saveState: null,
      errors: {},
    },
    thirdPartyAuth: {
      providers: [
        {
          id: 'oa2-google-oauth2',
          name: 'Google',
          connected: false,
          accepts_logins: true,
          connectUrl: 'http://localhost:18000/auth/login/google-oauth2/?auth_entry=account_settings&next=%2Faccount%2Fsettings',
          disconnectUrl: 'http://localhost:18000/auth/disconnect/google-oauth2/?',
        },
      ],
      disconnectionStatuses: {},
      errors: {},
    },
    verifiedName: null,
    mostRecentVerifiedName: {},
    verifiedNameHistory: {
      use_verified_name_for_certs: false,
      results: [],
    },
    profileDataManager: null,
  },
  notificationPreferences: {
    showPreferences: false,
    courses: {
      status: 'success',
      courses: [],
      pagination: {
        count: 0,
        currentPage: 1,
        hasMore: false,
        totalPages: 1,
      },
    },
    preferences: {
      status: 'idle',
      updatePreferenceStatus: 'idle',
      selectedCourse: null,
      preferences: [],
      apps: [],
      nonEditable: {},
    },
  },
};

export default mockData;
