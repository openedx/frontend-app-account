import React from 'react';
import { Button, Input } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

export default class LoginPage extends React.Component {
  state = {
    password: '',
    username: '',
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column" style={{ width: '400px' }}>
          <div className="d-flex flex-row">
            <p>First time here?</p>
            <a className="ml-2" href="/registration">Create an account!</a>
          </div>
          <form className="m-0">
            <div className="form-group">
              <h2>Sign In</h2>
              <div className="d-flex flex-column align-items-start">
                <label htmlFor="loginUsername" className="h6 mr-1">Username</label>
                <Input
                  name="Username"
                  id="loginUsername"
                  type="email"
                  placeholder="username@domain.com"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
              </div>
              <p className="mb-4">The email address you used to register with edX.</p>
              <div className="d-flex flex-column align-items-start">
                <label htmlFor="loginUsername" className="h6 mr-1">Password</label>
                <Input
                  name="Password"
                  id="loginPassword"
                  type="Password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </div>
            </div>
            <Button className="btn-primary">Sign in</Button>
          </form>
          <div className="section-heading-line mb-4">
            <h3>or sign in with</h3>
          </div>
          <div className="row text-center d-block mb-4">
            <button className="btn-social facebook"><FontAwesomeIcon className="mr-2" icon={faFacebookF} />Facebook</button>
            <button className="btn-social google"><FontAwesomeIcon className="mr-2" icon={faGoogle} />Google</button>
            <button className="btn-social microsoft"><FontAwesomeIcon className="mr-2" icon={faMicrosoft} />Microsoft</button>
          </div>
        </div>
      </div>
    );
  }
}
