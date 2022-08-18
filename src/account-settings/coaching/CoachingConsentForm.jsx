import React from 'react';

import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { Input, Button, Hyperlink } from '@edx/paragon';

import PropTypes from 'prop-types';

import Alert from '../Alert';
import messages from './CoachingConsent.messages';

const ErrorMessage = props => (
  <div className="alert-warning mb-2">{props.message}</div>
);

const ManagedProfileAlert = ({ profileDataManager }) => (
  <Alert className="alert alert-primary" role="alert">
    <FormattedMessage
      id="account.settings.coaching.managed.alert"
      defaultMessage="Your name is managed by {managerTitle}. Contact your administrator for help."
      description="Alert message informing the user their account data is managed by a third party"
      values={{
        managerTitle: <b>{profileDataManager}</b>,
      }}
    />
  </Alert>
);
const CoachingForm = props => (
  <div className="col-12 col-md-6 col-xl-5 mx-auto mt-4 p-5 shadow-lg">
    <h2 className="h2">
      {props.intl.formatMessage(messages['account.settings.coaching.consent.welcome.header'])}
    </h2>
    <p>{props.intl.formatMessage(messages['account.settings.coaching.consent.description'])}</p>
    <div>
      <form onSubmit={props.onSubmit}>
        <div className="py-3">
          {!!props.profileDataManager && (
            <ManagedProfileAlert profileDataManager={props.profileDataManager} />
          )}
          <ErrorMessage message={props.formErrors.full_name} />
          <label className="h6" htmlFor="fullName">
            {props.intl.formatMessage(messages['account.settings.coaching.consent.label.name'])}
          </label>
          <Input
            type="text"
            name="full-name"
            id="fullName"
            disabled={!!props.profileDataManager}
            defaultValue={props.formValues.name}
          />
        </div>
        <div className="py-3">
          <ErrorMessage message={props.formErrors.phone_number} />
          <label className="h6" htmlFor="phoneNumber">
            {props.intl.formatMessage(messages['account.settings.coaching.consent.label.phone-number'])}
          </label>
          <Input
            type="text"
            name="phone_number"
            id="phoneNumber"
            defaultValue={props.formValues.phone_number}
          />
        </div>
        <div className=" py-3">
          <p className="small font-italic">
            {props.intl.formatMessage(messages['account.settings.coaching.consent.text-messaging.disclaimer'])}
          </p>
        </div>
        <ErrorMessage message={props.formErrors.coaching} />
        <div className="d-flex flex-column align-items-center">
          <Button variant="outline-primary" className="w-100" type="submit">
            {props.intl.formatMessage(messages['account.settings.coaching.consent.accept-coaching'])}
          </Button>
        </div>
        <div className="mt-3">
          <Hyperlink
            className="mt-3 text-dark btn-link small"
            destination={props.redirectUrl}
            onClick={props.declineCoaching}
          >
            {props.intl.formatMessage(messages['account.settings.coaching.consent.decline-coaching'])}
          </Hyperlink>
        </div>
      </form>
    </div>
  </div>
);

CoachingForm.defaultProps = {
  formErrors: {
    coaching: '',
    name: '',
    phone_number: '',
  },
};

CoachingForm.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func.isRequired,
  declineCoaching: PropTypes.func.isRequired,
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
    coaching: PropTypes.string,
    full_name: PropTypes.string,
    phone_number: PropTypes.string,
  }),
  redirectUrl: PropTypes.string.isRequired,
  profileDataManager: PropTypes.string.isRequired,
};

ErrorMessage.defaultProps = {
  message: '',
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

ManagedProfileAlert.propTypes = {
  profileDataManager: PropTypes.string.isRequired,
};

export default injectIntl(CoachingForm);
