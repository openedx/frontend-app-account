import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-i18n'; // eslint-disable-line
import { NavHashLink } from 'react-router-hash-link';

import messages from '../AccountSettingsPage.messages';


function JumpNav({ intl }) {
  return (
    <div className="jump-nav">
      <ul className="list-unstyled">
        <li>
          <NavHashLink to="#basic-information">
            {intl.formatMessage(messages['account.settings.section.account.information'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#profile-information">
            {intl.formatMessage(messages['account.settings.section.profile.information'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#social-media">
            {intl.formatMessage(messages['account.settings.section.social.media'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#site-preferences">
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#linked-accounts">
            {intl.formatMessage(messages['account.settings.section.linked.accounts'])}
          </NavHashLink>
        </li>
      </ul>
    </div>
  );
}


JumpNav.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(JumpNav);
