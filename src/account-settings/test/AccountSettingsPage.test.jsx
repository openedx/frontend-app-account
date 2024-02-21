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
import { saveMultipleSettings, saveSettings } from '../data/actions';

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

  it(
    'renders NameField for full name if first_name and last_name are required in registration',
    async () => {
      const { getByText, rerender, getByLabelText } = render(reduxWrapper(<IntlAccountSettingsPage {...props} />));

      const fullNameText = getByText('Full name');
      const fullNameEditButton = fullNameText.parentElement.querySelector('button');

      expect(fullNameEditButton).toBeInTheDocument();

      store = mockStore({
        ...mockData,
        accountSettings: {
          ...mockData.accountSettings,
          openFormId: 'name',
          values: {
            ...mockData.accountSettings.values,
            first_name: 'John',
            last_name: 'Doe',
            are_first_and_last_name_required_in_registration: true,
          },
        },
      });
      store.dispatch = jest.fn(store.dispatch);

      rerender(reduxWrapper(<IntlAccountSettingsPage {...props} />));

      const submitButton = screen.getByText('Save');
      expect(submitButton).toBeInTheDocument();

      const firstNameField = getByLabelText('First name');
      const lastNameField = getByLabelText('Last name');

      // Use fireEvent.change to simulate changing the selected value
      fireEvent.change(firstNameField, { target: { value: 'John' } });
      fireEvent.change(lastNameField, { target: { value: 'Doe' } });

      fireEvent.click(submitButton);

      expect(store.dispatch).toHaveBeenCalledWith(saveMultipleSettings(
        [
          {
            commitValues: 'John',
            formId: 'first_name',
          },
          {
            commitValues: 'Doe',
            formId: 'last_name',
          },
          {
            commitValues: 'John Doe',
            formId: 'name',
          },
        ],
        'name',
        false,
      ));
    },
  );

  it(
    'renders EditableField for full name if first_name and last_name are not available in account settings',
    async () => {
      const { getByText, rerender, getByLabelText } = render(reduxWrapper(<IntlAccountSettingsPage {...props} />));

      const fullNameText = getByText('Full name');
      const fullNameEditButton = fullNameText.parentElement.querySelector('button');

      expect(fullNameEditButton).toBeInTheDocument();

      store = mockStore({
        ...mockData,
        accountSettings: {
          ...mockData.accountSettings,
          openFormId: 'name',
          values: {
            ...mockData.accountSettings.values,
          },
        },
      });
      store.dispatch = jest.fn(store.dispatch);

      rerender(reduxWrapper(<IntlAccountSettingsPage {...props} />));

      const submitButton = screen.getByText('Save');
      expect(submitButton).toBeInTheDocument();

      const fullName = getByLabelText('Full name');

      // Use fireEvent.change to simulate changing the selected value
      fireEvent.change(fullName, { target: { value: 'test_name' } });

      fireEvent.click(submitButton);

      expect(store.dispatch).toHaveBeenCalledWith(saveSettings(
        'name',
        'test_name',
      ));
    },
  );
});
