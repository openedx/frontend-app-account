# Account settings field

Slot ID: `org.openedx.frontend.slot.account.settingsField.v1`

This shared Slot surrounds each text, select, and email account settings field. Its default content is the field, preserved automatically. Widgets can use `useSlotContext()` to read `fieldName` and `value`. Field names retain their existing spelling, including `siteLanguage`. Values are passed through unchanged and can include unsaved drafts. The Slot does not expose save or validation callbacks.

For example, copy the example hint into your site and configure it as follows:

```jsx
import { WidgetOperationTypes } from '@openedx/frontend-base';
import FieldHint from './FieldHint';

export default {
  slots: [{
    slotId: 'org.openedx.frontend.slot.account.settingsField.v1',
    id: 'account-field-hint',
    op: WidgetOperationTypes.APPEND,
    component: FieldHint,
  }],
};
```

The example renders a hint only for `year_of_birth`, leaving other fields unchanged. Widget IDs are configuration identities, not DOM IDs. The Slot does not add a field container.
