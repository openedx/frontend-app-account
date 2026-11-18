import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';

import {
  CountryField,
  EmailAddressField,
  NameField,
  ResetPasswordField,
  SecondaryEmailField,
  StateField,
  UsernameField,
  VerifiedNameField,
  YearOfBirthField,
} from '@src/account-settings/fields/BasicInformationFields';
import {
  GenderField,
  LanguageProficienciesField,
  LevelOfEducationField,
  WorkExperienceField,
} from '@src/account-settings/fields/ProfileInformationFields';
import {
  SocialLinkFacebookField,
  SocialLinkLinkedinField,
  SocialLinkXField,
} from '@src/account-settings/fields/SocialMediaFields';
import { SiteLanguageField, TimeZoneField } from '@src/account-settings/fields/SitePreferencesFields';
import AdditionalProfileFieldsSlot from '@src/slots/AdditionalProfileFieldsSlot';

// The default widgets of this app's own slots, in display order.  The slots themselves live in
// `./slots/`.  A field that does not apply to the current learner renders nothing but keeps its
// place, so relative operations that target it keep working.
const slots: SlotOperation[] = [
  // Basic information
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.usernameField.v1',
    op: WidgetOperationTypes.APPEND,
    component: UsernameField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.nameField.v1',
    op: WidgetOperationTypes.APPEND,
    component: NameField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.verifiedNameField.v1',
    op: WidgetOperationTypes.APPEND,
    component: VerifiedNameField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.emailField.v1',
    op: WidgetOperationTypes.APPEND,
    component: EmailAddressField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.secondaryEmailField.v1',
    op: WidgetOperationTypes.APPEND,
    component: SecondaryEmailField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.resetPassword.v1',
    op: WidgetOperationTypes.APPEND,
    component: ResetPasswordField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.yearOfBirthField.v1',
    op: WidgetOperationTypes.APPEND,
    component: YearOfBirthField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.countryField.v1',
    op: WidgetOperationTypes.APPEND,
    component: CountryField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.basicInformation.v1',
    id: 'org.openedx.frontend.widget.account.stateField.v1',
    op: WidgetOperationTypes.APPEND,
    component: StateField,
  },

  // Profile information
  {
    slotId: 'org.openedx.frontend.slot.account.profileInformation.v1',
    id: 'org.openedx.frontend.widget.account.levelOfEducationField.v1',
    op: WidgetOperationTypes.APPEND,
    component: LevelOfEducationField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.profileInformation.v1',
    id: 'org.openedx.frontend.widget.account.genderField.v1',
    op: WidgetOperationTypes.APPEND,
    component: GenderField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.profileInformation.v1',
    id: 'org.openedx.frontend.widget.account.workExperienceField.v1',
    op: WidgetOperationTypes.APPEND,
    component: WorkExperienceField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.profileInformation.v1',
    id: 'org.openedx.frontend.widget.account.languageProficienciesField.v1',
    op: WidgetOperationTypes.APPEND,
    component: LanguageProficienciesField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.profileInformation.v1',
    id: 'org.openedx.frontend.widget.account.additionalProfileFields.v1',
    op: WidgetOperationTypes.APPEND,
    component: AdditionalProfileFieldsSlot,
  },

  // Social media
  {
    slotId: 'org.openedx.frontend.slot.account.socialMedia.v1',
    id: 'org.openedx.frontend.widget.account.socialLinkLinkedinField.v1',
    op: WidgetOperationTypes.APPEND,
    component: SocialLinkLinkedinField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.socialMedia.v1',
    id: 'org.openedx.frontend.widget.account.socialLinkFacebookField.v1',
    op: WidgetOperationTypes.APPEND,
    component: SocialLinkFacebookField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.socialMedia.v1',
    id: 'org.openedx.frontend.widget.account.socialLinkXField.v1',
    op: WidgetOperationTypes.APPEND,
    component: SocialLinkXField,
  },

  // Site preferences
  {
    slotId: 'org.openedx.frontend.slot.account.sitePreferences.v1',
    id: 'org.openedx.frontend.widget.account.siteLanguageField.v1',
    op: WidgetOperationTypes.APPEND,
    component: SiteLanguageField,
  },
  {
    slotId: 'org.openedx.frontend.slot.account.sitePreferences.v1',
    id: 'org.openedx.frontend.widget.account.timeZoneField.v1',
    op: WidgetOperationTypes.APPEND,
    component: TimeZoneField,
  },
];

export default slots;
