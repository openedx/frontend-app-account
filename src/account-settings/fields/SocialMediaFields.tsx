import { useIntl } from '@openedx/frontend-base';

import messages from '@src/account-settings/AccountSettingsPage.messages';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import EditableField from '@src/account-settings/EditableField';
import { useFieldHandlers } from './hooks';

interface SocialLinkFieldProps {
  name: string;
  platform: 'linkedin' | 'facebook' | 'xTwitter';
}

const SocialLinkField = ({ name, platform }: SocialLinkFieldProps) => {
  const intl = useIntl();
  const { formValues } = useAccountSettingsData();
  const handlers = useFieldHandlers();

  return (
    <EditableField
      name={name}
      type="text"
      value={formValues[name] as string}
      label={intl.formatMessage(messages[`account.settings.field.social.platform.name.${platform}`])}
      emptyLabel={intl.formatMessage(messages[`account.settings.field.social.platform.name.${platform}.empty`])}
      {...handlers}
    />
  );
};

export const SocialLinkLinkedinField = () => <SocialLinkField name="social_link_linkedin" platform="linkedin" />;
export const SocialLinkFacebookField = () => <SocialLinkField name="social_link_facebook" platform="facebook" />;
export const SocialLinkXField = () => <SocialLinkField name="social_link_x" platform="xTwitter" />;
