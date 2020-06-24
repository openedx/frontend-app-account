import { FROM, TO, convertData } from './utils';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

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
  
  try {
    ({ data } = await getAuthenticatedHttpClient()
      .get(requestUrl));

    data = convertData(data, FROM);
  } catch (error) {
    const apiError = Object.create(error);
    // if the API called resulted in this user receiving a 404 then follow up with a POST call to
    // create the demographics entity on the backend
    if (apiError.customAttributes.httpErrorStatus) {
      if (apiError.customAttributes.httpErrorStatus == 404) {
        data = await postDemographics(userId);
      } else {
        //apiError.fieldErrors.demographicsError = "error ocurred";
        demographicsFieldErrors = JSON.parse(error.customAttributes.httpErrorResponseData);
        apiError.fieldsErrors = {
          ...fieldsErrors,
          demographicsError: demographicsFieldErrors,
        }
        throw apiError;
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
      // TODO: I think we need similar error handling as the above?
      const apiError = Object.create(error);
      throw apiError;
    }));

  return convertData(data, FROM);
}
