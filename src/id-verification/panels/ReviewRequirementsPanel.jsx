import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

import { IdVerificationContext } from '../IdVerificationContext';
import messages from '../IdVerification.messages';

function ReviewRequirementsPanel(props) {
  const { userId } = useContext(IdVerificationContext);
  const panelSlug = 'review-requirements';
  const nextPanelSlug = useNextPanelSlug(panelSlug);

  useEffect(() => {
    sendTrackEvent('edx.id_verification.started', {
      category: 'id_verification',
      user_id: userId,
    });
  }, [userId]);

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.requirements.title'])}
      focusOnMount={false}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.requirements.description'])}
      </p>
      <div className="card mb-4 shadow requirements">
        <div className="card-body">
          <h6 aria-level="3">
            {props.intl.formatMessage(messages['id.verification.requirements.card.device.title'])}
          </h6>
          <p className="mb-0">
            <FormattedMessage
              id="id.verification.requirements.card.device.text"
              defaultMessage="You need a device that has a camera. If you receive a browser prompt for access to your camera, please make sure to click {allow}."
              description="Text explaining that the user needs access to a camera."
              values={{
                allow: <strong>{props.intl.formatMessage(messages['id.verification.requirements.card.device.allow'])}</strong>,
              }}
            />
          </p>
        </div>
      </div>
      <div className="card mb-4 shadow requirements">
        <div className="card-body">
          <h6 aria-level="3">
            {props.intl.formatMessage(messages['id.verification.requirements.card.id.title'])}
          </h6>
          <p className="mb-0">
            {props.intl.formatMessage(messages['id.verification.requirements.card.id.text'])}
          </p>
        </div>
      </div>
      <h4 aria-level="2" className="mb-3">
        {props.intl.formatMessage(messages['id.verification.privacy.title'])}
      </h4>
      <h6 aria-level="3">
        {props.intl.formatMessage(messages['id.verification.privacy.need.photo.question'])}
      </h6>
      <p>
        {props.intl.formatMessage(messages['id.verification.privacy.need.photo.answer'])}
      </p>
      <h6 aria-level="3">
        {props.intl.formatMessage(messages['id.verification.privacy.do.with.photo.question'])}
      </h6>
      <p>
        {props.intl.formatMessage(messages['id.verification.privacy.do.with.photo.answer'])}
      </p>

      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

ReviewRequirementsPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ReviewRequirementsPanel);
