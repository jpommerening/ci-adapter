import LRU from 'lru-cache';

export function Adapter(options) {
  if (!(this instanceof Adapter)) {
    return new Adapter(options);
  }
}

Adapter.prototype.getInfo = function getInfo() {
  return Promise.resolve({ builders: [] });
};

Adapter.prototype.getBuilder = function getBuilder(info, name) {
  return Promise.resolve({ name, builds: [] });
};

Adapter.prototype.getBuild = function getBuild(builder, number) {
  return Promise.resolve({ name: builder.name, number });
};

Adapter.prototype.getBuilders = function getBuilders(info) {
  return Promise.all(info.builders.map(name => this.getBuilder(info, name)));
};

Adapter.prototype.getBuilds = function getBuilds(builder) {
  return Promise.all(builder.builds.map(number => this.getBuild(builder, number)));
};

Adapter.prototype.getAllBuilds = function getAllBuilds(info) {
  return this.getBuilders(info)
    .then(builders => Promise.all(builders.map(builder => this.getBuilds(builder))))
    .then(builds => [].concat(...builds));
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
    return function keygen() {
      return [].join.call(arguments, '\n');
    }
  }

  return Object.create(adapter, {
    getInfo: { value: memoize(adapter.getInfo, keygen('info')) },
    getBuilders: { value: memoize(adapter.getBuilders, keygen('builders')) },
    getBuilds: { value: memoize(adapter.getBuilds, keygen('builds')) }
  });
}
