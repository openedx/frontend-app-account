import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import isEmpty from 'lodash.isempty';

import { handleRequestError, unpackFieldErrors } from './utils';
import { getThirdPartyAuthProviders } from '../third-party-auth';
import { postVerifiedNameConfig } from '../certificate-preference/data/service';

const SOCIAL_PLATFORMS = [
  { id: 'twitter', key: 'social_link_twitter' },
  { id: 'facebook', key: 'social_link_facebook' },
  { id: 'linkedin', key: 'social_link_linkedin' },
];

function unpackAccountResponseData(data) {
  const unpackedData = data;

  // This is handled by preferences
  delete unpackedData.time_zone;

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
    // Skip missing values. Empty strings are valid values and should be preserved.
    if (commitData[key] === undefined) {
      return;
    }

    packedData.social_links = [{ platform: id, social_link: commitData[key] }];
    delete packedData[key];
  });

  if (commitData.language_proficiencies !== undefined) {
    if (commitData.language_proficiencies) {
      packedData.language_proficiencies = [{ code: commitData.language_proficiencies }];
    } else {
      // An empty string should be sent as an array.
      packedData.language_proficiencies = [];
    }
  }

  if (commitData.year_of_birth !== undefined) {
    if (commitData.year_of_birth) {
      packedData.year_of_birth = commitData.year_of_birth;
    } else {
      // An empty string should be sent as null.
      packedData.year_of_birth = null;
    }
  }
  return packedData;
}

export async function getAccount(username) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${username}`);
  return unpackAccountResponseData(data);
}

export async function patchAccount(username, commitValues) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  };

  const { data } = await getAuthenticatedHttpClient()
    .patch(
      `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${username}`,
      packAccountCommitData(commitValues),
      requestConfig,
    )
    .catch((error) => {
      const unpackFunction = (fieldErrors) => {
        const unpackedFieldErrors = fieldErrors;
        if (fieldErrors.social_links) {
          SOCIAL_PLATFORMS.forEach(({ key }) => {
            unpackedFieldErrors[key] = fieldErrors.social_links;
          });
        }
        return unpackFieldErrors(unpackedFieldErrors);
      };
      handleRequestError(error, unpackFunction);
    });

  return unpackAccountResponseData(data);
}

export async function getPreferences(username) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`);
  return data;
}

export async function patchPreferences(username, commitValues) {
  const requestConfig = { headers: { 'Content-Type': 'application/merge-patch+json' } };
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`;

  // Ignore the success response, the API does not currently return any data.
  await getAuthenticatedHttpClient()
    .patch(requestUrl, commitValues, requestConfig).catch(handleRequestError);

  return commitValues;
}

export async function getTimeZones(forCountry) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/user_api/v1/preferences/time_zones/`, {
      params: { country_code: forCountry },
    })
    .catch(handleRequestError);

  return data;
}

/**
 * Determine if the user's profile data is managed by a third-party identity provider.
 */
export async function getProfileDataManager(username, userRoles) {
  const userRoleNames = userRoles.map(role => role.split(':')[0]);

  if (userRoleNames.includes('enterprise_learner')) {
    const url = `${getConfig().LMS_BASE_URL}/enterprise/api/v1/enterprise-learner/?username=${username}`;
    const { data } = await getAuthenticatedHttpClient().get(url).catch(handleRequestError);

    if (data.results.length > 0) {
      const enterprise = data.results[0] && data.results[0].enterprise_customer;
      // To ensure that enterprise returned is current enterprise & it manages profile settings
      if (enterprise && enterprise.sync_learner_profile_data) {
        return enterprise.name;
      }
    }
  }

  return null;
}

export async function getVerifiedName() {
  let data;
  const client = getAuthenticatedHttpClient();
  try {
    const requestUrl = `${getConfig().LMS_BASE_URL}/api/edx_name_affirmation/v1/verified_name`;
    ({ data } = await client.get(requestUrl));
  } catch (error) {
    return {};
  }

  return data;
}

export async function getVerifiedNameHistory() {
  let data;
  const client = getAuthenticatedHttpClient();
  try {
    const requestUrl = `${getConfig().LMS_BASE_URL}/api/edx_name_affirmation/v1/verified_name/history`;
    ({ data } = await client.get(requestUrl));
  } catch (error) {
    return {};
  }

  return data;
}

export async function postVerifiedName(data) {
  const requestConfig = { headers: { Accept: 'application/json' } };
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/edx_name_affirmation/v1/verified_name`;

  await getAuthenticatedHttpClient()
    .post(requestUrl, data, requestConfig)
    .catch(error => handleRequestError(error));
}

/**
 * A single function to GET everything considered a setting. Currently encapsulates Account, Preferences, and
 * ThirdPartyAuth.
 */
export async function getSettings(username, userRoles) {
  const [
    account,
    preferences,
    thirdPartyAuthProviders,
    profileDataManager,
    timeZones,
  ] = await Promise.all([
    getAccount(username),
    getPreferences(username),
    getThirdPartyAuthProviders(),
    getProfileDataManager(username, userRoles),
    getTimeZones(),
  ]);

  return {
    ...account,
    ...preferences,
    thirdPartyAuthProviders,
    profileDataManager,
    timeZones,
  };
}

/**
 * A single function to PATCH everything considered a setting.
 * Currently encapsulates Account, Preferences, ThirdPartyAuth
 */
export async function patchSettings(username, commitValues) {
  // Note: time_zone exists in the return value from user/v1/accounts
  // but it is always null and won't update. It also exists in
  // user/v1/preferences where it does update. This is the one we use.
  const preferenceKeys = ['time_zone'];
  const certificateKeys = ['useVerifiedNameForCerts'];
  const accountCommitValues = omit(
    commitValues,
    preferenceKeys,
    certificateKeys,
  );
  const preferenceCommitValues = pick(commitValues, preferenceKeys);
  const certCommitValues = pick(commitValues, certificateKeys);
  const patchRequests = [];

  if (!isEmpty(accountCommitValues)) {
    patchRequests.push(patchAccount(username, accountCommitValues));
  }
  if (!isEmpty(preferenceCommitValues)) {
    patchRequests.push(patchPreferences(username, preferenceCommitValues));
  }
  if (!isEmpty(certCommitValues)) {
    patchRequests.push(postVerifiedNameConfig(username, certCommitValues));
  }

  const results = await Promise.all(patchRequests);
  // Assigns in order of requests. Preference keys
  // will override account keys. Notably time_zone.
  const combinedResults = Object.assign({}, ...results);
  return combinedResults;
}

export async function getExtendedProfileFields(urlParams) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    params: urlParams,
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .get(
      `${getConfig().LMS_BASE_URL}/api/mfe_context`,
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });
  return {
    fields: data.optionalFields.extended_profile.map(
      (fieldName) => data.registrationFields.fields[fieldName],
    ) || [],
  };
}
