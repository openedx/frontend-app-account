import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Button } from '@edx/paragon';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { IdVerificationContext } from '../IdVerificationContext';
import ImagePreview from '../ImagePreview';

export default function GetNameIdPanel() {
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
    nameOnAccount, idPhotoName, setIdPhotoName, idPhotoFile,
  } = useContext(IdVerificationContext);
  const nameOnAccountValue = nameOnAccount || '';
  return (
    <BasePanel
      name={panelSlug}
      title="Account Name Check"
    >
      <p>Please check the Account Name below to ensure it matches the name on your ID. If not, click "Edit".</p>

      <div className="alert alert-warning">
        <strong>Please Note:</strong> any edit to your name will be saved to your account and can be reviewed on <Link to="/">Account Settings</Link>.
      </div>

      <div className="form-group">
        <label htmlFor="photo-id-name">Name</label>
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
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <ImagePreview
        id="photo-of-id"
        src={idPhotoFile}
        alt="Photo of your ID to be submitted."
      />

      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary">
          {isEditing ? 'Save' : 'Next'}
        </Link>
      </div>
    </BasePanel>
  );
}
