import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Hyperlink, Form } from '@edx/paragon';
import { Link, useHistory } from 'react-router-dom';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

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
    nameOnAccount, userId, profileDataManager, idPhotoName, setIdPhotoName,
  } = useContext(IdVerificationContext);
  const nameOnAccountValue = nameOnAccount || '';
  const invalidName = !nameMatches && (!idPhotoName || idPhotoName === nameOnAccount);
  const blankName = !nameOnAccount && !idPhotoName;

  useEffect(() => {
    setIdPhotoName(null);
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

  function getNameValue() {
    if (!nameMatches) {
      // Explicitly check for null, as an empty string should still be used here
      if (idPhotoName === null) {
        return nameOnAccountValue;
      }
      return idPhotoName;
    }
    return nameOnAccountValue;
  }

  function getErrorMessage() {
    if (profileDataManager) {
      return (
        <FormattedMessage
          id="id.verification.account.name.managed.alert"
          defaultMessage="Your profile settings are managed by {managerTitle}, so you are not allowed to update your name. Please contact your {profileDataManager} administrator or {support} for help."
          description="Alert message informing the user their account name is managed by a third party."
          values={{
            managerTitle: <strong>{profileDataManager}</strong>,
            profileDataManager,
            support: (
              <Hyperlink destination={getConfig().SUPPORT_URL} target="_blank">
                {props.intl.formatMessage(messages['id.verification.support'])}
              </Hyperlink>
            ),
          }}
        />
      );
    }
    return props.intl.formatMessage(messages['id.verification.account.name.error']);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // If the input is empty, or if no changes have been made to the
    // mismatching name, the user should not be able to proceed.
    if (!invalidName && !blankName) {
      push(nextPanelSlug);
    }
  }

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
                setIdPhotoName(null);
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
            readOnly={nameMatches || profileDataManager}
            isInvalid={invalidName || blankName}
            aria-describedby="photo-id-name-feedback"
            value={getNameValue()}
            onChange={e => setIdPhotoName(e.target.value)}
            data-testid="name-input"
          />
          <Form.Control.Feedback id="photo-id-name-feedback" type="invalid">
            {getErrorMessage()}
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
