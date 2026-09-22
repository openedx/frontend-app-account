const { createConfig } = require('@openedx/frontend-base/tools');

module.exports = createConfig('test', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.ts',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.ts',
    'src/i18n',
    'src/__mocks__',
    // Test helpers only ever imported by tests.
    'src/tests/',
    'src/account-settings/test/',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
    '\\.png$': '<rootDir>/src/__mocks__/file.js',
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
});
