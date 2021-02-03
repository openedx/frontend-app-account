import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import { BrowserRouter as Router } from 'react-router-dom';
import { mergeConfig, setConfig } from '@edx/frontend-platform';
import JumpNav from '../JumpNav';

const IntlJumpNav = injectIntl(JumpNav);

describe('JumpNav', () => {
  mergeConfig({
    ENABLE_DEMOGRAPHICS_COLLECTION: false,
  });

  let props = {};

  beforeEach(() => {
    props = {
      intl: {},
      displayDemographicsLink: false,
    };
  });

  it('should not render Optional Information link', () => {
    const tree = renderer.create((
      // Had to wrap the following in a router or I will receive an error stating:
      // "Invariant failed: You should not use <NavLink> outside a <Router>"
      <Router>
        <IntlProvider locale="en">
          <IntlJumpNav {...props} />
        </IntlProvider>
      </Router>
    ))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render Optional Information link', () => {
    setConfig({
      ENABLE_DEMOGRAPHICS_COLLECTION: true,
    });

    props = {
      ...props,
      displayDemographicsLink: true,
    };

    const tree = renderer.create((
      // Same as previous test
      <Router>
        <IntlProvider locale="en">
          <IntlJumpNav {...props} />
        </IntlProvider>
      </Router>
    ))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
