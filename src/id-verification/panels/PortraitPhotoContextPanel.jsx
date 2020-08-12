import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import CameraHelp from '../CameraHelp';
import messages from '../IdVerification.messages';

function PortraitPhotoContextPanel(props) {
  const panelSlug = 'portrait-photo-context';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.photo.tips.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.photo.tips.description'])}
      </p>
      <div className="card mb-4 shadow accent">
        <div className="card-body">
          <h6>
            {props.intl.formatMessage(messages['id.verification.photo.tips.list.title'])}
          </h6>
          <p>
            {props.intl.formatMessage(messages['id.verification.photo.tips.list.description'])}
          </p>
          <ul className="mb-0">
            <li>
              {props.intl.formatMessage(messages['id.verification.photo.tips.list.well.lit'])}
            </li>
            <li>
              {props.intl.formatMessage(messages['id.verification.photo.tips.list.inside.frame'])}
            </li>
          </ul>
        </div>
      </div>
      <CameraHelp isOpen isPortrait />
      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

PortraitPhotoContextPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PortraitPhotoContextPanel);
