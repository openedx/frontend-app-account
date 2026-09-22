# `frontend-app-account` Slots

* [`org.openedx.frontend.slot.account.additionalProfileFields.v1`](./AdditionalProfileFieldsSlot/)
* [`org.openedx.frontend.slot.account.idVerificationPage.v1`](./IdVerificationPageSlot/)

The footer is the shell's; see [frontend-base](https://github.com/openedx/frontend-base) for its
slots.

## Renamed slots

These slots were plugin slots of the legacy micro-frontend, under the ids below. They follow
[the frontend-base slot naming ADR](https://github.com/openedx/frontend-base/blob/main/docs/decisions/0009-slot-naming-and-lifecycle.rst)
now, and are configured through `site.config` rather than `env.config`.

| Legacy plugin slot id | Slot id |
|---|---|
| `org.openedx.frontend.account.additional_profile_fields.v1` | `org.openedx.frontend.slot.account.additionalProfileFields.v1` |
| `org.openedx.frontend.account.id_verification_page.v1` (alias `id_verification_page_plugin`) | `org.openedx.frontend.slot.account.idVerificationPage.v1` |
| `org.openedx.frontend.layout.footer.v1` (alias `footer_slot`) | the shell's `org.openedx.frontend.slot.footer.main.v1` |
