import React from 'react';
import { Button, Input } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/headerlogo.svg'
import EmailField from '../account-settings/EmailField';

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

        <div className="row registration-container d-block">
          <div className="mb-4">
            <FontAwesomeIcon className="d-block mx-auto fa-2x" icon={faGraduationCap} />
            <h5 className="d-block mx-auto text-center">Start learning now!</h5>
          </div>
          <div className="row text-center d-block mb-4">
            <span className="d-block mx-auto text-center">Create an account using</span>
              <button className="btn-social facebook"><FontAwesomeIcon className="mr-2" icon={faFacebookF} />Facebook</button>
              <button className="btn-social google"><FontAwesomeIcon className="mr-2" icon={faGoogle} />Google</button>
              <button className="btn-social microsoft"><FontAwesomeIcon className="mr-2" icon={faMicrosoft} />Microsoft</button>
            <span className="d-block mx-auto text-center">or create a new one here</span>
          </div>
          <form className="col-6 mb-4 mx-auto">
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
            <Button className="btn-primary float-right">Create Account</Button>
          </form>
          <div className="text-center mb-2">
            <span>Already have an edX account?</span>
            <a href="https://courses.edx.org/register?next=/dashboard#login"> Sign in.</a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default RegistrationPage;
