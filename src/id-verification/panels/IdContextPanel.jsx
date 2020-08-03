import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';

import messages from '../IdVerification.messages';

function IdContextPanel(props) {
  const panelSlug = 'id-context';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.id.tips.title'])}
    >
      <p>{props.intl.formatMessage(messages['id.verification.id.tips.description'])}</p>
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h6>
            {props.intl.formatMessage(messages['id.verification.photo.tips.list.title'])}
          </h6>
          <p>
            {props.intl.formatMessage(messages['id.verification.photo.tips.list.description'])}
          </p>
          <ul className="mb-0">
            <li>
              {props.intl.formatMessage(messages['id.verification.id.tips.list.well.lit'])}
            </li>
            <li>
              {props.intl.formatMessage(messages['id.verification.id.tips.list.clear'])}
            </li>
          </ul>
        </div>
      </div>
      <div className="action-row">
        <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

IdContextPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(IdContextPanel);
