
export const PENDING = 'pending';
export const SUCCESS = 'success';
export const WARNING = 'warning';
export const FAILURE = 'failure';
export const ERRORED = 'errored';
export const ABORTED = 'aborted';
export const UNKNOWN = 'unknown';

export const state = {
  PENDING,
  SUCCESS,
  WARNING,
  FAILURE,
  ERRORED,
  ABORTED,
  UNKNOWN
};

export class Adapter {
  constructor(options) {
  }

  getInfo() {
    return Promise.resolve({});
  }
  getBuilders() {
    return Promise.resolve([]);
  }
  getBuilds(builder) {
    return Promise.resolve([]);
  }
}

export function combine(...adapters) {
  const map = new Map();

  function addToMap(adapter) {
    return function (iterable) {
      for (const item of iterable) {
        map.set(item, adapter);
      }
      return iterable;
    };
  }

  function adapterBuilders(adapter) {
    return adapter.getBuilders().then(addToMap(adapter));
  }

  return {
    getBuilders: function getBuilders() {
      return Promise.all(adapters.map(adapterBuilders))
                    .then(lists => [].concat(...lists));
    },
    getBuilds: function getBuilds(builder) {
      const adapter = map.get(builder);
      return adapter.getBuilds(builder).then(addToMap(adapter));
    }
  };
}
