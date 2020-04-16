import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import ImageFileUpload from '../ImageFileUpload';
import ImagePreview from '../ImagePreview';
import Camera from '../Camera';
import CameraHelp from '../CameraHelp';
import { IdVerificationContext, MEDIA_ACCESS } from '../IdVerificationContext';

export default function TakePortraitPhotoPanel() {
  const panelSlug = 'take-portrait-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setFacePhotoFile, facePhotoFile, mediaAccess } = useContext(IdVerificationContext);
  const shouldUseCamera = mediaAccess === MEDIA_ACCESS.GRANTED;

  return (
    <BasePanel
      name={panelSlug}
      title={shouldUseCamera ? 'Take Your Photo' : 'Upload Your Portrait Photo'}
    >
      <div>
        {facePhotoFile && !shouldUseCamera && <ImagePreview src={facePhotoFile} alt="Preview of photo of user's face." />}

        {shouldUseCamera ? (
          <div>
            <p>When your face is in position, use the Take Photo button below to take your photo.</p>
            <Camera onImageCapture={setFacePhotoFile} />
          </div>
        ) : (
          <div>
            <p>Please upload a portrait photo. Ensure your entire face fits inside the frame and is well-lit. (Supported formats: .jpg, .jpeg, .png)</p>
            <ImageFileUpload onFileChange={setFacePhotoFile} />
          </div>
        )}
      </div>
      <div className="action-row" style={{ visibility: facePhotoFile ? 'unset' : 'hidden' }}>
        <Link to={nextPanelSlug} className="btn btn-primary">
          Next
        </Link>
      </div>
      {shouldUseCamera && <CameraHelp/>}
    </BasePanel>
  );
}
