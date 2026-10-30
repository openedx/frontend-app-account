import { createContext, ReactNode } from 'react';

/**
 * The page renders each section's fields and hands them to the section's default widgets through
 * this context.  It is internal: widgets added by sites do not receive it.
 */
const AccountSettingsSectionFieldsContext = createContext<Record<string, ReactNode>>({});

export default AccountSettingsSectionFieldsContext;
