import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'account.settings.page.heading': {
    id: 'account.settings.page.heading',
    defaultMessage: 'Account Settings',
    description: 'The page heading for the account settings page.',
  },
  'account.settings.loading.message': {
    id: 'account.settings.loading.message',
    defaultMessage: 'Loading...',
    description: 'Message when data is being loaded',
  },
  'account.settings.loading.error': {
    id: 'account.settings.loading.error',
    defaultMessage: 'Error: {error}',
    description: 'Message when data failed to load',
  },
  'account.settings.banner.beta.language': {
    id: 'account.settings.banner.beta.language',
    defaultMessage: 'You have set your language to {beta_language}, which is currently not fully translated. You can help us translate this language fully by joining the Transifex community and adding translations from English for learners that speak {beta_language}.',
    description: 'Message when the user selects a beta language this is not yet fully translated.',
  },
  'account.settings.banner.beta.language.action.switch.back': {
    id: 'account.settings.banner.beta.language.action.switch.back',
    defaultMessage: 'Switch Back to {previous_language}',
    description: 'Button on the beta language message to switch back to the previous language.',
  },
  'account.settings.banner.beta.language.action.help.translate': {
    id: 'account.settings.banner.beta.language.action.help.translate',
    defaultMessage: 'Help Translate into {beta_language}',
    description: 'Button on the beta language message to help translate the beta language.',
  },
  'account.settings.section.account.information': {
    id: 'account.settings.section.account.information',
    defaultMessage: 'Account Information',
    description: 'The basic account information section heading.',
  },
  'account.settings.section.account.information.description': {
    id: 'account.settings.section.account.information.description',
    defaultMessage: 'These settings include basic information about your account.',
    description: 'The basic account information section heading description.',
  },
  'account.settings.section.profile.information': {
    id: 'account.settings.section.profile.information',
    defaultMessage: 'Profile Information',
    description: 'The profile information section heading.',
  },
  'account.settings.section.demographics.information': {
    id: 'account.settings.section.demographics.information',
    defaultMessage: 'Optional Information',
    description: 'The optional information section heading.',
  },
  'account.settings.section.site.preferences': {
    id: 'account.settings.section.site.preferences',
    defaultMessage: 'Site Preferences',
    description: 'The site preferences section heading.',
  },
  'account.settings.section.linked.accounts': {
    id: 'account.settings.section.linked.accounts',
    defaultMessage: 'Linked Accounts',
    description: 'The linked accounts section heading.',
  },
  'account.settings.section.linked.accounts.description': {
    id: 'account.settings.section.linked.accounts.description',
    defaultMessage: 'You can link your identity accounts to simplify signing in to edX.',
    description: 'The linked accounts section heading description.',
  },
  'account.settings.field.username': {
    id: 'account.settings.field.username',
    defaultMessage: 'Username',
    description: 'Label for account settings username field.',
  },
  'account.settings.field.username.help.text': {
    id: 'account.settings.field.username.help.text',
    defaultMessage: 'The name that identifies you on edX. You cannot change your username.',
    description: 'Help text for the account settings username field.',
  },
  'account.settings.field.full.name': {
    id: 'account.settings.field.full.name',
    defaultMessage: 'Full name',
    description: 'Label for account settings name field.',
  },
  'account.settings.field.full.name.empty': {
    id: 'account.settings.field.full.name.empty',
    defaultMessage: 'Add name',
    description: 'Placeholder for empty account settings name field.',
  },
  'account.settings.field.full.name.help.text': {
    id: 'account.settings.field.full.name.help.text',
    defaultMessage: 'The name that is used for ID verification and that appears on your certificates.',
    description: 'Help text for the account settings name field.',
  },
  'account.settings.field.email': {
    id: 'account.settings.field.email',
    defaultMessage: 'Email address (Sign in)',
    description: 'Label for account settings email field.',
  },
  'account.settings.field.email.empty': {
    id: 'account.settings.field.email.empty',
    defaultMessage: 'Add email address',
    description: 'Placeholder for empty account settings email field.',
  },
  'account.settings.field.email.confirmation': {
    id: 'account.settings.field.email.confirmation',
    defaultMessage: 'We’ve sent a confirmation message to {value}. Click the link in the message to update your email address.',
    description: 'Confirmation message for saving the account settings email field.',
  },
  'account.settings.field.email.help.text': {
    id: 'account.settings.field.email.help.text',
    defaultMessage: 'You receive messages from edX and course teams at this address.',
    description: 'Help text for the account settings email field.',
  },
  'account.settings.field.secondary.email': {
    id: 'account.settings.field.secondary.email',
    defaultMessage: 'Recovery email address',
    description: 'Label for account settings recovery email field.',
  },
  'account.settings.field.secondary.email.empty': {
    id: 'account.settings.field.secondary.email.empty',
    defaultMessage: 'Add a recovery email address',
    description: 'Placeholder for empty account settings recovery email field.',
  },
  'account.settings.field.secondary.email.confirmation': {
    id: 'account.settings.field.secondary.email.confirmation',
    defaultMessage: 'We’ve sent a confirmation message to {value}. Click the link in the message to update your recovery email address.',
    description: 'Confirmation message for saving the account settings recovery email field.',
  },
  'account.settings.email.field.confirmation.header': {
    id: 'account.settings.email.field.confirmation.header',
    defaultMessage: 'One more step!',
    description: 'The header of the confirmation alert saying we\'ve sent a confirmation email',
  },
  'account.settings.field.dob': {
    id: 'account.settings.field.dob',
    defaultMessage: 'Year of birth',
    description: 'Label for account settings year of birth field.',
  },
  'account.settings.field.dob.empty': {
    id: 'account.settings.field.dob.empty',
    defaultMessage: 'Add year of birth',
    description: 'Placeholder for empty account settings year of birth field.',
  },
  'account.settings.field.year_of_birth.options.empty': {
    id: 'account.settings.field.year_of_birth.options.empty',
    defaultMessage: 'Select a year of birth',
    description: 'Option for empty value on account settings year of birth field.',
  },
  'account.settings.field.country': {
    id: 'account.settings.field.country',
    defaultMessage: 'Country',
    description: 'Label for account settings country field.',
  },
  'account.settings.field.country.empty': {
    id: 'account.settings.field.country.empty',
    defaultMessage: 'Add country',
    description: 'Placeholder for empty account settings country field.',
  },
  'account.settings.field.country.options.empty': {
    id: 'account.settings.field.country.options.empty',
    defaultMessage: 'Select a Country',
    description: 'Option for empty value on account settings country field.',
  },
  'account.settings.field.state': {
    id: 'account.settings.field.state',
    defaultMessage: 'State',
    description: 'Label for account settings state field.',
  },
  'account.settings.field.state.empty': {
    id: 'account.settings.field.state.empty',
    defaultMessage: 'Add state',
    description: 'Placeholder for empty account settings state field.',
  },
  'account.settings.field.state.options.empty': {
    id: 'account.settings.field.state.options.empty',
    defaultMessage: 'Select a State',
    description: 'Option for empty value on account settings state field.',
  },
  'account.settings.field.site.language': {
    id: 'account.settings.field.site.language',
    defaultMessage: 'Site language',
    description: 'Label for account settings site language field.',
  },
  'account.settings.field.site.language.help.text': {
    id: 'account.settings.field.site.language.help.text',
    defaultMessage: 'The language used throughout this site. This site is currently available in a limited number of languages.',
    description: 'Help text for the site language field.',
  },
  'account.settings.field.education': {
    id: 'account.settings.field.education',
    defaultMessage: 'Education',
    description: 'Label for account settings education field.',
  },
  'account.settings.field.education.empty': {
    id: 'account.settings.field.education.empty',
    defaultMessage: 'Add level of education',
    description: 'Placeholder for empty account settings education field.',
  },
  'account.settings.field.education.levels.empty': {
    id: 'account.settings.field.education.levels.empty',
    defaultMessage: 'Select a level of education',
    description: 'Placeholder for the education levels dropdown.',
  },
  'account.settings.field.education.levels.p': {
    id: 'account.settings.field.education.levels.p',
    defaultMessage: 'Doctorate',
    description: 'Selected by the user if their highest level of education is a doctorate degree.',
  },
  'account.settings.field.education.levels.m': {
    id: 'account.settings.field.education.levels.m',
    defaultMessage: "Master's or professional degree",
    description: "Selected by the user if their highest level of education is a master's or professional degree from a college or university.",
  },
  'account.settings.field.education.levels.b': {
    id: 'account.settings.field.education.levels.b',
    defaultMessage: "Bachelor's Degree",
    description: "Selected by the user if their highest level of education is a four year college or university bachelor's degree.",
  },
  'account.settings.field.education.levels.a': {
    id: 'account.settings.field.education.levels.a',
    defaultMessage: "Associate's degree",
    description: "Selected by the user if their highest level of education is an associate's degree. 1-2 years of college or university.",
  },
  'account.settings.field.education.levels.hs': {
    id: 'account.settings.field.education.levels.hs',
    defaultMessage: 'Secondary/high school',
    description: 'Selected by the user if their highest level of education is secondary or high school.  9-12 years of education.',
  },
  'account.settings.field.education.levels.jhs': {
    id: 'account.settings.field.education.levels.jhs',
    defaultMessage: 'Junior secondary/junior high/middle school',
    description: 'Selected by the user if their highest level of education is junior or middle school. 6-8 years of education.',
  },
  'account.settings.field.education.levels.el': {
    id: 'account.settings.field.education.levels.el',
    defaultMessage: 'Elementary/primary school',
    description: 'Selected by the user if their highest level of education is elementary or primary school.  1-5 years of education.',
  },
  'account.settings.field.education.levels.none': {
    id: 'account.settings.field.education.levels.none',
    defaultMessage: 'No formal education',
    description: 'Selected by the user to describe their education.',
  },
  'account.settings.field.education.levels.o': {
    id: 'account.settings.field.education.levels.o',
    defaultMessage: 'Other education',
    description: 'Selected by the user if they have a type of education not described by the other choices.',
  },

  'account.settings.field.gender': {
    id: 'account.settings.field.gender',
    defaultMessage: 'Gender',
    description: 'Label for account settings gender field.',
  },
  'account.settings.field.gender.empty': {
    id: 'account.settings.field.gender.empty',
    defaultMessage: 'Add gender',
    description: 'Placeholder for empty account settings gender field.',
  },
  'account.settings.field.gender.options.empty': {
    id: 'account.settings.field.gender.options.empty',
    defaultMessage: 'Select a gender',
    description: 'Placeholder for the gender options dropdown.',
  },
  'account.settings.field.gender.options.f': {
    id: 'account.settings.field.gender.options.f',
    defaultMessage: 'Female',
    description: 'The label for the female gender option.',
  },
  'account.settings.field.gender.options.m': {
    id: 'account.settings.field.gender.options.m',
    defaultMessage: 'Male',
    description: 'The label for the male gender option.',
  },
  'account.settings.field.gender.options.o': {
    id: 'account.settings.field.gender.options.o',
    defaultMessage: 'Other',
    description: 'The label for catch-all gender option.',
  },
  'account.settings.field.language.proficiencies': {
    id: 'account.settings.field.language.proficiencies',
    defaultMessage: 'Spoken languages',
    description: 'Label for account settings spoken languages field.',
  },
  'account.settings.field.language.proficiencies.empty': {
    id: 'account.settings.field.language.proficiencies.empty',
    defaultMessage: 'Add a spoken language',
    description: 'Placeholder for empty account settings spoken languages field.',
  },
  'account.settings.field.language_proficiencies.options.empty': {
    id: 'account.settings.field.language_proficiencies.options.empty',
    defaultMessage: 'Select a Language',
    description: 'Option for an empty value on account settings spoken languages field.',
  },

  'account.settings.field.demographics.gender': {
    id: 'account.settings.field.demographics.gender',
    defaultMessage: 'Gender identity',
    description: 'Label for account settings gender field.',
  },
  'account.settings.field.demographics.gender.empty': {
    id: 'account.settings.field.demographics.gender.empty',
    defaultMessage: 'Add gender identity',
    description: 'Placeholder for empty account settings gender field.',
  },
  'account.settings.field.demographics.gender.options.empty': {
    id: 'account.settings.field.demographics.gender.options.empty',
    defaultMessage: 'Select a gender identity',
    description: 'Placeholder for the gender options dropdown.',
  },
  'account.settings.field.demographics.gender.options.woman': {
    id: 'account.settings.field.demographics.gender.options.woman',
    defaultMessage: 'Woman',
    description: 'The label for the woman gender option.',
  },
  'account.settings.field.demographics.gender.options.man': {
    id: 'account.settings.field.demographics.gender.options.man',
    defaultMessage: 'Man',
    description: 'The label for the man gender option.',
  },
  'account.settings.field.demographics.gender.options.non-binary': {
    id: 'account.settings.field.demographics.gender.options.non-binary',
    defaultMessage: 'Non-binary',
    description: 'The label for the non-binary gender option.',
  },
  'account.settings.field.demographics.gender.options.self-describe': {
    id: 'account.settings.field.demographics.gender.options.self-describe',
    defaultMessage: 'Prefer to self-describe',
    description: 'The label for self-describe gender option.',
  },
  'account.settings.field.demographics.ethnicity': {
    id: 'account.settings.field.demographics.ethnicity',
    defaultMessage: 'Ethnic background',
    description: 'Label for account settings ethnic background field.',
  },
  'account.settings.field.demographics.ethnicity.empty': {
    id: 'account.settings.field.demographics.ethnicity.empty',
    defaultMessage: 'Add ethnic background',
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
    defaultMessage: 'Household income',
    description: 'Label for account settings household income field.',
  },
  'account.settings.field.demographics.income.empty': {
    id: 'account.settings.field.demographics.income.empty',
    defaultMessage: 'Add household income',
    description: 'Placeholder for empty account settings household income field.',
  },
  'account.settings.field.demographics.income.options.empty': {
    id: 'account.settings.field.demographics.income.options.empty',
    defaultMessage: 'Select a household income range',
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
    defaultMessage: 'US Armed Forces service',
    description: 'Label for account settings military history field.',
  },
  'account.settings.field.demographics.military_history.empty': {
    id: 'account.settings.field.demographics.military_history.empty',
    defaultMessage: 'Add military history',
    description: 'Placeholder for empty account settings military history field.',
  },
  'account.settings.field.demographics.military_history.options.empty': {
    id: 'account.settings.field.demographics.military_history.options.empty',
    defaultMessage: 'Select military history',
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
    defaultMessage: 'Highest level of education',
    description: 'Label for account settings learner education level field.',
  },
  'account.settings.field.demographics.learner_education_level.empty': {
    id: 'account.settings.field.demographics.learner_education_level.empty',
    defaultMessage: 'Add education level',
    description: 'Placeholder for empty account settings learner education level field.',
  },
  'account.settings.field.demographics.parent_education_level': {
    id: 'account.settings.field.demographics.parent_education_level',
    defaultMessage: 'Highest level of education of a parent or guardian',
    description: 'Label for account settings parent education level field.',
  },
  'account.settings.field.demographics.parent_education_level.empty': {
    id: 'account.settings.field.demographics.parent_education_level.empty',
    defaultMessage: 'Add education level',
    description: 'Placeholder for empty account settings parent education level field.',
  },
  'account.settings.field.demographics.education_level.options.empty': {
    id: 'account.settings.field.demographics.education_level.options.empty',
    defaultMessage: 'Select an education level',
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
    defaultMessage: 'Current work status',
    description: 'Label for account settings work status field.',
  },
  'account.settings.field.demographics.work_status.empty': {
    id: 'account.settings.field.demographics.work_status.empty',
    defaultMessage: 'Add work status',
    description: 'Placeholder for empty account settings work status field.',
  },
  'account.settings.field.demographics.work_status.options.empty': {
    id: 'account.settings.field.demographics.work_status.options.empty',
    defaultMessage: 'Select a work status',
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
  'account.settings.field.demographics.current_work_sector': {
    id: 'account.settings.field.demographics.current_work_sector',
    defaultMessage: 'Current indstry',
    description: 'Label for account settings current work sector field.',
  },
  'account.settings.field.demographics.current_work_sector.empty': {
    id: 'account.settings.field.demographics.current_work_sector.empty',
    defaultMessage: 'Add industry',
    description: 'Placeholder for empty account settings current work sector field.',
  },
  'account.settings.field.demographics.future_work_sector': {
    id: 'account.settings.field.demographics.future_work_sector',
    defaultMessage: 'Future industry',
    description: 'Label for account settings future work sector field.',
  },
  'account.settings.field.demographics.future_work_sector.empty': {
    id: 'account.settings.field.demographics.future_work_sector.empty',
    defaultMessage: 'Add industry',
    description: 'Placeholder for empty account settings future work sector field.',
  },
  'account.settings.field.demographics.work_sector.options.empty': {
    id: 'account.settings.field.demographics.work_sector.options.empty',
    defaultMessage: 'Select an industry',
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

  'account.settings.field.time.zone': {
    id: 'account.settings.field.time.zone',
    defaultMessage: 'Time zone',
    description: 'Label for time zone settings field.',
  },
  'account.settings.field.time.zone.empty': {
    id: 'account.settings.field.time.zone.empty',
    defaultMessage: 'Set time zone',
    description: 'Placeholder for empty for time zone settings field.',
  },
  'account.settings.field.time.zone.description': {
    id: 'account.settings.field.time.zone.description',
    defaultMessage: 'Select the time zone for displaying course dates. If you do not specify a time zone, course dates, including assignment deadlines, will be displayed in your browser’s local time zone.',
    description: 'Description for time zone settings field.',
  },
  'account.settings.field.time.zone.default': {
    id: 'account.settings.field.time.zone.default',
    defaultMessage: 'Default (Local Time Zone)',
    description: 'The default option for a time zone.',
  },
  'account.settings.field.time.zone.all': {
    id: 'account.settings.field.time.zone.all',
    defaultMessage: 'All time zones',
    description: 'The label for the group of options for all time zones.',
  },
  'account.settings.field.time.zone.country': {
    id: 'account.settings.field.time.zone.country',
    defaultMessage: 'Country time zones',
    description: 'The group of time zone options for a country.',
  },

  'account.settings.section.social.media': {
    id: 'account.settings.section.social.media',
    defaultMessage: 'Social Media Links',
    description: 'Section header for social media links settings',
  },
  'account.settings.section.social.media.description': {
    id: 'account.settings.section.social.media.description',
    defaultMessage: 'Optionally, link your personal accounts to the social media icons on your edX profile.',
    description: 'Section subheader for social media links settings',
  },
  'account.settings.field.social.platform.name.linkedin': {
    id: 'account.settings.field.social.platform.name.linkedin',
    defaultMessage: 'LinkedIn',
    description: 'Label for LinkedIn',
  },
  'account.settings.field.social.platform.name.linkedin.empty': {
    id: 'account.settings.field.social.platform.name.linkedin.empty',
    defaultMessage: 'Add LinkedIn profile',
    description: 'Placeholder for an empty LinkedIn field',
  },
  'account.settings.jump.nav.delete.account': {
    id: 'account.settings.jump.nav.delete.account',
    defaultMessage: 'Delete My Account',
    description: 'Header for the user account deletion area',
  },
  'account.settings.field.social.platform.name.twitter': {
    id: 'account.settings.field.social.platform.name.twitter',
    defaultMessage: 'Twitter',
    description: 'Label for Twitter',
  },
  'account.settings.field.social.platform.name.twitter.empty': {
    id: 'account.settings.field.social.platform.name.twitter.empty',
    defaultMessage: 'Add Twitter profile',
    description: 'Placeholder for an empty Twitter field',
  },

  'account.settings.field.social.platform.name.facebook': {
    id: 'account.settings.field.social.platform.name.facebook',
    defaultMessage: 'Facebook',
    description: 'Label for Facebook',
  },
  'account.settings.field.social.platform.name.facebook.empty': {
    id: 'account.settings.field.social.platform.name.facebook.empty',
    defaultMessage: 'Add Facebook profile',
    description: 'Placeholder for an empty Facebook field',
  },
  'account.settings.editable.field.action.save': {
    id: 'account.settings.editable.field.action.save',
    defaultMessage: 'Save',
    description: 'The save button on an editable field',
  },
  'account.settings.editable.field.action.cancel': {
    id: 'account.settings.editable.field.action.cancel',
    defaultMessage: 'Cancel',
    description: 'The cancel button on an editable field',
  },
  'account.settings.editable.field.action.edit': {
    id: 'account.settings.editable.field.action.edit',
    defaultMessage: 'Edit',
    description: 'The edit button on an editable field',
  },
  'account.settings.static.field.empty': {
    id: 'account.settings.static.field.empty',
    defaultMessage: 'No value set. Contact your {enterprise} administrator to make changes.',
    description: 'The placeholder for an empty but uneditable field',
  },
  'account.settings.static.field.empty.no.admin': {
    id: 'account.settings.static.field.empty.no.admin',
    defaultMessage: 'No value set.',
    description: 'The placeholder for an empty but uneditable field when there is no administrator',
  },
});

export default messages;
