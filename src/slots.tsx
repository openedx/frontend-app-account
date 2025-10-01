import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import CoursesMenuItem from './widgets/CoursesMenuItem';
import React from 'react';

const slots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
    id: 'org.openedx.frontend.widget.coursesMenu.headerLink',
    op: WidgetOperationTypes.APPEND,
    element: (
      <CoursesMenuItem label="Courses" role="org.openedx.frontend.role.learnerDashboard" variant="navLink" />
    )
  },
];

export default slots;
