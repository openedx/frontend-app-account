import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hyperlink } from '@edx/paragon';

import { thirdPartyAuthSelector } from '../selectors';

class ThirdPartyAuth extends React.Component {
  renderConnectedProvider(url, name) {
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

  renderUnconnectedProvider(url, name) {
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
        <Hyperlink destination={url}>
          <FormattedMessage
            id="account.settings.sso.unlink.account"
            defaultMessage="Unlink {name} account"
            description="An action link to unlink a connected third party account"
            values={{ name }}
          />
        </Hyperlink>
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
          this.renderUnconnectedProvider(disconnectUrl, name) :
          this.renderConnectedProvider(connectUrl, name)
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

  renderProviders() {
    if (this.props.providers === undefined) return null;

    if (this.props.providers.length === 0) {
      return this.renderNoProviders();
    }

    return this.props.providers.map(this.renderProvider, this);
  }

  render() {
    return (
      <div>
        <h2>
          <FormattedMessage
            id="account.settings.sso.section.header"
            defaultMessage="Linked Accounts"
            description="Section header for the third party auth settings"
          />
        </h2>
        <p>
          <FormattedMessage
            id="account.settings.sso.section.subheader"
            defaultMessage="You can link your identity accounts to simplify signing in to edX."
            description="Section subheader for the third party auth settings"
          />
        </p>
        {this.renderProviders()}
      </div>
    );
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
};

ThirdPartyAuth.defaultProps = {
  providers: undefined,
};


export default connect(thirdPartyAuthSelector)(ThirdPartyAuth);
