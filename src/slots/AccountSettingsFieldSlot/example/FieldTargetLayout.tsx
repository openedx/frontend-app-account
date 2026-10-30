import { useSlotContext, useWidgets } from '@openedx/frontend-base';

/** Optional site-owned layout that gives each field a DOM target. */
const FieldTargetLayout = () => {
  const { fieldName } = useSlotContext();
  const widgets = useWidgets();

  return (
    <div data-account-settings-field={typeof fieldName === 'string' ? fieldName : undefined}>
      {widgets}
    </div>
  );
};

export default FieldTargetLayout;
