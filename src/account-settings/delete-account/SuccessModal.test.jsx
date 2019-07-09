import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-i18n';

// Modal creates a portal.  Overriding ReactDOM.createPortal allows portals to be tested in jest.
ReactDOM.createPortal = node => node;

import { SuccessModal } from './SuccessModal'; // eslint-disable-line import/first

const IntlSuccessModal = injectIntl(SuccessModal);

describe('SuccessModal', () => {
  let props = {};

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      open: false,
    };
  });

  it('should match default closed success modal snapshot', () => {
    const tree = renderer.create((
      <IntlProvider locale="en"><IntlSuccessModal {...props} /></IntlProvider>))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match open success modal snapshot', () => {
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <IntlSuccessModal
            {...props}
            // This will cause 'modal-backdrop' and 'show' to appear on the modal as CSS classes.
            open
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
