import { useId, useState } from 'react';
import { useSlotContext, useWidgets } from '@openedx/frontend-base';

const FieldHelp = () => {
  const [open, setOpen] = useState(false);
  const helpId = useId();
  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls={helpId} onClick={() => setOpen(!open)}>
        Why do we ask for your year of birth?
      </button>
      <p id={helpId} hidden={!open}>Some courses have age requirements.</p>
    </div>
  );
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
    return <><p>Your time zone is set by your organization.</p>{extraWidgets}</>;
  }
  if (fieldName === 'year_of_birth') {
    return (
      <>
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">{defaultField}</div>
          <FieldHelp />
        </div>
        {extraWidgets}
      </>
    );
  }
  return <>{widgets}</>;
};

export default SelectiveFieldLayout;
