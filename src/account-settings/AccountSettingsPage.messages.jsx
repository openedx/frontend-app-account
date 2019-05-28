import { defineMessages } from '@edx/frontend-i18n';

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


  'account.settings.delete.account.header': {
    id: 'account.settings.delete.account.header',
    defaultMessage: 'Delete My Account',
    description: 'Header for the user account deletion area',
  },
  'account.settings.delete.account.subheader': {
    id: 'account.settings.delete.account.subheader',
    defaultMessage: 'We\'re sorry to see you go!',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.1': {
    id: 'account.settings.delete.account.text.1',
    defaultMessage: 'Please note: Deletion of your account and personal data is permanent and cannot be undone. edX will not be able to recover your account or the data that is deleted.',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.2': {
    id: 'account.settings.delete.account.text.2',
    defaultMessage: 'Once your account is deleted, you cannot use it to take courses on the edX app, edx.org, or any other site hosted by edX. This includes access to edx.org from your employer’s or university’s system and access to private sites offered by MIT Open Learning, Wharton Executive Education, and Harvard Medical School.',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.3.link': {
    id: 'account.settings.delete.account.text.3.link',
    defaultMessage: 'follow the instructions for printing or downloading a certificate',
    description: 'This text will be a link to a technical support page; it will go in the phrase If you want to make a copy of these for your records, ______ .',
  },
  'account.settings.delete.account.text.warning': {
    id: 'account.settings.delete.account.text.warning',
    defaultMessage: 'Warning: Account deletion is permanent. Please read the above carefully before proceeding. This is an irreversible action, and you will no longer be able to use the same email on edX.',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.text.change.instead': {
    id: 'account.settings.delete.account.text.change.instead',
    defaultMessage: 'Want to change your email, name, or password instead?',
    description: 'A message in the user account deletion area',
  },
  'account.settings.delete.account.button': {
    id: 'account.settings.delete.account.button',
    defaultMessage: 'Delete My Account',
    description: 'Button label to permanently delete your edX account',
  },
  'account.settings.delete.account.please.activate': {
    id: 'account.settings.delete.account.please.activate',
    defaultMessage: 'activate your account',
    description: 'This is the text on a link that goes to the support page.  It is part of this sentence: Before proceeding, please activate your account.',
  },
  'account.settings.delete.account.please.unlink': {
    id: 'account.settings.delete.account.please.unlink',
    defaultMessage: 'unlink all social media accounts',
    description: 'This is the text on a link that goes to the support page.  It is part of this sentence: Before proceeding, please unlink all social media accounts.',
  },
  'account.settings.delete.account.modal.header': {
    id: 'account.settings.delete.account.modal.header',
    defaultMessage: 'Are you sure?',
    description: 'Title of the dialog asking user to confirm that they want to delete their entire account',
  },
  'account.settings.delete.account.modal.text.1': {
    id: 'account.settings.delete.account.modal.text.1',
    defaultMessage: 'You have selected "Delete My Account". Deletion of your account and personal data is permanent and cannot be undone. edX will not be able to recover your account or the data that is deleted.',
    description: 'Messaging in the dialog asking user to confirm that they want to delete their entire account',
  },
  'account.settings.delete.account.modal.text.2': {
    id: 'account.settings.delete.account.modal.text.2',
    defaultMessage: 'If you proceed, you will be unable to use this account to take courses on the edX app, edx.org, or any other site hosted by edX. This includes access to edx.org from your employer\'s or university\'s system and access to private sites offered by MIT Open Learning, Wharton Executive Education, and Harvard Medical School.',
    description: 'Messaging in the dialog asking user to confirm that they want to delete their entire account',
  },
  'account.settings.delete.account.modal.enter.password': {
    id: 'account.settings.delete.account.modal.enter.password',
    defaultMessage: 'If you still wish to continue and delete your account, please enter your account password:',
    description: 'Asking for the user\'s account password',
  },
  'account.settings.delete.account.modal.password': {
    id: 'account.settings.delete.account.modal.password',
    defaultMessage: 'Password',
    description: 'Label for the input box asking for the user\'s account password',
  },
  'account.settings.delete.account.modal.confirm.delete': {
    id: 'account.settings.delete.account.modal.confirm.delete',
    defaultMessage: 'Yes, Delete',
    description: 'Button label for user to confirm it is okay to delete their account',
  },
  'account.settings.delete.error.unable.to.delete': {
    id: 'account.settings.delete.error.unable.to.delete',
    defaultMessage: 'Unable to delete account',
    description: 'Error message when account deletion failed',
  },
  'account.settings.delete.error.unable.to.delete.details': {
    id: 'account.settings.delete.error.unable.to.delete.details',
    defaultMessage: 'Sorry, there was an error trying to process your request. Please try again later.',
    description: 'Error message when account deletion failed',
  },

  'account.settings.delete.account.modal.after.header': {
    id: 'account.settings.delete.account.modal.after.header',
    defaultMessage: 'We\'re sorry to see you go!  Your account will be deleted shortly.',
    description: 'Title displayed after user account is deleted',
  },
  'account.settings.delete.account.modal.after.text': {
    id: 'account.settings.delete.account.modal.after.text',
    defaultMessage: 'Account deletion, including removal from email lists, may take a few weeks to fully process through our system. If you want to opt-out of emails before then, please unsubscribe from the footer of any email.',
    description: 'Text displayed after user account is deleted',
  },
  'account.settings.delete.account.modal.after.button': {
    id: 'account.settings.delete.account.modal.after.button',
    defaultMessage: 'Close',
    description: 'Label on button to close a dialog',
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
