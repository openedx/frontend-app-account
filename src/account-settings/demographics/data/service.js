import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { convertData, TO, FROM } from './utils';

/**
 * post all of the data related to demographics.
 * @param {Number} userId users are identified in the api by LMS id
 * @param {Object} commitValues { demographics }
 */
export async function postDemographics(userId) {
  const requestUrl = `${getConfig().DEMOGRAPHICS_BASE_URL}/demographics/api/v1/demographics/`;
  const commitValues = { user: userId };
  let data = {};

  ({ data } = await getAuthenticatedHttpClient()
    .post(requestUrl, commitValues)
    .catch((error) => {
      const apiError = Object.create(error);
      throw apiError;
    }));

  return convertData(data, FROM);
}

/**
 * get all data related to the demographics.
 * @param {Number} userId users are identified in the api by LMS id
 */
export async function getDemographics(userId) {
  const requestUrl = `${getConfig().DEMOGRAPHICS_BASE_URL}/demographics/api/v1/demographics/${userId}/`;
  let data = {};
  // getDemographics() will run on Account page load. If the API call results in a '404' then follow up with a
  // POST call to the Demographics IDA to create an entity in the Demographics IDA for this user. After the 
  // entity is created all subsequent calls can be PATCH to begin answering the questions
  try {
    ({ data } = await getAuthenticatedHttpClient()
      .get(requestUrl));

    data = convertData(data, FROM);
  } catch (error) {
    if (error.response) {
      if (error.response.status == 404) {
        data = await postDemographics(userId);
      }
    }
  }

  return data;
}

/**
 * patch all of the data related to demographics.
 * @param {Number} userId users are identified in the api by LMS id
 * @param {Object} commitValues { demographics }
 */
export async function patchDemographics(userId, commitValues) {
  const requestUrl = `${getConfig().DEMOGRAPHICS_BASE_URL}/demographics/api/v1/demographics/${userId}/`;
  const convertedCommitValues = convertData(commitValues, TO);
  let data = {};

  ({ data } = await getAuthenticatedHttpClient()
    .patch(requestUrl, convertedCommitValues)
    .catch((error) => {
      const apiError = Object.create(error);
      throw apiError;
    }));

  return convertData(data, FROM);
}
