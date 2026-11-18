import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutOperationTypes, mergeSiteConfig, WidgetOperationTypes } from '@openedx/frontend-base';

import slots from '@src/slots';
import { renderWithProviders } from '@src/tests/renderWithProviders';
import AccountSettingsSectionSlot, { sectionSlotIds } from './index';
import {
  FieldInfoLayout, SectionHighlightLayout, TimeZoneNotice, YearOfBirthHint,
} from './example';

jest.mock('@src/account-settings/fields/BasicInformationFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/account-settings/fields/ProfileInformationFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/account-settings/fields/SocialMediaFields', () => jest.requireActual('@src/tests/fieldStubs').default);
jest.mock('@src/account-settings/fields/SitePreferencesFields', () => jest.requireActual('@src/tests/fieldStubs').default);

const countryInfo = 'We use your country to show the courses available where you live.';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

mergeSiteConfig({
  apps: [{
    appId: 'org.openedx.frontend.app.accountSectionExamplesTest',
    slots: [
      ...slots,
      {
        slotId: sectionSlotIds.basicInformation,
        id: 'org.openedx.frontend.widget.test.yearOfBirthHint',
        relatedId: 'org.openedx.frontend.widget.account.yearOfBirthField.v1',
        op: WidgetOperationTypes.INSERT_AFTER,
        component: YearOfBirthHint,
      },
      { slotId: sectionSlotIds.basicInformation, op: LayoutOperationTypes.REPLACE, component: FieldInfoLayout },
      {
        slotId: sectionSlotIds.basicInformation,
        op: LayoutOperationTypes.OPTIONS,
        options: { info: { 'org.openedx.frontend.widget.account.countryField.v1': countryInfo } },
      },
      {
        slotId: sectionSlotIds.sitePreferences,
        id: 'org.openedx.frontend.widget.test.timeZoneNotice',
        relatedId: 'org.openedx.frontend.widget.account.timeZoneField.v1',
        op: WidgetOperationTypes.REPLACE,
        component: TimeZoneNotice,
      },
      { slotId: sectionSlotIds.socialMedia, op: LayoutOperationTypes.REPLACE, component: SectionHighlightLayout },
      {
        slotId: sectionSlotIds.socialMedia,
        op: LayoutOperationTypes.OPTIONS,
        options: { highlight: 'org.openedx.frontend.widget.account.socialLinkFacebookField.v1' },
      },
    ],
  }],
});

it('adds a hint and an info tooltip to the selected basic information fields', async () => {
  const user = userEvent.setup();
  renderWithProviders(<AccountSettingsSectionSlot section="basicInformation" />);
  expect(screen.getByText('Some courses have age requirements.')).toBeInTheDocument();
  const help = screen.getAllByRole('button', { name: 'Why do we ask for this?' });
  expect(help).toHaveLength(1);
  await user.hover(help[0]);
  expect(await screen.findByText(countryInfo)).toBeVisible();
  expect(screen.getByText('StateField')).toBeInTheDocument();
});

it('replaces the time zone field with a notice', () => {
  renderWithProviders(<AccountSettingsSectionSlot section="sitePreferences" />);
  expect(screen.getByText('SiteLanguageField')).toBeInTheDocument();
  expect(screen.queryByText('TimeZoneField')).not.toBeInTheDocument();
  expect(screen.getByText('Your time zone is set by your organization.')).toBeInTheDocument();
});

it('highlights and scrolls to the configured widget', () => {
  const { container } = renderWithProviders(<AccountSettingsSectionSlot section="socialMedia" />);
  const highlighted = container.querySelector('.border-warning');
  expect(highlighted).toHaveTextContent('SocialLinkFacebookField');
  expect(highlighted).not.toHaveTextContent('SocialLinkLinkedinField');
  expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
});
