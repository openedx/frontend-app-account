import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import ExistingRequest from '../ExistingRequest';

const IntlExistingRequest = injectIntl(ExistingRequest);

const history = createMemoryHistory();

describe('ExistingRequest', () => {
  const defaultProps = {
    intl: {},
    status: '',
  };

  afterEach(() => {
    cleanup();
  });

  it('renders correctly when status is pending', async () => {
    defaultProps.status = 'pending';

    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IntlExistingRequest {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/You have already submitted your verification information./);

    expect(text).toBeInTheDocument();
  });

  it('renders correctly when status is approved', async () => {
    defaultProps.status = 'approved';

    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IntlExistingRequest {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/You have already submitted your verification information./);

    expect(text).toBeInTheDocument();
  });

  it('renders correctly when status is denied', async () => {
    defaultProps.status = 'denied';

    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IntlExistingRequest {...defaultProps} />
        </IntlProvider>
      </Router>
    )));

    const text = screen.getByText(/You cannot verify your identity at this time./);

    expect(text).toBeInTheDocument();
  });
});
