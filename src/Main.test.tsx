import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from '@openedx/frontend-base';

import Main from './Main';

describe('Main', () => {
  it('renders the current route in the main landmark and sets the document title', async () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={['/account']}>
          <Routes>
            <Route path="account" element={<Main />}>
              <Route index element={<div>settings page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </IntlProvider>,
    );

    expect(screen.getByRole('main')).toHaveTextContent('settings page');
    await waitFor(() => expect(document.title).toBe('Account | localhost'));
  });
});
