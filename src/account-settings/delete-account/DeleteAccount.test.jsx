import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider } from '@edx/frontend-i18n';

// Testing the modals separately, they just clutter up the snapshots if included here.
jest.mock('./ConfirmationModal');
jest.mock('./SuccessModal');

import DeleteAccount from './DeleteAccount'; // eslint-disable-line import/first

describe('DeleteAccount', () => {
  let props = {};

  beforeEach(() => {
    props = {
      hasLinkedTPA: false,
      isVerifiedAccount: true,
      logoutUrl: 'http://localhost/logout',
    };
  });

  it('should match default section snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <DeleteAccount
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
          <DeleteAccount
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
          <DeleteAccount
            {...props}
            hasLinkedTPA
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
