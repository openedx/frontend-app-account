import pick from 'lodash.pick';

export function applyConfiguration(expected, actual) {
  Object.keys(expected).forEach((key) => {
    if (actual[key] === undefined) {
      throw new Error(`Service configuration error: ${key} is required.`);
    }
  });
  return pick(actual, Object.keys(expected));
}

/**
 * Turns field errors of the form:
 *
 * {
 *   "name":{
 *     "developer_message": "Nerdy message here",
 *     "user_message": "This value is invalid."
 *   },
 *   "other_field": {
 *     "developer_message": "Other Nerdy message here",
 *     "user_message": "This other value is invalid."
 *   }
 * }
 *
 * Into:
 *
 * {
 *   "name": "This value is invalid.",
 *   "other_field": "This other value is invalid"
 * }
 */
export function unpackFieldErrors(fieldErrors) {
  return Object.entries(fieldErrors).reduce((acc, [k, v]) => {
    acc[k] = v.user_message;
    return acc;
  }, {});
}

/**
 * Processes and re-throws request errors.  If the response contains a field_errors field, will
 * massage the data into a form expected by the client.
 *
 * Field errors will be packaged as an api error with a fieldErrors field usable by the client.
 * Takes an optional unpack function which is used to process the field errors,
 * otherwise uses the default unpackFieldErrors function.
 *
 * @param error The original error object.
 * @param unpackFunction (Optional) A function to use to unpack the field errors as a replacement
 * for the default.
 */
export function handleRequestError(error, unpackFunction = unpackFieldErrors) {
  if (error.response && error.response.data.field_errors) {
    const apiError = Object.create(error);
    apiError.fieldErrors = unpackFunction(error.response.data.field_errors);
    throw apiError;
  }
  throw error;
}
