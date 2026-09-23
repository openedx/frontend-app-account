import PropTypes from 'prop-types';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

/**
 * PluginSlot merges pluginProps into its default content's props. The field
 * components spread unknown props onto their inputs, so the field is rendered
 * through this pass-through, which drops them.
 *
 * Its `fieldName` prop is part of the slot's contract: a Modify operation on
 * `default_contents` reads it to target one field (see the README).
 */
// eslint-disable-next-line react/prop-types
const DefaultField = ({ field }) => field;

const AccountSettingsFieldSlot = ({ fieldName, value = null, children }) => (
  <div data-account-settings-field={fieldName}>
    <PluginSlot
      id="org.openedx.frontend.account.settings_field.v1"
      pluginProps={{ fieldName, value }}
    >
      <DefaultField fieldName={fieldName} field={children} />
    </PluginSlot>
  </div>
);

AccountSettingsFieldSlot.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
  children: PropTypes.node.isRequired,
};

export default AccountSettingsFieldSlot;
