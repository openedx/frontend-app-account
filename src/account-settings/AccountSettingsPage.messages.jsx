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

  'account.settings.field.education': {
    id: 'account.settings.field.education',
    defaultMessage: 'Education',
    description: 'Label for account settings education field.',
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
});

export default messages;
