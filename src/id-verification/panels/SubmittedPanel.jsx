import React from 'react';
import { getConfig } from '@edx/frontend-platform';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

export default function SubmittedPanel() {
  const panelSlug = 'submitted';
  return (
    <BasePanel
      name={panelSlug}
      title="Identity Verification in Progress"
    >
      <p>We have received you information and are verifiying your identity. You will see a message on your dashboard when the verification process is complete (usually within 1-2 days). In the meantime, you can still access all available course content.</p>
      <a className="btn btn-primary" href={`${getConfig().LMS_BASE_URL}/dashboard`}>Return to Your Dashboard</a>
    </BasePanel>
  );
}
