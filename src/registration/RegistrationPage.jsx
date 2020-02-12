import React from 'react';
import logo from '../assets/headerlogo.svg';
import EmailField from '../account-settings/EmailField';
import { Button, Input } from '@edx/paragon';

// export default () => <EmailField />;

class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="registration-header">
          <img src={logo} alt="edX" class="logo"/>
        </div>

        <div className="row registration-container">
          <div className="col-8 md-5">
            <span>Already have an edX account?</span>
            <a href="https://courses.edx.org/register?next=/dashboard#login">Sign in.</a>
          </div>
          <div className="col-5 md-5">
            <span>Create an account and start learning</span>
            <span>Create an account using</span>
              <button>Facebook</button>
              <button>Google</button>
              <button>Microsoft</button>
            <span>or create a new one here</span>
            <Input type="text" defaultValue="Email (required)" />
            <Input type="text" defaultValue="Full Name (required)" />
            <Input type="text" defaultValue="Public Username (required)" />
            <Input type="text" defaultValue="Password (required)" />
            <Input
              type="select"
              defaultValue="Country or Region of Residency"
              options={[
                { value: 'Foo Bar', label: 'Foo Bar' },
                { value: 'Foos Bar', label: 'Bar foo' },
                { value: 'Foo sBar', label: 'FoBaro' },
                { value: 'Foo ssBar', label: 'Farboo' },
              ]}
            />


          </div>
        </div>
        <Button className="btn-primary">Create Account</Button>
      </React.Fragment>
    )
  }
}

export default RegistrationPage;
