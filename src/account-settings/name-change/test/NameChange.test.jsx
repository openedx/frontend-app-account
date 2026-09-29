import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getAuthenticatedUser } from '@openedx/frontend-base';

import { postVerifiedName } from '@src/account-settings/data/api';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import { renderWithForm } from '@src/account-settings/test/renderWithForm';
import { postNameChange } from '@src/account-settings/name-change/data/api';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

jest.mock('@src/account-settings/data/api');
jest.mock('@src/account-settings/data/hooks');
jest.mock('@src/account-settings/name-change/data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedUser: jest.fn(),
}));

import NameChange from '@src/account-settings/name-change/NameChange'; // eslint-disable-line import/first

const placeholder = 'Enter the name on your photo ID';

const renderNameChange = (props = {}, form = {}) => renderWithForm(
  <Routes>
    <Route path="/" element={<NameChange targetFormId="test_form" {...props} />} />
    <Route path="/id-verification" element={<div>IDV</div>} />
  </Routes>,
  { form: { closeForm: jest.fn(), saveSettingsReset: jest.fn(), ...form } },
);

describe('NameChange', () => {
  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue({ userId: 3, username: 'edx', name: 'Edx Profile' });
    useAccountSettingsData.mockReturnValue({
      formValues: {
        name: 'edx edx',
        verified_name: 'edX Verified',
      },
    });
    postNameChange.mockResolvedValue({});
    postVerifiedName.mockResolvedValue({});
  });

  afterEach(() => jest.clearAllMocks());

  it('renders populated input after clicking continue if verified_name in form data', async () => {
    const user = userEvent.setup();

    renderNameChange();
    expect(screen.queryByPlaceholderText(placeholder)).toBeNull();

    await user.click(screen.getByText('Continue'));

    expect(screen.getByPlaceholderText(placeholder).value).toBe('edX Verified');
  });

  it('renders empty input after clicking continue if verified_name not in form data', async () => {
    const user = userEvent.setup();

    useAccountSettingsData.mockReturnValue({ formValues: { name: 'edx edx' } });
    renderNameChange();

    await user.click(screen.getByText('Continue'));

    expect(screen.getByPlaceholderText(placeholder).value).toBe('');
  });

  it('requests a verified name on submit if targetForm is not "name"', async () => {
    const user = userEvent.setup();

    renderNameChange();

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.type(screen.getByPlaceholderText(placeholder), 'Verified Name');
    await user.click(screen.getByText('Continue'));

    await waitFor(() => expect(postVerifiedName).toHaveBeenCalledWith({
      username: 'edx',
      verified_name: 'Verified Name',
      profile_name: 'Edx Profile',
    }));
    expect(postNameChange).not.toHaveBeenCalled();
  });

  it('requests both a profile name change and a verified name if the targetForm is "name"', async () => {
    const user = userEvent.setup();

    renderNameChange({ targetFormId: 'name' });

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.type(screen.getByPlaceholderText(placeholder), 'Verified Name');
    await user.click(screen.getByText('Continue'));

    await waitFor(() => expect(postVerifiedName).toHaveBeenCalledWith({
      username: 'edx',
      verified_name: 'Verified Name',
      profile_name: 'edx edx',
    }));
    expect(postNameChange).toHaveBeenCalledWith('edx edx');
  });

  it('asks for a name when the input is empty', async () => {
    const user = userEvent.setup();

    renderNameChange();

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Please enter a valid name.')).toBeInTheDocument();
    expect(postVerifiedName).not.toHaveBeenCalled();
  });

  it('does not send another request while one is pending', async () => {
    const user = userEvent.setup();

    postVerifiedName.mockReturnValue(new Promise(() => {}));
    renderNameChange();

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.type(screen.getByPlaceholderText(placeholder), 'Verified Name');
    await user.click(screen.getByText('Continue'));
    await waitFor(() => expect(postVerifiedName).toHaveBeenCalledTimes(1));

    await user.click(screen.getByText('Continue'));
    expect(postVerifiedName).toHaveBeenCalledTimes(1);
  });

  it('shows the errors the LMS reports', async () => {
    const user = userEvent.setup();

    postVerifiedName.mockRejectedValue(Object.assign(new Error('bad'), {
      customAttributes: { httpErrorResponseData: JSON.stringify({ verified_name: 'Name is too long.' }) },
    }));
    renderNameChange();

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.type(screen.getByPlaceholderText(placeholder), 'Verified Name');
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Name is too long.')).toBeInTheDocument();
  });

  it('shows a general error for anything else', async () => {
    const user = userEvent.setup();

    postVerifiedName.mockRejectedValue(new Error('Network Error'));
    renderNameChange();

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.type(screen.getByPlaceholderText(placeholder), 'Verified Name');
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('A technical error occurred. Please try again.')).toBeInTheDocument();
  });

  it('closes the form and routes to IDV when the request succeeds', async () => {
    const user = userEvent.setup();

    const { form } = renderNameChange();

    await user.click(screen.getByText('Continue'));
    await user.clear(screen.getByPlaceholderText(placeholder));
    await user.type(screen.getByPlaceholderText(placeholder), 'Verified Name');
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('IDV')).toBeInTheDocument();
    expect(form.closeForm).toHaveBeenCalledWith('test_form');
    expect(form.saveSettingsReset).toHaveBeenCalled();
  });
});
