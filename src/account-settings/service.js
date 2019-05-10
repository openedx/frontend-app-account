import pick from 'lodash.pick';
import omit from 'lodash.omit';
import isEmpty from 'lodash.isempty';
import applyConfiguration from '../common/serviceUtils';

let config = {
  ACCOUNTS_API_BASE_URL: null,
  PREFERENCES_API_BASE_URL: null,
  ECOMMERCE_API_BASE_URL: null,
  LMS_BASE_URL: null,
  PASSWORD_RESET_URL: null,
};

const SOCIAL_PLATFORMS = [
  { id: 'twitter', key: 'social_link_twitter' },
  { id: 'facebook', key: 'social_link_facebook' },
  { id: 'linkedin', key: 'social_link_linkedin' },
];

let apiClient = null;

export function configureApiService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

function unpackFieldErrors(fieldErrors) {
  const unpackedFieldErrors = fieldErrors;
  if (fieldErrors.social_links) {
    SOCIAL_PLATFORMS.forEach(({ key }) => {
      unpackedFieldErrors[key] = fieldErrors.social_links;
    });
  }
  return Object.entries(unpackedFieldErrors)
    .reduce((acc, [k, v]) => {
      acc[k] = v.user_message;
      return acc;
    }, {});
}

function unpackAccountResponseData(data) {
  const unpackedData = data;

  SOCIAL_PLATFORMS.forEach(({ id, key }) => {
    const platformData = data.social_links.find(({ platform }) => platform === id);
    unpackedData[key] = typeof platformData === 'object' ? platformData.social_link : '';
  });

  if (Array.isArray(data.language_proficiencies)) {
    if (data.language_proficiencies.length) {
      unpackedData.language_proficiencies = data.language_proficiencies[0].code;
    } else {
      unpackedData.language_proficiencies = '';
    }
  }

  return unpackedData;
}
function packAccountCommitData(commitData) {
  const packedData = commitData;

  SOCIAL_PLATFORMS.forEach(({ id, key }) => {
    if (commitData[key]) {
      packedData.social_links = [{ platform: id, social_link: commitData[key] }];
    }
    delete packedData[key];
  });

  if (commitData.language_proficiencies) {
    packedData.language_proficiencies = [{ code: commitData.language_proficiencies }];
  }
  return packedData;
}


function handleRequestError(error) {
  if (error.response && error.response.data.field_errors) {
    const apiError = Object.create(error);
    apiError.fieldErrors = unpackFieldErrors(error.response.data.field_errors);
    throw apiError;
  }
  throw error;
}

export async function getAccount(username) {
  const { data } = await apiClient.get(`${config.ACCOUNTS_API_BASE_URL}/${username}`);
  return unpackAccountResponseData(data);
}

export async function patchAccount(username, commitValues) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  };

  const { data } = await apiClient.patch(
    `${config.ACCOUNTS_API_BASE_URL}/${username}`,
    packAccountCommitData(commitValues),
    requestConfig,
  ).catch(handleRequestError);

  return unpackAccountResponseData(data);
}

export async function getPreferences(username) {
  const { data } = await apiClient.get(`${config.PREFERENCES_API_BASE_URL}/${username}`);
  return data;
}

export async function patchPreferences(username, commitValues) {
  const requestConfig = { headers: { 'Content-Type': 'application/merge-patch+json' } };
  const requestUrl = `${config.PREFERENCES_API_BASE_URL}/${username}`;

  // Ignore the success response, the API does not currently return any data.
  await apiClient.patch(requestUrl, commitValues, requestConfig)
    .catch(handleRequestError);

  return commitValues;
}

export async function getThirdPartyAuthProviders() {
  const { data } = await apiClient.get(`${config.LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${config.LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${config.LMS_BASE_URL}${disconnectUrl}`,
  }));
}

/**
 * Determine if the user's profile data is managed by a third-party identity provider.
 */
export async function getProfileDataManager(username, userRoles) {
  const userRoleNames = userRoles.map(role => role.split(':')[0]);

  if (userRoleNames.includes('enterprise_learner')) {
    const url = `${config.LMS_BASE_URL}/enterprise/api/v1/enterprise-learner/?username=${username}`;
    const { data } = await apiClient.get(url).catch(handleRequestError);

    if ('results' in data) {
      for (let i = 0; i < data.results.length; i += 1) {
        const enterprise = data.results[i].enterprise_customer;
        if (enterprise.sync_learner_profile_data) {
          return enterprise.name;
        }
      }
    }
  }

  return null;
}

/**
 * A single function to GET everything considered a setting.
 * Currently encapsulates Account, Preferences, and ThirdPartyAuth
 */
export async function getSettings(username, userRoles) {
  const results = await Promise.all([
    getAccount(username),
    getPreferences(username),
    getThirdPartyAuthProviders(),
    getProfileDataManager(username, userRoles),
  ]);

  return {
    ...results[0],
    ...results[1],
    thirdPartyAuthProviders: results[2],
    profileDataManager: results[3],
  };
}

/**
 * A single function to PATCH everything considered a setting.
 * Currently encapsulates Account, Preferences, and ThirdPartyAuth
 */
export async function patchSettings(username, commitValues) {
  // Note: time_zone exists in the return value from user/v1/accounts
  // but it is always null and won't update. It also exists in
  // user/v1/preferences where it does update. This is the one we use.
  const preferenceKeys = ['time_zone'];
  const accountCommitValues = omit(commitValues, preferenceKeys);
  const preferenceCommitValues = pick(commitValues, preferenceKeys);
  const patchRequests = [];

  if (!isEmpty(accountCommitValues)) {
    patchRequests.push(patchAccount(username, accountCommitValues));
  }
  if (!isEmpty(preferenceCommitValues)) {
    patchRequests.push(patchPreferences(username, preferenceCommitValues));
  }

  const results = await Promise.all(patchRequests);
  // Assigns in order of requests. Preference keys
  // will override account keys. Notably time_zone.
  const combinedResults = Object.assign({}, ...results);
  return combinedResults;
}

export async function postResetPassword(email) {
  const { data } = await apiClient
    .post(config.PASSWORD_RESET_URL, { email })
    .catch(handleRequestError);

  return data;
}
