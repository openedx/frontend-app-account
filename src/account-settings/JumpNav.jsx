import { useIntl, getAppConfig } from '@openedx/frontend-base';
import { breakpoints, useWindowSize } from '@openedx/paragon';
import classNames from 'classnames';
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';
import { useShowPreferences } from '@src/notification-preferences/data/hooks';
import messages from '@src/account-settings/AccountSettingsPage.messages';
import { parseEnvBoolean } from '@src/utils';
import { appId } from '@src/constants';

const JumpNav = () => {
  const intl = useIntl();
  const stickToTop = useWindowSize().width > breakpoints.small.minWidth;
  const showNotifications = useShowPreferences();

  return (
    <div className={classNames('jump-nav', { 'jump-nav-sm position-sticky pt-3': stickToTop })}>
      <Scrollspy
        items={[
          'basic-information',
          'profile-information',
          'social-media',
          ...(showNotifications ? ['notifications'] : []),
          'site-preferences',
          'linked-accounts',
          'delete-account',
        ]}
        className="list-unstyled"
        currentClassName="font-weight-bold"
        offset={-64}
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
        {showNotifications && (
          <li>
            <NavHashLink to="#notifications">
              {intl.formatMessage(messages['notification.preferences.notifications.label'])}
            </NavHashLink>
          </li>
        )}
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
        {parseEnvBoolean(getAppConfig(appId).ENABLE_ACCOUNT_DELETION)
          && (
          <li>
            <NavHashLink to="#delete-account">
              {intl.formatMessage(messages['account.settings.jump.nav.delete.account'])}
            </NavHashLink>
          </li>
          )}
      </Scrollspy>
    </div>
  );
};

export default JumpNav;
