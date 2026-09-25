import { useContext, useEffect } from 'react';
import { sendTrackEvent, useIntl, getLinkProps } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';

import { useRedirect } from '@src/hooks';

import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import messages from '@src/id-verification/IdVerification.messages';

import BasePanel from '@src/id-verification/panels/BasePanel';

const SubmittedPanel = () => {
  const { userId } = useContext(IdVerificationContext);
  const { url: returnUrl, text: returnText } = useRedirect();
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
      <Button {...getLinkProps(returnUrl)} data-testid="return-button">
        {intl.formatMessage(messages[returnText])}
      </Button>
    </BasePanel>
  );
};

export default SubmittedPanel;
