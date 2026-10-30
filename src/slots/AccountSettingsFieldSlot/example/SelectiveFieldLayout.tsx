import { useSlotContext, useWidgets } from '@openedx/frontend-base';
import { Icon, IconButtonWithTooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';

const fieldInfo: Record<string, string> = {
  year_of_birth: 'Some courses are only open to learners of a certain age, so we ask for your year of birth.',
  country: 'We use your country to show the courses available where you live.',
};

/** Example site layout: customize individual instances of the shared slot. */
const SelectiveFieldLayout = () => {
  const { fieldName } = useSlotContext();
  const widgets = useWidgets();
  const defaultField = widgets.byId('defaultContent');
  const extraWidgets = widgets.withoutId('defaultContent');

  if (fieldName === 'social_link_x') {
    return null;
  }
  if (fieldName === 'time_zone') {
    return <><p className="text-danger">Your time zone is set by your organization.</p>{extraWidgets}</>;
  }
  if (typeof fieldName === 'string' && fieldInfo[fieldName]) {
    return (
      <>
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">{defaultField}</div>
          <IconButtonWithTooltip
            src={InfoOutline}
            iconAs={Icon}
            alt="Why do we ask for this?"
            tooltipPlacement="left"
            tooltipContent={fieldInfo[fieldName]}
            size="sm"
          />
        </div>
        {extraWidgets}
      </>
    );
  }
  return <>{widgets}</>;
};

export default SelectiveFieldLayout;
