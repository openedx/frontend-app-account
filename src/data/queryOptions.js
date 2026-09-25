/**
 * Retry policy for the app's queries.
 *
 * A 4xx will not get better by asking again, so it fails at once; anything else (network trouble,
 * a 5xx) gets react-query's usual three attempts. This lives on each query rather than on the
 * QueryClient because the frontend-base shell provides the client, with library defaults.
 */
export const isClientError = (error) => {
  const status = error?.response?.status;
  return status !== undefined && status >= 400 && status < 500;
};

export const retryUnlessClientError = (failureCount, error) => (
  !isClientError(error) && failureCount < 3
);
