import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'account.settings.page.heading': {
    id: 'account.settings.page.heading',
    defaultMessage: 'Account Settings',
    description: 'The page heading for the account settings page.',
  },
  'account.settings.loading.message': {
    id: 'account.settings.loading.message',
    defaultMessage: 'Loading',
    description: 'Message when data is being loaded',
  },
  'account.settings.loading.error': {
    id: 'account.settings.loading.error',
    defaultMessage: 'Error: {error}',
    description: 'Message when data failed to load',
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
  'account.settings.field.full.name': {
    id: 'account.settings.field.full.name',
    defaultMessage: 'Full name',
    description: 'Label for account settings name field.',
  },
  'account.settings.field.email': {
    id: 'account.settings.field.email',
    defaultMessage: 'Email address (Sign in)',
    description: 'Label for account settings email field.',
  },
  'account.settings.field.email.confirmation': {
    id: 'account.settings.field.email.confirmation',
    defaultMessage: 'We’ve sent a confirmation message to {value}. Click the link in the message to update your email address.',
    description: 'Confirmation message for saving the account settings email field.',
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
  'account.settings.field.country': {
    id: 'account.settings.field.country',
    defaultMessage: 'Country',
    description: 'Label for account settings country field.',
  },
  'account.settings.field.site.language': {
    id: 'account.settings.field.site.language',
    defaultMessage: 'Site Language',
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
  'account.settings.field.education.levels.null': {
    id: 'account.settings.field.education.levels.null',
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
  'account.settings.field.gender.options.null': {
    id: 'account.settings.field.gender.options.null',
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
    defaultMessage: 'Spoken Languages',
    description: 'Label for account settings spoken languages field.',
  },
  'account.settings.field.time.zone': {
    id: 'account.settings.field.time.zone',
    defaultMessage: 'Time Zone',
    description: 'Label for time zone settings field.',
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
  'account.settings.field.social.platform.name.twitter': {
    id: 'account.settings.field.social.platform.name.twitter',
    defaultMessage: 'Twitter',
    description: 'Label for Twitter',
  },
  'account.settings.field.social.platform.name.facebook': {
    id: 'account.settings.field.social.platform.name.facebook',
    defaultMessage: 'Facebook',
    description: 'Label for Facebook',
  },

  'account.settings.editable.field.password.reset.button': {
    id: 'account.settings.editable.field.password.reset.button',
    defaultMessage: 'Reset Password',
    description: 'The password reset button in account settings',
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
});

export default messages;
