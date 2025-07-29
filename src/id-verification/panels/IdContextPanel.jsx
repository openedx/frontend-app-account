import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import CameraHelp from '../CameraHelp';
import messages from '../IdVerification.messages';
import exampleCard from '../assets/example-card.png';

const IdContextPanel = () => {
  const panelSlug = 'id-context';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const intl = useIntl();
  return (
    <BasePanel
      name={panelSlug}
      title={intl.formatMessage(messages['id.verification.id.tips.title'])}
    >
      <p>{intl.formatMessage(messages['id.verification.id.tips.description'])}</p>
      <div className="card mb-4 shadow accent border-warning">
        <div className="card-body">
          <h6>
            {intl.formatMessage(messages['id.verification.photo.tips.list.title'])}
          </h6>
          <p>
            {intl.formatMessage(messages['id.verification.photo.tips.list.description'])}
          </p>
          <ul>
            <li>
              {intl.formatMessage(messages['id.verification.id.tips.list.well.lit'])}
            </li>
            <li>
              {intl.formatMessage(messages['id.verification.id.tips.list.clear'])}
            </li>
          </ul>
          <img
            src={exampleCard}
            alt={intl.formatMessage(messages['id.verification.example.card.alt'])}
          />
        </div>
      </div>
      <CameraHelp isOpen />
      <div className="action-row">
        <Link to={`/id-verification/${nextPanelSlug}`} className="btn btn-primary" data-testid="next-button">
          {intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

export default IdContextPanel;
