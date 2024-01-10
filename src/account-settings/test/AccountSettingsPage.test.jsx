import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { AppContext } from '@edx/frontend-platform/react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import AccountSettingsPage from '../AccountSettingsPage';
import mockData from './mockData';

const mockDispatch = jest.fn();
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackingLogEvent: jest.fn(),
  getCountryList: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@edx/frontend-platform/auth');

const IntlAccountSettingsPage = injectIntl(AccountSettingsPage);

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('AccountSettingsPage', () => {
  let props = {};
  let store = {};
  const appContext = { locale: 'en', authenticatedUser: { userId: 3, roles: [] } };
  const reduxWrapper = children => (
    <AppContext.Provider value={appContext}>
      <Router>
        <IntlProvider locale="en">
          <Provider store={store}>
            {children}
          </Provider>
        </IntlProvider>
      </Router>
    </AppContext.Provider>
  );

  beforeEach(() => {
    store = mockStore(mockData);
    props = {
      loaded: true,
      siteLanguage: {},
      formValues: {
        username: 'test_username',
        accomplishments_shared: false,
        name: 'test_name',
        email: 'test_email@test.com',
        id: 534,
        extended_profile: [
          {
            field_name: 'work_experience',
            field_value: '',
          },
        ],

      },
      fetchSettings: jest.fn(),
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('renders AccountSettingsPage correctly with editing enabled', async () => {
    const { getByText, rerender, getByLabelText } = render(reduxWrapper(<IntlAccountSettingsPage {...props} />));

    const workExperienceText = getByText('Work Experience');
    const workExperienceEditButton = workExperienceText.parentElement.querySelector('button');

    expect(workExperienceEditButton).toBeInTheDocument();

    store = mockStore({
      ...mockData,
      accountSettings: {
        ...mockData.accountSettings,
        openFormId: 'work_experience',
      },
    });
    rerender(reduxWrapper(<IntlAccountSettingsPage {...props} />));

    const submitButton = screen.getByText('Save');
    expect(submitButton).toBeInTheDocument();

    const workExperienceSelect = getByLabelText('Work Experience');

    // Use fireEvent.change to simulate changing the selected value
    fireEvent.change(workExperienceSelect, { target: { value: '4' } });

    fireEvent.click(submitButton);
  });
});
