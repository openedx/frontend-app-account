import { useContext } from 'react';
import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';

import AccountSettingsSectionFieldsContext from './context';
import { AccountSettingsSection, sectionSlotIds } from './index';

// Default widgets of each section slot, in display order.
export const sectionWidgets: Record<AccountSettingsSection, string[]> = {
  basicInformation: [
    'usernameField',
    'nameField',
    'verifiedNameField',
    'emailField',
    'secondaryEmailField',
    'resetPassword',
    'yearOfBirthField',
    'countryField',
    'stateField',
  ],
  profileInformation: [
    'levelOfEducationField',
    'genderField',
    'workExperienceField',
    'languageProficienciesField',
    'additionalProfileFields',
  ],
  socialMedia: [
    'socialLinkLinkedinField',
    'socialLinkFacebookField',
    'socialLinkXField',
  ],
  sitePreferences: [
    'siteLanguageField',
    'timeZoneField',
  ],
};

export const sectionWidgetId = (name: string) => `org.openedx.frontend.widget.account.${name}.v1`;

const createSectionWidget = (name: string) => {
  const SectionWidget = () => {
    const fields = useContext(AccountSettingsSectionFieldsContext);
    return <>{fields[name] || null}</>;
  };
  SectionWidget.displayName = `AccountSettingsSectionWidget(${name})`;
  return SectionWidget;
};

const sectionWidgetOperations: SlotOperation[] = (Object.keys(sectionWidgets) as AccountSettingsSection[])
  .flatMap(section => sectionWidgets[section].map(name => ({
    slotId: sectionSlotIds[section],
    id: sectionWidgetId(name),
    op: WidgetOperationTypes.APPEND,
    component: createSectionWidget(name),
  })));

export default sectionWidgetOperations;
