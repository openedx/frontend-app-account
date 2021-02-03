import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import get from 'lodash.get';
import { convertData, TO, FROM } from './utils';

/**
 * Utility method that attempts to extract errors from the response of a PATCH request in order to
 * display a warning or otherwise meaningful message to the user.
 *
 * @param {Error} error
 */
export function createDemographicsError(error) {
  const apiError = Object.create(error);
  // If the error received has the `httpResponseData` field in it, then we should have reason to
  // believe the Demographics service is alive and responding. Extract errors from fields where
  // appropriate so we can display them to the user.
  if (get(error, 'customAttributes.httpErrorResponseData')) {
    apiError.fieldErrors = JSON.parse(error.customAttributes.httpErrorResponseData);
    if (get(apiError, 'fieldErrors.gender_description')) {
      // eslint-disable-next-line prefer-destructuring
      apiError.fieldErrors.demographics_gender = apiError.fieldErrors.gender_description[0];
      delete apiError.fieldErrors.gender_description;
    } else if (get(apiError, 'fieldErrors.work_status_description')) {
      // eslint-disable-next-line prefer-destructuring
      apiError.fieldErrors.demographics_work_status = apiError.fieldErrors.work_status_description[0];
      delete apiError.fieldErrors.work_status_description;
    }
  // Otherwise, when the service is down, the error response will not contain a
  // `httpErrorResponseData` field. Add a generic 'demographicsError' field to the fieldErrors that
  // will trigger showing an Alert to the user to them them know the update was unsuccessful.
  } else {
    apiError.fieldErrors = {
      demographicsError: error.customAttributes.httpErrorType,
    };
  }

  return apiError;
}

/**
 * post all of the data related to demographics.
 * @param {Number} userId users are identified in the api by LMS id
 * @param {Object} commitValues { demographics }
 */
export async function postDemographics(userId) {
  const requestConfig = { headers: { 'Content-Type': 'application/json' } };
  const requestUrl = `${getConfig().DEMOGRAPHICS_BASE_URL}/demographics/api/v1/demographics/`;
  const commitValues = { user: userId };
  let data = {};

  ({ data } = await getAuthenticatedHttpClient()
    .post(requestUrl, commitValues, requestConfig)
    .catch((error) => {
      const apiError = createDemographicsError(error);
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
    // try and create the demographics entity on the backend
    if (apiError.customAttributes.httpErrorStatus) {
      if (apiError.customAttributes.httpErrorStatus === 404) {
        data = await postDemographics(userId);
      }
    } else {
      data = {
        user: userId,
        demographics_gender: '',
        demographics_gender_description: '',
        demographics_income: '',
        demographics_learner_education_level: '',
        demographics_parent_education_level: '',
        demographics_military_history: '',
        demographics_work_status: '',
        demographics_work_status_description: '',
        demographics_current_work_sector: '',
        demographics_future_work_sector: '',
        demographics_user_ethnicity: [],
      };
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
      const apiError = createDemographicsError(error);
      throw apiError;
    }));

  return convertData(data, FROM);
}

/**
 * retrieve the options for each field from the Demographics API
 */
export async function getDemographicsOptions() {
  const requestUrl = `${getConfig().DEMOGRAPHICS_BASE_URL}/demographics/api/v1/demographics/`;
  let data = {};

  try {
    ({ data } = await getAuthenticatedHttpClient().options(requestUrl));
  } catch (error) {
    // We are catching and suppressing errors here on purpose. If an error occurs during the
    // getDemographicsOptions call we will pass back an empty `data` object. Downstream we make
    // the assumption that if the demographicsOptions object is empty that there was an issue or
    // error communicating with the service/API.
  }

  return data;
}
