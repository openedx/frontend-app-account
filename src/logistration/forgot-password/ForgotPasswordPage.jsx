import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Input, ValidationFormGroup } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { forgotPassword } from './data/actions';
import { forgotPasswordSelector } from './data/selectors';
import RequestInProgressAlert from '../../account-settings/reset-password/RequestInProgressAlert';

const ForgotPasswordPage = (props) => {
  const { intl, forgotPassword, status } = props;
  const [ emailInput, setEmailValue ] = useState('');
  const [ emailValid, setEmailValidValue ] = useState(true);

  const handleOnChange = (e) => {
    const emailValue = e.target.value;
    setEmailValue(emailValue)
    validateEmail(emailValue);
  }

  const validateEmail = (email) => {
    const isEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    setEmailValidValue(isEmailValid !== null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput === '') {
      setEmailValidValue(false);
    }
    if (emailValid && emailInput !== '') {
      forgotPassword(emailInput);
    }
  }
  return (
    <React.Fragment>
      {status === 'complete' ? <Redirect to="/login" /> : null}
      <div className="d-flex justify-content-center forgot-password-container">
        <div className="d-flex flex-column" style={{ width: '400px' }}>
          <form className="m-0">
            <div className="form-group">
              <h3 className="text-center mt-3">
                {intl.formatMessage(messages['logisration.forgot.password.page.heading'])}
              </h3>
              <p className="mb-4">
                {intl.formatMessage(messages['logisration.forgot.password.page.instructions'])}
              </p>
              {status === 'forbidden' ? <RequestInProgressAlert /> : null}
              <div className="d-flex flex-column align-items-start">
                <ValidationFormGroup
                  for="email"
                  invalid={!emailValid}
                  invalidMessage={intl.formatMessage(
                    messages['logisration.forgot.password.page.invalid.email.message']
                  )}
                >
                  <label htmlFor="forgot-password-input" className="h6 mr-1">
                    {intl.formatMessage(messages['logisration.forgot.password.page.email.field.label'])}
                  </label>
                  <Input
                    name="email"
                    id="forgot-password-input"
                    type="email"
                    placeholder="email@domain.com"
                    value={emailInput}
                    onChange={e => handleOnChange(e)}
                    style={{ width: '400px' }}
                  />
                </ValidationFormGroup>
              </div>
              <p className="mb-4">
                {intl.formatMessage(messages['logisration.forgot.password.page.email.field.help.text'])}
              </p>
            </div>
            <Button
              className="btn-primary submit"
              onClick={e => handleSubmit(e)}
            >
              {intl.formatMessage(messages['logisration.forgot.password.page.submit.button'])}
            </Button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

ForgotPasswordPage.propTypes = {
  intl: intlShape.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  status: PropTypes.string,
}

const mapStateToProps = state => forgotPasswordSelector(state);

export default connect(
  mapStateToProps,
  {
    forgotPassword
  },
)(injectIntl(ForgotPasswordPage));
