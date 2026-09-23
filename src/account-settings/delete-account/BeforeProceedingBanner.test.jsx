import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';

import BeforeProceedingBanner from '@src/account-settings/delete-account/BeforeProceedingBanner';

const renderBanner = (supportArticleUrl) => render(
  <IntlProvider locale="en">
    <BeforeProceedingBanner
      instructionMessageId="account.settings.delete.account.please.unlink"
      supportArticleUrl={supportArticleUrl}
    />
  </IntlProvider>,
);

describe('BeforeProceedingBanner', () => {
  it('gives the instruction as plain text without a support article', () => {
    renderBanner('');

    expect(screen.getByText('Before proceeding, please unlink all social media accounts.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('links the instruction to the support article when there is one', () => {
    renderBanner('http://test-support.edx');

    expect(screen.getByRole('link', { name: 'unlink all social media accounts' }))
      .toHaveAttribute('href', 'http://test-support.edx');
  });
});
