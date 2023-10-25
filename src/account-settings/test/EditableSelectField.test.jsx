import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';

import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import EditableSelectField from '../EditableSelectField';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@edx/frontend-platform/auth');
jest.mock('../data/selectors', () => jest.fn().mockImplementation(() => ({ certPreferenceSelector: () => ({}) })));

const history = createMemoryHistory();

const IntlEditableSelectField = injectIntl(EditableSelectField);

const mockStore = configureStore();

describe('EditableSelectField', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <Router history={history}>
      <IntlProvider locale="en">
        <Provider store={store}>{children}</Provider>
      </IntlProvider>
    </Router>
  );

  beforeEach(() => {
    store = mockStore();
    props = {
      name: 'testField',
      label: 'Main Label',
      emptyLabel: 'Empty Main Label',
      type: 'text',
      value: 'Test Field',
      userSuppliedValue: '',
      options: [
        {
          label: 'Default Option',
          value: 'defaultOption',
        },
        {
          label: 'User Options',
          group: [
            {
              label: 'Suboption 1',
              value: 'suboption1',
            },
          ],
        },
        {
          label: 'Other Options',
          group: [
            {
              label: 'Suboption 2',
              value: 'suboption2',
            },
            {
              label: 'Suboption 3',
              value: 'suboption3',
            },
          ],
        },
      ],
      saveState: 'default',
      error: '',
      confirmationMessageDefinition: {
        id: 'confirmationMessageId',
        defaultMessage: 'Default Confirmation Message',
        description: 'Description of the confirmation message',
      },
      confirmationValue: 'Confirmation Value',
      helpText: 'Helpful Text',
      isEditing: false,
      isEditable: true,
      isGrayedOut: false,
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('renders EditableSelectField correctly with editing disabled', () => {
    render(reduxWrapper(<IntlEditableSelectField {...props} />));

    expect(screen.getByText('Main Label')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders EditableSelectField correctly with editing enabled', () => {
    props = {
      ...props,
      isEditing: true,
    };

    render(reduxWrapper(<IntlEditableSelectField {...props} />));

    expect(screen.getByText('Main Label')).toBeInTheDocument();
    expect(screen.getByText('Suboption 1')).toBeInTheDocument();
    expect(screen.getByText('Default Option')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
