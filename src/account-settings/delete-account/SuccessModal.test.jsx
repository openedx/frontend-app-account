import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import { SuccessModal } from './SuccessModal'; // eslint-disable-line import/first

const IntlSuccessModal = injectIntl(SuccessModal);

describe('SuccessModal', () => {
  let props = {};

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      status: null,
    };
  });

  it('should match default closed success modal snapshot', () => {
    let tree = renderer.create((
      <IntlProvider locale="en"><IntlSuccessModal {...props} /></IntlProvider>))
      .toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create((
      <IntlProvider locale="en"><IntlSuccessModal {...props} status="confirming" /></IntlProvider>))
      .toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create((
      <IntlProvider locale="en"><IntlSuccessModal {...props} status="pending" /></IntlProvider>))
      .toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create((
      <IntlProvider locale="en"><IntlSuccessModal {...props} status="failed" /></IntlProvider>))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match open success modal snapshot', async () => {
    let tree;
    await act(async () => {
      renderer.create((
        <IntlProvider locale="en">
          <IntlSuccessModal
            {...props}
            status="deleted" // This will cause 'modal-backdrop' and 'show' to appear on the modal as CSS classes.
          />
        </IntlProvider>
      ))
        .toJSON();
    });
    expect(tree).toMatchSnapshot();
  });
});
