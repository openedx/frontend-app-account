/* eslint-disable no-import-assign */
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import * as auth from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import messages from '../messages';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import CertificatePreference from '../CertificatePreference'; // eslint-disable-line import/first

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@edx/frontend-platform/auth');
jest.mock('../../data/selectors', () => jest.fn().mockImplementation(() => ({ certPreferenceSelector: () => ({}) })));

const mockStore = configureStore();

describe('NameChange', () => {
  let props = {};
  let store = {};
  const formId = 'useVerifiedNameForCerts';
  const updateDraft = 'UPDATE_DRAFT';
  const labelText = messages['account.settings.field.name.checkbox.certificate.select'].defaultMessage;

  const reduxWrapper = children => (
    <Router>
      <IntlProvider locale="en">
        <Provider store={store}>{children}</Provider>
      </IntlProvider>
    </Router>
  );

  beforeEach(() => {
    store = mockStore();
    props = {
      fieldName: 'name',
      originalFullName: 'Ed X',
      originalVerifiedName: 'edX Verified',
      saveState: null,
      useVerifiedNameForCerts: false,
    };

    auth.getAuthenticatedHttpClient = jest.fn(() => ({
      patch: async () => ({
        data: { status: 200 },
        catch: () => {},
      }),
    }));
    auth.getAuthenticatedUser = jest.fn(() => ({ userId: 3 }));
  });

  afterEach(() => jest.clearAllMocks());

  it('does not render if there is no verified name', () => {
    props = {
      ...props,
      originalVerifiedName: '',
    };

    const wrapper = render(reduxWrapper(<CertificatePreference {...props} />));

    expect(wrapper).toMatchSnapshot();
  });

  it('does not trigger modal when checking empty checkbox, and updates draft immediately', () => {
    props = {
      ...props,
      useVerifiedNameForCerts: true,
    };

    render(reduxWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(false);

    fireEvent.click(checkbox);

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { name: formId, value: false },
      type: updateDraft,
    });
  });

  it('triggers modal when attempting to uncheck checkbox', () => {
    render(reduxWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(true);

    fireEvent.click(checkbox);
    expect(mockDispatch).not.toHaveBeenCalled();

    screen.getByRole('radiogroup');
  });

  it('updates draft when changing radio value', () => {
    render(reduxWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);

    const fullNameOption = screen.getByLabelText('Ed X (Full Name)');
    const verifiedNameOption = screen.getByLabelText('edX Verified (Verified Name)');
    expect(fullNameOption.checked).toEqual(true);
    expect(verifiedNameOption.checked).toEqual(false);

    fireEvent.click(verifiedNameOption);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { name: formId, value: true },
      type: updateDraft,
    });
  });

  it('clears draft on cancel', () => {
    render(reduxWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_DRAFTS' });
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  it('submits', () => {
    render(reduxWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);

    const submitButton = screen.getByText('Choose name');
    fireEvent.click(submitButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { formId, commitValues: false, extendedProfile: {} },
      type: 'ACCOUNT_SETTINGS__SAVE_SETTINGS',
    });
  });

  it('checks box for verified name', () => {
    props = {
      ...props,
      fieldName: 'verified_name',
      useVerifiedNameForCerts: true,
    };

    render(reduxWrapper(<CertificatePreference {...props} />));

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(true);
  });
});
