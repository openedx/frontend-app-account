/* eslint-disable no-import-assign */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import { useSettingsFormDataState, useAccountSettings} from '../../hooks';

import { IntlProvider, initializeMockApp } from '@openedx/frontend-base';
import CertificatePreference from '../CertificatePreference';

// Mock the hooks module
jest.mock('../../hooks', () => ({
  useAccountSettings: jest.fn(),
  useSettingsFormDataState: jest.fn(),
}));

describe('CertificatePreference', () => {
  let props = {};
  let queryClient;
  let mockUpdateVerifiedName;
  let mockSaveSettingsMutate;
  const formId = 'useVerifiedNameForCerts';
  const labelText = 'If checked, this name will appear on your certificates and public-facing records.';

  const componentWrapper = children => (
    <Router>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          {children}
        </IntlProvider>
      </QueryClientProvider>
    </Router>
  );

  beforeEach(() => {
    // Create fresh mock functions for each test
    mockUpdateVerifiedName = jest.fn();
    mockSaveSettingsMutate = jest.fn();

    // Set up default mock implementations
    useAccountSettings.mockReturnValue({
      saveSettingsMutation: {
        mutate: mockSaveSettingsMutate,
      },
    });

    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        committedValues: {
          name: 'Ed X',
          verified_name: 'edX Verified',
        },
        formValues: {
          useVerifiedNameForCerts: false,
        },
        saveState: null,
        verifiedNameForCertsDraft: null,
      },
      closeForm: jest.fn(),
      updateVerifiedNameForCertsDraft: mockUpdateVerifiedName,
    });

    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    props = {
      fieldName: 'name',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if there is no verified name', () => {
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        committedValues: {
          name: 'Ed X',
          verified_name: '', // No verified name
        },
        formValues: {
          useVerifiedNameForCerts: false,
        },
        saveState: null,
        verifiedNameForCertsDraft: null,
      },
      closeForm: jest.fn(),
      updateVerifiedNameForCertsDraft: jest.fn(),
    });

    const { container } = render(componentWrapper(<CertificatePreference fieldName="name" />));

    // The component should not render anything when there's no verified name
    expect(container.firstChild).toBeNull();
    
    // Verify that no checkbox is rendered
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('does not trigger modal when checking empty checkbox, and updates draft immediately', () => {
    const mockUpdate = jest.fn();
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        committedValues: {
          name: 'Ed X',
          verified_name: 'Verified Name',
        },
        formValues: {
          useVerifiedNameForCerts: true,
        },
        saveState: null,
        verifiedNameForCertsDraft: null,
      },
      closeForm: jest.fn(),
      updateVerifiedNameForCertsDraft: mockUpdate,
    });

    render(componentWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(false);

    fireEvent.click(checkbox);

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(mockUpdate).toHaveBeenCalledWith(false);
  });

  it('triggers modal when attempting to uncheck checkbox', () => {
    render(componentWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(true);

    fireEvent.click(checkbox);
    expect(mockUpdateVerifiedName).not.toHaveBeenCalled();

    screen.getByRole('radiogroup');
  });

  it('updates draft when changing radio value', () => {
    render(componentWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);

    const fullNameOption = screen.getByLabelText('Ed X (Full Name)');
    const verifiedNameOption = screen.getByLabelText('edX Verified (Verified Name)');
    expect(fullNameOption.checked).toEqual(true);
    expect(verifiedNameOption.checked).toEqual(false);

    fireEvent.click(verifiedNameOption);
    expect(mockUpdateVerifiedName).toHaveBeenCalledWith(true);
  });

  it('clears draft on cancel', () => {
    render(componentWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockUpdateVerifiedName).toHaveBeenCalledWith(null);
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  it('submits', () => {
    render(componentWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);

    const submitButton = screen.getByText('Choose name');
    fireEvent.click(submitButton);
    expect(mockSaveSettingsMutate).toHaveBeenCalledWith({ formId, values: false });
  });

  it('checks box for verified name', () => {
    const localProps = {
      ...props,
      fieldName: 'verified_name',
    };
    useSettingsFormDataState.mockReturnValue({
      settingsFormDataState: {
        committedValues: {
          name: 'Ed X',
          verified_name: 'Ed X verified',
        },
        formValues: {
          useVerifiedNameForCerts: true,
        },
        saveState: null,
        verifiedNameForCertsDraft: null,
      },
      closeForm: jest.fn(),
      updateVerifiedNameForCertsDraft: jest.fn(),
    });

    render(componentWrapper(<CertificatePreference {...localProps} />));

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(true);
  });
});
