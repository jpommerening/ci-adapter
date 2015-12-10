'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = cache;

var _adapter = require('./adapter');

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var MAX_AGE = 1000 * 60;

function cache(adapter, options) {
  if (!((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object')) {
    options = { max: options, maxAge: MAX_AGE };
  }

  var cache = new _lruCache2.default(options);
  var _options = options;
  var maxAge = _options.maxAge;

  function circuitBreaker(key) {
    return function (error) {
      var reject = Promise.reject(error);
      cache.set(key, reject);
      setTimeout(function () {
        return cache.del(key);
      }, maxAge);
      return reject;
    };
  }

  function cached(keyfn, callback) {
    // Don't cache the default implementations; they do nothing remotely expensive.
    if (callback === _adapter.Adapter.prototype[callback.name]) {
      return callback;
    }

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = keyfn.apply(undefined, args);
      var promise = cache.get(key) || callback.apply(this, args);

      if (!cache.has(key)) {
        cache.set(key, promise.then(null, circuitBreaker(key)));
      }

      return promise;
    };
  }

  var getInfo = cached(function () {
    return 'info';
  }, adapter.getInfo);
  var getBuilder = cached(function (info, name) {
    return 'builder-' + name;
  }, adapter.getBuilder);
  var getBuild = cached(function (builder, number) {
    return 'build-' + builder.name + '-' + number;
  }, adapter.getBuild);
  var getBuilders = cached(function (info) {
    return 'builders';
  }, adapter.getBuilders);
  var getBuilds = cached(function (builder) {
    return 'builds-' + builder.name;
  }, adapter.getBuilds);

  return Object.create(adapter, {
    getInfo: { value: getInfo },
    getBuilder: { value: getBuilder },
    getBuild: { value: getBuild },
    getBuilders: { value: getBuilders },
    getBuilds: { value: getBuilds }
  });
}
//# sourceMappingURL=data:application/json;base64,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LFlBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsZUFBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtBQUNuQyxhQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO0dBQ2hDLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcic7XG5pbXBvcnQgTFJVIGZyb20gJ2xydS1jYWNoZSc7XG5cbmNvbnN0IE1BWF9BR0UgPSAxMDAwICogNjA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWNoZShhZGFwdGVyLCBvcHRpb25zKSB7XG4gIGlmICghKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JykpIHtcbiAgICBvcHRpb25zID0geyBtYXg6IG9wdGlvbnMsIG1heEFnZTogTUFYX0FHRSB9O1xuICB9XG5cbiAgY29uc3QgY2FjaGUgPSBuZXcgTFJVKG9wdGlvbnMpO1xuICBjb25zdCB7IG1heEFnZSB9ID0gb3B0aW9ucztcblxuICBmdW5jdGlvbiBjaXJjdWl0QnJlYWtlcihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zdCByZWplY3QgPSBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICBjYWNoZS5zZXQoa2V5LCByZWplY3QpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBjYWNoZS5kZWwoa2V5KSwgbWF4QWdlKTtcbiAgICAgIHJldHVybiByZWplY3Q7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhY2hlZChrZXlmbiwgY2FsbGJhY2spIHtcbiAgICAvLyBEb24ndCBjYWNoZSB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbnM7IHRoZXkgZG8gbm90aGluZyByZW1vdGVseSBleHBlbnNpdmUuXG4gICAgaWYgKGNhbGxiYWNrID09PSBBZGFwdGVyLnByb3RvdHlwZVsgY2FsbGJhY2submFtZSBdKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleWZuKC4uLmFyZ3MpO1xuICAgICAgY29uc3QgcHJvbWlzZSA9IGNhY2hlLmdldChrZXkpIHx8IGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICBpZiAoIWNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICAgIGNhY2hlLnNldChrZXksIHByb21pc2UudGhlbihudWxsLCBjaXJjdWl0QnJlYWtlcihrZXkpKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG4gIH1cblxuICBjb25zdCBnZXRJbmZvID0gY2FjaGVkKCgpID0+ICdpbmZvJywgYWRhcHRlci5nZXRJbmZvKTtcbiAgY29uc3QgZ2V0QnVpbGRlciA9IGNhY2hlZCgoaW5mbywgbmFtZSkgPT4gYGJ1aWxkZXItJHtuYW1lfWAsIGFkYXB0ZXIuZ2V0QnVpbGRlcik7XG4gIGNvbnN0IGdldEJ1aWxkID0gY2FjaGVkKChidWlsZGVyLCBudW1iZXIpID0+IGBidWlsZC0ke2J1aWxkZXIubmFtZX0tJHtudW1iZXJ9YCwgYWRhcHRlci5nZXRCdWlsZCk7XG4gIGNvbnN0IGdldEJ1aWxkZXJzID0gY2FjaGVkKChpbmZvKSA9PiAnYnVpbGRlcnMnLCBhZGFwdGVyLmdldEJ1aWxkZXJzKTtcbiAgY29uc3QgZ2V0QnVpbGRzID0gY2FjaGVkKChidWlsZGVyKSA9PiBgYnVpbGRzLSR7YnVpbGRlci5uYW1lfWAsIGFkYXB0ZXIuZ2V0QnVpbGRzKTtcblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShhZGFwdGVyLCB7XG4gICAgZ2V0SW5mbzogeyB2YWx1ZTogZ2V0SW5mbyB9LFxuICAgIGdldEJ1aWxkZXI6IHsgdmFsdWU6IGdldEJ1aWxkZXIgfSxcbiAgICBnZXRCdWlsZDogeyB2YWx1ZTogZ2V0QnVpbGQgfSxcbiAgICBnZXRCdWlsZGVyczogeyB2YWx1ZTogZ2V0QnVpbGRlcnMgfSxcbiAgICBnZXRCdWlsZHM6IHsgdmFsdWU6IGdldEJ1aWxkcyB9XG4gIH0pO1xufVxuIl19