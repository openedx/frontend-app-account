import React from 'react';
import { Button, Input, ValidationFormGroup } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/headerlogo.svg';
import countryList from './countryList';

class RegistrationPage extends React.Component {
  state = {
    email: '',
    name: '',
    username: '',
    password: '',
    country: '',
    errors: {
      email: '',
      name: '',
      username: '',
      password: '',
      country: '',
    },
    emailValid: false,
    nameValid: false,
    usernameValid: false,
    passwordValid: false,
    countryValid: false,
    formValid: false,
  }

  handleSelectCountry = (e) => {
    this.setState({
      country: e.target.value,
    });
  }

  handleSubmit = (e) => {
    console.log('submit', e);
    e.preventDefault();
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
    let { nameValid } = this.state;
    let { usernameValid } = this.state;
    let { passwordValid } = this.state;
    let { countryValid } = this.state;

    switch (inputName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        inputErrors.email = emailValid ? '' : ' is invalid';
        break;
      case 'name':
        nameValid = value.length >= 1;
        inputErrors.name = nameValid ? '' : ' is too short';
        break;
      case 'username':
        usernameValid = value.length >= 2 && value.length <= 30;
        inputErrors.username = usernameValid ? '' : ' is too short';
        break;
      case 'password':
        passwordValid = value.length >= 8;
        inputErrors.password = passwordValid ? '' : ' is too short';
        break;
      case 'country':
        countryValid = value !== 'Country or Region of Residence (required)';
        inputErrors.country = countryValid ? '' : ' select a country';
        break;
      default:
        break;
    }

    this.setState({
      errors: inputErrors,
      emailValid,
      nameValid,
      usernameValid,
      passwordValid,
      countryValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.nameValid &&
      this.state.usernameValid && this.state.passwordValid && this.state.countryValid,
    });
  }

  renderCountryList() {
    const items = [{ value: 'Country or Region of Residence (required)', label: 'Country or Region of Residence (required)' }];
    const countries = Object.values(countryList);
    for (let i = 0; i < countries.length; i += 1) {
      items.push({ value: countries[i], label: countries[i] });
    }
    return items;
  }

  render() {
    return (
      <React.Fragment>
        <div className="registration-header">
          <img src={logo} alt="edX" className="logo" />
        </div>

        <div className="row registration-container d-block">
          <div className="mb-4">
            <FontAwesomeIcon className="d-block mx-auto fa-2x" icon={faGraduationCap} />
            <h5 className="d-block mx-auto text-center">Start learning now!</h5>
          </div>
          <div className="row text-center d-block mb-4">
            <span className="d-block mx-auto mb-4 text-center section-heading-line col-6">Create an account using</span>
            <button className="btn-social facebook"><FontAwesomeIcon className="mr-2" icon={faFacebookF} />Facebook</button>
            <button className="btn-social google"><FontAwesomeIcon className="mr-2" icon={faGoogle} />Google</button>
            <button className="btn-social microsoft"><FontAwesomeIcon className="mr-2" icon={faMicrosoft} />Microsoft</button>
            <span className="d-block mx-auto text-center mt-4 section-heading-line col-6">or create a new one here</span>
          </div>

          <form className="col-6 mb-4 mx-auto form-group">
            <ValidationFormGroup
              for="email"
              invalid={this.state.errors.email !== ''}
              invalidMessage="Enter a valid email address that contains at least 3 characters."
            >
              <label htmlFor="registrationEmail" className="h6 pt-3">Email (required)</label>
              <Input
                name="email"
                id="registrationEmail"
                type="email"
                placeholder="email@domain.com"
                value={this.state.email}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="name"
              invalid={this.state.errors.name !== ''}
              invalidMessage="Enter your full name."
            >
              <label htmlFor="registrationName" className="h6 pt-3">Full Name (required)</label>
              <Input
                name="name"
                id="registrationName"
                type="text"
                placeholder="Name"
                value={this.state.name}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="username"
              invalid={this.state.errors.username !== ''}
              invalidMessage="Username must be between 2 and 30 characters long."
            >
              <label htmlFor="registrationUsername" className="h6 pt-3">Public Username (required)</label>
              <Input
                name="username"
                id="registrationUsername"
                type="text"
                placeholder="Username"
                value={this.state.username}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="password"
              invalid={this.state.errors.password !== ''}
              invalidMessage="This password is too short. It must contain at least 8 characters. This password must contain at least 1 number."
            >
              <label htmlFor="registrationPassword" className="h6 pt-3">Password (required)</label>
              <Input
                name="password"
                id="registrationPassword"
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="country"
              invalid={this.state.errors.country !== ''}
              invalidMessage="Select your country or region of residence."
            >
              <label htmlFor="registrationCountry" className="h6 pt-3">Country (required)</label>
              <Input
                type="select"
                placeholder="Country or Region of Residence"
                value={this.state.country}
                options={this.renderCountryList()}
                onChange={this.handleSelectCountry}
                required
              />
            </ValidationFormGroup>
            <span>By creating an account, you agree to the <a href="https://www.edx.org/edx-terms-service">Terms of Service and Honor Code</a> and you acknowledge that edX and each Member process your personal data in accordance with the <a href="https://www.edx.org/edx-privacy-policy">Privacy Policy</a>.</span>
            <Button className="btn-primary mt-4 submit" onClick={this.handleSubmit} disabled={!this.state.formValid}>Create Account</Button>
          </form>
          <div className="text-center mb-2 pt-2">
            <span>Already have an edX account?</span>
            <a href="https://courses.edx.org/register?next=/dashboard#login"> Sign in.</a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistrationPage;
