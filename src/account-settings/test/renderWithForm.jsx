import React from 'react';
import PropTypes from 'prop-types';
// This module is only ever imported by tests.
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

import { createTestQueryClient, createWrapper } from '../../tests/renderWithProviders';
import { AccountSettingsFormContext } from '../data/FormContext';
import { initialFormState } from '../data/formReducer';

const noop = () => {};

/**
 * A stand-in for the form context, for leaf components that read from it. Every action is a
 * no-op unless the test supplies its own (usually a `jest.fn()`).
 */
export const createFormContextValue = (overrides = {}) => ({
  ...initialFormState,
  openForm: noop,
  closeForm: noop,
  updateDraft: noop,
  resetDrafts: noop,
  beginNameChange: noop,
  saveSettingsReset: noop,
  saveSettings: noop,
  saveMultipleSettings: noop,
  ...overrides,
});

/**
 * Renders `ui` inside the usual providers plus a stubbed form context built from `form`.
 */
export const renderWithForm = (ui, {
  form = {},
  queryClient = createTestQueryClient(),
  siteContext = null,
  route = '/',
  ...renderOptions
} = {}) => {
  const formValue = createFormContextValue(form);
  const Providers = createWrapper({ queryClient, siteContext, route });

  const Wrapper = ({ children }) => (
    <Providers>
      <AccountSettingsFormContext.Provider value={formValue}>
        {children}
      </AccountSettingsFormContext.Provider>
    </Providers>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return {
    form: formValue,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export default renderWithForm;
