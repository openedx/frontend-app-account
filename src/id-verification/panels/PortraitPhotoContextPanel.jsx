import React from 'react';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

export default function PortraitPhotoContextPanel() {
  const panelSlug = 'portrait-photo-context';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  return (
    <BasePanel
      name={panelSlug}
      title="Helpful Photo Tips"
    >
      <p>Next, we'll need you to take a photo of your face. Please review the helpful tips below.</p>
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h6>Photo Tips</h6>
          <p>To take a successful photo, make sure that:</p>
          <ul className="mb-0">
            <li>Your face is well-lit.</li>
            <li>Your entire face fits inside the frame.</li>
          </ul>
        </div>
      </div>
      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary">
          Next
        </Link>
      </div>
    </BasePanel>
  );
}
