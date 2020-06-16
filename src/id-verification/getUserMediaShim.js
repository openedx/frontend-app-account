/**
 * This polyfill is from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * Their description:
 * "Here's an example of using navigator.mediaDevices.getUserMedia(), with a
 * polyfill to cope with older browsers. Note that this polyfill does not
 * correct for legacy differences in constraints syntax, which means constraints
 * won't work well across browsers. It is recommended to use the adapter.js
 * polyfill instead, which does handle constraints."
 *
 * Despite the lack of support for differences in constraints we'll use this
 * since it's small and simple and we don't have a need for constraints at the
 * moment. I've added an export hasGetUserMediaSupport before the polyfill to
 * help us understand support before making calls to getUserMedia.
 */

// IIFE to check getUserMedia support. Must be run before the polyfill.
const hasGetUserMediaSupport = (() => {
  // Modern API
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return true;
  }
  // Deprecated APIs
  if (navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    return true;
  }
  return false;
})();

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  // eslint-disable-next-line func-names
  navigator.mediaDevices.getUserMedia = function (constraints) {
    // First get ahold of the legacy getUserMedia, if present
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    }));
  };
}

// eslint-disable-next-line import/prefer-default-export
export { hasGetUserMediaSupport };
