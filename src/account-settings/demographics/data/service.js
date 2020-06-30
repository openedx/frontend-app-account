import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { convertData, TO, FROM } from './utils';

/**
 *  If there was an error making the PATCH call then we create an apiError object containing a
 *  'demographicsError' fieldError. The content of the error itself isn't particularly important.
 *  This will trigger the `renderDemographicsServiceIssueWarningMessage()` (in
 *  DemographicsSection.jsx) to display an Alert to let the end-user know that there may be an
 *  issue communicating with the Demographics service.
 *
 * @param {Error} error
 */
export function createDemographicsError(error) {
  const apiError = Object.create(error);
  apiError.fieldErrors = {
    demographicsError: error.customAttributes.httpErrorType,
  };
  return apiError;
}

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
        gender: null,
        gender_description: null,
        income: null,
        learner_education_level: null,
        parent_education_level: null,
        military_history: null,
        work_status: null,
        work_status_description: null,
        current_work_sector: null,
        future_work_sector: null,
        user_ethnicity: [],
      };
    }
  }

  return convertData(data, FROM);
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
