import {
  screen, fireEvent, waitFor,
} from '@testing-library/react';
import DOBModal from '../DOBForm';
import messages from '../AccountSettingsPage.messages';
import { YEAR_OF_BIRTH_OPTIONS } from '../data/constants';
import { renderWithForm } from './renderWithForm';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
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

describe('DOBModal', () => {
  beforeEach(() => {
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

  const renderComponent = (props = {}, form = {}) => renderWithForm(
    <DOBModal onSubmit={jest.fn()} {...props} />,
    { form: { saveState: null, saveSettingsReset: jest.fn(), ...form } },
  );

  it('renders the modal with correct elements', () => {
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
    fireEvent.click(screen.getByTestId('open-modal-button'));

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveAttribute('aria-disabled', 'true');

    fireEvent.change(screen.getByTestId('month-select'), { target: { value: '6' } });
    fireEvent.change(screen.getByTestId('year-select'), { target: { value: YEAR_OF_BIRTH_OPTIONS[0].value } });

    await waitFor(() => expect(submitButton).not.toHaveAttribute('aria-disabled', 'true'));
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    const mockOnSubmit = jest.fn();
    renderComponent({ onSubmit: mockOnSubmit });
    fireEvent.click(screen.getByTestId('open-modal-button'));

    fireEvent.change(screen.getByTestId('month-select'), { target: { value: '6' } });
    fireEvent.change(screen.getByTestId('year-select'), { target: { value: '1990' } });
    fireEvent.submit(screen.getByTestId('dob-form'));

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith('extended_profile', [
      { field_name: 'DOB', field_value: '1990-6' },
    ]));
  });

  it('shows a general error when the save failed', () => {
    renderComponent({}, { saveState: 'error' });
    fireEvent.click(screen.getByTestId('open-modal-button'));

    expect(screen.getByTestId('error-message')).toHaveTextContent(messages['account.settingsfield.dob.error.general'].defaultMessage);
  });

  it('remembers the submission and resets the save state once it completes', () => {
    const { form } = renderComponent({}, { saveState: 'complete' });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('submittedDOB', 'true');
    expect(form.saveSettingsReset).toHaveBeenCalled();
  });
});
