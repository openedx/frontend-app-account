import React, { useContext, useEffect, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import BasePanel from './BasePanel';

import IdVerificationContext from '../IdVerificationContext';
import messages from '../IdVerification.messages';

function SubmittedPanel(props) {
  const { userId } = useContext(IdVerificationContext);
  const [returnUrl, setReturnUrl] = useState('dashboard');
  const [returnText, setReturnText] = useState('id.verification.return.dashboard');
  const panelSlug = 'submitted';

  useEffect(() => {
    sendTrackEvent('edx.id_verification.submitted', {
      category: 'id_verification',
      user_id: userId,
    });
  }, [userId]);

  // Link back to the correct location if the user accessed IDV somewhere other
  // than the dashboard
  useEffect(() => {
    if (sessionStorage.getItem('courseId')) {
      setReturnUrl(`courses/${sessionStorage.getItem('courseId')}`);
      setReturnText('id.verification.return.course');
    } else if (sessionStorage.getItem('next')) {
      setReturnUrl(sessionStorage.getItem('next'));
      setReturnText('id.verification.return.generic');
    }
  }, []);

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.submitted.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.submitted.text'])}
      </p>
      <a
        className="btn btn-primary"
        href={`${getConfig().LMS_BASE_URL}/${returnUrl}`}
        data-testid="return-button"
      >
        {props.intl.formatMessage(messages[returnText])}
      </a>
    </BasePanel>
  );
}

SubmittedPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SubmittedPanel);
