/* eslint-disable react/jsx-no-useless-fragment */
import renderer from 'react-test-renderer';
import { IntlProvider } from '@edx/frontend-platform/i18n';

// Testing the modals separately, they just clutter up the snapshots if included here.
jest.mock('./ConfirmationModal', () => function ConfirmationModalMock() {
  return <></>;
});
jest.mock('./SuccessModal', () => function SuccessModalMock() {
  return <></>;
});

jest.mock('./data/actions', () => ({
  deleteAccount: jest.fn(),
  deleteAccountConfirmation: jest.fn(),
  deleteAccountFailure: jest.fn(),
  deleteAccountReset: jest.fn(),
  deleteAccountCancel: jest.fn(),
}));

import { DeleteAccount } from './DeleteAccount'; // eslint-disable-line import/first

describe('DeleteAccount', () => {
  let props = {};

  beforeEach(() => {
    props = {
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
