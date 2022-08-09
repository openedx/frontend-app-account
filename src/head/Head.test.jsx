import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { mount } from 'enzyme';
import { getConfig } from '@edx/frontend-platform';
import Head from './Head';

describe('Head', () => {
  const props = {};
  it('should match render title tag and fivicon with the site configuration values', () => {
    mount(<IntlProvider locale="en"><Head {...props} /></IntlProvider>);
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(`Account | ${getConfig().SITE_NAME}`);
    expect(helmet.linkTags[0].rel).toEqual('shortcut icon');
    expect(helmet.linkTags[0].href).toEqual(getConfig().FAVICON_URL);
  });
});
