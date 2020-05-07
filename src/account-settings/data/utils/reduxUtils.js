/**
 * Helper class to save time when writing out action types for asynchronous methods.  Also helps
 * ensure that actions are namespaced.
 */
export class AsyncActionType {
  constructor(topic, name) {
    this.topic = topic;
    this.name = name;
  }

  get BASE() {
    return `${this.topic}__${this.name}`;
  }

  get BEGIN() {
    return `${this.topic}__${this.name}__BEGIN`;
  }

  get SUCCESS() {
    return `${this.topic}__${this.name}__SUCCESS`;
  }

  get FAILURE() {
    return `${this.topic}__${this.name}__FAILURE`;
  }

  get RESET() {
    return `${this.topic}__${this.name}__RESET`;
  }

  get FORBIDDEN() {
    return `${this.topic}__${this.name}__FORBIDDEN`;
  }
}

/**
 * Given a state tree and an array representing a set of keys to traverse in that tree, returns
 * the portion of the tree at that key path.
 *
 * Example:
 *
 * const result = getModuleState(
 *   {
 *     first: { red: { awesome: 'sauce' }, blue: { weak: 'sauce' } },
 *     second: { other: 'data', }
 *   },
 *   ['first', 'red']
 * );
 *
 * result will be:
 *
 * {
 *   awesome: 'sauce'
 * }
 */
export function getModuleState(state, originalPath) {
  const path = [...originalPath]; // don't modify your argument
  if (path.length < 1) {
    return state;
  }
  const key = path.shift();
  if (state[key] === undefined) {
    throw new Error(`Unexpected state key ${key} given to getModuleState. Is your state path set up correctly?`);
  }
  return getModuleState(state[key], path);
}
