import { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

interface AccountSettingsFieldSlotProps {
  fieldName: string;
  value?: unknown;
  children: ReactNode;
}

const AccountSettingsFieldSlot = ({ fieldName, value, children }: AccountSettingsFieldSlotProps) => (
  <Slot id="org.openedx.frontend.slot.account.settingsField.v1" fieldName={fieldName} value={value}>
    {children}
  </Slot>
);

export default AccountSettingsFieldSlot;
