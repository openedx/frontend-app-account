import pick from 'lodash.pick';

export default function applyConfiguration(expected, actual) {
  Object.keys(expected).forEach((key) => {
    if (actual[key] === undefined) {
      throw new Error(`Service configuration error: ${key} is required.`);
    }
  });
  return pick(actual, Object.keys(expected));
}
