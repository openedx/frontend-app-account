import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import messages from './ExamplePage.messages';

// Actions
import { fetchExampleData } from './actions';
import { exampleSelector } from './selectors';
import { PageLoading } from '../common';

class ExamplePage extends React.Component {
  componentDidMount() {
    this.props.fetchExampleData('Hello example data!');
  }

  renderContent() {
    return (
      <div>{this.props.data}</div>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['example.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <PageLoading srMessage={this.props.intl.formatMessage(messages['example.loading.message'])} />
    );
  }

  render() {
    const {
      loading,
      loaded,
      loadingError,
    } = this.props;

    return (
      <div className="page__example container-fluid py-5">
        <h1>
          {this.props.intl.formatMessage(messages['example.page.heading'])}
        </h1>
        {loading ? this.renderLoading() : null}
        {loaded ? this.renderContent() : null}
        {loadingError ? this.renderError() : null}
      </div>
    );
  }
}

ExamplePage.propTypes = {
  intl: intlShape.isRequired,
  data: PropTypes.string,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,
  fetchExampleData: PropTypes.func.isRequired,
};

ExamplePage.defaultProps = {
  data: null,
  loading: false,
  loaded: false,
  loadingError: null,
};

export default connect(exampleSelector, {
  fetchExampleData,
})(injectIntl(ExamplePage));
