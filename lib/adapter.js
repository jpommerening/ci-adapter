'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = exports.UNKNOWN = exports.ABORTED = exports.ERRORED = exports.FAILURE = exports.WARNING = exports.SUCCESS = exports.PENDING = undefined;
exports.Adapter = Adapter;
exports.combine = combine;
exports.cache = cache;

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var PENDING = exports.PENDING = 'pending';
var SUCCESS = exports.SUCCESS = 'success';
var WARNING = exports.WARNING = 'warning';
var FAILURE = exports.FAILURE = 'failure';
var ERRORED = exports.ERRORED = 'errored';
var ABORTED = exports.ABORTED = 'aborted';
var UNKNOWN = exports.UNKNOWN = 'unknown';

var state = exports.state = {
  PENDING: PENDING,
  SUCCESS: SUCCESS,
  WARNING: WARNING,
  FAILURE: FAILURE,
  ERRORED: ERRORED,
  ABORTED: ABORTED,
  UNKNOWN: UNKNOWN
};

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
//# sourceMappingURL=data:application/json;base64,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QU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWCxXQUFPLFNBQVMsTUFBTSxHQUFlO1VBQWQsSUFBSSx5REFBRyxLQUFLOztBQUNqQyxVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEdBQUksRUFBRSxFQUFFLEFBQUMsQ0FBQyxDQUFDO0FBQ3JELGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QixDQUFBO0dBQ0Y7O0FBRUQsU0FBTztBQUNMLFdBQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsZUFBVyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3RCxhQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3hELENBQUM7Q0FDSCIsImZpbGUiOiJhZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExSVSBmcm9tICdscnUtY2FjaGUnO1xuXG5leHBvcnQgY29uc3QgUEVORElORyA9ICdwZW5kaW5nJztcbmV4cG9ydCBjb25zdCBTVUNDRVNTID0gJ3N1Y2Nlc3MnO1xuZXhwb3J0IGNvbnN0IFdBUk5JTkcgPSAnd2FybmluZyc7XG5leHBvcnQgY29uc3QgRkFJTFVSRSA9ICdmYWlsdXJlJztcbmV4cG9ydCBjb25zdCBFUlJPUkVEID0gJ2Vycm9yZWQnO1xuZXhwb3J0IGNvbnN0IEFCT1JURUQgPSAnYWJvcnRlZCc7XG5leHBvcnQgY29uc3QgVU5LTk9XTiA9ICd1bmtub3duJztcblxuZXhwb3J0IGNvbnN0IHN0YXRlID0ge1xuICBQRU5ESU5HLFxuICBTVUNDRVNTLFxuICBXQVJOSU5HLFxuICBGQUlMVVJFLFxuICBFUlJPUkVELFxuICBBQk9SVEVELFxuICBVTktOT1dOXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQWRhcHRlcihvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBZGFwdGVyKSkge1xuICAgIHJldHVybiBuZXcgQWRhcHRlcihvcHRpb25zKTtcbiAgfVxufVxuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRJbmZvID0gZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZGVycyA9IGZ1bmN0aW9uIGdldEJ1aWxkZXJzKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEJ1aWxkcyA9IGZ1bmN0aW9uIGdldEJ1aWxkcyhidWlsZGVyKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmUoLi4uYWRhcHRlcnMpIHtcbiAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIGFkZFRvTWFwKGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgbWFwLnNldChpdGVtLCBhZGFwdGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRhcHRlckJ1aWxkZXJzKGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZGVycygpLnRoZW4oYWRkVG9NYXAoYWRhcHRlcikpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRJbmZvOiBmdW5jdGlvbiBnZXRJbmZvKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGFkYXB0ZXJzLm1hcChhZGFwdGVyID0+IGFkYXB0ZXIuZ2V0SW5mbygpKSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGluZm9zKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGluZm9zLm1hcChpbmZvID0+IGluZm8ubmFtZSkuam9pbignLCAnKSxcbiAgICAgICAgICAgIGRhdGE6IGluZm9zXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRCdWlsZGVyczogZnVuY3Rpb24gZ2V0QnVpbGRlcnMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYWRhcHRlcnMubWFwKGFkYXB0ZXJCdWlsZGVycykpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGxpc3RzID0+IFtdLmNvbmNhdCguLi5saXN0cykpO1xuICAgIH0sXG4gICAgZ2V0QnVpbGRzOiBmdW5jdGlvbiBnZXRCdWlsZHMoYnVpbGRlcikge1xuICAgICAgY29uc3QgYWRhcHRlciA9IG1hcC5nZXQoYnVpbGRlcik7XG4gICAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZHMoYnVpbGRlcikudGhlbihhZGRUb01hcChhZGFwdGVyKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FjaGUoYWRhcHRlciwgb3B0aW9ucykge1xuICBjb25zdCBrZXlzID0gbmV3IFdlYWtNYXAoKTtcbiAgY29uc3QgY2FjaGUgPSBuZXcgTFJVKG9wdGlvbnMpO1xuXG4gIGZ1bmN0aW9uIG1lbW9pemUoZm4sIGtleWZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5Zm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgY29uc3QgdmFsdWUgPSBjYWNoZS5nZXQoa2V5KSB8fCBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cbiAgICAgIGNhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24ga2V5Z2VuKHByZWZpeCA9ICdpZCcpIHtcbiAgICBjb25zdCBFTVBUWSA9IHt9O1xuICAgIGxldCBpZCA9IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGtleWdlbihpdGVtID0gRU1QVFkpIHtcbiAgICAgIGlmICgha2V5cy5oYXMoaXRlbSkpIGtleXMuc2V0KGl0ZW0sIHByZWZpeCArIChpZCsrKSk7XG4gICAgICByZXR1cm4ga2V5cy5nZXQoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRJbmZvOiBtZW1vaXplKGFkYXB0ZXIuZ2V0SW5mbywga2V5Z2VuKCdpbmZvJykpLFxuICAgIGdldEJ1aWxkZXJzOiBtZW1vaXplKGFkYXB0ZXIuZ2V0QnVpbGRlcnMsIGtleWdlbignYnVpbGRlcnMnKSksXG4gICAgZ2V0QnVpbGRzOiBtZW1vaXplKGFkYXB0ZXIuZ2V0QnVpbGRzLCBrZXlnZW4oJ2J1aWxkcycpKVxuICB9O1xufVxuIl19