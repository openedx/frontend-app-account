import { getSiteConfig, injectIntl, intlShape, sendTrackEvent } from '@openedx/frontend-base';
import { useContext, useEffect } from 'react';

import { useRedirect } from '../../hooks';

import messages from '../IdVerification.messages';
import IdVerificationContext from '../IdVerificationContext';

import BasePanel from './BasePanel';

const SubmittedPanel = (props) => {
  const { userId } = useContext(IdVerificationContext);
  const { location: returnUrl, text: returnText } = useRedirect();
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
        href={`${getSiteConfig().LMS_BASE_URL}/${returnUrl}`}
        data-testid="return-button"
      >
        {props.intl.formatMessage(messages[returnText])}
      </a>
    </BasePanel>
  );
};

SubmittedPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SubmittedPanel);
