import { screen } from '@testing-library/react';
import {
  LayoutOperationTypes, mergeSiteConfig, useWidgets, WidgetOperationTypes,
} from '@openedx/frontend-base';

import slots from '@src/slots';
import { renderWithProviders } from '@src/tests/renderWithProviders';
import AccountSettingsSectionSlot, { sectionSlotIds } from './index';

jest.mock('@src/account-settings/fields/BasicInformationFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/account-settings/fields/ProfileInformationFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/account-settings/fields/SocialMediaFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/account-settings/fields/SitePreferencesFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/slots/AdditionalProfileFieldsSlot', () => ({
  __esModule: true,
  default: jest.requireActual('@src/tests/fieldStubs').default.AdditionalProfileFieldsSlot,
}));

const Hint = () => <p>Some courses have age requirements.</p>;
const Notice = () => <p>Your time zone is set by your organization.</p>;

const highlighted = 'org.openedx.frontend.widget.account.countryField.v1';
const HighlightLayout = () => {
  const widgets = useWidgets();
  return (
    <>
      {widgets.identified.map(({ id, node }) => (id === highlighted
        ? <div key={id} data-testid="highlight">{node}</div>
        : node))}
    </>
  );
};

mergeSiteConfig({
  apps: [{
    appId: 'org.openedx.frontend.app.accountSectionsTest',
    slots: [
      ...slots,
      {
        slotId: sectionSlotIds.socialMedia,
        relatedId: 'org.openedx.frontend.widget.account.socialLinkXField.v1',
        op: WidgetOperationTypes.REMOVE,
      },
      {
        slotId: sectionSlotIds.sitePreferences,
        id: 'org.openedx.frontend.widget.test.timeZoneNotice',
        relatedId: 'org.openedx.frontend.widget.account.timeZoneField.v1',
        op: WidgetOperationTypes.REPLACE,
        component: Notice,
      },
      {
        slotId: sectionSlotIds.basicInformation,
        id: 'org.openedx.frontend.widget.test.yearOfBirthHint',
        relatedId: 'org.openedx.frontend.widget.account.yearOfBirthField.v1',
        op: WidgetOperationTypes.INSERT_AFTER,
        component: Hint,
      },
      {
        slotId: sectionSlotIds.basicInformation,
        op: LayoutOperationTypes.REPLACE,
        component: HighlightLayout,
      },
    ],
  }],
});

it('registers each field as a default widget, in order', () => {
  renderWithProviders(<AccountSettingsSectionSlot section="profileInformation" />);
  expect(screen.getAllByText(/Field|Slot$/).map(node => node.textContent)).toEqual([
    'LevelOfEducationField', 'GenderField', 'WorkExperienceField', 'LanguageProficienciesField', 'AdditionalProfileFieldsSlot',
  ]);
});

it('removes and replaces a single field by widget ID', () => {
  renderWithProviders(
    <>
      <AccountSettingsSectionSlot section="socialMedia" />
      <AccountSettingsSectionSlot section="sitePreferences" />
    </>,
  );
  expect(screen.getByText('SocialLinkLinkedinField')).toBeInTheDocument();
  expect(screen.getByText('SocialLinkFacebookField')).toBeInTheDocument();
  expect(screen.queryByText('SocialLinkXField')).not.toBeInTheDocument();
  expect(screen.getByText('SiteLanguageField')).toBeInTheDocument();
  expect(screen.queryByText('TimeZoneField')).not.toBeInTheDocument();
  expect(screen.getByText('Your time zone is set by your organization.')).toBeInTheDocument();
});

it('inserts a hint after one field and lets a layout highlight another', () => {
  renderWithProviders(<AccountSettingsSectionSlot section="basicInformation" />);
  expect(screen.getAllByText(/YearOfBirthField|age requirements|CountryField/).map(node => node.textContent))
    .toEqual(['YearOfBirthField', 'Some courses have age requirements.', 'CountryField']);
  expect(screen.getByTestId('highlight')).toHaveTextContent('CountryField');
  expect(screen.getByTestId('highlight')).not.toHaveTextContent('StateField');
});
