import { FormattedMessage, getSiteConfig, getAppConfig, injectIntl, intlShape, sendTrackEvent } from '@openedx/frontend-base';
import { Alert, Hyperlink } from '@openedx/paragon';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { appId } from '../../constants';

import messages from '../IdVerification.messages';
import IdVerificationContext from '../IdVerificationContext';
import exampleCard from '../assets/example-card.png';

const ReviewRequirementsPanel = (props) => {
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
                <Hyperlink destination={getAppConfig(appId).SUPPORT_URL} target="_blank">
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
      <div className="card mb-4 shadow accent border-warning">
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
      <div className="card mb-4 shadow accent border-warning">
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
          { siteName: getSiteConfig().siteName },
        )}
      </h6>
      <p>
        {props.intl.formatMessage(messages['id.verification.privacy.need.photo.answer'])}
      </p>
      <h6 aria-level="3">
        {props.intl.formatMessage(
          messages['id.verification.privacy.do.with.photo.question'],
          { siteName: getSiteConfig().siteName },
        )}
      </h6>
      <p>
        {props.intl.formatMessage(
          messages['id.verification.privacy.do.with.photo.answer'],
          { siteName: getSiteConfig().siteName },
        )}
      </p>

      <div className="action-row">
        <Link to={`/id-verification/${nextPanelSlug}`} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

ReviewRequirementsPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ReviewRequirementsPanel);
