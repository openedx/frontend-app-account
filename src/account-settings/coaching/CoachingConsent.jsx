import React from 'react';

import { getConfig, getQueryParameters } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@edx/paragon';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PageLoading from '../PageLoading';
import CoachingConsentForm from './CoachingConsentForm';
import messages from './CoachingConsent.messages';
import LogoSVG from '../../logo.svg';
import { fetchSettings, saveSettings, saveMultipleSettings } from '../data/actions';
import { coachingConsentPageSelector } from '../data/selectors';

const Logo = ({ src, alt, ...attributes }) => (
  <>
    <img src={src} alt={alt} {...attributes} />
  </>
);

const SuccessMessage = props => (
  <div className="col-12 col-lg-6 shadow-lg mx-auto mt-4 p-5">
    <FontAwesomeIcon className="text-success" icon={faCheck} size="5x" />
    <div className="h3">{props.header}</div>
    <div>{props.message}</div>
    <Hyperlink destination={props.continueUrl} className="d-block p-2 my-3 text-center text-white bg-primary rounded">
      {props.continue}
    </Hyperlink>
  </div>
);

const AutoRedirect = (props) => {
  window.location.href = props.redirectUrl;
  return <></>;
};

const VIEWS = {
  NOT_LOADED: 'NOT_LOADED',
  LOADED: 'LOADED',
  SUCCESS: 'SUCCESS',
  SUCCESS_PENDING: 'SUCCESS_PENDING',
  DECLINED: 'DECLINED',
  DECLINE_PENDING: 'DECLINE_PENDING',
};

class CoachingConsent extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Used to redirect back to the courseware.
    const nextUrl = this.sanitizeForwardingUrl(getQueryParameters().next);
    this.state = {
      redirectUrl: nextUrl || `${getConfig().LMS_BASE_URL}/dashboard/`,
      formErrors: {},
      formSubmitted: false,
      declineSubmitted: false,
      allSubmissionsComplete: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.declineCoaching = this.declineCoaching.bind(this);
  }

  componentDidMount() {
    this.props.fetchSettings();
  }

  componentDidUpdate(prevProps, prevState) {
    /*
      When we are submitting the form, we're calling saveSettings 3 times, which causes
      multiple parallel redux flows. Because of this we can't rely on just the redux states
      being sent in through props. For instance if the coaching submission and name
      submission happen in near parallel, the coaching flow could return errors in
      formErrors and the name flow could overwrite the formErrors with an empty object.

      To minimize disruption to the rest of the app, we're going to manage flow state from
      within this component.
    */

    // If a new error comes in, store it before the next redux call overwrites it.
    let allFormErrors = {};
    let allSubmissionsComplete = false;

    // Collect new errors and add to state (will be cleared on new submission)
    const newErrorsFound = (
      this.props.formErrors !== prevProps.formErrors
      && Object.keys(this.props.formErrors).length > 0
    );
    if (newErrorsFound) {
      allFormErrors = Object.assign({}, this.state.formErrors, this.props.formErrors);
    }

    // Check if all values from the form have confirmation values
    if (
      this.state.formSubmitted &&
      this.props.saveState === 'complete'
    ) {
      allSubmissionsComplete = true;
    }

    // Check if all values from the decline link have confirmation values
    if (this.props.confirmationValues.coaching && this.state.declineSubmitted) {
      allSubmissionsComplete = true;
    }
    if (newErrorsFound || (allSubmissionsComplete !== prevState.allSubmissionsComplete)) {
      this.setState({
        formErrors: allFormErrors,
        allSubmissionsComplete,
      });
    }
  }

  sanitizeForwardingUrl(url) {
    // Redirect to root of MFE if invalid next param is sent
    return url && url.startsWith(getConfig().LMS_BASE_URL) ? url : `${getConfig().LMS_BASE_URL}/dashboard/`;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({
      formErrors: {},
      formSubmitted: true,
      declineSubmitted: false,
    });
    // Must store target values or they disappear before the async function can use them.
    const fullName = e.target.fullName.value;
    const phoneNumber = e.target.phoneNumber.value;
    const coachingValues = this.props.formValues.coaching;

    // !important: The order of this data matters!
    // The order that this data is in, is the order that the saveSettings() function
    // is called.
    const settingsSubmissions = [];
    if (!this.props.profileDataManager) {
      settingsSubmissions.push({
        formId: 'name',
        commitValues: fullName,
      });
    }
    Array.prototype.push.apply(settingsSubmissions, [
      {
        formId: 'coaching',
        commitValues: {
          ...coachingValues,
          phone_number: phoneNumber,
          coaching_consent: true,
          consent_form_seen: true,
        },
      },
      {
        formId: 'phone_number',
        commitValues: phoneNumber,
      },
    ]);
    this.props.saveMultipleSettings(settingsSubmissions);
  }

  async declineCoaching(e) {
    e.preventDefault();
    this.setState({
      formErrors: {},
      declineSubmitted: true,
      formSubmitted: false,
    });
    // Must store target values or they disappear before the async function can use them.
    const coachingValues = this.props.formValues.coaching;
    this.props.saveSettings('coaching', {
      ...coachingValues,
      coaching_consent: false,
      consent_form_seen: true,
    });
  }

  renderView(currentView) {
    switch (currentView) {
      case VIEWS.NOT_LOADED:
        return <PageLoading srMessage="" />;
      case VIEWS.LOADED:
        return (<CoachingConsentForm
          onSubmit={this.handleSubmit}
          declineCoaching={this.declineCoaching}
          formErrors={this.state.formErrors}
          formValues={this.props.formValues}
          redirectUrl={this.state.redirectUrl}
          profileDataManager={this.props.profileDataManager}
        />);
      case VIEWS.SUCCESS_PENDING:
        return <PageLoading srMessage="Submitting..." />;
      case VIEWS.SUCCESS:
        return (<SuccessMessage
          continueUrl={this.state.redirectUrl}
          header={this.props.intl.formatMessage(messages['account.settings.coaching.consent.success.header'])}
          message={this.props.intl.formatMessage(messages['account.settings.coaching.consent.success.message'])}
          continue={this.props.intl.formatMessage(messages['account.settings.coaching.consent.success.continue'])}
        />);
      case VIEWS.DECLINE_PENDING:
        return <PageLoading srMessage="Redirecting..." />;
      case VIEWS.DECLINED:
        return <AutoRedirect redirectUrl={this.state.redirectUrl} />;
      default:
        return <></>;
    }
  }

  render() {
    const { loaded } = this.props;
    const formHasErrors = Object.keys(this.state.formErrors).length > 0;
    let currentView = null;
    // This amount of logic was making the template very hard to read, so I broke it out into views.
    if (!loaded) {
      currentView = VIEWS.NOT_LOADED;
    } else if (this.state.formSubmitted && !formHasErrors) {
      if (this.state.allSubmissionsComplete) {
        currentView = VIEWS.SUCCESS;
      } else {
        currentView = VIEWS.SUCCESS_PENDING;
      }
    } else if (this.state.declineSubmitted && !formHasErrors) {
      if (this.state.allSubmissionsComplete) {
        currentView = VIEWS.DECLINED;
      } else {
        currentView = VIEWS.DECLINE_PENDING;
      }
    } else {
      currentView = VIEWS.LOADED;
    }

    return (
      <main>
        <div className="w-100 d-flex justify-content-center align-items-center shadow coaching-header">
          <Logo
            className="logo"
            src={LogoSVG}
            alt="Logo"
          />
        </div>
        {this.renderView(currentView)}
      </main>
    );
  }
}

Logo.defaultProps = {
  src: '',
  alt: '',
};

Logo.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

SuccessMessage.defaultProps = {
  header: '',
  message: '',
  continueUrl: '',
  continue: '',
};

SuccessMessage.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  continueUrl: PropTypes.string,
  continue: PropTypes.string,
};

AutoRedirect.defaultProps = {
  redirectUrl: '',
};

AutoRedirect.propTypes = {
  redirectUrl: PropTypes.string,
};

CoachingConsent.defaultProps = {
  loaded: false,
  saveState: undefined,
  profileDataManager: null,
};

CoachingConsent.propTypes = {
  intl: intlShape.isRequired,
  loaded: PropTypes.bool,
  formValues: PropTypes.shape({
    name: PropTypes.string,
    phone_number: PropTypes.string,
    coaching: PropTypes.shape({
      coaching_consent: PropTypes.bool.isRequired,
      user: PropTypes.number.isRequired,
      eligible_for_coaching: PropTypes.bool.isRequired,
      consent_form_seen: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  formErrors: PropTypes.shape({
    coaching: PropTypes.object,
  }).isRequired,
  confirmationValues: PropTypes.shape({
    coaching: PropTypes.object,
    name: PropTypes.object,
    phone_number: PropTypes.object,
  }).isRequired,
  fetchSettings: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  saveMultipleSettings: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  profileDataManager: PropTypes.string,
};

export default connect(coachingConsentPageSelector, {
  fetchSettings,
  saveSettings,
  saveMultipleSettings,
})(injectIntl(CoachingConsent));
