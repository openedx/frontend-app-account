import { Slot } from '@openedx/frontend-base';

export const sectionSlotIds = {
  basicInformation: 'org.openedx.frontend.slot.account.basicInformation.v1',
  profileInformation: 'org.openedx.frontend.slot.account.profileInformation.v1',
  socialMedia: 'org.openedx.frontend.slot.account.socialMedia.v1',
  sitePreferences: 'org.openedx.frontend.slot.account.sitePreferences.v1',
} as const;

export type AccountSettingsSection = keyof typeof sectionSlotIds;

interface AccountSettingsSectionSlotProps {
  section: AccountSettingsSection;
}

/**
 * Renders one account settings section's fields.  The fields are the section's default widgets,
 * registered by the app in `src/slots.tsx`; see `./widgets`.
 */
const AccountSettingsSectionSlot = ({ section }: AccountSettingsSectionSlotProps) => (
  <Slot id={sectionSlotIds[section]} />
);

export default AccountSettingsSectionSlot;
