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
    defaultMessage: 'You can link your identity accounts to simplify signing in to {siteName}.',
    description: 'The linked accounts section heading description.',
  },
  'account.settings.field.username': {
    id: 'account.settings.field.username',
    defaultMessage: 'Username',
    description: 'Label for account settings username field.',
  },
  'account.settings.field.username.help.text': {
    id: 'account.settings.field.username.help.text',
    defaultMessage: 'The name that identifies you on {siteName}. You cannot change your username.',
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
  'account.settings.field.full.name.help.text.default': {
    id: 'account.settings.field.full.name.help.text.default',
    defaultMessage: 'The name that appears on your public profile.',
    description: 'Help text for the account settings name field.',
  },
  'account.settings.field.full.name.help.text.default.certificate': {
    id: 'account.settings.field.full.name.help.text.default.certificate',
    defaultMessage: 'This name is selected to appear on your certificates and public-facing records.',
    description: 'Help text for the account settings name field.',
  },
  'account.settings.field.name.verified': {
    id: 'account.settings.field.name.verified',
    defaultMessage: 'Verified name',
    description: 'Label for account settings verified name field.',
  },
  'account.settings.field.name.verified.help.text.verified': {
    id: 'account.settings.field.name.verified.help.text.verified',
    defaultMessage: 'This name has been verified by photo ID.',
    description: 'Help text for the account settings verified name field when the name is verified.',
  },
  'account.settings.field.name.verified.help.text.verified.proctored': {
    id: 'account.settings.field.name.verified.help.text.verified.proctored',
    defaultMessage: 'This name has been verified by proctoring.',
    description: 'Help text for the account settings verified name field when the name is verified through proctoring.',
  },
  'account.settings.field.name.verified.help.text.verified.certificate': {
    id: 'account.settings.field.name.verified.help.text.verified.certificate',
    defaultMessage: 'This name has been verified by photo ID, and is selected to appear on your certificates and public-facing records.',
    description: 'Help text for the account settings verified name field when the name is selected for certificates.',
  },
  'account.settings.field.name.verified.help.text.verified.proctored.certificate': {
    id: 'account.settings.field.name.verified.help.text.verified.proctored.certificate',
    defaultMessage: 'This name has been verified by proctoring, and is selected to appear on your certificates and public-facing records.',
    description: 'Help text for the account settings verified name field when the name is selected for certificates, and the name is verified through proctoring.',
  },
  'account.settings.field.name.verified.help.text.submitted': {
    id: 'account.settings.field.name.verified.help.text.submitted',
    defaultMessage: 'Verification has been submitted. This usually takes 48 hours or less. Verified name cannot be changed at this time.',
    description: 'Help text for the account settings verified name field when a verified name has been submitted.',
  },
  'account.settings.field.name.verified.help.text.submitted.proctored': {
    id: 'account.settings.field.name.verified.help.text.submitted.proctored',
    defaultMessage: 'Your proctored exam has been submitted. Verified name cannot be changed at this time. Please check back in 2-5 days.',
    description: 'Help text for the account settings verified name field when a verified name has been submitted through proctoring.',
  },
  'account.settings.field.name.verified.help.text.submitted.certificate': {
    id: 'account.settings.field.name.verified.help.text.submitted.certificate',
    defaultMessage: 'When identity verification is successful, this name will appear on your certificates and public-facing records. Verified name cannot be changed at this time.',
    description: 'Help text for the account settings verified name field when a verified name has been submitted and will appear on certificates.',
  },
  'account.settings.field.name.verified.help.text.submitted.proctored.certificate': {
    id: 'account.settings.field.name.verified.help.text.submitted.proctored.certificate',
    defaultMessage: 'Once your proctored exam passes review, this name will appear on your certificate and public-facing records. Verified Name cannot be changed at this time.',
    description: 'Help text for the account settings verified name field when a verified name has been submitted through proctoring and will appear on certificates.',
  },
  'account.settings.field.full.name.help.text.submitted': {
    id: 'account.settings.field.full.name.help.text.submitted',
    defaultMessage: 'Verification has been submitted. This usually takes 48 hours or less. Full name cannot be changed at this time.',
    description: 'Help text for the account settings full name field when a verified name has been submitted.',
  },
  'account.settings.field.full.name.help.text.submitted.proctored': {
    id: 'account.settings.field.full.name.help.text.submitted.proctored',
    defaultMessage: 'Your proctored exam has been submitted. Full name cannot be changed at this time. Please check back in 2-5 days.',
    description: 'Help text for the account settings full name field when a verified name has been submitted through proctoring.',
  },
  'account.settings.field.full.name.help.text.submitted.certificate': {
    id: 'account.settings.field.full.name.help.text.submitted.certificate',
    defaultMessage: 'When identity verification is successful, this name will appear on your certificates and public-facing records. Full name cannot be changed at this time.',
    description: 'Help text for the account settings full name field when a full name has been submitted and will appear on certificates.',
  },
  'account.settings.field.full.name.help.text.submitted.proctored.certificate': {
    id: 'account.settings.field.full.name.help.text.submitted.proctored.certificate',
    defaultMessage: 'Once your proctored exam passes review, this name will appear on your certificates and public-facing records. Full name cannot be changed at this time.',
    description: 'Help text for the account settings full name field when a full name has been submitted and will appear on certificates.',
  },
  'account.settings.field.name.verified.success.message': {
    id: 'account.settings.field.name.verified.success.message',
    defaultMessage: 'Your identity verification request has successfully completed. You now have the option of selecting which name you prefer to appear on your certificates and public-records.',
    description: 'The body of the success alert indicating that a user\'s name has been verified',
  },
  'account.settings.field.name.verified.success.message.header': {
    id: 'account.settings.field.name.verified.success.message.header',
    defaultMessage: 'Your name change request is complete!',
    description: 'The header of the success alert indicating that a user\'s name has been verified',
  },
  'account.settings.field.name.verified.failure.message': {
    id: 'account.settings.field.name.verified.failure.message',
    defaultMessage: 'Your most recent identity verification attempt did not pass. Related account settings have been restored.',
    description: 'The body of the failure alert indicating that a user\'s name was not able to be verified',
  },
  'account.settings.field.name.verified.failure.message.header': {
    id: 'account.settings.field.name.verified.failure.message.header',
    defaultMessage: 'We were not able to verify your identity.',
    description: 'The header of the failure alert indicating that a user\'s name was not able to be verified',
  },
  'account.settings.field.name.verified.failure.message.help.link': {
    id: 'account.settings.field.name.verified.failure.message.help.link',
    defaultMessage: 'Learn more about ID verification',
    description: 'The text of the button displayed when a user\'s name was not able to be verified, intended to direct the user to a help article about ID verification.',
  },
  'account.settings.field.name.verified.submitted.message': {
    id: 'account.settings.field.name.verified.submitted.message',
    defaultMessage: 'Your identity verification request has been submitted and usually takes between 24 and 48 hours to complete.',
    description: 'The body of the submitted alert indicating that a user\'s name has been submitted for verification',
  },
  'account.settings.field.name.verified.submitted.message.certificate': {
    id: 'account.settings.field.name.verified.submitted.message.certificate',
    defaultMessage: 'When your request is approved, your updated name will appear on all associated certificates and public-facing records.',
    description: 'The body of the submitted alert indicating that a user\'s name will be updated on certificates.',
  },
  'account.settings.field.name.verified.submitted.message.header': {
    id: 'account.settings.field.name.verified.submitted.message.header',
    defaultMessage: 'Your name change request is almost complete!',
    description: 'The header of the submitted alert indicating that a user\'s name has been submitted for verification',
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
    defaultMessage: 'You receive messages from {siteName} and course teams at this address.',
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
  'account.settings.field.dob.month': {
    id: 'account.settings.field.dob.month',
    defaultMessage: 'Month',
    description: 'Label for account settings month of birth field.',
  },
  'account.settings.field.dob.year': {
    id: 'account.settings.field.dob.year',
    defaultMessage: 'Year',
    description: 'Label for account settings year of birth field.',
  },
  'account.settings.field.dob.month.default': {
    id: 'account.settings.field.month.year.default',
    defaultMessage: 'Select month',
    description: 'Default label for account settings month of birth field.',
  },
  'account.settings.field.dob.year.default': {
    id: 'account.settings.field.dob.year.default',
    defaultMessage: 'Select year',
    description: 'Default label for account settings year of birth field.',
  },
  'account.settings.field.dob.form.button': {
    id: 'account.settings.field.dob.form.button',
    defaultMessage: 'Please confirm your date of birth',
    description: 'Message to prompt user to enter dob',
  },
  'account.settings.field.dob.form.title': {
    id: 'account.settings.field.dob.form.title',
    defaultMessage: 'Enter your birth month and year',
    description: 'Title of DOB form',
  },
  'account.settings.field.dob.form.help.text': {
    id: 'account.settings.field.dob.form.help.text',
    defaultMessage: 'We ask for birth month and year information to help us comply with our legal obligations.',
    description: 'Help text for DOB form',
  },
  'account.settings.field.dob.form.success': {
    id: 'account.settings.field.dob.form.success',
    defaultMessage: 'Thank you for entering your information.',
    description: 'Title of banner when date of birth is successfully entered',
  },
  'account.settings.field.month_of_birth.options.empty': {
    id: 'account.settings.field.month_of_birth.options.empty',
    defaultMessage: 'Select a month of birth',
    description: 'Option for empty value on account settings month of birth field.',
  },
  'account.settingsfield.dob.error.general': {
    id: 'account.settingsfield.dob.error.general',
    defaultMessage: 'A technical error occurred. Please try again.',
    description: 'Generic error message.',
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
  'account.settings.field.education.levels.other': {
    id: 'account.settings.field.education.levels.other',
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
    defaultMessage: 'Spoken language',
    description: 'Label for account settings spoken language field.',
  },
  'account.settings.field.language.proficiencies.empty': {
    id: 'account.settings.field.language.proficiencies.empty',
    defaultMessage: 'Add a spoken language',
    description: 'Placeholder for empty account settings spoken language field.',
  },
  'account.settings.field.language_proficiencies.options.empty': {
    id: 'account.settings.field.language_proficiencies.options.empty',
    defaultMessage: 'Select a Language',
    description: 'Option for an empty value on account settings spoken language field.',
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
    defaultMessage: 'Optionally, link your personal accounts to the social media icons on your {siteName} profile.',
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
  'notification.preferences.notifications.label': {
    id: 'notification.preferences.notifications.label',
    defaultMessage: 'Notifications',
    description: 'Label for Notifications',
  },
  'account.settings.field.work.experience': {
    id: 'account.settings.work.experience',
    defaultMessage: 'Work Experience',
    description: 'Label for account settings Work experience field.',
  },
  'account.settings.field.work.experience.empty': {
    id: 'account.settings.field.work.experience.empty',
    defaultMessage: 'Add work experience',
    description: 'Placeholder for empty account settings work experience field.',
  },
  'account.settings.field.work.experience.options.empty': {
    id: 'account.settings.field.work.experience.options.empty',
    defaultMessage: 'Select work experience',
    description: 'Placeholder for the work experience levels dropdown.',
  },
});

export default messages;
