import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hyperlink } from '@edx/paragon';

import { fetchThirdPartyAuthProviders } from '../actions';
import { thirdPartyAuthSelector } from '../selectors';

class ThirdPartyAuth extends React.Component {
  componentDidMount() {
    this.props.fetchThirdPartyAuthProviders();
  }

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

  renderLoading() {
    return (
      <FormattedMessage
        id="account.settings.sso.loading"
        defaultMessage="Loading..."
        description="Waiting for data to load in the third party auth provider list"
      />
    );
  }

  renderLoadingError() {
    return (
      <FormattedMessage
        id="account.settings.sso.loading.error"
        defaultMessage="There was a problem loading linked accounts."
        description="Error message for failing to load the third party auth provider list"
      />
    );
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
            id="account.settings.sso.section.header"
            defaultMessage="You can link your identity accounts to simplify signing in to edX."
            description="Section subheader for the third party auth settings"
          />
        </p>
        {this.props.providers.map(this.renderProvider, this)}
        {this.props.loaded && this.props.providers.length === 0 ? this.renderNoProviders() : null}
        {this.props.loading ? this.renderLoading() : null}
        {this.props.loadingError ? this.renderLoadingError() : null}
      </div>
    );
  }
}


ThirdPartyAuth.propTypes = {
  fetchThirdPartyAuthProviders: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    disconnectUrl: PropTypes.string,
    connectUrl: PropTypes.string,
    connected: PropTypes.bool,
    id: PropTypes.string,
  })),
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,
};

ThirdPartyAuth.defaultProps = {
  providers: [],
  loading: false,
  loaded: false,
  loadingError: undefined,
};


export default connect(thirdPartyAuthSelector, {
  fetchThirdPartyAuthProviders,
})(ThirdPartyAuth);
