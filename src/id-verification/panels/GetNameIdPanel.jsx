import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Button } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { IdVerificationContext } from '../IdVerificationContext';
import ImagePreview from '../ImagePreview';

import messages from '../IdVerification.messages';

function GetNameIdPanel(props) {
  const panelSlug = 'get-name-id';
  const [isEditing, setIsEditing] = useState(false);
  const nameInputRef = useRef();
  const nextPanelSlug = useNextPanelSlug(panelSlug);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const {
    nameOnAccount, userId, idPhotoName, setIdPhotoName, idPhotoFile,
  } = useContext(IdVerificationContext);
  const nameOnAccountValue = nameOnAccount || '';

  const handleClick = () => {
    setIsEditing(true);
    sendTrackingLogEvent('edx.id_verification.name_change', {
      category: 'id_verification',
      user_id: userId,
    });
  };

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.account.name.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.account.name.instructions'])}
      </p>

      <div className="alert alert-warning">
        <FormattedMessage
          id="id.verification.account.name.warning"
          defaultMessage="{prefix} Any edit to your name will be saved to your account and can be reviewed on {accountSettings}."
          description="Warning that any edit to the user's name will be saved to the account."
          values={{
            prefix: <strong>{props.intl.formatMessage(messages['id.verification.account.name.warning.prefix'])}</strong>,
            accountSettings: <Link to="/">{props.intl.formatMessage(messages['id.verification.account.name.settings'])}</Link>,
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo-id-name">
          {props.intl.formatMessage(messages['id.verification.account.name.label'])}
        </label>
        <div className="d-flex">
          <Input
            id="photo-id-name"
            type="text"
            ref={nameInputRef}
            disabled={!isEditing}
            readOnly={!isEditing}
            value={idPhotoName || nameOnAccountValue}
            onChange={e => setIdPhotoName(e.target.value)}
          />
          {!isEditing && (
            <Button
              className="btn-link px-0 ml-3"
              onClick={handleClick}
            >
              {props.intl.formatMessage(messages['id.verification.account.name.edit'])}
            </Button>
          )}
        </div>
      </div>
      <ImagePreview
        id="photo-of-id"
        src={idPhotoFile}
        alt={props.intl.formatMessage(messages['id.verification.account.name.photo.alt'])}
      />

      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary">
          {isEditing ? props.intl.formatMessage(messages['id.verification.account.name.save']) : props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

GetNameIdPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GetNameIdPanel);
