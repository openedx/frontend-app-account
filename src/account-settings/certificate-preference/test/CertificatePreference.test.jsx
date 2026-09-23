import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import messages from '@src/account-settings/certificate-preference/messages';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import { renderWithForm } from '@src/account-settings/test/renderWithForm';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

jest.mock('@src/account-settings/data/hooks');

import CertificatePreference from '@src/account-settings/certificate-preference/CertificatePreference'; // eslint-disable-line import/first

const formId = 'useVerifiedNameForCerts';
const labelText = messages['account.settings.field.name.checkbox.certificate.select'].defaultMessage;

const setData = ({ fullName = 'Ed X', verifiedName = 'edX Verified', useVerifiedNameForCerts = false } = {}) => {
  useAccountSettingsData.mockReturnValue({
    committedValues: { name: fullName },
    formValues: { useVerifiedNameForCerts },
    verifiedName: verifiedName ? { verified_name: verifiedName } : null,
  });
};

const renderComponent = (props = {}, form = {}) => renderWithForm(
  <CertificatePreference fieldName="name" {...props} />,
  {
    form: {
      updateDraft: jest.fn(), resetDrafts: jest.fn(), saveSettings: jest.fn(), closeForm: jest.fn(), ...form,
    },
  },
);

describe('CertificatePreference', () => {
  beforeEach(() => setData());

  afterEach(() => jest.clearAllMocks());

  it('does not render if there is no verified name', () => {
    setData({ verifiedName: '' });

    const { container } = renderComponent();

    expect(container).toBeEmptyDOMElement();
  });

  it('does not trigger modal when checking empty checkbox, and updates draft immediately', () => {
    setData({ useVerifiedNameForCerts: true });

    const { form } = renderComponent();

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(false);

    fireEvent.click(checkbox);

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(form.updateDraft).toHaveBeenCalledWith(formId, false);
  });

  it('triggers modal when attempting to uncheck checkbox', () => {
    const { form } = renderComponent();

    const checkbox = screen.getByLabelText(labelText);
    expect(checkbox.checked).toEqual(true);

    fireEvent.click(checkbox);
    expect(form.updateDraft).not.toHaveBeenCalled();

    screen.getByRole('radiogroup');
  });

  it('updates draft when changing radio value', () => {
    const { form } = renderComponent();

    fireEvent.click(screen.getByLabelText(labelText));

    const fullNameOption = screen.getByLabelText('Ed X (Full Name)');
    const verifiedNameOption = screen.getByLabelText('edX Verified (Verified Name)');
    expect(fullNameOption.checked).toEqual(true);
    expect(verifiedNameOption.checked).toEqual(false);

    fireEvent.click(verifiedNameOption);
    expect(form.updateDraft).toHaveBeenCalledWith(formId, true);
  });

  it('clears draft on cancel', () => {
    const { form } = renderComponent();

    fireEvent.click(screen.getByLabelText(labelText));
    fireEvent.click(screen.getByText('Cancel'));

    expect(form.resetDrafts).toHaveBeenCalled();
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  it('submits', () => {
    const { form } = renderComponent();

    fireEvent.click(screen.getByLabelText(labelText));
    fireEvent.click(screen.getByText('Choose name'));

    expect(form.saveSettings).toHaveBeenCalledWith(formId, false);
  });

  it('does not submit while a save is pending', () => {
    const { form } = renderComponent({}, { saveState: 'pending' });

    fireEvent.click(screen.getByLabelText(labelText));
    fireEvent.click(screen.getByText('Choose name'));

    expect(form.saveSettings).not.toHaveBeenCalled();
  });

  it('closes the modal and the field once the save completes', () => {
    const { form } = renderComponent({}, { saveState: 'complete' });

    fireEvent.click(screen.getByLabelText(labelText));

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(form.closeForm).toHaveBeenCalledWith('name');
  });

  it('checks box for verified name', () => {
    setData({ useVerifiedNameForCerts: true });

    renderComponent({ fieldName: 'verified_name' });

    expect(screen.getByLabelText(labelText).checked).toEqual(true);
  });
});
