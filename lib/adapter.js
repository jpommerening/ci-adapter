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

Adapter.prototype.getBuilder = function getBuilder(info, name) {
  return Promise.resolve({ name: name, builds: [] });
};

Adapter.prototype.getBuild = function getBuild(builder, number) {
  return Promise.resolve({ name: builder.name, number: number });
};

Adapter.prototype.getBuilders = function getBuilders(info) {
  var _this = this;

  return Promise.all(info.builders.map(function (name) {
    return _this.getBuilder(info, name);
  }));
};

Adapter.prototype.getBuilds = function getBuilds(builder) {
  var _this2 = this;

  return Promise.all(builder.builds.map(function (number) {
    return _this2.getBuild(builder, number);
  }));
};

Adapter.prototype.getAllBuilds = function getAllBuilds(info) {
  var _this3 = this;

  return this.getBuilders(info).then(function (builders) {
    return Promise.all(builders.map(function (builder) {
      return _this3.getBuilds(builder);
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
      return [].join.call(arguments, '\n');
    };
  }

  return Object.create(adapter, {
    getInfo: { value: memoize(adapter.getInfo, keygen('info')) },
    getBuilders: { value: memoize(adapter.getBuilders, keygen('builders')) },
    getBuilds: { value: memoize(adapter.getBuilds, keygen('builds')) }
  });
}
//# sourceMappingURL=data:application/json;base64,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RSxDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJhZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExSVSBmcm9tICdscnUtY2FjaGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWRhcHRlcihvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBZGFwdGVyKSkge1xuICAgIHJldHVybiBuZXcgQWRhcHRlcihvcHRpb25zKTtcbiAgfVxufVxuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRJbmZvID0gZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGJ1aWxkZXJzOiBbXSB9KTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEJ1aWxkZXIgPSBmdW5jdGlvbiBnZXRCdWlsZGVyKGluZm8sIG5hbWUpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IG5hbWUsIGJ1aWxkczogW10gfSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZCA9IGZ1bmN0aW9uIGdldEJ1aWxkKGJ1aWxkZXIsIG51bWJlcikge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgbmFtZTogYnVpbGRlci5uYW1lLCBudW1iZXIgfSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZGVycyA9IGZ1bmN0aW9uIGdldEJ1aWxkZXJzKGluZm8pIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKGluZm8uYnVpbGRlcnMubWFwKG5hbWUgPT4gdGhpcy5nZXRCdWlsZGVyKGluZm8sIG5hbWUpKSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZHMgPSBmdW5jdGlvbiBnZXRCdWlsZHMoYnVpbGRlcikge1xuICByZXR1cm4gUHJvbWlzZS5hbGwoYnVpbGRlci5idWlsZHMubWFwKG51bWJlciA9PiB0aGlzLmdldEJ1aWxkKGJ1aWxkZXIsIG51bWJlcikpKTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEFsbEJ1aWxkcyA9IGZ1bmN0aW9uIGdldEFsbEJ1aWxkcyhpbmZvKSB7XG4gIHJldHVybiB0aGlzLmdldEJ1aWxkZXJzKGluZm8pXG4gICAgLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGJ1aWxkZXIgPT4gdGhpcy5nZXRCdWlsZHMoYnVpbGRlcikpKSlcbiAgICAudGhlbihidWlsZHMgPT4gW10uY29uY2F0KC4uLmJ1aWxkcykpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmUoLi4uYWRhcHRlcnMpIHtcbiAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIGFkZFRvTWFwKGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgbWFwLnNldChpdGVtLCBhZGFwdGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRhcHRlckJ1aWxkZXJzKGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZGVycygpLnRoZW4oYWRkVG9NYXAoYWRhcHRlcikpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRJbmZvOiBmdW5jdGlvbiBnZXRJbmZvKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGFkYXB0ZXJzLm1hcChhZGFwdGVyID0+IGFkYXB0ZXIuZ2V0SW5mbygpKSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGluZm9zKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGluZm9zLm1hcChpbmZvID0+IGluZm8ubmFtZSkuam9pbignLCAnKSxcbiAgICAgICAgICAgIGRhdGE6IGluZm9zXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRCdWlsZGVyczogZnVuY3Rpb24gZ2V0QnVpbGRlcnMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYWRhcHRlcnMubWFwKGFkYXB0ZXJCdWlsZGVycykpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGxpc3RzID0+IFtdLmNvbmNhdCguLi5saXN0cykpO1xuICAgIH0sXG4gICAgZ2V0QnVpbGRzOiBmdW5jdGlvbiBnZXRCdWlsZHMoYnVpbGRlcikge1xuICAgICAgY29uc3QgYWRhcHRlciA9IG1hcC5nZXQoYnVpbGRlcik7XG4gICAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZHMoYnVpbGRlcikudGhlbihhZGRUb01hcChhZGFwdGVyKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FjaGUoYWRhcHRlciwgb3B0aW9ucykge1xuICBjb25zdCBrZXlzID0gbmV3IFdlYWtNYXAoKTtcbiAgY29uc3QgY2FjaGUgPSBuZXcgTFJVKG9wdGlvbnMpO1xuXG4gIGZ1bmN0aW9uIG1lbW9pemUoZm4sIGtleWZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5Zm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgY29uc3QgdmFsdWUgPSBjYWNoZS5nZXQoa2V5KSB8fCBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cbiAgICAgIGNhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24ga2V5Z2VuKHByZWZpeCA9ICdpZCcpIHtcbiAgICBjb25zdCBFTVBUWSA9IHt9O1xuICAgIGxldCBpZCA9IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGtleWdlbigpIHtcbiAgICAgIHJldHVybiBbXS5qb2luLmNhbGwoYXJndW1lbnRzLCAnXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoYWRhcHRlciwge1xuICAgIGdldEluZm86IHsgdmFsdWU6IG1lbW9pemUoYWRhcHRlci5nZXRJbmZvLCBrZXlnZW4oJ2luZm8nKSkgfSxcbiAgICBnZXRCdWlsZGVyczogeyB2YWx1ZTogbWVtb2l6ZShhZGFwdGVyLmdldEJ1aWxkZXJzLCBrZXlnZW4oJ2J1aWxkZXJzJykpIH0sXG4gICAgZ2V0QnVpbGRzOiB7IHZhbHVlOiBtZW1vaXplKGFkYXB0ZXIuZ2V0QnVpbGRzLCBrZXlnZW4oJ2J1aWxkcycpKSB9XG4gIH0pO1xufVxuIl19