import { injectIntl, IntlProvider } from '@openedx/frontend-base';
import {
  act,
  cleanup,
  render,
  screen,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import AccessBlocked from '../AccessBlocked';
import { ERROR_REASONS } from '../IdVerificationContext';

const IntlAccessBlocked = injectIntl(AccessBlocked);

describe('AccessBlocked', () => {
  const defaultProps = {
    intl: {},
    error: '',
  };

  afterEach(() => {
    cleanup();
  });

  it('renders correctly when there is an existing request', async () => {
    defaultProps.error = ERROR_REASONS.EXISTING_REQUEST;

    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IntlAccessBlocked {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/You have already submitted your verification information./);

    expect(text).toBeInTheDocument();
  });

  it('renders correctly when learner is not enrolled in a verified course mode', async () => {
    defaultProps.error = ERROR_REASONS.COURSE_ENROLLMENT;

    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IntlAccessBlocked {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/You are not currently enrolled in a course that requires identity verification./);

    expect(text).toBeInTheDocument();
  });

  it('renders correctly when status is denied', async () => {
    defaultProps.error = ERROR_REASONS.CANNOT_VERIFY;

    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IntlAccessBlocked {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/We cannot verify your identity at this time./);

    expect(text).toBeInTheDocument();
  });
});
