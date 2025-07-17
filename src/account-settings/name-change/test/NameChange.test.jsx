/* eslint-disable no-import-assign */
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import * as auth from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';

// Modal creates a portal.  Overriding createPortal allows portals to be tested in jest.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import NameChange from '../NameChange'; // eslint-disable-line import/first

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@edx/frontend-platform/auth');
jest.mock('../../data/selectors', () => jest.fn().mockImplementation(() => ({ nameChangeSelector: () => ({}) })));

const mockStore = configureStore();

describe('NameChange', () => {
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
    props = {
      targetFormId: 'test_form',
      errors: {},
      formValues: {
        name: 'edx edx',
        verified_name: 'edX Verified',
      },
      saveState: null,
    };

    auth.getAuthenticatedHttpClient = jest.fn(() => ({
      patch: async () => ({
        data: { status: 200 },
        catch: () => {},
      }),
    }));
    auth.getAuthenticatedUser = jest.fn(() => ({ userId: 3, username: 'edx' }));
  });

  afterEach(() => jest.clearAllMocks());

  it('renders populated input after clicking continue if verified_name in form data', async () => {
    const getInput = () => screen.queryByPlaceholderText('Enter the name on your photo ID');

    render(reduxWrapper(<NameChange {...props} />));
    expect(getInput()).toBeNull();

    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    expect(getInput().value).toBe('edX Verified');
  });

  it('renders empty input after clicking continue if verified_name not in form data', async () => {
    const getInput = () => screen.queryByPlaceholderText('Enter the name on your photo ID');
    const formProps = {
      ...props,
      formValues: {
        name: 'edx edx',
      },
    };
    render(reduxWrapper(<NameChange {...formProps} />));

    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    expect(getInput().value).toBe('');
  });

  it('dispatches verifiedName on submit if targetForm is not "name"', async () => {
    const dispatchData = {
      payload: {
        profileName: null,
        username: 'edx',
        verifiedName: 'Verified Name',
      },
      type: 'ACCOUNT_SETTINGS__REQUEST_NAME_CHANGE',
    };

    render(reduxWrapper(<NameChange {...props} />));

    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    const input = screen.getByPlaceholderText('Enter the name on your photo ID');
    fireEvent.change(input, { target: { value: 'Verified Name' } });

    const submitButton = screen.getByText('Continue');
    fireEvent.click(submitButton);
    expect(mockDispatch).toHaveBeenCalledWith(dispatchData);
  });

  it('dispatches both profileName and verifiedName on submit if the targetForm is "name"', async () => {
    const dispatchData = {
      payload: {
        profileName: 'edx edx',
        username: 'edx',
        verifiedName: 'Verified Name',
      },
      type: 'ACCOUNT_SETTINGS__REQUEST_NAME_CHANGE',
    };
    const formProps = {
      ...props,
      targetFormId: 'name',
    };

    render(reduxWrapper(<NameChange {...formProps} />));

    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    const input = screen.getByPlaceholderText('Enter the name on your photo ID');
    fireEvent.change(input, { target: { value: 'Verified Name' } });

    const submitButton = screen.getByText('Continue');
    fireEvent.click(submitButton);
    expect(mockDispatch).toHaveBeenCalledWith(dispatchData);
  });

  it('does not dispatch action while pending', async () => {
    props.saveState = 'pending';

    render(reduxWrapper(<NameChange {...props} />));

    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    const input = screen.getByPlaceholderText('Enter the name on your photo ID');
    fireEvent.change(input, { target: { value: 'Verified Name' } });

    const submitButton = screen.getByText('Continue');
    fireEvent.click(submitButton);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('routes to IDV when name change request is successful', async () => {
    props.saveState = 'complete';

    render(reduxWrapper(<NameChange {...props} />));
    expect(window.location.pathname).toEqual('/id-verification');
  });
});
