import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  /* Demographics section heading */
  'account.settings.section.demographics.information': {
    id: 'account.settings.section.demographics.information',
    defaultMessage: 'Optional Information',
    description: 'The optional information section heading.',
  },
  /* Gender identity */
  'account.settings.field.demographics.gender': {
    id: 'account.settings.field.demographics.gender',
    defaultMessage: 'Gender identity',
    description: 'Label for account settings gender identity field.',
  },
  'account.settings.field.demographics.gender.empty': {
    id: 'account.settings.field.demographics.gender.empty',
    defaultMessage: 'Add gender identity',
    description: 'Placeholder for empty account settings gender identity field.',
  },
  'account.settings.field.demographics.gender.options.empty': {
    id: 'account.settings.field.demographics.gender.options.empty',
    defaultMessage: 'Select a gender identity',
    description: 'Placeholder for the gender identity options dropdown.',
  },
  'account.settings.field.demographics.gender_description': {
    id: 'account.settings.field.demographics.gender_description',
    defaultMessage: 'Gender identity description',
    description: 'Label for account settings gender identity description field.',
  },
  'account.settings.field.demographics.gender_description.empty': {
    id: 'account.settings.field.demographics.gender_description.empty',
    defaultMessage: 'Enter description',
    description: 'Placeholder for empty account settings gender identity field.',
  },
  /* Ethnicity */
  'account.settings.field.demographics.ethnicity': {
    id: 'account.settings.field.demographics.ethnicity',
    defaultMessage: 'Race/Ethnicity identity',
    description: 'Label for account settings ethnic background field.',
  },
  'account.settings.field.demographics.ethnicity.empty': {
    id: 'account.settings.field.demographics.ethnicity.empty',
    defaultMessage: 'Add race/ethnicity identity',
    description: 'Placeholder for empty account settings ethnic background field.',
  },
  'account.settings.field.demographics.ethnicity.options.empty': {
    id: 'account.settings.field.demographics.ethnicity.options.empty',
    defaultMessage: 'Select all that apply', // TODO: Is this the desired text?
    description: 'Placeholder for the ethnic background options field.',
  },
  /* Income */
  'account.settings.field.demographics.income': {
    id: 'account.settings.field.demographics.income',
    defaultMessage: 'Family income',
    description: 'Label for account settings household income field.',
  },
  'account.settings.field.demographics.income.empty': {
    id: 'account.settings.field.demographics.income.empty',
    defaultMessage: 'Add family income',
    description: 'Placeholder for empty account settings household income field.',
  },
  'account.settings.field.demographics.income.options.empty': {
    id: 'account.settings.field.demographics.income.options.empty',
    defaultMessage: 'Select a family income range',
    description: 'Placeholder for the household income dropdown.',
  },
  /* Military history */
  'account.settings.field.demographics.military_history': {
    id: 'account.settings.field.demographics.military_history',
    defaultMessage: 'U.S. Military status',
    description: 'Label for account settings military history field.',
  },
  'account.settings.field.demographics.military_history.empty': {
    id: 'account.settings.field.demographics.military_history.empty',
    defaultMessage: 'Add military status',
    description: 'Placeholder for empty account settings military history field.',
  },
  'account.settings.field.demographics.military_history.options.empty': {
    id: 'account.settings.field.demographics.military_history.options.empty',
    defaultMessage: 'Select military status',
    description: 'Placeholder for the military history dropdown.',
  },
  /* Learner and family education level */
  'account.settings.field.demographics.learner_education_level': {
    id: 'account.settings.field.demographics.learner_education_level',
    defaultMessage: 'Your education level',
    description: 'Label for account settings learner education level field.',
  },
  'account.settings.field.demographics.learner_education_level.empty': {
    id: 'account.settings.field.demographics.learner_education_level.empty',
    defaultMessage: 'Add education level',
    description: 'Placeholder for empty account settings learner education level field.',
  },
  'account.settings.field.demographics.parent_education_level': {
    id: 'account.settings.field.demographics.parent_education_level',
    defaultMessage: 'Parents/Guardians education level',
    description: 'Label for account settings parent education level field.',
  },
  'account.settings.field.demographics.parent_education_level.empty': {
    id: 'account.settings.field.demographics.parent_education_level.empty',
    defaultMessage: 'Add education level',
    description: 'Placeholder for empty account settings parent education level field.',
  },
  'account.settings.field.demographics.education_level.options.empty': {
    id: 'account.settings.field.demographics.education_level.options.empty',
    defaultMessage: 'Select education level',
    description: 'Placeholder for the education level options dropdown.',
  },
  /* Work status */
  'account.settings.field.demographics.work_status': {
    id: 'account.settings.field.demographics.work_status',
    defaultMessage: 'Employment status',
    description: 'Label for account settings work status field.',
  },
  'account.settings.field.demographics.work_status.empty': {
    id: 'account.settings.field.demographics.work_status.empty',
    defaultMessage: 'Add employment status',
    description: 'Placeholder for empty account settings work status field.',
  },
  'account.settings.field.demographics.work_status.options.empty': {
    id: 'account.settings.field.demographics.work_status.options.empty',
    defaultMessage: 'Select employment status',
    description: 'Placeholder for the work status options dropdown.',
  },
  'account.settings.field.demographics.work_status_description': {
    id: 'account.settings.field.demographics.work_status_description',
    defaultMessage: 'Employment status description',
    description: 'Label for account settings work status description field.',
  },
  'account.settings.field.demographics.work_status_description.empty': {
    id: 'account.settings.field.demographics.work_status_description.empty',
    defaultMessage: 'Enter description',
    description: 'Placeholder for empty account settings work status description field.',
  },
  /* Work sector */
  'account.settings.field.demographics.current_work_sector': {
    id: 'account.settings.field.demographics.current_work_sector',
    defaultMessage: 'Current work industry',
    description: 'Label for account settings current work sector field.',
  },
  'account.settings.field.demographics.current_work_sector.empty': {
    id: 'account.settings.field.demographics.current_work_sector.empty',
    defaultMessage: 'Add work industry',
    description: 'Placeholder for empty account settings current work sector field.',
  },
  'account.settings.field.demographics.future_work_sector': {
    id: 'account.settings.field.demographics.future_work_sector',
    defaultMessage: 'Future work industry',
    description: 'Label for account settings future work sector field.',
  },
  'account.settings.field.demographics.future_work_sector.empty': {
    id: 'account.settings.field.demographics.future_work_sector.empty',
    defaultMessage: 'Add work industry',
    description: 'Placeholder for empty account settings future work sector field.',
  },
  'account.settings.field.demographics.work_sector.options.empty': {
    id: 'account.settings.field.demographics.work_sector.options.empty',
    defaultMessage: 'Select work industry',
    description: 'Placeholder for the work sector options dropdown.',
  },
  /* Legal copy link text */
  'account.settings.section.demographics.why': {
    id: 'account.settings.section.demographics.why',
    defaultMessage: 'Why does edX collect this information?',
    description: 'Link text for a link to external legal text',
  },
});

export default messages;
