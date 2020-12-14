import React, { useState, useEffect, useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import BasePanel from './BasePanel';

import { IdVerificationContext } from '../IdVerificationContext';
import messages from '../IdVerification.messages';

function SubmittedPanel(props) {
  const { userId } = useContext(IdVerificationContext);
  const panelSlug = 'submitted';
  const [returnPath, setReturnPath] = useState('dashboard');
  const [returnText, setReturnText] = useState('id.verification.return.dashboard');

  // If the user accessed IDV through a course,
  // link back to that course rather than the dashboard
  useEffect(() => {
    if (sessionStorage.getItem('courseRunKey')) {
      setReturnPath(`courses/${sessionStorage.getItem('courseRunKey')}`);
      setReturnText('id.verification.return.course');
    }
  });

  useEffect(() => {
    sendTrackEvent('edx.id_verification.submitted', {
      category: 'id_verification',
      user_id: userId,
    });
  }, [userId]);

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
        href={`${getConfig().LMS_BASE_URL}/${returnPath}`}
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
