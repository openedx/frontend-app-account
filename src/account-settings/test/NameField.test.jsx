import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import { fireEvent, render } from '@testing-library/react';
import NameField from '../NameField';

jest.mock('@edx/frontend-platform/auth');
jest.mock('../data/selectors', () => jest.fn().mockImplementation(() => ({ certPreferenceSelector: () => ({}) })));

const IntlNameField = injectIntl(NameField);

const mockStore = configureStore();

describe('NameField', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <Router>
      <IntlProvider locale="en">
        <Provider store={store}>{children}</Provider>
      </IntlProvider>
    </Router>
  );

  beforeEach(() => {
    store = mockStore();
    const onSubmit = jest.fn();
    const onChange = jest.fn();
    props = {
      name: 'name',
      label: 'Full name',
      emptyLabel: 'Add name',
      type: 'text',
      fullNameValue: 'Test Name',
      firstNameValue: '',
      lastNameValue: '',
      verifiedName: null,
      userSuppliedValue: '',
      pendingNameChange: '',
      error: '',
      firstNameError: '',
      lastNameError: '',
      saveState: 'default',
      confirmationValue: 'Confirmation Value',
      helpText: 'Helpful Text',
      isEditing: false,
      isEditable: true,
      isGrayedOut: false,
      onSubmit,
      onChange,
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('renders NameField correctly with editing disabled', () => {
    const tree = renderer.create(reduxWrapper(<IntlNameField {...props} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders NameField correctly with editing enabled', () => {
    props = {
      ...props,
      isEditing: true,
    };

    const tree = renderer.create(reduxWrapper(<IntlNameField {...props} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders NameField with an error on full name', () => {
    const errorProps = {
      ...props,
      isEditing: true,
      error: 'This value is invalid.',
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...errorProps} />));

    const errorMessage = getByText('This value is invalid.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders NameField with an error on first name', () => {
    const errorProps = {
      ...props,
      isEditing: true,
      firstNameError: 'This value is invalid.',
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...errorProps} />));

    const errorMessage = getByText('This value is invalid.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders NameField with an error on last name', () => {
    const errorProps = {
      ...props,
      isEditing: true,
      lastNameError: 'This value is invalid.',
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...errorProps} />));

    const errorMessage = getByText('This value is invalid.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('display pendingName in NameField if available when verifiedName submit state is submitted', () => {
    const componentProps = {
      ...props,
      pendingNameChange: 'Pending Name',
      verifiedName: {
        status: 'submitted',
      },
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const pendingNameText = getByText('Pending Name');
    expect(pendingNameText).toBeInTheDocument();
  });

  it('should not display pendingName when verifiedName submit state is not submitted', () => {
    const componentProps = {
      ...props,
      pendingNameChange: 'Pending Name',
      verifiedName: {
        status: 'pending',
      },
    };

    const { queryByText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    expect(queryByText('Pending Name')).not.toBeInTheDocument();
  });

  it('display concatenated first and last name in full name if first or last name value is available', () => {
    const componentProps = {
      ...props,
      firstNameValue: 'John',
      lastNameValue: 'Doe',
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const pendingNameText = getByText('John Doe');
    expect(pendingNameText).toBeInTheDocument();
  });

  it('display full name in NameField if first and last name value are not available', () => {
    const componentProps = {
      ...props,
      fullNameValue: 'John Doe',
      firstNameValue: '',
      lastNameValue: '',
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const pendingNameText = getByText('John Doe');
    expect(pendingNameText).toBeInTheDocument();
  });

  it('split full name in first and last name on editing if first and last name value not available ', () => {
    const componentProps = {
      ...props,
      isEditing: true,
      fullNameValue: '',
      firstNameValue: 'John',
      lastNameValue: 'Doe',
    };

    const { getByLabelText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const firstNameField = getByLabelText('First name');
    const lastNameField = getByLabelText('Last name');

    expect(firstNameField.value).toEqual('John');
    expect(lastNameField.value).toEqual('Doe');
  });

  it('submit full name, first name and last name on save ', () => {
    const componentProps = {
      ...props,
      isEditing: true,
      fullNameValue: '',
      firstNameValue: 'John',
      lastNameValue: 'Doe',
    };

    const { getByText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const submitButton = getByText('Save');
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);
    expect(props.onSubmit).toHaveBeenCalledWith('name', 'John Doe', 'John', 'Doe');
  });

  it('update both first name and full name on first name change ', () => {
    const componentProps = {
      ...props,
      isEditing: true,
      fullNameValue: '',
      firstNameValue: '',
      lastNameValue: 'Doe',
    };

    const { getByLabelText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const firstNameField = getByLabelText('First name');
    fireEvent.change(firstNameField, { target: { value: 'John' } });

    expect(props.onChange).toHaveBeenCalledTimes(2);
    expect(props.onChange).toHaveBeenCalledWith('first_name', 'John');
    expect(props.onChange).toHaveBeenCalledWith('name', 'John Doe');
  });

  it('update both last name and full name on last name change ', () => {
    const componentProps = {
      ...props,
      isEditing: true,
      fullNameValue: '',
      firstNameValue: 'John',
      lastNameValue: '',
    };

    const { getByLabelText } = render(reduxWrapper(<IntlNameField {...componentProps} />));

    const lastNameField = getByLabelText('Last name');
    fireEvent.change(lastNameField, { target: { value: 'Doe' } });

    expect(props.onChange).toHaveBeenCalledTimes(2);
    expect(props.onChange).toHaveBeenCalledWith('last_name', 'Doe');
    expect(props.onChange).toHaveBeenCalledWith('name', 'John Doe');
  });
});
