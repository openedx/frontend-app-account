import { ContextType, ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getSiteConfig, IntlProvider, SiteContext } from '@openedx/frontend-base';

type SiteContextValue = ContextType<typeof SiteContext>;

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

interface WrapperOptions {
  queryClient?: QueryClient;
  siteContext?: Partial<SiteContextValue> | null;
  route?: string;
}

export const createWrapper = ({
  queryClient = createTestQueryClient(),
  siteContext = null,
  route = '/',
}: WrapperOptions = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    const tree = (
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[route]}>
            {children}
          </MemoryRouter>
        </IntlProvider>
      </QueryClientProvider>
    );

    if (!siteContext) {
      return tree;
    }

    const value: SiteContextValue = {
      authenticatedUser: null,
      siteConfig: getSiteConfig(),
      locale: 'en',
      ...siteContext,
    };

    return <SiteContext.Provider value={value}>{tree}</SiteContext.Provider>;
  };

  return Wrapper;
};

type RenderWithProvidersOptions = WrapperOptions & Omit<RenderOptions, 'wrapper'>;

/**
 * Renders `ui` inside the providers the app expects: react-query, i18n, a memory router and,
 * when `siteContext` is given, frontend-base's SiteContext.
 */
export const renderWithProviders = (ui: ReactElement, {
  queryClient = createTestQueryClient(),
  siteContext = null,
  route = '/',
  ...renderOptions
}: RenderWithProvidersOptions = {}) => ({
  queryClient,
  ...render(ui, {
    wrapper: createWrapper({ queryClient, siteContext, route }),
    ...renderOptions,
  }),
});

export default renderWithProviders;
