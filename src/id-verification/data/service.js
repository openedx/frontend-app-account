import qs from 'qs';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Get ID verification status from LMS.
 *
 * Returns {
 *  status: String,
 *  expires: String|null,
 *  canVerify: Boolean,
 * }
 */
export async function getExistingIdVerification() {
  const url = `${getConfig().LMS_BASE_URL}/verify_student/status/`;
  const requestConfig = {
    headers: { Accept: 'application/json' },
  };
  try {
    const response = await getAuthenticatedHttpClient().get(url, requestConfig);
    return {
      status: response.data.status || null,
      expires: response.data.expires || null,
      canVerify: response.data.can_verify || false,
    };
  } catch (e) {
    return { status: null, expires: null, canVerify: false };
  }
}

/**
 * Get the learner's enrollments. Used to check whether the learner is enrolled
 * in a verified course mode.
 *
 * Returns an array: [{...data, mode: String}]
 */
export async function getEnrollments() {
  const url = `${getConfig().LMS_BASE_URL}/api/enrollment/v1/enrollment`;
  const requestConfig = {
    headers: { Accept: 'application/json' },
  };
  try {
    const { data } = await getAuthenticatedHttpClient().get(url, requestConfig);
    return data;
  } catch (e) {
    return {};
  }
}

/**
 * Submit ID verifiction to LMS.
 *
 * verificationData should take the shape of:
 *   - facePhotoFile (String): Base64-encoded image.
 *   - idPhotoFile (String|null): Optional Base64-encoded image
 *   - idPhotoName (String|null): Optional string to change the user's name to.
 *   - courseRunKey (String|null): Optional course run to redirect to.
 *
 * Returns { success: Boolean, message: String|null }
 */
export async function submitIdVerification(verificationData) {
  const keyMap = {
    facePhotoFile: 'face_image',
    idPhotoFile: 'photo_id_image',
    idPhotoName: 'full_name',
  };
  const postData = {};
  // Don't include blank/null/undefined values.
  // Note that this will also drop the value `false`.
  Object.keys(keyMap).forEach((jsKey) => {
    const apiKey = keyMap[jsKey];
    if (verificationData[jsKey]) {
      postData[apiKey] = verificationData[jsKey];
    }
  });

  const url = `${getConfig().LMS_BASE_URL}/verify_student/submit-photos/`;
  const urlEncodedPostData = qs.stringify(postData);
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  try {
    await getAuthenticatedHttpClient().post(url, urlEncodedPostData, requestConfig);
    return { success: true, message: null };
  } catch (e) {
    return {
      success: false,
      status: e.customAttributes.httpErrorStatus,
      message: String(e),
    };
  }
}
