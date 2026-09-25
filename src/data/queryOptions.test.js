import { isClientError, retryUnlessClientError } from './queryOptions';

const withStatus = (status) => Object.assign(new Error(`HTTP ${status}`), { response: { status } });

describe('isClientError', () => {
  it('recognizes 4xx responses', () => {
    expect(isClientError(withStatus(400))).toBe(true);
    expect(isClientError(withStatus(403))).toBe(true);
    expect(isClientError(withStatus(499))).toBe(true);
  });

  it('does not treat anything else as a client error', () => {
    expect(isClientError(withStatus(500))).toBe(false);
    expect(isClientError(withStatus(302))).toBe(false);
    expect(isClientError(new Error('Network Error'))).toBe(false);
    expect(isClientError(undefined)).toBe(false);
  });
});

describe('retryUnlessClientError', () => {
  it('never retries a client error', () => {
    expect(retryUnlessClientError(0, withStatus(403))).toBe(false);
  });

  it('retries other failures up to three times', () => {
    const error = withStatus(503);
    expect(retryUnlessClientError(0, error)).toBe(true);
    expect(retryUnlessClientError(2, error)).toBe(true);
    expect(retryUnlessClientError(3, error)).toBe(false);
    expect(retryUnlessClientError(0, new Error('Network Error'))).toBe(true);
  });
});
