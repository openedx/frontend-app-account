import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'account.settings.section.demographics.information': {
    id: 'account.settings.section.demographics.information',
    defaultMessage: 'Optional Information',
    description: 'The optional information section heading.',
  },
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
  'account.settings.field.demographics.gender.options.woman': {
    id: 'account.settings.field.demographics.gender.options.woman',
    defaultMessage: 'Woman',
    description: 'The label for the woman gender identity option.',
  },
  'account.settings.field.demographics.gender.options.man': {
    id: 'account.settings.field.demographics.gender.options.man',
    defaultMessage: 'Man',
    description: 'The label for the man gender identity option.',
  },
  'account.settings.field.demographics.gender.options.non-binary': {
    id: 'account.settings.field.demographics.gender.options.non-binary',
    defaultMessage: 'Non-binary',
    description: 'The label for the non-binary gender identity option.',
  },
  'account.settings.field.demographics.gender.options.self-describe': {
    id: 'account.settings.field.demographics.gender.options.self-describe',
    defaultMessage: 'Prefer to self-describe',
    description: 'The label for self-describe gender identity option.',
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
  'account.settings.field.demographics.ethnicity.options.american-indian-or-alaska-native': {
    id: 'account.settings.field.demographics.ethnicity.options.american-indian-or-alaska-native',
    defaultMessage: 'American Indian or Alaska Native',
    description: 'The label for the American Indian or Alaska Native ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.asian': {
    id: 'account.settings.field.demographics.ethnicity.options.asian',
    defaultMessage: 'Asian',
    description: 'The label for the Asian ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.black-or-african-american': {
    id: 'account.settings.field.demographics.ethnicity.options.black-or-african-american',
    defaultMessage: 'Black or African American',
    description: 'The label for the Black or African American ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.hispanic-latin-spanish': {
    id: 'account.settings.field.demographics.ethnicity.options.hispanic-latin-spanish',
    defaultMessage: 'Hispanic, Latin, or Spanish origin',
    description: 'The label for the Hispanic, Latin, or Spanish origin ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.middle-eastern-or-north-african': {
    id: 'account.settings.field.demographics.ethnicity.options.middle-eastern-or-north-african',
    defaultMessage: 'Middle Eastern or North African',
    description: 'The label for the Middle Eastern or North African ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.native-hawaiian-or-pacific-islander': {
    id: 'account.settings.field.demographics.ethnicity.options.native-hawaiian-or-pacific-islander',
    defaultMessage: 'Native Hawaiian or Other Pacific Islander',
    description: 'The label for the Native Hawaiian or Other Pacific Islander ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.white': {
    id: 'account.settings.field.demographics.ethnicity.options.white',
    defaultMessage: 'White',
    description: 'The label for the White ethnicity option.',
  },
  'account.settings.field.demographics.ethnicity.options.other': {
    id: 'account.settings.field.demographics.ethnicity.options.other',
    defaultMessage: 'Some other race, ethnicity, or origin',
    description: 'The label for the Some other race, ethnicity, or origin ethnicity option.',
  },
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
  'account.settings.field.demographics.income.options.less-than-10k': {
    id: 'account.settings.field.demographics.income.options.less-than-10k',
    defaultMessage: 'Less than US $10,000',
    description: 'The label for the less than US $10,000 income option.',
  },
  'account.settings.field.demographics.income.options.10k-25k': {
    id: 'account.settings.field.demographics.income.options.10k-25k',
    defaultMessage: 'US $10,000 - $25,000',
    description: 'The label for the US $10,000 - $25,000 income option.',
  },
  'account.settings.field.demographics.income.options.25k-50k': {
    id: 'account.settings.field.demographics.income.options.25k-50k',
    defaultMessage: 'US $25,000 - $50,000',
    description: 'The label for the US $25,000 - $50,000 income option.',
  },
  'account.settings.field.demographics.income.options.50k-75k': {
    id: 'account.settings.field.demographics.income.options.50k-75k',
    defaultMessage: 'US $50,000 - $75,000',
    description: 'The label for the US $50,000 - $75,000 income option.',
  },
  'account.settings.field.demographics.income.options.over-100k': {
    id: 'account.settings.field.demographics.income.options.over-100k',
    defaultMessage: 'Over US $100,000',
    description: 'The label for the over US $100,000 income option.',
  },
  'account.settings.field.demographics.income.options.unsure': {
    id: 'account.settings.field.demographics.income.options.unsure',
    defaultMessage: 'I don\'t know',
    description: 'The label for the I don\'t know income option.',
  },
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
  'account.settings.field.demographics.military_history.options.never-served': {
    id: 'account.settings.field.demographics.income.options.never-served',
    defaultMessage: 'Never served in the military',
    description: 'The label for the never served in the military military history option.',
  },
  'account.settings.field.demographics.military_history.options.training': {
    id: 'account.settings.field.demographics.income.options.training',
    defaultMessage: 'Only on active duty for training',
    description: 'The label for the only on active duty for training military history option.',
  },
  'account.settings.field.demographics.military_history.options.active': {
    id: 'account.settings.field.demographics.income.options.active',
    defaultMessage: 'Now on active duty',
    description: 'The label for the now on active duty military history option.',
  },
  'account.settings.field.demographics.military_history.options.previously-active': {
    id: 'account.settings.field.demographics.income.options.previously-active',
    defaultMessage: 'On active duty in the past, but not now',
    description: 'The label for the on active duty in the past, but not now military history option.',
  },
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
  'account.settings.field.demographics.education_level.options.no-high-school': {
    id: 'account.settings.field.demographics.education_level.options.no-high-school',
    defaultMessage: 'No High School',
    description: 'The label for the no high school education level option.',
  },
  'account.settings.field.demographics.education_level.options.some-high-school': {
    id: 'account.settings.field.demographics.education_level.options.some-high-school',
    defaultMessage: 'Some High School',
    description: 'The label for the some high school education level option.',
  },
  'account.settings.field.demographics.education_level.options.high-school-ged-equivalent': {
    id: 'account.settings.field.demographics.education_level.options.high-school-ged-equivalent',
    defaultMessage: 'High School diploma, GED, or equivalent',
    description: 'The label for the high school diploma, GED, or equivalent education level option.',
  },
  'account.settings.field.demographics.education_level.options.some-college': {
    id: 'account.settings.field.demographics.education_level.options.some-college',
    defaultMessage: 'Some college, but no degree',
    description: 'The label for the some college, but no degree education level option.',
  },
  'account.settings.field.demographics.education_level.options.associates': {
    id: 'account.settings.field.demographics.education_level.options.associates',
    defaultMessage: 'Associates degree',
    description: 'The label for the Associates degree education level option.',
  },
  'account.settings.field.demographics.education_level.options.bachelors': {
    id: 'account.settings.field.demographics.education_level.options.bachelors',
    defaultMessage: 'Bachelors degree',
    description: 'The label for the Bachelors degree education level option.',
  },
  'account.settings.field.demographics.education_level.options.masters': {
    id: 'account.settings.field.demographics.education_level.options.masters',
    defaultMessage: 'Masters degree',
    description: 'The label for the Masters degree education level option.',
  },
  'account.settings.field.demographics.education_level.options.professional': {
    id: 'account.settings.field.demographics.education_level.options.professional',
    defaultMessage: 'Professional degree',
    description: 'The label for the Professional degree education level option.',
  },
  'account.settings.field.demographics.education_level.options.doctorate': {
    id: 'account.settings.field.demographics.education_level.options.doctorate',
    defaultMessage: 'Doctorate degree',
    description: 'The label for the Doctorate degree education level option.',
  },
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
  'account.settings.field.demographics.work_status.options.full-time': {
    id: 'account.settings.field.demographics.work_status.options.full-time',
    defaultMessage: 'Employed, working full-time',
    description: 'The label for the employed, working full-time work status option.',
  },
  'account.settings.field.demographics.work_status.options.part-time': {
    id: 'account.settings.field.demographics.work_status.options.part-time',
    defaultMessage: 'Employed, working part-time',
    description: 'The label for the employed, working part-time work status option.',
  },
  'account.settings.field.demographics.work_status.options.self-employed': {
    id: 'account.settings.field.demographics.work_status.options.self-employed',
    defaultMessage: 'Self-Employed',
    description: 'The label for the self-employed work status option.',
  },
  'account.settings.field.demographics.work_status.options.not-employed-looking': {
    id: 'account.settings.field.demographics.work_status.options.not-employed-looking',
    defaultMessage: 'Not employed, looking for work',
    description: 'The label for the not employed, looking for work work status option.',
  },
  'account.settings.field.demographics.work_status.options.not-employed-not-looking': {
    id: 'account.settings.field.demographics.work_status.options.not-employed-not-looking',
    defaultMessage: 'Not employed, not looking for work',
    description: 'The label for the not employed, not looking for work work status option.',
  },
  'account.settings.field.demographics.work_status.options.unable': {
    id: 'account.settings.field.demographics.work_status.options.unable',
    defaultMessage: 'Unable to work',
    description: 'The label for the unable to work work status option.',
  },
  'account.settings.field.demographics.work_status.options.retired': {
    id: 'account.settings.field.demographics.work_status.options.retired',
    defaultMessage: 'Retired',
    description: 'The label for the retired work status option.',
  },
  'account.settings.field.demographics.work_status.options.other': {
    id: 'account.settings.field.demographics.work_status.options.other',
    defaultMessage: 'Other',
    description: 'The label for the other work status option.',
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
  'account.settings.field.demographics.work_sector.options.accommodation-food': {
    id: 'account.settings.field.demographics.work_sector.options.accommodation-food',
    defaultMessage: 'Accommodation and Food Services',
    description: 'The label for the Accommodation and Food Services work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.administrative-support-waste-remediation': {
    id: 'account.settings.field.demographics.work_sector.options.administrative-support-waste-remediation',
    defaultMessage: 'Administrative and Support and Waste Management and Remediation Services',
    description: 'The label for the Administrative and Support and Waste Management and Remediation Services work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.agriculture-forestry-fishing-hunting': {
    id: 'account.settings.field.demographics.work_sector.options.agriculture-forestry-fishing-hunting',
    defaultMessage: 'Agriculture, Forestry, Fishing and Hunting',
    description: 'The label for the Agriculture, Forestry, Fishing and Hunting work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.arts-entertainment-recreation': {
    id: 'account.settings.field.demographics.work_sector.options.arts-entertainment-recreation',
    defaultMessage: 'Arts, Entertainment, and Recreation',
    description: 'The label for the Arts, Entertainment, and Recreation work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.construction': {
    id: 'account.settings.field.demographics.work_sector.options.construction',
    defaultMessage: 'Construction',
    description: 'The label for the Construction work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.educational': {
    id: 'account.settings.field.demographics.work_sector.options.educational',
    defaultMessage: 'Education Services',
    description: 'The label for the Education Services work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.finance-insurance': {
    id: 'account.settings.field.demographics.work_sector.options.finance-insurance',
    defaultMessage: 'Finance and Insurance',
    description: 'The label for the Finance and Insurance work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.healthcare-social': {
    id: 'account.settings.field.demographics.work_sector.options.healthcare-social',
    defaultMessage: 'Health Care and Social Assistance',
    description: 'The label for the Health Care and Social Assistance work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.information': {
    id: 'account.settings.field.demographics.work_sector.options.information',
    defaultMessage: 'Information',
    description: 'The label for the Information work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.management': {
    id: 'account.settings.field.demographics.work_sector.options.management',
    defaultMessage: 'Management of Companies and Enterprises',
    description: 'The label for the Management of Companies and Enterprises work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.manufacturing': {
    id: 'account.settings.field.demographics.work_sector.options.manufacturing',
    defaultMessage: 'Manufacturing',
    description: 'The label for the Manufacturing work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.mining-quarry-oil-gas': {
    id: 'account.settings.field.demographics.work_sector.options.mining-quarry-oil-gas',
    defaultMessage: 'Mining, Quarrying, and Oil and Gas Extraction',
    description: 'The label for the Mining, Quarrying, and Oil and Gas Extraction work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.professional-scientific-technical': {
    id: 'account.settings.field.demographics.work_sector.options.professional-scientific-technical',
    defaultMessage: 'Professional, Scientific, and Technical Services',
    description: 'The label for the Professional, Scientific, and Technical Services work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.public-admin': {
    id: 'account.settings.field.demographics.work_sector.options.public-admin',
    defaultMessage: 'Public Administration',
    description: 'The label for the Public Administration work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.real-estate': {
    id: 'account.settings.field.demographics.work_sector.options.real-estate',
    defaultMessage: 'Real Estate and Rental and Leasing',
    description: 'The label for the Real Estate and Rental and Leasing work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.retail': {
    id: 'account.settings.field.demographics.work_sector.options.retail',
    defaultMessage: 'Retail Trade',
    description: 'The label for the Retail Trade work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.transport-warehousing': {
    id: 'account.settings.field.demographics.work_sector.options.transport-warehousing',
    defaultMessage: 'Transportation and Warehousing',
    description: 'The label for the Transportation and Warehousing work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.utilities': {
    id: 'account.settings.field.demographics.work_sector.options.utilities',
    defaultMessage: 'Utilities',
    description: 'The label for the Utilities work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.trade': {
    id: 'account.settings.field.demographics.work_sector.options.trade',
    defaultMessage: 'Wholesale Trade',
    description: 'The label for the Wholesale Trade work sector option.',
  },
  'account.settings.field.demographics.work_sector.options.other': {
    id: 'account.settings.field.demographics.work_sector.options.other',
    defaultMessage: 'Other',
    description: 'The label for the Other work sector option.',
  },
  'account.settings.field.demographics.options.declined': {
    id: 'account.settings.field.demographics.options.declined',
    defaultMessage: 'Prefer not to respond',
    description: 'The label for the declined option.',
  },
  'account.settings.section.demographics.why': {
    id: 'account.settings.section.demographics.why',
    defaultMessage: 'Why does edX collect this information?',
    description: 'Link text for a link to external legal text',
  },
});

export default messages;
