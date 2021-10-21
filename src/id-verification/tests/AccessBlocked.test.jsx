import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';

import { ERROR_REASONS } from '../IdVerificationContext';
import AccessBlocked from '../AccessBlocked';

const IntlAccessBlocked = injectIntl(AccessBlocked);

const history = createMemoryHistory();

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
      <Router history={history}>
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
      <Router history={history}>
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
      <Router history={history}>
        <IntlProvider locale="en">
          <IntlAccessBlocked {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/We cannot verify your identity at this time./);

    expect(text).toBeInTheDocument();
  });
});
