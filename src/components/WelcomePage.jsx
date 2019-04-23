import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="py-5 justify-content-center align-items-start text-center">
      <p className="my-0 pt-5 text-muted">
        <FormattedMessage
          id="app.page"
          defaultMessage="Congratulations!  You have a new micro-frontend."
          description="Default page content for a new frontend application"
        />
      </p>
      <p className="my-0 pt-3 text-muted">
        <Link to="/example">
          <FormattedMessage
            id="app.example.link"
            defaultMessage="Click here to visit a example page that loads data."
            description="A link to an example page that loads data."
          />
        </Link>
      </p>
    </div>
  );
}
