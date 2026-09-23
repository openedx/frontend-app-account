import React from 'react';
import { FormattedMessage } from '@openedx/frontend-base';
import { Hyperlink, StatefulButton } from '@openedx/paragon';

import Alert from '@src/account-settings/Alert';
import { useThirdPartyAuthProviders } from '@src/account-settings/data/hooks';
import { useDisconnectAuth } from '@src/account-settings/third-party-auth/data/hooks';

const BUTTON_STATES = {
  idle: null,
  pending: 'pending',
  success: 'complete',
  error: 'error',
};

const ThirdPartyAuth = () => {
  const { data: providers } = useThirdPartyAuthProviders();
  const disconnectAuth = useDisconnectAuth();

  // Only the provider being disconnected reflects the mutation's state.
  const disconnectionStatus = (providerId) => (
    disconnectAuth.variables?.providerId === providerId ? BUTTON_STATES[disconnectAuth.status] : null
  );

  const onClickDisconnect = (e) => {
    e.preventDefault();
    const providerId = e.currentTarget.getAttribute('data-provider-id');
    if (disconnectionStatus(providerId) === 'pending') {
      return;
    }
    const disconnectUrl = e.currentTarget.getAttribute('data-disconnect-url');
    disconnectAuth.mutate({ url: disconnectUrl, providerId });
  };

  const renderUnconnectedProvider = (url, name) => (
    <>
      <h6 aria-level="3">{name}</h6>
      <Hyperlink destination={url} className="btn btn-outline-primary">
        <FormattedMessage
          id="account.settings.sso.link.account"
          defaultMessage="Sign in with {name}"
          description="An action link to link a connected third party account.m {name} will be Google, Facebook, etc."
          values={{ name }}
        />
      </Hyperlink>
    </>
  );

  const renderConnectedProvider = (url, name, id) => {
    const hasError = disconnectionStatus(id) === 'error';

    return (
      <>
        <h6 aria-level="3">
          {name}
          <span className="small font-weight-normal text-muted ml-2">
            <FormattedMessage
              id="account.settings.sso.account.connected"
              defaultMessage="Linked"
              description="A badge to show that a third party account is linked"
            />
          </span>
        </h6>
        {hasError ? (
          <Alert className="alert-danger">
            <FormattedMessage
              id="account.settings.sso.account.disconnect.error"
              defaultMessage="There was a problem disconnecting this account. Contact support if the problem persists."
              description="A message displayed when an error occurred while disconnecting a third party account"
            />
          </Alert>
        ) : null}

        <StatefulButton
          variant="link"
          state={disconnectionStatus(id)}
          labels={{
            default: (
              <FormattedMessage
                id="account.settings.sso.unlink.account"
                defaultMessage="Unlink {name} account"
                description="An action link to unlink a connected third party account"
                values={{ name }}
              />
            ),
          }}
          onClick={onClickDisconnect}
          disabledStates={[]}
          data-disconnect-url={url}
          data-provider-id={id}
        />
      </>
    );
  };

  const renderProvider = ({
    name, disconnectUrl, connectUrl, connected, id,
  }) => (
    <div className="form-group" key={id}>
      {
        connected
          ? renderConnectedProvider(disconnectUrl, name, id)
          : renderUnconnectedProvider(connectUrl, name)
      }
    </div>
  );

  if (providers === undefined) {
    return null;
  }

  if (providers.length === 0) {
    return (
      <FormattedMessage
        id="account.settings.sso.no.providers"
        defaultMessage="No accounts can be linked at this time."
        description="Displayed when no third-party accounts are available for the user to link to their account on the platform."
      />
    );
  }

  return providers.map(renderProvider);
};

export default ThirdPartyAuth;
