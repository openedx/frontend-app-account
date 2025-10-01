import { getUrlByRouteRole, LinkMenuItem, MenuItemName } from '@openedx/frontend-base';
import React from 'react';

interface CoursesMenuItemProps {
  label: MenuItemName,
  role: string,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

const CoursesMenuItem = ({ label, role, variant = 'hyperlink' }: CoursesMenuItemProps) => {
  const url = getUrlByRouteRole(role) ?? '#';

  return (
    <LinkMenuItem
      label={label}
      url={url}
      variant={variant}
    />
  );
};
export default CoursesMenuItem;
