import { screen } from '@testing-library/react';
import {
  LayoutOperationTypes, mergeSiteConfig, useWidgets, WidgetOperationTypes,
} from '@openedx/frontend-base';

import { renderWithProviders } from '@src/tests/renderWithProviders';
import AccountSettingsSectionSlot, { sectionSlotIds } from './index';
import sectionWidgetOperations, { sectionWidgetId } from './widgets';

const Hint = () => <p>Some courses have age requirements.</p>;
const Notice = () => <p>Your time zone is set by your organization.</p>;

const highlighted = sectionWidgetId('countryField');
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
      ...sectionWidgetOperations,
      {
        slotId: sectionSlotIds.socialMedia,
        relatedId: sectionWidgetId('socialLinkXField'),
        op: WidgetOperationTypes.REMOVE,
      },
      {
        slotId: sectionSlotIds.sitePreferences,
        id: 'org.openedx.frontend.widget.test.timeZoneNotice',
        relatedId: sectionWidgetId('timeZoneField'),
        op: WidgetOperationTypes.REPLACE,
        component: Notice,
      },
      {
        slotId: sectionSlotIds.basicInformation,
        id: 'org.openedx.frontend.widget.test.yearOfBirthHint',
        relatedId: sectionWidgetId('yearOfBirthField'),
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

it('renders the page-supplied fields as default widgets in order', () => {
  renderWithProviders(
    <AccountSettingsSectionSlot
      section="profileInformation"
      fields={{
        genderField: <p>Gender</p>,
        levelOfEducationField: <p>Education</p>,
        workExperienceField: false,
      }}
    />,
  );
  expect(screen.getAllByText(/Gender|Education/).map(node => node.textContent)).toEqual(['Education', 'Gender']);
});

it('removes and replaces a single field by widget ID', () => {
  renderWithProviders(
    <>
      <AccountSettingsSectionSlot
        section="socialMedia"
        fields={{ socialLinkLinkedinField: <p>LinkedIn</p>, socialLinkXField: <p>X</p> }}
      />
      <AccountSettingsSectionSlot
        section="sitePreferences"
        fields={{ siteLanguageField: <p>Site language</p>, timeZoneField: <p>Time zone</p> }}
      />
    </>,
  );
  expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  expect(screen.queryByText('X')).not.toBeInTheDocument();
  expect(screen.getByText('Site language')).toBeInTheDocument();
  expect(screen.queryByText('Time zone')).not.toBeInTheDocument();
  expect(screen.getByText('Your time zone is set by your organization.')).toBeInTheDocument();
});

it('inserts a hint after one field and lets a layout highlight another', () => {
  renderWithProviders(
    <AccountSettingsSectionSlot
      section="basicInformation"
      fields={{
        yearOfBirthField: <p>Year of birth</p>,
        countryField: <p>Country</p>,
        stateField: <p>State</p>,
      }}
    />,
  );
  expect(screen.getAllByText(/Year of birth|age requirements|Country/).map(node => node.textContent))
    .toEqual(['Year of birth', 'Some courses have age requirements.', 'Country']);
  expect(screen.getByTestId('highlight')).toHaveTextContent('Country');
  expect(screen.getByTestId('highlight')).not.toHaveTextContent('State');
});
