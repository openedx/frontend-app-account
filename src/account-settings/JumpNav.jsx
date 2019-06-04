import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-i18n'; // eslint-disable-line
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';

import messages from './AccountSettingsPage.messages';


function JumpNav({ intl }) {
  return (
    <div className="jump-nav">
      <Scrollspy
        items={[
          'basic-information',
          'profile-information',
          'social-media',
          'site-preferences',
          'linked-accounts',
          'delete-account',
        ]}
        className="list-unstyled"
        currentClassName="font-weight-bold"
      >
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
        <li>
          <NavHashLink to="#delete-account">
            {intl.formatMessage(messages['account.settings.delete.account.header'])}
          </NavHashLink>
        </li>
      </Scrollspy>
    </div>
  );
}


JumpNav.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(JumpNav);
