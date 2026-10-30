import { useSlotContext } from '@openedx/frontend-base';

const FieldHint = () => {
  const { fieldName } = useSlotContext();
  return fieldName === 'year_of_birth' ? <p>Some courses have age requirements.</p> : null;
};

export default FieldHint;
