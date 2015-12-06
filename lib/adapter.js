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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Adapter(options) {
  if (!(this instanceof Adapter)) {
    return new Adapter(options);
  }
}

Adapter.prototype.getInfo = function getInfo() {
  return Promise.resolve({ builders: [] });
};

Adapter.prototype.getBuilder = function getBuilder(name) {
  return Promise.resolve({ name: name, builds: [] });
};

Adapter.prototype.getBuild = function getBuild(name, number) {
  return Promise.resolve({ name: name, number: number });
};

Adapter.prototype.getBuilders = function getBuilders() {
  var _this = this;

  return this.getInfo().then(function (info) {
    return Promise.all(info.builders.map(function (name) {
      return _this.getBuilder(name);
    }));
  });
};

Adapter.prototype.getBuilds = function getBuilds(name) {
  var _this2 = this;

  return this.getBuilder(name).then(function (builder) {
    return Promise.all(builder.builds.map(function (number) {
      return _this2.getBuild(name, number);
    }));
  });
};

Adapter.prototype.getAllBuilds = function getAllBuilds() {
  var _this3 = this;

  return this.getInfo().then(function (info) {
    return Promise.all(info.builders.map(function (name) {
      return _this3.getBuilds(name);
    }));
  }).then(function (builds) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(builds));
  });
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
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(lists));
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

  return Object.create(adapter, {
    getInfo: { value: memoize(adapter.getInfo, keygen('info')) },
    getBuilders: { value: memoize(adapter.getBuilders, keygen('builders')) },
    getBuilds: { value: memoize(adapter.getBuilds, keygen('builds')) }
  });
}
//# sourceMappingURL=data:application/json;base64,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QUFDLENBQUMsRUFBRTtBQUM1RCxlQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDeEUsYUFBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO0dBQ25FLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTFJVIGZyb20gJ2xydS1jYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGFwdGVyKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEFkYXB0ZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBBZGFwdGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEluZm8gPSBmdW5jdGlvbiBnZXRJbmZvKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgYnVpbGRlcnM6IFtdIH0pO1xufTtcblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0QnVpbGRlciA9IGZ1bmN0aW9uIGdldEJ1aWxkZXIobmFtZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgbmFtZSwgYnVpbGRzOiBbXSB9KTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEJ1aWxkID0gZnVuY3Rpb24gZ2V0QnVpbGQobmFtZSwgbnVtYmVyKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBuYW1lLCBudW1iZXIgfSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZGVycyA9IGZ1bmN0aW9uIGdldEJ1aWxkZXJzKCkge1xuICByZXR1cm4gdGhpcy5nZXRJbmZvKClcbiAgICAudGhlbihpbmZvID0+IFByb21pc2UuYWxsKGluZm8uYnVpbGRlcnMubWFwKG5hbWUgPT4gdGhpcy5nZXRCdWlsZGVyKG5hbWUpKSkpO1xufTtcblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0QnVpbGRzID0gZnVuY3Rpb24gZ2V0QnVpbGRzKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0QnVpbGRlcihuYW1lKVxuICAgIC50aGVuKGJ1aWxkZXIgPT4gUHJvbWlzZS5hbGwoYnVpbGRlci5idWlsZHMubWFwKG51bWJlciA9PiB0aGlzLmdldEJ1aWxkKG5hbWUsIG51bWJlcikpKSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRBbGxCdWlsZHMgPSBmdW5jdGlvbiBnZXRBbGxCdWlsZHMoKSB7XG4gIHJldHVybiB0aGlzLmdldEluZm8oKVxuICAgIC50aGVuKGluZm8gPT4gUHJvbWlzZS5hbGwoaW5mby5idWlsZGVycy5tYXAobmFtZSA9PiB0aGlzLmdldEJ1aWxkcyhuYW1lKSkpKVxuICAgIC50aGVuKGJ1aWxkcyA9PiBbXS5jb25jYXQoLi4uYnVpbGRzKSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZSguLi5hZGFwdGVycykge1xuICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gYWRkVG9NYXAoYWRhcHRlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlcmFibGUpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBtYXAuc2V0KGl0ZW0sIGFkYXB0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBhZGFwdGVyQnVpbGRlcnMoYWRhcHRlcikge1xuICAgIHJldHVybiBhZGFwdGVyLmdldEJ1aWxkZXJzKCkudGhlbihhZGRUb01hcChhZGFwdGVyKSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEluZm86IGZ1bmN0aW9uIGdldEluZm8oKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYWRhcHRlcnMubWFwKGFkYXB0ZXIgPT4gYWRhcHRlci5nZXRJbmZvKCkpKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoaW5mb3MpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogaW5mb3MubWFwKGluZm8gPT4gaW5mby5uYW1lKS5qb2luKCcsICcpLFxuICAgICAgICAgICAgZGF0YTogaW5mb3NcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldEJ1aWxkZXJzOiBmdW5jdGlvbiBnZXRCdWlsZGVycygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChhZGFwdGVycy5tYXAoYWRhcHRlckJ1aWxkZXJzKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4obGlzdHMgPT4gW10uY29uY2F0KC4uLmxpc3RzKSk7XG4gICAgfSxcbiAgICBnZXRCdWlsZHM6IGZ1bmN0aW9uIGdldEJ1aWxkcyhidWlsZGVyKSB7XG4gICAgICBjb25zdCBhZGFwdGVyID0gbWFwLmdldChidWlsZGVyKTtcbiAgICAgIHJldHVybiBhZGFwdGVyLmdldEJ1aWxkcyhidWlsZGVyKS50aGVuKGFkZFRvTWFwKGFkYXB0ZXIpKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWNoZShhZGFwdGVyLCBvcHRpb25zKSB7XG4gIGNvbnN0IGtleXMgPSBuZXcgV2Vha01hcCgpO1xuICBjb25zdCBjYWNoZSA9IG5ldyBMUlUob3B0aW9ucyk7XG5cbiAgZnVuY3Rpb24gbWVtb2l6ZShmbiwga2V5Zm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNhY2hlLmdldChrZXkpIHx8IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuICAgICAgY2FjaGUuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBrZXlnZW4ocHJlZml4ID0gJ2lkJykge1xuICAgIGNvbnN0IEVNUFRZID0ge307XG4gICAgbGV0IGlkID0gMDtcbiAgICByZXR1cm4gZnVuY3Rpb24ga2V5Z2VuKGl0ZW0gPSBFTVBUWSkge1xuICAgICAgaWYgKCFrZXlzLmhhcyhpdGVtKSkga2V5cy5zZXQoaXRlbSwgcHJlZml4ICsgKGlkKyspKTtcbiAgICAgIHJldHVybiBrZXlzLmdldChpdGVtKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShhZGFwdGVyLCB7XG4gICAgZ2V0SW5mbzogeyB2YWx1ZTogbWVtb2l6ZShhZGFwdGVyLmdldEluZm8sIGtleWdlbignaW5mbycpKSB9LFxuICAgIGdldEJ1aWxkZXJzOiB7IHZhbHVlOiBtZW1vaXplKGFkYXB0ZXIuZ2V0QnVpbGRlcnMsIGtleWdlbignYnVpbGRlcnMnKSkgfSxcbiAgICBnZXRCdWlsZHM6IHsgdmFsdWU6IG1lbW9pemUoYWRhcHRlci5nZXRCdWlsZHMsIGtleWdlbignYnVpbGRzJykpIH1cbiAgfSk7XG59XG4iXX0=