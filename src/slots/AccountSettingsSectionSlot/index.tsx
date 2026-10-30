import { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

import AccountSettingsSectionFieldsContext from './context';

export const sectionSlotIds = {
  basicInformation: 'org.openedx.frontend.slot.account.basicInformation.v1',
  profileInformation: 'org.openedx.frontend.slot.account.profileInformation.v1',
  socialMedia: 'org.openedx.frontend.slot.account.socialMedia.v1',
  sitePreferences: 'org.openedx.frontend.slot.account.sitePreferences.v1',
} as const;

export type AccountSettingsSection = keyof typeof sectionSlotIds;

interface AccountSettingsSectionSlotProps {
  section: AccountSettingsSection;
  // Keyed by default widget name; see `./widgets`.
  fields: Record<string, ReactNode>;
}

const AccountSettingsSectionSlot = ({ section, fields }: AccountSettingsSectionSlotProps) => (
  <AccountSettingsSectionFieldsContext.Provider value={fields}>
    <Slot id={sectionSlotIds[section]} />
  </AccountSettingsSectionFieldsContext.Provider>
);

export default AccountSettingsSectionSlot;
