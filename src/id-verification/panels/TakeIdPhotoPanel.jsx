import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import Camera from '../Camera';
import { IdVerificationContext } from '../IdVerificationContext';

import messages from '../IdVerification.messages';
import CameraHelp from '../CameraHelp';

function TakeIdPhotoPanel(props) {
  const panelSlug = 'take-id-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setIdPhotoFile, idPhotoFile } = useContext(IdVerificationContext);

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.id.photo.title.camera'])}
    >
      <div>
        <p>
          {props.intl.formatMessage(messages['id.verification.id.photo.instructions.camera'])}
        </p>
        <Camera onImageCapture={setIdPhotoFile} />
      </div>
      <CameraHelp />
      <div className="action-row" style={{ visibility: idPhotoFile ? 'unset' : 'hidden' }}>
        <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

TakeIdPhotoPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(TakeIdPhotoPanel);
