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

## Customize selected fields

A site's layout can make different choices for each instance of the shared Slot. Copy
[`SelectiveFieldLayout.tsx`](./example/SelectiveFieldLayout.tsx) into your site and configure it:

```tsx
import { LayoutOperationTypes } from '@openedx/frontend-base';
import SelectiveFieldLayout from './SelectiveFieldLayout';

export default {
  slots: [{
    slotId: 'org.openedx.frontend.slot.account.settingsField.v1',
    op: LayoutOperationTypes.REPLACE,
    component: SelectiveFieldLayout,
  }],
};
```

The example adds adjacent help to `year_of_birth`, hides `social_link_x`, and replaces
`time_zone` with a display-only notice. Other fields retain their original content. Use
`useSlotContext()` to read `fieldName`, and `useWidgets()` to render the current instance's
widgets. The field is automatically included as `defaultContent`; `byId('defaultContent')`
selects it, while `withoutId('defaultContent')` keeps other widgets without duplicating it.
The example hides all widgets for a hidden field and keeps added widgets alongside the replacement.

Widget operations apply to every instance sharing the Slot ID. To hide or replace only one
field, make the decision in a context-aware layout instead of removing or replacing the shared
`defaultContent` widget through a site-wide widget operation. A replacement is display-only;
the Slot does not provide an editing or saving API.

For an extension-owned DOM target that supports styling, scrolling, or highlighting a field,
see the [optional field targeting layout](./example/FieldTargetLayout.md).
