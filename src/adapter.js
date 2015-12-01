import LRU from 'lru-cache';

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

export function Adapter(options) {
  if (!(this instanceof Adapter)) {
    return new Adapter(options);
  }
}

Adapter.prototype.getInfo = function getInfo() {
  return Promise.resolve({});
};

Adapter.prototype.getBuilders = function getBuilders() {
  return Promise.resolve([]);
};

Adapter.prototype.getBuilds = function getBuilds(builder) {
  return Promise.resolve([]);
};

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
    getInfo: function getInfo() {
      return Promise.all(adapters.map(adapter => adapter.getInfo()))
        .then(function (infos) {
          return {
            name: infos.map(info => info.name).join(', '),
            data: infos
          };
        });
    },
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

export function cache(adapter, options) {
  const keys = new WeakMap();
  const cache = new LRU(options);

  function memoize(fn, keyfn) {
    return function() {
      const key = keyfn.apply( this, arguments );
      const value = cache.get(key) || fn.apply( this, arguments );

      cache.set(key, value);
      return value;
    };
  }

  function keygen(prefix = 'id') {
    const EMPTY = {};
    let id = 0;
    return function keygen(item = EMPTY) {
      if (!keys.has(item)) keys.set(item, prefix + (id++));
      return keys.get(item);
    }
  }

  return {
    getInfo: memoize(adapter.getInfo, keygen('info')),
    getBuilders: memoize(adapter.getBuilders, keygen('builders')),
    getBuilds: memoize(adapter.getBuilds, keygen('builds'))
  };
}
