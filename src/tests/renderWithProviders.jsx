import React from 'react';
import PropTypes from 'prop-types';
// This module is only ever imported by tests.
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

/**
 * A QueryClient for tests: no retries, so failures surface immediately, and no cache retention
 * between tests. `defaultOptions.queries` can be extended, for instance with `staleTime: Infinity`
 * when a test seeds the cache and does not want a background refetch.
 */
export const createTestQueryClient = (queryOptions = {}) => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      ...queryOptions,
    },
    mutations: {
      retry: false,
    },
  },
});

export const createWrapper = ({
  queryClient = createTestQueryClient(),
  appContext = null,
  route = '/',
} = {}) => {
  const Wrapper = ({ children }) => {
    const tree = (
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[route]}>
            {children}
          </MemoryRouter>
        </IntlProvider>
      </QueryClientProvider>
    );

    return appContext
      ? <AppContext.Provider value={appContext}>{tree}</AppContext.Provider>
      : tree;
  };

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
};

/**
 * Renders `ui` inside the providers the app expects: react-query, i18n, a memory router and,
 * when `appContext` is given, frontend-platform's AppContext.
 */
export const renderWithProviders = (ui, {
  queryClient = createTestQueryClient(),
  appContext = null,
  route = '/',
  ...renderOptions
} = {}) => ({
  queryClient,
  ...render(ui, {
    wrapper: createWrapper({ queryClient, appContext, route }),
    ...renderOptions,
  }),
});

export default renderWithProviders;
