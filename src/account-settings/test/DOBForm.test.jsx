import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { act } from 'react-dom/test-utils';
import * as reactRedux from 'react-redux';
import DOBModal from '../DOBForm';
import messages from '../AccountSettingsPage.messages';
import { YEAR_OF_BIRTH_OPTIONS } from '../data/constants';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
}));

jest.mock('@openedx/paragon', () => ({
  ...jest.requireActual('@openedx/paragon'),
  Form: {
    ...jest.requireActual('@openedx/paragon').Form,
    Control: {
      ...jest.requireActual('@openedx/paragon').Form.Control,
      // eslint-disable-next-line react/prop-types
      Feedback: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
  },
}));

const mockStore = configureStore([]);

describe('DOBModal', () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    store = mockStore({
      accountSettings: {
        saveState: 'default',
        errors: {},
        openFormId: null,
        confirmationValues: {},
      },
    });
    mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch); // ✅ replaced require with import
    // Mock localStorage.setItem
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <DOBModal
          saveState="default"
          error={undefined}
          onSubmit={jest.fn()}
          {...props}
        />
      </IntlProvider>
    </Provider>,
  );

  it('renders the modal with correct elements', async () => {
    renderComponent();
    const openButton = screen.getByTestId('open-modal-button');
    expect(openButton).toHaveTextContent(messages['account.settings.field.dob.form.button'].defaultMessage);

    fireEvent.click(openButton);

    expect(screen.getByTestId('modal-title')).toHaveTextContent(messages['account.settings.field.dob.form.title'].defaultMessage);
    expect(screen.getByTestId('help-text')).toHaveTextContent(messages['account.settings.field.dob.form.help.text'].defaultMessage);
    expect(screen.getByTestId('month-label')).toHaveTextContent(messages['account.settings.field.dob.month'].defaultMessage);
    expect(screen.getByTestId('year-label')).toHaveTextContent(messages['account.settings.field.dob.year'].defaultMessage);
    expect(screen.getByTestId('month-select')).toBeInTheDocument();
    expect(screen.getByTestId('year-select')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('enables submit button when both month and year are selected', async () => {
    renderComponent();
    const openButton = screen.getByTestId('open-modal-button');
    await act(async () => {
      fireEvent.click(openButton);
    });
    await waitFor(() => {
      const monthSelect = screen.getByTestId('month-select');
      const yearSelect = screen.getByTestId('year-select');
      const submitButton = screen.getByTestId('submit-button');

      act(() => {
        fireEvent.change(monthSelect, { target: { value: '6' } });
        fireEvent.change(yearSelect, { target: { value: YEAR_OF_BIRTH_OPTIONS[0].value } });
      });

      expect(submitButton).not.toHaveAttribute('disabled');
    }, { timeout: 2000 });
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    const mockOnSubmit = jest.fn();
    renderComponent({ onSubmit: mockOnSubmit });

    const openButton = screen.getByTestId('open-modal-button');
    await act(async () => {
      fireEvent.click(openButton);
    });
    await waitFor(() => {
      const monthSelect = screen.getByTestId('month-select');
      const yearSelect = screen.getByTestId('year-select');
      const form = screen.getByTestId('dob-form');

      act(() => {
        fireEvent.change(monthSelect, { target: { value: '6' } });
        fireEvent.change(yearSelect, { target: { value: '1990' } });
      });

      act(() => {
        fireEvent.submit(form);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith('extended_profile', [
        { field_name: 'DOB', field_value: '1990-6' },
      ]);
    }, { timeout: 2000 });
  });
});
