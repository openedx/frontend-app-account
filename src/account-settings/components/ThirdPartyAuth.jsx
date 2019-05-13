import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hyperlink, StatefulButton } from '@edx/paragon';
import Alert from './Alert';

import { disconnectAuth } from '../actions';
import { thirdPartyAuthSelector } from '../selectors';

class ThirdPartyAuth extends React.Component {
  onClickDisconnect = (e) => {
    e.preventDefault();
    if (this.props.disconnectingState === 'pending') return;
    const providerId = e.currentTarget.getAttribute('data-provider-id');
    const disconnectUrl = e.currentTarget.getAttribute('data-disconnect-url');
    this.props.disconnectAuth(disconnectUrl, providerId);
  }

  renderUnconnectedProvider(url, name) {
    return (
      <React.Fragment>
        <h6>{name}</h6>
        <Hyperlink destination={url} className="btn btn-outline-primary">
          <FormattedMessage
            id="account.settings.sso.link.account"
            defaultMessage="Sign in with {name}"
            description="An action link to link a connected third party account.m {name} will be Google, Facebook, etc."
            values={{ name }}
          />
        </Hyperlink>
      </React.Fragment>
    );
  }

  renderConnectedProvider(url, name, id) {
    const hasError = this.props.disconnectErrors[id];

    return (
      <React.Fragment>
        <h6>
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
          className="btn-link"
          state={this.props.disconnectingState}
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
          onClick={this.onClickDisconnect}
          disabledStates={[]}
          data-disconnect-url={url}
          data-provider-id={id}
        />
      </React.Fragment>
    );
  }

  renderProvider({
    name, disconnectUrl, connectUrl, connected, id,
  }) {
    return (
      <div className="form-group" key={id}>
        {
          connected ?
          this.renderConnectedProvider(disconnectUrl, name, id) :
          this.renderUnconnectedProvider(connectUrl, name)
        }
      </div>
    );
  }

  renderNoProviders() {
    return (
      <FormattedMessage
        id="account.settings.sso.no.providers"
        defaultMessage="No accounts can be linked at this time."
        description="Displayed when no third party accounts are available to link an edX account to"
      />
    );
  }

  render() {
    if (this.props.providers === undefined) return null;

    if (this.props.providers.length === 0) {
      return this.renderNoProviders();
    }

    return this.props.providers.map(this.renderProvider, this);
  }
}


ThirdPartyAuth.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    disconnectUrl: PropTypes.string,
    connectUrl: PropTypes.string,
    connected: PropTypes.bool,
    id: PropTypes.string,
  })),
  disconnectingState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  disconnectErrors: PropTypes.objectOf(PropTypes.bool),
  disconnectAuth: PropTypes.func.isRequired,
};

ThirdPartyAuth.defaultProps = {
  providers: undefined,
  disconnectingState: null,
  disconnectErrors: {},
};


export default connect(thirdPartyAuthSelector, {
  disconnectAuth,
})(ThirdPartyAuth);
