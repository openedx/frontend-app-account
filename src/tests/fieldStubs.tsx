import { ComponentType } from 'react';

const stubs: Record<string, ComponentType> = {};

/**
 * Stands in for an account settings field module in Slot tests.  Every export is a component
 * that renders its own name, so a test can register the app's real default widgets without the
 * settings queries the fields read.
 *
 *   jest.mock('@src/account-settings/fields/SocialMediaFields', () => jest.requireActual('@src/tests/fieldStubs').default);
 */
const fieldStubs = new Proxy({}, {
  get: (_, name) => {
    if (typeof name !== 'string' || name === '__esModule' || name === 'then') {
      return undefined;
    }
    if (!stubs[name]) {
      const Stub = () => <p>{name}</p>;
      Stub.displayName = name;
      stubs[name] = Stub;
    }
    return stubs[name];
  },
});

export default fieldStubs;
