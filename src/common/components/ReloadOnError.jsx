import { Component } from 'react';
import PropTypes from 'prop-types';

import { NewRelicLoggingService } from '@edx/frontend-logging';

/*
  Error boundary component used to log caught errors and reload the page.
*/
export default class ReloadOnError extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    NewRelicLoggingService.logError(`${error} ${info}`);
  }

  render() {
    if (this.state.hasError) {
      // Reload the page so the user is not stuck with a broken app.
      window.location.reload();
    }

    return this.props.children;
  }
}

ReloadOnError.propTypes = {
  children: PropTypes.node,
};

ReloadOnError.defaultProps = {
  children: null,
};
