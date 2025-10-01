# ID Verification Page Slot

### Slot ID: `org.openedx.frontend.slot.account.idVerificationPage.v1`

### Slot ID Aliases
* `id_verification_page_plugin`

## Description

This slot is used to replace/modify the IDV Page.

The implementation of the `IdVerificationPageSlot` component lives in `src/plugin-slots/IdVerificationPageSlot/index.jsx`.

## Example

The following `env.config.jsx` will replace the default IDV Page.

![Screenshot of Default IDV Page](./images/default_id-verification-page.png)

```jsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

const config = {
  pluginSlots: {
    'org.openedx.frontend.slot.account.idVerificationPage.v1': {
      plugins: [
        {
          // Insert a custom IDV Page
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_id_verification_page',
            type: DIRECT_PLUGIN,
            RenderWidget: () => (
              <div>
                <p>This is the new IDV page</p>
                <a href="/">Go Home</a>
              </div>
            ),
          },
        },
      ],
    },
  },
};

export default config;

```
