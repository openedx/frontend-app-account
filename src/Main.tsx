import { CurrentAppProvider, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Container } from '@openedx/paragon';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';

import { appId } from '@src/constants';
import messages from '@src/messages';

// The stylesheet stays relative: tsc-alias only rewrites an alias whose target already exists in
// dist, and the Makefile copies stylesheets and assets there after it runs.
import './style.scss';

const Main = () => {
  const { formatMessage } = useIntl();
  return (
    <CurrentAppProvider appId={appId}>
      <Helmet>
        <title>
          {formatMessage(messages['account.page.title'], {
            siteName: getSiteConfig().siteName,
          })}
        </title>
      </Helmet>
      <main className="account-app" id="main">
        {/* The same container as the shell's header, so the pages line up with it. */}
        <Container size="xl" className="py-5">
          <Outlet />
        </Container>
      </main>
    </CurrentAppProvider>
  );
};

export default Main;
