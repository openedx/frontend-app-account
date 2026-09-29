import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DOBModal from '@src/account-settings/DOBForm';
import messages from '@src/account-settings/AccountSettingsPage.messages';
import { YEAR_OF_BIRTH_OPTIONS } from '@src/account-settings/data/constants';
import { renderWithForm } from '@src/account-settings/test/renderWithForm';

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

  // The dialog is open from the start, so the button behind it is out of reach.
  it('renders the modal with correct elements', () => {
    renderComponent();

    expect(screen.getByTestId('open-modal-button')).toHaveTextContent(messages['account.settings.field.dob.form.button'].defaultMessage);
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
    const user = userEvent.setup();

    renderComponent();

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveAttribute('aria-disabled', 'true');

    await user.selectOptions(screen.getByTestId('month-select'), '6');
    await user.selectOptions(screen.getByTestId('year-select'), String(YEAR_OF_BIRTH_OPTIONS[0].value));

    await waitFor(() => expect(submitButton).not.toHaveAttribute('aria-disabled', 'true'));
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    const user = userEvent.setup();

    const mockOnSubmit = jest.fn();
    renderComponent({ onSubmit: mockOnSubmit });

    await user.selectOptions(screen.getByTestId('month-select'), '6');
    await user.selectOptions(screen.getByTestId('year-select'), '1990');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith('extended_profile', [
      { field_name: 'DOB', field_value: '1990-6' },
    ]));
  });

  it('shows a general error when the save failed', () => {
    renderComponent({}, { saveState: 'error' });

    expect(screen.getByTestId('error-message')).toHaveTextContent(messages['account.settingsfield.dob.error.general'].defaultMessage);
  });

  it('remembers the submission and resets the save state once it completes', () => {
    const { form } = renderComponent({}, { saveState: 'complete' });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('submittedDOB', 'true');
    expect(form.saveSettingsReset).toHaveBeenCalled();
  });
});
