import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import ImageFileUpload from '../ImageFileUpload';
import ImagePreview from '../ImagePreview';
import Camera from '../Camera';
import CameraHelp from '../CameraHelp';
import { IdVerificationContext, MEDIA_ACCESS } from '../IdVerificationContext';

export default function TakeIdPhotoPanel() {
  const panelSlug = 'take-id-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setIdPhotoFile, idPhotoFile, mediaAccess } = useContext(IdVerificationContext);
  const shouldUseCamera = mediaAccess === MEDIA_ACCESS.GRANTED;
  return (
    <BasePanel
      name={panelSlug}
      title={shouldUseCamera ? 'Take ID Photo' : 'Upload Your ID Photo'}
    >
      <div>
        {idPhotoFile && !shouldUseCamera && <ImagePreview src={idPhotoFile} alt="Preview of photo of ID." />}

        {shouldUseCamera ? (
          <div>
            <p>When your ID is in position, use the Take Photo button below to take your photo.</p>
            <Camera onImageCapture={setIdPhotoFile} />
          </div>
        ) : (
          <div>
            <p>Please upload a ID photo. Ensure the entire ID fits inside the frame and is well-lit. (Supported formats: .jpg, .jpeg, .png)</p>
            <ImageFileUpload onFileChange={setIdPhotoFile} />
          </div>
        )}
      </div>
      <div className="action-row" style={{ visibility: idPhotoFile ? 'unset' : 'hidden' }}>
        <Link to={nextPanelSlug} className="btn btn-primary">
          Next
        </Link>
      </div>
      {shouldUseCamera && <CameraHelp/>}
    </BasePanel>
  );
}
