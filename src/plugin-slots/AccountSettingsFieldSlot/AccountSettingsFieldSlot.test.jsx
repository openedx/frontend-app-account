import { render, screen } from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

import AccountSettingsFieldSlot from '.';
import { addFieldInfo, hideOrReplaceField } from './example';

// Use the real PluginSlot: the mocked one in setupTest.js would hide the
// pluginProps merge this slot has to guard against.
jest.mock('@openedx/frontend-plugin-framework', () => jest.requireActual('@openedx/frontend-plugin-framework'));

// eslint-disable-next-line react/prop-types
const Field = ({ name, ...others }) => <select name={name} data-testid="field" {...others} />;

describe('AccountSettingsFieldSlot', () => {
  it('renders the field inside a container named after it', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <AccountSettingsFieldSlot fieldName="year_of_birth" value={1990}>
          <Field name="year_of_birth" />
        </AccountSettingsFieldSlot>
      </IntlProvider>,
    );

    expect(container.querySelector('[data-account-settings-field="year_of_birth"]'))
      .toContainElement(screen.getByTestId('field'));
  });

  it('does not pass the plugin props on to the field', () => {
    render(
      <IntlProvider locale="en">
        <AccountSettingsFieldSlot fieldName="year_of_birth" value={1990}>
          <Field name="year_of_birth" />
        </AccountSettingsFieldSlot>
      </IntlProvider>,
    );

    const field = screen.getByTestId('field');
    expect(field).not.toHaveAttribute('fieldName');
    expect(field).not.toHaveAttribute('fieldname');
    expect(field).not.toHaveAttribute('value');
  });

  describe('when a Modify operation targets one field', () => {
    // eslint-disable-next-line react/prop-types
    const Replacement = ({ fieldName, value }) => <p data-testid="replacement">{`${fieldName}: ${value}`}</p>;

    beforeEach(() => {
      mergeConfig({
        pluginSlots: {
          'org.openedx.frontend.account.settings_field.v1': {
            keepDefault: true,
            plugins: [{
              op: PLUGIN_OPERATIONS.Modify,
              widgetId: 'default_contents',
              fn: (widget) => {
                switch (widget.RenderWidget.props.fieldName) {
                  case 'social_link_x': return { ...widget, hidden: true };
                  case 'time_zone': return { ...widget, RenderWidget: <Replacement /> };
                  default: return widget;
                }
              },
            }],
          },
        },
      });
    });

    afterEach(() => {
      mergeConfig({ pluginSlots: {} });
    });

    it('hides or replaces only the targeted fields', () => {
      render(
        <IntlProvider locale="en">
          <AccountSettingsFieldSlot fieldName="year_of_birth" value={1990}>
            <Field name="year_of_birth" />
          </AccountSettingsFieldSlot>
          <AccountSettingsFieldSlot fieldName="social_link_x" value="">
            <p data-testid="x">x</p>
          </AccountSettingsFieldSlot>
          <AccountSettingsFieldSlot fieldName="time_zone" value="Europe/Lisbon">
            <p data-testid="time-zone">time zone</p>
          </AccountSettingsFieldSlot>
        </IntlProvider>,
      );

      expect(screen.getByTestId('field')).toBeInTheDocument();
      expect(screen.queryByTestId('x')).not.toBeInTheDocument();
      expect(screen.queryByTestId('time-zone')).not.toBeInTheDocument();
      // The replacement gets the slot's plugin props.
      expect(screen.getByTestId('replacement')).toHaveTextContent('time_zone: Europe/Lisbon');
    });
  });

  describe('with the README examples', () => {
    beforeEach(() => {
      mergeConfig({
        pluginSlots: {
          'org.openedx.frontend.account.settings_field.v1': {
            keepDefault: true,
            plugins: [
              { op: PLUGIN_OPERATIONS.Modify, widgetId: 'default_contents', fn: addFieldInfo },
              { op: PLUGIN_OPERATIONS.Modify, widgetId: 'default_contents', fn: hideOrReplaceField },
            ],
          },
        },
      });
    });

    afterEach(() => {
      mergeConfig({ pluginSlots: {} });
    });

    it('adds the info button beside some fields and hides or replaces others', () => {
      const { container } = render(
        <IntlProvider locale="en">
          <AccountSettingsFieldSlot fieldName="year_of_birth" value={1990}>
            <Field name="year_of_birth" />
          </AccountSettingsFieldSlot>
          <AccountSettingsFieldSlot fieldName="country" value="PT">
            <p data-testid="country">country</p>
          </AccountSettingsFieldSlot>
          <AccountSettingsFieldSlot fieldName="email">
            <p data-testid="email">email</p>
          </AccountSettingsFieldSlot>
          <AccountSettingsFieldSlot fieldName="social_link_x" value="">
            <p data-testid="x">x</p>
          </AccountSettingsFieldSlot>
          <AccountSettingsFieldSlot fieldName="time_zone" value="Europe/Lisbon">
            <p data-testid="time-zone">time zone</p>
          </AccountSettingsFieldSlot>
        </IntlProvider>,
      );

      const infoButtonIn = (fieldName) => container
        .querySelector(`[data-account-settings-field="${fieldName}"] [aria-label="Why do we ask for this?"]`);

      // addFieldInfo: an info button beside year of birth and country, and the fields are still there.
      expect(infoButtonIn('year_of_birth')).toBeInTheDocument();
      expect(infoButtonIn('country')).toBeInTheDocument();
      expect(screen.getByTestId('field')).toBeInTheDocument();
      expect(screen.getByTestId('country')).toBeInTheDocument();
      // A field it doesn't know is left alone.
      expect(infoButtonIn('email')).not.toBeInTheDocument();
      expect(screen.getByTestId('email')).toBeInTheDocument();
      // hideOrReplaceField: X hidden, time zone replaced by the notice.
      expect(screen.queryByTestId('x')).not.toBeInTheDocument();
      expect(screen.queryByTestId('time-zone')).not.toBeInTheDocument();
      expect(screen.getByText('Your time zone is set by your organization.')).toBeInTheDocument();
    });
  });
});
