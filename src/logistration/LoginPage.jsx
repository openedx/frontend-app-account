import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input, ValidationFormGroup } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

import { loginRequest } from './data/actions';
import { forgotPasswordSelector, loginRequestSelector } from './data/selectors';
import ConfirmationAlert from './ConfirmationAlert';
import LoginHelpLinks from './LoginHelpLinks';


const LoginRedirect = (props) => {
  const { success, redirectUrl } = props;
  if (success) {
    window.location.href = redirectUrl;
  }
  return <></>;
};

class LoginPage extends React.Component {
  state = {
    password: '',
    email: '',
    errors: {
      email: '',
      password: '',
    },
    emailValid: false,
    passwordValid: false,
    formValid: false,
  }

  handleOnChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.validateInput(e.target.name, e.target.value);
  }

  validateInput(inputName, value) {
    const inputErrors = this.state.errors;
    let { emailValid } = this.state;
    let { passwordValid } = this.state;

    switch (inputName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        inputErrors.email = emailValid ? '' : null;
        break;
      case 'password':
        passwordValid = value.length >= 8 && value.match(/\d+/g);
        inputErrors.password = passwordValid ? '' : null;
        break;
      default:
        break;
    }

    this.setState({
      errors: inputErrors,
      emailValid,
      passwordValid,
    }, this.validateForm);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(this.props.location.search);
    const payload = {
      email: this.state.email,
      password: this.state.password,
      next: params.get('next'),
      course_id: params.get('course_id'),
    };

    this.props.loginRequest(payload);
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid,
    });
  }

  render() {
    return (
      <React.Fragment>
        <LoginRedirect success={this.props.loginResult.success} redirectUrl={this.props.loginResult.redirectUrl} />
        <div className="d-flex justify-content-center logistration-container">
          <div className="d-flex flex-column" style={{ width: '400px' }}>
            {this.props.forgotPassword.status === 'complete' ? <ConfirmationAlert email={this.props.forgotPassword.email} /> : null}
            <div className="d-flex flex-row">
              <p>
                First time here?<a className="ml-1" href="/register">Create an Account.</a>
              </p>
            </div>
            <form className="m-0">
              <div className="form-group">
                <h3 className="text-center mt-3">Sign In</h3>
                <div className="d-flex flex-column align-items-start">
                  <ValidationFormGroup
                    for="email"
                    invalid={this.state.errors.email !== ''}
                    invalidMessage="The email address you've provided isn't formatted correctly."
                  >
                    <label htmlFor="loginEmail" className="h6 mr-1">Email</label>
                    <Input
                      name="email"
                      id="loginEmail"
                      type="email"
                      placeholder="username@domain.com"
                      value={this.state.email}
                      onChange={e => this.handleOnChange(e)}
                      style={{ width: '400px' }}
                    />
                  </ValidationFormGroup>
                </div>
                <p className="mb-4">The email address you used to register with edX.</p>
                <div className="d-flex flex-column align-items-start">
                  <label htmlFor="loginPassword" className="h6 mr-1">Password</label>
                  <Input
                    name="password"
                    id="loginPassword"
                    type="password"
                    value={this.state.password}
                    onChange={e => this.handleOnChange(e)}
                  />
                </div>
                <LoginHelpLinks page="login" />
              </div>
              <Button
                className="btn-primary submit"
                onClick={this.handleSubmit}
              >
                Sign in
              </Button>
            </form>
            <div className="section-heading-line mb-4">
              <h4>or sign in with</h4>
            </div>
            <div className="row text-center d-block mb-4">
              <button className="btn-social facebook"><FontAwesomeIcon className="mr-2" icon={faFacebookF} />Facebook</button>
              <button className="btn-social google"><FontAwesomeIcon className="mr-2" icon={faGoogle} />Google</button>
              <button className="btn-social microsoft"><FontAwesomeIcon className="mr-2" icon={faMicrosoft} />Microsoft</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

LoginRedirect.defaultProps = {
  redirectUrl: '',
  success: false,
};

LoginRedirect.propTypes = {
  redirectUrl: PropTypes.string,
  success: PropTypes.bool,
};

const mapStateToProps = state => {
  const forgotPassword = forgotPasswordSelector(state);
  const loginResult = loginRequestSelector(state);
  return { forgotPassword, loginResult };
}

export default connect(
  mapStateToProps,
  {
    loginRequest,
  },
)(LoginPage);
