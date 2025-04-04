import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { waitFor } from '@testing-library/react';
import { SuccessModal } from './SuccessModal';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

const IntlSuccessModal = injectIntl(SuccessModal);

describe('SuccessModal', () => {
  let props = {};

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      status: null,
    };
  });

  it('should match default closed success modal snapshot', async () => {
    await waitFor(() => {
      const tree = renderer.create((
        <IntlProvider locale="en"><IntlSuccessModal {...props} /></IntlProvider>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    await waitFor(() => {
      const tree = renderer.create((
        <IntlProvider locale="en"><IntlSuccessModal {...props} status="confirming" /></IntlProvider>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    await waitFor(() => {
      const tree = renderer.create((
        <IntlProvider locale="en"><IntlSuccessModal {...props} status="pending" /></IntlProvider>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    await waitFor(() => {
      const tree = renderer.create((
        <IntlProvider locale="en"><IntlSuccessModal {...props} status="failed" /></IntlProvider>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('should match open success modal snapshot', async () => {
    await waitFor(() => {
      const tree = renderer.create(
        <IntlProvider locale="en">
          <IntlSuccessModal
            {...props}
            status="deleted"
          />
        </IntlProvider>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
