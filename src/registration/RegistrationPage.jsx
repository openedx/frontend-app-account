import React from 'react';
import { Button, Input } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/headerlogo.svg';
import countryList from './countryList';
import EmailField from '../account-settings/EmailField';

// export default () => <EmailField />;

class RegistrationPage extends React.Component {
  state = {
    email: '',
    name: '',
    username: '',
    password: '',
    country: '',
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSelectCountry = (e) => {
    this.setState({
      country: e.target.value,
    });
  };

  renderCountryList() {
    const items = [{ value: ' Country or Region of Residence (required)', label: ' Country or Region of Residence (required)' }];
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
            <span className="d-block mx-auto pb-2 text-center">Create an account using</span>
            <button className="btn-social facebook"><FontAwesomeIcon className="mr-2" icon={faFacebookF} />Facebook</button>
            <button className="btn-social google"><FontAwesomeIcon className="mr-2" icon={faGoogle} />Google</button>
            <button className="btn-social microsoft"><FontAwesomeIcon className="mr-2" icon={faMicrosoft} />Microsoft</button>
            <span className="d-block mx-auto text-center pt-2">or create a new one here</span>
          </div>

          <form className="col-6 mb-4 mx-auto form-group">
            <label htmlFor="registrationEmail" className="h6 pt-3">Email (required)</label>
            <Input
              name="email"
              id="registrationEmail"
              type="email"
              placeholder="email@domain.com"
              value={this.state.email}
              onChange={e => this.handleOnChange(e)}
            />
            <label htmlFor="registrationName" className="h6 pt-3">Full Name (required)</label>
            <Input
              name="name"
              id="registrationName"
              type="text"
              placeholder="Name"
              value={this.state.name}
              onChange={e => this.handleOnChange(e)}
            />
            <label htmlFor="registrationUsername" className="h6 pt-3">Public Username (required)</label>
            <Input
              name="username"
              id="registrationUsername"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={e => this.handleOnChange(e)}
            />
            <label htmlFor="registrationPassword" className="h6 pt-3">Password (required)</label>
            <Input
              name="password"
              id="registrationPassword"
              type="text"
              placeholder="Password"
              value={this.state.password}
              onChange={e => this.handleOnChange(e)}
            />
            <label htmlFor="registrationCountry" className="h6 pt-3">Country (required)</label>
            <Input
              type="select"
              placeholder="Country or Region of Residence"
              value={this.state.country}
              options={this.renderCountryList()}
              onChange={this.handleSelectCountry}
            />
            <Button className="btn-primary mt-4">Create Account</Button>
          </form>
          <div className="text-center mb-2">
            <span>Already have an edX account?</span>
            <a href="https://courses.edx.org/register?next=/dashboard#login"> Sign in.</a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistrationPage;
