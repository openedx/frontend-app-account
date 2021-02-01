import React, { useEffect, useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import BasePanel from './BasePanel';

import IdVerificationContext from '../IdVerificationContext';
import messages from '../IdVerification.messages';

function SubmittedPanel(props) {
  const { userId } = useContext(IdVerificationContext);
  const panelSlug = 'submitted';

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
        href={`${getConfig().LMS_BASE_URL}/dashboard`}
        data-testid="return-button"
      >
        {props.intl.formatMessage(messages['id.verification.return.dashboard'])}
      </a>
    </BasePanel>
  );
}

SubmittedPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SubmittedPanel);
