import {
  useContext, useEffect, useRef,
} from 'react';
import { Form } from '@openedx/paragon';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';

const GetNameIdPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const nameInputRef = useRef();
  const panelSlug = 'get-name-id';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const intl = useIntl();

  const { nameOnAccount, idPhotoName, setIdPhotoName } = useContext(IdVerificationContext);
  const nameOnAccountValue = nameOnAccount || '';

  useEffect(() => {
    if (idPhotoName === null) {
      setIdPhotoName(nameOnAccountValue);
    }

    if (location.state?.fromSummary && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [idPhotoName, location.state, nameOnAccountValue, setIdPhotoName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idPhotoName) {
      navigate(`/id-verification/${nextPanelSlug}`);
    }
  };

  return (
    <BasePanel
      name={panelSlug}
      title={intl.formatMessage(messages['id.verification.name.check.title'])}
    >
      <p>
        {intl.formatMessage(messages['id.verification.name.check.instructions'])}
      </p>
      <p>
        {intl.formatMessage(messages['id.verification.name.check.mismatch.information'])}
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="font-weight-bold" htmlFor="photo-id-name">
            {intl.formatMessage(messages['id.verification.name.label'])}
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
              {intl.formatMessage(messages['id.verification.name.error'])}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Form>

      <div className="action-row">
        <Link
          to={`/id-verification/${nextPanelSlug}`}
          className={`btn btn-primary ${!idPhotoName && 'disabled'}`}
          data-testid="next-button"
          aria-disabled={!idPhotoName}
        >
          {intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

export default GetNameIdPanel;
