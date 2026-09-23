import PropTypes from 'prop-types';
import { Icon, IconButtonWithTooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';

const FIELD_INFO = {
  year_of_birth: 'Some courses are only open to learners of a certain age, so we ask for your year of birth.',
  country: 'We use your country to show the courses available where you live.',
};

/**
 * Renders the original field with an info button beside it. The slot also
 * passes it `fieldName` and `value`; the original field arrives as `field`.
 */
const FieldWithInfo = ({ field, fieldName }) => (
  <div className="d-flex align-items-start">
    <div className="flex-grow-1">{field}</div>
    <IconButtonWithTooltip
      src={InfoOutline}
      iconAs={Icon}
      alt="Why do we ask for this?"
      tooltipPlacement="left"
      tooltipContent={FIELD_INFO[fieldName]}
      size="sm"
    />
  </div>
);

FieldWithInfo.propTypes = {
  field: PropTypes.node.isRequired,
  fieldName: PropTypes.string.isRequired,
};

/**
 * `fn` for a Modify operation on `default_contents`: it runs once per field
 * and adds an info button beside the fields listed in FIELD_INFO.
 */
export const addFieldInfo = (widget) => {
  const { fieldName } = widget.RenderWidget.props;
  if (!FIELD_INFO[fieldName]) { return widget; }
  return {
    ...widget,
    RenderWidget: <FieldWithInfo field={widget.RenderWidget} fieldName={fieldName} />,
  };
};

const TimeZoneNotice = () => (
  <div className="form-group">
    <h6 aria-level="3">Time zone</h6>
    <p>Your time zone is set by your organization.</p>
  </div>
);

/**
 * `fn` for a Modify operation on `default_contents`: it runs once per field,
 * hides the X (Twitter) link, replaces the time zone field and leaves the rest.
 */
export const hideOrReplaceField = (widget) => {
  switch (widget.RenderWidget.props.fieldName) {
    case 'social_link_x':
      return { ...widget, hidden: true };
    case 'time_zone':
      return { ...widget, RenderWidget: <TimeZoneNotice /> };
    default:
      return widget;
  }
};
