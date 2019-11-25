import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

// Testing the modals separately, they just clutter up the snapshots if included here.
jest.mock('./ConfirmationModal');
jest.mock('./SuccessModal');

import { DeleteAccount } from './DeleteAccount'; // eslint-disable-line import/first

const IntlDeleteAccount = injectIntl(DeleteAccount);

describe('DeleteAccount', () => {
  let props = {};

  beforeEach(() => {
    props = {
      deleteAccount: jest.fn(),
      deleteAccountConfirmation: jest.fn(),
      deleteAccountFailure: jest.fn(),
      deleteAccountReset: jest.fn(),
      deleteAccountCancel: jest.fn(),
      status: null,
      errorType: null,
      hasLinkedTPA: false,
      isVerifiedAccount: true,
    };
  });

  it('should match default section snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlDeleteAccount
            {...props}
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match unverified account section snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlDeleteAccount
            {...props}
            isVerifiedAccount={false}
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match unverified account section snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlDeleteAccount
            {...props}
            hasLinkedTPA
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
