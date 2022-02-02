import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@edx/paragon';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

import IdVerificationContext from '../IdVerificationContext';
import messages from '../IdVerification.messages';
import exampleCard from '../assets/example-card.png';

function ReviewRequirementsPanel(props) {
  const { userId, profileDataManager } = useContext(IdVerificationContext);
  const panelSlug = 'review-requirements';
  const nextPanelSlug = useNextPanelSlug(panelSlug);

  useEffect(() => {
    sendTrackEvent('edx.id_verification.started', {
      category: 'id_verification',
      user_id: userId,
    });
  }, [userId]);

  function renderManagedProfileMessage() {
    if (!profileDataManager) {
      return null;
    }

    return (
      <div>
        <Alert className="alert alert-primary" role="alert">
          <FormattedMessage
            id="id.verification.requirements.account.managed.alert"
            defaultMessage="Your account settings are managed by {managerTitle}. If the name on your photo ID does not match the name on your account, please contact your {profileDataManager} administrator or {support} for help before completing the Photo Verification process."
            description="Alert message informing the user their account data is managed by a third party."
            values={{
              managerTitle: <strong>{profileDataManager}</strong>,
              profileDataManager,
              support: (
                <Hyperlink destination={getConfig().SUPPORT_URL} target="_blank">
                  {props.intl.formatMessage(messages['id.verification.support'])}
                </Hyperlink>
              ),
            }}
          />
        </Alert>
      </div>
    );
  }

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.requirements.title'])}
      focusOnMount={false}
    >
      {renderManagedProfileMessage()}
      <p>
        {props.intl.formatMessage(messages['id.verification.requirements.description'])}
      </p>
      <div className="card mb-4 shadow accent">
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
      <div className="card mb-4 shadow accent">
        <div className="card-body">
          <h6 aria-level="3">
            {props.intl.formatMessage(messages['id.verification.requirements.card.id.title'])}
          </h6>
          <p className="mb-0">
            {props.intl.formatMessage(messages['id.verification.requirements.card.id.text'])}
            <img
              src={exampleCard}
              alt={props.intl.formatMessage(messages['id.verification.example.card.alt'])}
            />
          </p>
        </div>
      </div>
      <h4 aria-level="2" className="mb-3">
        {props.intl.formatMessage(messages['id.verification.privacy.title'])}
      </h4>
      <h6 aria-level="3">
        {props.intl.formatMessage(
          messages['id.verification.privacy.need.photo.question'],
          { siteName: getConfig().SITE_NAME },
        )}
      </h6>
      <p>
        {props.intl.formatMessage(messages['id.verification.privacy.need.photo.answer'])}
      </p>
      <h6 aria-level="3">
        {props.intl.formatMessage(
          messages['id.verification.privacy.do.with.photo.question'],
          { siteName: getConfig().SITE_NAME },
        )}
      </h6>
      <p>
        {props.intl.formatMessage(
          messages['id.verification.privacy.do.with.photo.answer'],
          { siteName: getConfig().SITE_NAME },
        )}
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
