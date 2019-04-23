import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import messages from './FeaturePage.messages';

// Actions
import { fetchFeatureData } from './actions';
import { featureSelector } from './selectors';
import { PageLoading } from '../common';

class FeaturePage extends React.Component {
  componentDidMount() {
    this.props.fetchFeatureData('Hello feature data!');
  }

  renderContent() {
    return (
      <div>{this.props.data}</div>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['feature.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <PageLoading srMessage={this.props.intl.formatMessage(messages['feature.loading.message'])} />
    );
  }

  render() {
    const {
      loading,
      loaded,
      loadingError,
    } = this.props;

    return (
      <div className="page__feature container-fluid py-5">
        <h1>
          {this.props.intl.formatMessage(messages['feature.page.heading'])}
        </h1>
        {loading ? this.renderLoading() : null}
        {loaded ? this.renderContent() : null}
        {loadingError ? this.renderError() : null}
      </div>
    );
  }
}

FeaturePage.propTypes = {
  intl: intlShape.isRequired,
  data: PropTypes.string,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,
  fetchFeatureData: PropTypes.func.isRequired,
};

FeaturePage.defaultProps = {
  data: null,
  loading: false,
  loaded: false,
  loadingError: null,
};

export default connect(featureSelector, {
  fetchFeatureData,
})(injectIntl(FeaturePage));
