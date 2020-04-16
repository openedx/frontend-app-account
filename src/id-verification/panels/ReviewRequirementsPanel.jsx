import React from 'react';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

export default function ReviewRequirementsPanel() {
  const panelSlug = 'review-requirements';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  return (
    <BasePanel
      name={panelSlug}
      title="Photo Verification Requirements"
      focusOnMount={false}
    >
      <p>
        In order to complete Photo Verification online, you will need the following
      </p>
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h6>Device with Camera</h6>
          <p className="mb-0">You need a device that has a camera. If you receive a browser prompt for access to your camera, please make sure to click <strong>Allow</strong>.</p>
        </div>
      </div>
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h6>Photo Identification</h6>
          <p className="mb-0">You need a valid ID that contains your full name and photo.</p>
        </div>
      </div>
      <h4 className="mb-3">Privacy Information</h4>
      <h6>Why does edX need my photo?</h6>
      <p>We use your verification photos to confirm your identity and ensure the validity of your certificate.</p>
      <h6>What does edX do with this photo?</h6>
      <p>We securely encrypt your photo and send it our authorization service for review. Your photo and information are not saved or visible anywhere on edX after the verification process is complete.</p>

      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary">
          Next
        </Link>
      </div>
    </BasePanel>
  );
}
