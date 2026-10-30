# Optional field targeting layout

The default account settings field Slot adds no DOM container. A site that needs a stable target for styling, scrolling, or highlighting can copy `FieldTargetLayout.tsx` into its own source and configure it as a layout replacement:

```tsx
import { LayoutOperationTypes } from '@openedx/frontend-base';
import FieldTargetLayout from './FieldTargetLayout';

export default {
  slots: [{
    slotId: 'org.openedx.frontend.slot.account.settingsField.v1',
    op: LayoutOperationTypes.REPLACE,
    component: FieldTargetLayout,
  }],
};
```

The layout renders all configured widgets inside a container with `data-account-settings-field` set to the field name. For example, `document.querySelector('[data-account-settings-field="username"]')` selects the username container, which remains present while the field enters and leaves editing. A site can use that element for its own scrolling or highlighting; this example does not perform either action automatically.

Widget IDs are configuration identities, not DOM IDs. Each instance of this shared Slot has a widget named `defaultContent`, so that ID cannot locate a specific field element in the document. This layout is optional and belongs to the site, not the default field Slot.
