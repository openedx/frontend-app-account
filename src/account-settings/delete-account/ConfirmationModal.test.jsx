import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-i18n';

// Modal creates a portal.  Overriding ReactDOM.createPortal allows portals to be tested in jest.
ReactDOM.createPortal = node => node;

import { ConfirmationModal } from './ConfirmationModal'; // eslint-disable-line import/first

const IntlConfirmationModal = injectIntl(ConfirmationModal);

describe('ConfirmationModal', () => {
  let props = {};

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onChange: jest.fn(),
      onSubmit: jest.fn(),
      open: false,
      errorType: null,
      password: 'fluffy bunnies',
      logoutUrl: 'http://localhost/logout',
    };
  });

  it('should match default closed confirmation modal snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlConfirmationModal
            {...props}
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match open confirmation modal snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlConfirmationModal
            {...props}
            // This will cause 'modal-backdrop' and 'show' to appear on the modal as CSS classes.
            open
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match empty password confirmation modal snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlConfirmationModal
            {...props}
            errorType="empty-password"
            // This will cause 'modal-backdrop' and 'show' to appear on the modal as CSS classes.
            open
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
