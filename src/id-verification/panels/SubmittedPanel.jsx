import { useContext, useEffect } from 'react';
import { sendTrackEvent, useIntl, getSiteConfig } from '@openedx/frontend-base';

import { useRedirect } from '../../hooks';

import IdVerificationContext from '../IdVerificationContext';
import messages from '../IdVerification.messages';

import BasePanel from './BasePanel';

const SubmittedPanel = () => {
  const { userId } = useContext(IdVerificationContext);
  const { location: returnUrl, text: returnText } = useRedirect();
  const panelSlug = 'submitted';
  const intl = useIntl();

  useEffect(() => {
    sendTrackEvent('edx.id_verification.submitted', {
      category: 'id_verification',
      user_id: userId,
    });
  }, [userId]);

  return (
    <BasePanel
      name={panelSlug}
      title={intl.formatMessage(messages['id.verification.submitted.title'])}
    >
      <p>
        {intl.formatMessage(messages['id.verification.submitted.text'])}
      </p>
      <a
        className="btn btn-primary"
        href={`${getSiteConfig().lmsBaseUrl}/${returnUrl}`}
        data-testid="return-button"
      >
        {intl.formatMessage(messages[returnText])}
      </a>
    </BasePanel>
  );
};

export default SubmittedPanel;
