import React from 'react';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

export default function IdContextPanel() {
  const panelSlug = 'id-context';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  return (
    <BasePanel
      name={panelSlug}
      title="Helpful ID Tips"
    >
      <p>Next you'll need an eligible photo, make sure that:</p>
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h6>Photo Tips</h6>
          <p>To take a successful photo, make sure that:</p>
          <ul className="mb-0">
            <li>Your ID is well-lit.</li>
            <li>Ensure that you can see your photo and clearly read your name.</li>
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
