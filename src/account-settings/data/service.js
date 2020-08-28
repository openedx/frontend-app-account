import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import pick from 'lodash.pick';
import pickBy from 'lodash.pickby';
import omit from 'lodash.omit';
import isEmpty from 'lodash.isempty';

import { handleRequestError, unpackFieldErrors } from './utils';
import { getThirdPartyAuthProviders } from '../third-party-auth';
import { getCoachingPreferences, patchCoachingPreferences } from '../coaching/data/service';
import { getDemographics, getDemographicsOptions, patchDemographics } from '../demographics/data/service';
import { DEMOGRAPHICS_FIELDS } from '../demographics/data/utils';

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
    if (commitData[key] === undefined) return;

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

/**
 * A function to determine if the Demographics questions should be displayed to the user. For the
 * MVP release of Demographics we are limiting the Demographics question visibility only to
 * MicroBachelors learners.
 */
export async function shouldDisplayDemographicsQuestions() {
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/demographics/v1/demographics/status/`;
  let data = {};

  try {
    ({ data } = await getAuthenticatedHttpClient().get(requestUrl));
    if (data.display) {
      return data.display;
    }
  } catch (error) {
    // if there was an error then we just hide the section
    return false;
  }

  return false;
}

/**
 * A single function to GET everything considered a setting.
 * Currently encapsulates Account, Preferences, Coaching, ThirdPartyAuth, and Demographics
 */
export async function getSettings(username, userRoles, userId) {
  const results = await Promise.all([
    getAccount(username),
    getPreferences(username),
    getThirdPartyAuthProviders(),
    getProfileDataManager(username, userRoles),
    getTimeZones(),
    getConfig().COACHING_ENABLED && getCoachingPreferences(userId),
    getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && shouldDisplayDemographicsQuestions(),
    getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && getDemographics(userId),
    getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && getDemographicsOptions(),
  ]);

  return {
    ...results[0],
    ...results[1],
    thirdPartyAuthProviders: results[2],
    profileDataManager: results[3],
    timeZones: results[4],
    coaching: results[5],
    shouldDisplayDemographicsSection: results[6],
    ...results[7], // demographics
    demographicsOptions: results[8],
  };
}

/**
 * A single function to PATCH everything considered a setting.
 * Currently encapsulates Account, Preferences, coaching and ThirdPartyAuth
 */
export async function patchSettings(username, commitValues, userId) {
  // Note: time_zone exists in the return value from user/v1/accounts
  // but it is always null and won't update. It also exists in
  // user/v1/preferences where it does update. This is the one we use.
  const preferenceKeys = ['time_zone'];
  const coachingKeys = ['coaching'];
  const demographicsKeys = DEMOGRAPHICS_FIELDS;
  const isDemographicsKey = (value, key) => key.includes('demographics');
  const accountCommitValues = omit(commitValues, preferenceKeys, coachingKeys, demographicsKeys);
  const preferenceCommitValues = pick(commitValues, preferenceKeys);
  const coachingCommitValues = pick(commitValues, coachingKeys);
  const demographicsCommitValues = pickBy(commitValues, isDemographicsKey);
  const patchRequests = [];

  if (!isEmpty(accountCommitValues)) {
    patchRequests.push(patchAccount(username, accountCommitValues));
  }
  if (!isEmpty(preferenceCommitValues)) {
    patchRequests.push(patchPreferences(username, preferenceCommitValues));
  }
  if (!isEmpty(coachingCommitValues)) {
    patchRequests.push(patchCoachingPreferences(userId, coachingCommitValues));
  }
  if (!isEmpty(demographicsCommitValues)) {
    patchRequests.push(patchDemographics(userId, demographicsCommitValues));
  }

  const results = await Promise.all(patchRequests);
  // Assigns in order of requests. Preference keys
  // will override account keys. Notably time_zone.
  const combinedResults = Object.assign({}, ...results);
  return combinedResults;
}
