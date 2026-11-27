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
 * Turns the `errors` of a v2 error body, which lists the messages for each refused property, or
 * for an item inside one such as `social_links[0].social_link`:
 *
 * {
 *   "name": ["This value is invalid."],
 *   "social_links[0].social_link": ["This field is required."]
 * }
 *
 * Into the field errors form above, with one message per property:
 *
 * {
 *   "name": { "user_message": "This value is invalid." },
 *   "social_links": { "user_message": "This field is required." }
 * }
 */
export function packErrors(errors) {
  return Object.entries(errors).reduce((acc, [name, messages]) => {
    const field = name.split(/[[.]/)[0];
    const message = [].concat(messages).join(' ');
    acc[field] = { user_message: acc[field] ? `${acc[field].user_message} ${message}` : message };
    return acc;
  }, {});
}

/**
 * Processes and re-throws request errors.  If the response contains a field_errors field, or the
 * `errors` of a v2 error body, will massage the data into a form expected by the client.
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
  const data = error.response?.data;
  let fieldErrors = data?.field_errors;
  if (!fieldErrors && data?.errors && Object.keys(data.errors).length) {
    fieldErrors = packErrors(data.errors);
  }
  if (fieldErrors) {
    const apiError = Object.create(error);
    apiError.fieldErrors = unpackFunction(fieldErrors);
    throw apiError;
  }
  throw error;
}
