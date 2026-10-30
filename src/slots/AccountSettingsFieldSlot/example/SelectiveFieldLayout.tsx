import { useSlotContext, useWidgets } from '@openedx/frontend-base';

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
    return <><p>Your time zone is set by your organization.</p>{extraWidgets}</>;
  }
  if (fieldName === 'year_of_birth') {
    return (
      <>
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">{defaultField}</div>
          <span>Why do we ask for your year of birth?</span>
        </div>
        {extraWidgets}
      </>
    );
  }
  return <>{widgets}</>;
};

export default SelectiveFieldLayout;
