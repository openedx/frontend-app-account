import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { Form } from '@edx/paragon';
import { Link, useHistory } from 'react-router-dom';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';

function GetNameIdPanel(props) {
  const { push } = useHistory();
  const panelSlug = 'get-name-id';
  const [nameMatches, setNameMatches] = useState(true);
  const nameInputRef = useRef();
  const nextPanelSlug = useNextPanelSlug(panelSlug);

  const {
    nameOnAccount, userId, idPhotoName, setIdPhotoName,
  } = useContext(IdVerificationContext);
  const nameOnAccountValue = nameOnAccount || '';
  const invalidName = !nameMatches && (!idPhotoName || idPhotoName === nameOnAccount);
  const blankName = !nameOnAccount && !idPhotoName;

  useEffect(() => {
    setIdPhotoName('');
  }, []);

  useEffect(() => {
    if (!nameMatches && nameInputRef.current) {
      nameInputRef.current.focus();
    }
    if (!nameMatches) {
      sendTrackEvent('edx.id_verification.name_change', {
        category: 'id_verification',
        user_id: userId,
      });
    }
    if (blankName) {
      setNameMatches(false);
    }
  }, [nameMatches, blankName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // If the input is empty, or if no changes have been made to the
    // mismatching name, the user should not be able to proceed.
    if (!invalidName && !blankName) {
      push(nextPanelSlug);
    }
  };

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.account.name.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.account.name.instructions'])}
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="nameMatchesYes">
            {props.intl.formatMessage(messages['id.verification.account.name.radio.label'])}
          </Form.Label>
          <Form.Row>
            <Form.Check
              type="radio"
              id="nameMatchesYes"
              name="nameMatches"
              data-testid="name-matches-yes"
              label={props.intl.formatMessage(messages['id.verification.account.name.radio.yes'])}
              checked={nameMatches}
              disabled={!nameOnAccount}
              inline
              onChange={() => {
                setNameMatches(true);
                setIdPhotoName('');
              }}
            />
            <Form.Check
              type="radio"
              id="nameMatchesNo"
              name="nameMatches"
              data-testid="name-matches-no"
              label={props.intl.formatMessage(messages['id.verification.account.name.radio.no'])}
              checked={!nameMatches}
              disabled={!nameOnAccount}
              inline
              onChange={() => setNameMatches(false)}
            />
          </Form.Row>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="photo-id-name">
            {props.intl.formatMessage(messages['id.verification.account.name.label'])}
          </Form.Label>
          <Form.Control
            controlId="photo-id-name"
            size="lg"
            type="text"
            ref={nameInputRef}
            readOnly={nameMatches}
            isInvalid={invalidName || blankName}
            aria-describedby="photo-id-name-feedback"
            value={
              !nameMatches
                ? idPhotoName || nameOnAccountValue
                : nameOnAccountValue
            }
            onChange={e => setIdPhotoName(e.target.value)}
            data-testid="name-input"
          />
          <Form.Control.Feedback id="photo-id-name-feedback" type="invalid">
            {props.intl.formatMessage(messages['id.verification.account.name.error'])}
          </Form.Control.Feedback>
        </Form.Group>
      </Form>

      <div className="action-row">
        <Link
          to={nextPanelSlug}
          className={`btn btn-primary ${(invalidName || blankName) && 'disabled'}`}
          data-testid="next-button"
          aria-disabled={invalidName || blankName}
        >
          {
            !nameMatches
              ? props.intl.formatMessage(messages['id.verification.account.name.save'])
              : props.intl.formatMessage(messages['id.verification.next'])
          }
        </Link>
      </div>
    </BasePanel>
  );
}

GetNameIdPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GetNameIdPanel);
