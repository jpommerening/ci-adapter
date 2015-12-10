import { Adapter } from './adapter';
import LRU from 'lru-cache';

const MAX_AGE = 1000 * 60;

export function cache(adapter, options) {
  if (!(typeof options === 'object')) {
    options = { max: options, maxAge: MAX_AGE };
  }

  const cache = new LRU(options);
  const { maxAge } = options;

  function circuitBreaker(key) {
    return function (error) {
      const reject = Promise.reject(error);
      cache.set(key, reject);
      setTimeout(() => cache.del(key), maxAge);
      return reject;
    };
  }

  function cached(keyfn, callback) {
    // Don't cache the default implementations; they do nothing remotely expensive.
    if (callback === Adapter.prototype[ callback.name ]) {
      return callback;
    }

    return function(...args) {
      const key = keyfn(...args);
      const promise = cache.get(key) || callback.apply(this, args);

      if (!cache.has(key)) {
        cache.set(key, promise.then(null, circuitBreaker(key)));
      }

      return promise;
    };
  }

  const getInfo = cached(() => 'info', adapter.getInfo);
  const getBuilder = cached((info, name) => `builder-${name}`, adapter.getBuilder);
  const getBuild = cached((builder, number) => `build-${builder.name}-${number}`, adapter.getBuild);
  const getBuilders = cached((info) => 'builders', adapter.getBuilders);
  const getBuilds = cached((builder) => `builds-${builder.name}`, adapter.getBuilds);

  return Object.create(adapter, {
    getInfo: { value: getInfo },
    getBuilder: { value: getBuilder },
    getBuild: { value: getBuild },
    getBuilders: { value: getBuilders },
    getBuilds: { value: getBuilds }
  });
}
