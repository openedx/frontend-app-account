import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { sendTrackEvent } from '@edx/frontend-analytics';
import { IntlProvider, injectIntl, intlShape, getMessages } from '@edx/frontend-i18n';
import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import {
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faRedditSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ErrorBoundary, fetchUserAccount } from '../common';
import { ConnectedAccountSettingsPage } from '../account-settings';

import FooterLogo from '../assets/edx-footer.png';
import HeaderLogo from '../assets/logo.svg';
import NotFoundPage from './NotFoundPage';

import messages from './App.messages';

function PageContent() {
  return (
    <div id="app">
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={ConnectedAccountSettingsPage} />
          <Route path="/notfound" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

const IntlPageContent = injectIntl(PageContent);

class App extends Component {
  componentDidMount() {
    const { username } = this.props;
    this.props.fetchUserAccount(username);
  }

  render() {
    return (
      <ErrorBoundary>
        <IntlProvider locale={this.props.locale} messages={getMessages()}>
          <Provider store={this.props.store}>
            <ConnectedRouter history={this.props.history}>
              <IntlPageContent
                configuration={this.props.configuration}
                username={this.props.username}
                avatar={this.props.avatar}
              />
            </ConnectedRouter>
          </Provider>
        </IntlProvider>
      </ErrorBoundary>
    );
  }
}

const configurationPropTypes = {
  SITE_NAME: PropTypes.string.isRequired,
  LMS_BASE_URL: PropTypes.string.isRequired,
  LOGOUT_URL: PropTypes.string.isRequired,
  MARKETING_SITE_BASE_URL: PropTypes.string.isRequired,
  SUPPORT_URL: PropTypes.string.isRequired,
  CONTACT_URL: PropTypes.string.isRequired,
  OPEN_SOURCE_URL: PropTypes.string.isRequired,
  TERMS_OF_SERVICE_URL: PropTypes.string.isRequired,
  PRIVACY_POLICY_URL: PropTypes.string.isRequired,
  FACEBOOK_URL: PropTypes.string.isRequired,
  TWITTER_URL: PropTypes.string.isRequired,
  YOU_TUBE_URL: PropTypes.string.isRequired,
  LINKED_IN_URL: PropTypes.string.isRequired,
  REDDIT_URL: PropTypes.string.isRequired,
  APPLE_APP_STORE_URL: PropTypes.string.isRequired,
  GOOGLE_PLAY_URL: PropTypes.string.isRequired,
  ORDER_HISTORY_URL: PropTypes.string.isRequired,
  ENTERPRISE_MARKETING_URL: PropTypes.string.isRequired,
  ENTERPRISE_MARKETING_UTM_SOURCE: PropTypes.string.isRequired,
  ENTERPRISE_MARKETING_UTM_CAMPAIGN: PropTypes.string.isRequired,
  ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM: PropTypes.string.isRequired,
};

PageContent.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  configuration: PropTypes.shape(configurationPropTypes).isRequired,
  intl: intlShape.isRequired,
};

PageContent.defaultProps = {
  avatar: null,
};

App.propTypes = {
  fetchUserAccount: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  store: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.object.isRequired, // eslint-disable-line
  locale: PropTypes.string.isRequired,
  configuration: PropTypes.shape(configurationPropTypes).isRequired,
};

App.defaultProps = {
  avatar: null,
};

const mapStateToProps = state => ({
  username: state.authentication.username,
  configuration: state.configuration,
  locale: state.i18n.locale,
  avatar: state.userAccount.profileImage.hasImage
    ? state.userAccount.profileImage.imageUrlMedium
    : null,
});

export default connect(
  mapStateToProps,
  {
    fetchUserAccount,
  },
)(App);
