import { FormattedMessage } from '@openedx/frontend-base';
import { Hyperlink, StatefulButton } from '@openedx/paragon';
import Alert from '../Alert';
import { useDisconnectAuth, useThirdPartyAuthProviders } from './hooks';

const ThirdPartyAuth = () => {
  const { data: providers } = useThirdPartyAuthProviders();
  const { mutate: disconnectAuth, disconnectionStatuses, errors } = useDisconnectAuth();

  const handleClickDisconnect = (e) => {
    e.preventDefault();
    const providerId = e.currentTarget.getAttribute('data-provider-id');
    if (disconnectionStatuses[providerId] === 'pending') {
      return;
    }
    const disconnectUrl = e.currentTarget.getAttribute('data-disconnect-url');
    disconnectAuth({ url: disconnectUrl, providerId });
  };

  const renderUnconnectedProvider = (url, name) => {
    return (
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
  };

  const renderConnectedProvider = (url, name, id) => {
    const hasError = errors[id];

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
          state={disconnectionStatuses[id]}
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
          onClick={handleClickDisconnect}
          disabledStates={['pending']}
          data-disconnect-url={url}
          data-provider-id={id}
        />
      </>
    );
  };

  const renderProvider = ({
    name, disconnectUrl, connectUrl, connected, id,
  }) => {
    return (
      <div className="form-group" key={id}>
        {
          connected
            ? renderConnectedProvider(disconnectUrl, name, id)
            : renderUnconnectedProvider(connectUrl, name)
        }
      </div>
    );
  };

  const renderNoProviders = () => {
    return (
      <FormattedMessage
        id="account.settings.sso.no.providers"
        defaultMessage="No accounts can be linked at this time."
        description="Displayed when no third-party accounts are available for the user to link to their account on the platform."
      />
    );
  };

  if (providers === undefined) {
    return null;
  }

  if (providers.length === 0) {
    return renderNoProviders();
  }

  return providers.map(renderProvider);
};

export default ThirdPartyAuth;
