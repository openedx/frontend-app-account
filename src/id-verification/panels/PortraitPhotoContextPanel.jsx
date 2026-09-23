import { Link } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';

import { useNextPanelSlug } from '@src/id-verification/routing-utilities';
import BasePanel from '@src/id-verification/panels/BasePanel';
import CameraHelp from '@src/id-verification/CameraHelp';
import messages from '@src/id-verification/IdVerification.messages';

const PortraitPhotoContextPanel = () => {
  const intl = useIntl();
  const panelSlug = 'portrait-photo-context';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  return (
    <BasePanel
      name={panelSlug}
      title={intl.formatMessage(messages['id.verification.photo.tips.title'])}
    >
      <p>
        {intl.formatMessage(messages['id.verification.photo.tips.description'])}
      </p>
      <div className="card mb-4 shadow accent border-warning">
        <div className="card-body">
          <h6>
            {intl.formatMessage(messages['id.verification.photo.tips.list.title'])}
          </h6>
          <p>
            {intl.formatMessage(messages['id.verification.photo.tips.list.description'])}
          </p>
          <ul className="mb-0">
            <li>
              {intl.formatMessage(messages['id.verification.photo.tips.list.well.lit'])}
            </li>
            <li>
              {intl.formatMessage(messages['id.verification.photo.tips.list.inside.frame'])}
            </li>
          </ul>
        </div>
      </div>
      <CameraHelp isOpen isPortrait />
      <div className="action-row">
        <Link to={`../${nextPanelSlug}`} className="btn btn-primary" data-testid="next-button">
          {intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

export default PortraitPhotoContextPanel;
