import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import * as auth from '@edx/frontend-platform/auth';

import CoachingConsent from '../CoachingConsent';
import * as selectors from '../../data/selectors';

jest.mock('@edx/frontend-platform/auth');

const IntlCoachingConsent = injectIntl(CoachingConsent);

jest.mock('../../data/selectors', () => jest.fn().mockImplementation(() => ({ coachingConsentPageSelector: () => ({}) })));

const mockStore = configureStore();

describe('CoachingConsent', () => {
  let props = {};
  let store = {};
  selectors.mockClear();

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider store={store}>{children}</Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    store = mockStore();
    props = {
      fetchSettings: jest.fn(),
      loaded: true,
      saveState: undefined,
      formValues: {
        name: 'edx edx',
        phone_number: '1234567890',
        coaching: {
          coaching_consent: true,
          consent_form_seen: false,
          eligible_for_coaching: true,
          user: 1,
        },
      },
      formErrors: {},
      confirmationValues: {},
      profileDataManager: '',
      intl: {},
    };
    auth.getAuthenticatedHttpClient = jest.fn(() => ({
      patch: async () => ({
        data: { status: 200 },
        catch: () => {},
      }),
    }));
    auth.getAuthenticatedUser = jest.fn(() => ({ userId: 3 }));
  });

  it('should render', () => {
    const wrapper = renderer.create(reduxWrapper(<IntlCoachingConsent {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('disables name field on enterprise user', () => {
    props = {
      ...props,
      profileDataManager: 'test person',
    };
    const wrapper = renderer.create(reduxWrapper(<IntlCoachingConsent {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('display completed box when successfully submitted', async () => {
    const fakeEvent = {
      preventDefault: () => {},
      target: {
        fullName: { value: 'edx edx' },
        phoneNumber: { value: '9783028731' },
      },
    };
    const wrapper = renderer.create(
      reduxWrapper(<IntlCoachingConsent {...props} />),
      {
        // bypass the forward-ref. we don't care about focus for this one test
        createNodeMock: (element) => {
          if (element.type === 'button') {
            // mock a focus function
            return {
              focus: async () => wrapper.root.findByType('form').props.onSubmit(fakeEvent),
            };
          }
          return null;
        },
      },
    );
    const form = wrapper.root.findByType('form');
    await act(async () => { await form.props.onSubmit(fakeEvent); });
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
