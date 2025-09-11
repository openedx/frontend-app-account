import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import { ConfirmationModal } from './ConfirmationModal'; // eslint-disable-line import/first

const IntlConfirmationModal = injectIntl(ConfirmationModal);

describe('ConfirmationModal', () => {
  let props = {};

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onChange: jest.fn(),
      onSubmit: jest.fn(),
      status: null,
      errorType: null,
      password: 'fluffy bunnies',
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
            status="pending" // This will cause 'modal-backdrop' and 'show' to appear on the modal as CSS classes.
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
            status="pending" // This will cause 'modal-backdrop' and 'show' to appear on the modal as CSS classes.
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
