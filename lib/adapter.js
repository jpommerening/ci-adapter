'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combine = combine;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PENDING = exports.PENDING = 'pending';
var SUCCESS = exports.SUCCESS = 'success';
var WARNING = exports.WARNING = 'warning';
var FAILURE = exports.FAILURE = 'failure';
var ERRORED = exports.ERRORED = 'errored';
var ABORTED = exports.ABORTED = 'aborted';
var UNKNOWN = exports.UNKNOWN = 'unknown';

var STATES = exports.STATES = {
  PENDING: PENDING,
  SUCCESS: SUCCESS,
  WARNING: WARNING,
  FAILURE: FAILURE,
  ERRORED: ERRORED,
  ABORTED: ABORTED,
  UNKNOWN: UNKNOWN
};

var Adapter = exports.Adapter = (function () {
  function Adapter(options) {
    _classCallCheck(this, Adapter);
  }

  _createClass(Adapter, [{
    key: 'getBuilders',
    value: function getBuilders() {
      return Promise.resolve([]);
    }
  }, {
    key: 'getBuilds',
    value: function getBuilds(builder) {
      return Promise.resolve([]);
    }
  }, {
    key: 'getBuildDetails',
    value: function getBuildDetails(build) {
      return Promise.resolve({});
    }
  }]);

  return Adapter;
})();

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
    getBuilders: function getBuilders() {
      return Promise.all(adapters.map(adapterBuilders)).then(function (lists) {
        var _ref;

        return (_ref = []).concat.apply(_ref, _toConsumableArray(lists));
      });
    },
    getBuilds: function getBuilds(builder) {
      var adapter = map.get(builder);
      return adapter.getBuilds(builder).then(addToMap(adapter));
    },
    getBuildDetails: function getBuildDetails(build) {
      var adapter = map.get(build);
      return adapter.getBuildDetails(build);
    }
  };
}
//# sourceMappingURL=data:application/json;base64,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O0tBQ3ZDO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6ImFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjb25zdCBQRU5ESU5HID0gJ3BlbmRpbmcnO1xuZXhwb3J0IGNvbnN0IFNVQ0NFU1MgPSAnc3VjY2Vzcyc7XG5leHBvcnQgY29uc3QgV0FSTklORyA9ICd3YXJuaW5nJztcbmV4cG9ydCBjb25zdCBGQUlMVVJFID0gJ2ZhaWx1cmUnO1xuZXhwb3J0IGNvbnN0IEVSUk9SRUQgPSAnZXJyb3JlZCc7XG5leHBvcnQgY29uc3QgQUJPUlRFRCA9ICdhYm9ydGVkJztcbmV4cG9ydCBjb25zdCBVTktOT1dOID0gJ3Vua25vd24nO1xuXG5leHBvcnQgY29uc3QgU1RBVEVTID0ge1xuICBQRU5ESU5HLFxuICBTVUNDRVNTLFxuICBXQVJOSU5HLFxuICBGQUlMVVJFLFxuICBFUlJPUkVELFxuICBBQk9SVEVELFxuICBVTktOT1dOXG59O1xuXG5leHBvcnQgY2xhc3MgQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgfVxuXG4gIGdldEJ1aWxkZXJzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG4gIGdldEJ1aWxkcyhidWlsZGVyKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gIH1cbiAgZ2V0QnVpbGREZXRhaWxzKGJ1aWxkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmUoLi4uYWRhcHRlcnMpIHtcbiAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIGFkZFRvTWFwKGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgbWFwLnNldChpdGVtLCBhZGFwdGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRhcHRlckJ1aWxkZXJzKGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZGVycygpLnRoZW4oYWRkVG9NYXAoYWRhcHRlcikpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRCdWlsZGVyczogZnVuY3Rpb24gZ2V0QnVpbGRlcnMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYWRhcHRlcnMubWFwKGFkYXB0ZXJCdWlsZGVycykpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGxpc3RzID0+IFtdLmNvbmNhdCguLi5saXN0cykpO1xuICAgIH0sXG4gICAgZ2V0QnVpbGRzOiBmdW5jdGlvbiBnZXRCdWlsZHMoYnVpbGRlcikge1xuICAgICAgY29uc3QgYWRhcHRlciA9IG1hcC5nZXQoYnVpbGRlcik7XG4gICAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZHMoYnVpbGRlcikudGhlbihhZGRUb01hcChhZGFwdGVyKSk7XG4gICAgfSxcbiAgICBnZXRCdWlsZERldGFpbHM6IGZ1bmN0aW9uIGdldEJ1aWxkRGV0YWlscyhidWlsZCkge1xuICAgICAgY29uc3QgYWRhcHRlciA9IG1hcC5nZXQoYnVpbGQpO1xuICAgICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGREZXRhaWxzKGJ1aWxkKTtcbiAgICB9XG4gIH07XG59XG4iXX0=