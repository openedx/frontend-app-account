import React, {
  useContext, useEffect, useRef,
} from 'react';
import { Form } from '@edx/paragon';
import { Link, useHistory } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';

function GetNameIdPanel(props) {
  const { push, location } = useHistory();
  const nameInputRef = useRef();
  const panelSlug = 'get-name-id';
  const nextPanelSlug = useNextPanelSlug(panelSlug);

  const { nameOnAccount, idPhotoName, setIdPhotoName } = useContext(IdVerificationContext);
  const nameOnAccountValue = nameOnAccount || '';

  useEffect(() => {
    if (idPhotoName === null) {
      setIdPhotoName(nameOnAccountValue);
    }

    if (location.state?.fromSummary && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (idPhotoName) {
      push(nextPanelSlug);
    }
  }

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.name.check.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.name.check.instructions'])}
      </p>
      <p>
        {props.intl.formatMessage(messages['id.verification.name.check.mismatch.information'])}
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="font-weight-bold" htmlFor="photo-id-name">
            {props.intl.formatMessage(messages['id.verification.name.label'])}
          </Form.Label>
          <Form.Control
            controlId="photo-id-name"
            size="lg"
            type="text"
            ref={nameInputRef}
            isInvalid={!idPhotoName}
            aria-describedby="photo-id-name-feedback"
            value={idPhotoName}
            onChange={e => setIdPhotoName(e.target.value)}
            data-testid="name-input"
          />
          {!idPhotoName && (
            <Form.Control.Feedback
              id="photo-id-name-feedback"
              data-testid="id-name-feedback-message"
              type="invalid"
            >
              {props.intl.formatMessage(messages['id.verification.name.error'])}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Form>

      <div className="action-row">
        <Link
          to={nextPanelSlug}
          className={`btn btn-primary ${!idPhotoName && 'disabled'}`}
          data-testid="next-button"
          aria-disabled={!idPhotoName}
        >
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

GetNameIdPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GetNameIdPanel);
