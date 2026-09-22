// @ts-check

const { createLintConfig } = require('@openedx/frontend-base/tools');

module.exports = createLintConfig(
  {
    files: [
      'src/**/*',
      'site.config.*',
    ],
  },
  {
    ignores: [
      'coverage/*',
      'dist/*',
      'docs/*',
      'node_modules/*',
      '**/__mocks__/*',
      '**/__snapshots__/*',
      'src/i18n/messages/*',
    ],
  },
);
