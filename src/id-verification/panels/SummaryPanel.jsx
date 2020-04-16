import React, { useContext } from 'react';
import { history } from '@edx/frontend-platform';
import { Input, Button } from '@edx/paragon';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import { submitIdVerfication } from '../data/service';
import BasePanel from './BasePanel';
import { IdVerificationContext } from '../IdVerificationContext';
import ImagePreview from '../ImagePreview';

export default function SummaryPanel() {
  const panelSlug = 'summary';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const {
    facePhotoFile,
    idPhotoFile,
    nameOnAccount,
    idPhotoName,
  } = useContext(IdVerificationContext);
  const nameToBeUsed = idPhotoName || nameOnAccount || '';
  const courseRunKey = null; // TODO: Implement course run key

  function SubmitButton() {
    function handleClick(e) {
      const verificationData = {
        facePhotoFile,
        idPhotoFile,
        idPhotoName,
        courseRunKey,
      };
      const { success, message } = submitIdVerfication(verificationData);
      history.push(nextPanelSlug);
    }
    return (
      <Button className="btn btn-primary" onClick={handleClick}>
        Confirm
      </Button>
    );
  }

  return (
    <BasePanel
      name={panelSlug}
      title="Review Your Photos"
    >
      <p>Make sure we can verify your identity with the photos and information you have provided.</p>
      <div className="row mb-4">
        <div className="col-6">
          <label htmlFor="photo-of-face">Your Portrait</label>
          <ImagePreview
            id="photo-of-face"
            src={facePhotoFile}
            alt="Photo of your face to be submitted."
          />
          <Link
            className="btn btn-inverse-primary shadow"
            to={{
              pathname: 'take-portrait-photo',
              state: { fromSummary: true },
            }}
          >
            Retake Portrait Photo
          </Link>
        </div>
        <div className="col-6">
          <label htmlFor="photo-of-id/edit">Your Photo ID</label>
          <ImagePreview
            id="photo-of-id"
            src={idPhotoFile}
            alt="Photo of your ID to be submitted."
          />
          <Link
            className="btn btn-inverse-primary shadow"
            to={{
              pathname: 'take-id-photo',
              state: { fromSummary: true },
            }}
          >
            Retake ID Photo
          </Link>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="name-to-be-used">Name on ID</label>
        <div className="d-flex">
          <Input
            id="name-to-be-used"
            type="text"
            readOnly
            value={nameToBeUsed}
            onChange={() => {}}
          />

          <Link
            className="btn btn-link ml-3 px-0"
            to={{
                pathname: 'get-name-id',
                state: { fromSummary: true },
              }}
          >
            Edit
          </Link>
        </div>
      </div>
      <SubmitButton />
    </BasePanel>
  );
}
