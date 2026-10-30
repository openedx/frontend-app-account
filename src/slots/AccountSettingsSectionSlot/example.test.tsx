import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutOperationTypes, mergeSiteConfig, WidgetOperationTypes } from '@openedx/frontend-base';

import { renderWithProviders } from '@src/tests/renderWithProviders';
import AccountSettingsSectionSlot, { sectionSlotIds } from './index';
import sectionWidgetOperations, { sectionWidgetId } from './widgets';
import {
  FieldInfoLayout, SectionHighlightLayout, TimeZoneNotice, YearOfBirthHint,
} from './example';

const countryInfo = 'We use your country to show the courses available where you live.';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

mergeSiteConfig({
  apps: [{
    appId: 'org.openedx.frontend.app.accountSectionExamplesTest',
    slots: [
      ...sectionWidgetOperations,
      {
        slotId: sectionSlotIds.basicInformation,
        id: 'org.openedx.frontend.widget.test.yearOfBirthHint',
        relatedId: sectionWidgetId('yearOfBirthField'),
        op: WidgetOperationTypes.INSERT_AFTER,
        component: YearOfBirthHint,
      },
      { slotId: sectionSlotIds.basicInformation, op: LayoutOperationTypes.REPLACE, component: FieldInfoLayout },
      {
        slotId: sectionSlotIds.basicInformation,
        op: LayoutOperationTypes.OPTIONS,
        options: { info: { [sectionWidgetId('countryField')]: countryInfo } },
      },
      {
        slotId: sectionSlotIds.sitePreferences,
        id: 'org.openedx.frontend.widget.test.timeZoneNotice',
        relatedId: sectionWidgetId('timeZoneField'),
        op: WidgetOperationTypes.REPLACE,
        component: TimeZoneNotice,
      },
      { slotId: sectionSlotIds.socialMedia, op: LayoutOperationTypes.REPLACE, component: SectionHighlightLayout },
      {
        slotId: sectionSlotIds.socialMedia,
        op: LayoutOperationTypes.OPTIONS,
        options: { highlight: sectionWidgetId('socialLinkFacebookField') },
      },
    ],
  }],
});

it('adds a hint and an info tooltip to the selected basic information fields', async () => {
  const user = userEvent.setup();
  renderWithProviders(
    <AccountSettingsSectionSlot
      section="basicInformation"
      fields={{ yearOfBirthField: <p>Year of birth</p>, countryField: <p>Country</p>, stateField: <p>State</p> }}
    />,
  );
  expect(screen.getByText('Some courses have age requirements.')).toBeInTheDocument();
  const help = screen.getAllByRole('button', { name: 'Why do we ask for this?' });
  expect(help).toHaveLength(1);
  await user.hover(help[0]);
  expect(await screen.findByText(countryInfo)).toBeVisible();
  expect(screen.getByText('State')).toBeInTheDocument();
});

it('replaces the time zone field with a notice', () => {
  renderWithProviders(
    <AccountSettingsSectionSlot
      section="sitePreferences"
      fields={{ siteLanguageField: <p>Site language</p>, timeZoneField: <p>Time zone</p> }}
    />,
  );
  expect(screen.getByText('Site language')).toBeInTheDocument();
  expect(screen.queryByText('Time zone')).not.toBeInTheDocument();
  expect(screen.getByText('Your time zone is set by your organization.')).toBeInTheDocument();
});

it('highlights and scrolls to the configured widget', () => {
  const { container } = renderWithProviders(
    <AccountSettingsSectionSlot
      section="socialMedia"
      fields={{ socialLinkLinkedinField: <p>LinkedIn</p>, socialLinkFacebookField: <p>Facebook</p> }}
    />,
  );
  const highlighted = container.querySelector('.border-warning');
  expect(highlighted).toHaveTextContent('Facebook');
  expect(highlighted).not.toHaveTextContent('LinkedIn');
  expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
});
