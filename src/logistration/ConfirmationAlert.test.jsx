import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import ConfirmationAlert from './ConfirmationAlert'; // eslint-disable-line import/first

describe('ConfirmationAlert', () => {
  let props = {};

  beforeEach(() => {
    props = {
      email: 'test@example.com',
    };
  });

  it('should match default confirmation message snapshot', () => {
    const tree = renderer.create(
      <IntlProvider locale="en">
        <ConfirmationAlert {...props} />
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
