'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Adapter = Adapter;
exports.combine = combine;
exports.cache = cache;

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function Adapter(options) {
  if (!_instanceof(this, Adapter)) {
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

function combine() {
  for (var _len = arguments.length, adapters = Array(_len), _key = 0; _key < _len; _key++) {
    adapters[_key] = arguments[_key];
  }

  var map = new Map();

  function addToMap(adapter) {
    return function (iterable) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          map.set(item, adapter);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return iterable;
    };
  }

  function adapterBuilders(adapter) {
    return adapter.getBuilders().then(addToMap(adapter));
  }

  return {
    getInfo: function getInfo() {
      return Promise.all(adapters.map(function (adapter) {
        return adapter.getInfo();
      })).then(function (infos) {
        return {
          name: infos.map(function (info) {
            return info.name;
          }).join(', '),
          data: infos
        };
      });
    },
    getBuilders: function getBuilders() {
      return Promise.all(adapters.map(adapterBuilders)).then(function (lists) {
        var _ref;

        return (_ref = []).concat.apply(_ref, _toConsumableArray(lists));
      });
    },
    getBuilds: function getBuilds(builder) {
      var adapter = map.get(builder);
      return adapter.getBuilds(builder).then(addToMap(adapter));
    }
  };
}

function cache(adapter, options) {
  var keys = new WeakMap();
  var cache = new _lruCache2.default(options);

  function memoize(fn, keyfn) {
    return function () {
      var key = keyfn.apply(this, arguments);
      var value = cache.get(key) || fn.apply(this, arguments);

      cache.set(key, value);
      return value;
    };
  }

  function keygen() {
    var prefix = arguments.length <= 0 || arguments[0] === undefined ? 'id' : arguments[0];

    var EMPTY = {};
    var id = 0;
    return function keygen() {
      var item = arguments.length <= 0 || arguments[0] === undefined ? EMPTY : arguments[0];

      if (!keys.has(item)) keys.set(item, prefix + id++);
      return keys.get(item);
    };
  }

  return {
    getInfo: memoize(adapter.getInfo, keygen('info')),
    getBuilders: memoize(adapter.getBuilders, keygen('builders')),
    getBuilds: memoize(adapter.getBuilds, keygen('builds'))
  };
}
//# sourceMappingURL=data:application/json;base64,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RUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDeEQsQ0FBQztDQUNIIiwiZmlsZSI6ImFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTFJVIGZyb20gJ2xydS1jYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGFwdGVyKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEFkYXB0ZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBBZGFwdGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEluZm8gPSBmdW5jdGlvbiBnZXRJbmZvKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEJ1aWxkZXJzID0gZnVuY3Rpb24gZ2V0QnVpbGRlcnMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xufTtcblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0QnVpbGRzID0gZnVuY3Rpb24gZ2V0QnVpbGRzKGJ1aWxkZXIpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZSguLi5hZGFwdGVycykge1xuICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gYWRkVG9NYXAoYWRhcHRlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlcmFibGUpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBtYXAuc2V0KGl0ZW0sIGFkYXB0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBhZGFwdGVyQnVpbGRlcnMoYWRhcHRlcikge1xuICAgIHJldHVybiBhZGFwdGVyLmdldEJ1aWxkZXJzKCkudGhlbihhZGRUb01hcChhZGFwdGVyKSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEluZm86IGZ1bmN0aW9uIGdldEluZm8oKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYWRhcHRlcnMubWFwKGFkYXB0ZXIgPT4gYWRhcHRlci5nZXRJbmZvKCkpKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoaW5mb3MpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogaW5mb3MubWFwKGluZm8gPT4gaW5mby5uYW1lKS5qb2luKCcsICcpLFxuICAgICAgICAgICAgZGF0YTogaW5mb3NcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldEJ1aWxkZXJzOiBmdW5jdGlvbiBnZXRCdWlsZGVycygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChhZGFwdGVycy5tYXAoYWRhcHRlckJ1aWxkZXJzKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4obGlzdHMgPT4gW10uY29uY2F0KC4uLmxpc3RzKSk7XG4gICAgfSxcbiAgICBnZXRCdWlsZHM6IGZ1bmN0aW9uIGdldEJ1aWxkcyhidWlsZGVyKSB7XG4gICAgICBjb25zdCBhZGFwdGVyID0gbWFwLmdldChidWlsZGVyKTtcbiAgICAgIHJldHVybiBhZGFwdGVyLmdldEJ1aWxkcyhidWlsZGVyKS50aGVuKGFkZFRvTWFwKGFkYXB0ZXIpKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWNoZShhZGFwdGVyLCBvcHRpb25zKSB7XG4gIGNvbnN0IGtleXMgPSBuZXcgV2Vha01hcCgpO1xuICBjb25zdCBjYWNoZSA9IG5ldyBMUlUob3B0aW9ucyk7XG5cbiAgZnVuY3Rpb24gbWVtb2l6ZShmbiwga2V5Zm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNhY2hlLmdldChrZXkpIHx8IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuICAgICAgY2FjaGUuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBrZXlnZW4ocHJlZml4ID0gJ2lkJykge1xuICAgIGNvbnN0IEVNUFRZID0ge307XG4gICAgbGV0IGlkID0gMDtcbiAgICByZXR1cm4gZnVuY3Rpb24ga2V5Z2VuKGl0ZW0gPSBFTVBUWSkge1xuICAgICAgaWYgKCFrZXlzLmhhcyhpdGVtKSkga2V5cy5zZXQoaXRlbSwgcHJlZml4ICsgKGlkKyspKTtcbiAgICAgIHJldHVybiBrZXlzLmdldChpdGVtKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEluZm86IG1lbW9pemUoYWRhcHRlci5nZXRJbmZvLCBrZXlnZW4oJ2luZm8nKSksXG4gICAgZ2V0QnVpbGRlcnM6IG1lbW9pemUoYWRhcHRlci5nZXRCdWlsZGVycywga2V5Z2VuKCdidWlsZGVycycpKSxcbiAgICBnZXRCdWlsZHM6IG1lbW9pemUoYWRhcHRlci5nZXRCdWlsZHMsIGtleWdlbignYnVpbGRzJykpXG4gIH07XG59XG4iXX0=