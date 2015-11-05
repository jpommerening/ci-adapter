"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combine = combine;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Adapter = exports.Adapter = (function () {
  function Adapter(options) {
    _classCallCheck(this, Adapter);
  }

  _createClass(Adapter, [{
    key: "getBuilders",
    value: function getBuilders() {
      return Promise.resolve([]);
    }
  }, {
    key: "getBuilds",
    value: function getBuilds(builder) {
      return Promise.resolve([]);
    }
  }, {
    key: "getBuildDetails",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hZGFwdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUFlZ0IsT0FBTyxHQUFQLE9BQU87Ozs7OztJQWZWLE9BQU8sV0FBUCxPQUFPO0FBQ2xCLFdBRFcsT0FBTyxDQUNOLE9BQU8sRUFBRTswQkFEVixPQUFPO0dBRWpCOztlQUZVLE9BQU87O2tDQUlKO0FBQ1osYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCOzs7OEJBQ1MsT0FBTyxFQUFFO0FBQ2pCLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM1Qjs7O29DQUNlLEtBQUssRUFBRTtBQUNyQixhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7OztTQVpVLE9BQU87OztBQWViLFNBQVMsT0FBTyxHQUFjO29DQUFWLFFBQVE7QUFBUixZQUFROzs7QUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsV0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ3pCLFdBQU8sVUFBVSxRQUFRLEVBQUU7Ozs7OztBQUN6Qiw2QkFBbUIsUUFBUSw4SEFBRTtjQUFsQixJQUFJOztBQUNiLGFBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3hCOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsYUFBTyxRQUFRLENBQUM7S0FDakIsQ0FBQztHQUNIOztBQUVELFdBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRTtBQUNoQyxXQUFPLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDdEQ7O0FBRUQsU0FBTztBQUNMLGVBQVcsRUFBRSxTQUFTLFdBQVcsR0FBRztBQUNsQyxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUNsQyxJQUFJLENBQUMsVUFBQSxLQUFLOzs7ZUFBSSxRQUFBLEVBQUUsRUFBQyxNQUFNLE1BQUEsMEJBQUksS0FBSyxFQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ25EO0FBQ0QsYUFBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUNyQyxVQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGFBQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDM0Q7QUFDRCxtQkFBZSxFQUFFLFNBQVMsZUFBZSxDQUFDLEtBQUssRUFBRTtBQUMvQyxVQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLGFBQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2QztHQUNGLENBQUM7Q0FDSCIsImZpbGUiOiJhZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gIH1cblxuICBnZXRCdWlsZGVycygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgfVxuICBnZXRCdWlsZHMoYnVpbGRlcikge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG4gIGdldEJ1aWxkRGV0YWlscyhidWlsZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lKC4uLmFkYXB0ZXJzKSB7XG4gIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcblxuICBmdW5jdGlvbiBhZGRUb01hcChhZGFwdGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVyYWJsZSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIG1hcC5zZXQoaXRlbSwgYWRhcHRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkYXB0ZXJCdWlsZGVycyhhZGFwdGVyKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRlcnMoKS50aGVuKGFkZFRvTWFwKGFkYXB0ZXIpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0QnVpbGRlcnM6IGZ1bmN0aW9uIGdldEJ1aWxkZXJzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGFkYXB0ZXJzLm1hcChhZGFwdGVyQnVpbGRlcnMpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihsaXN0cyA9PiBbXS5jb25jYXQoLi4ubGlzdHMpKTtcbiAgICB9LFxuICAgIGdldEJ1aWxkczogZnVuY3Rpb24gZ2V0QnVpbGRzKGJ1aWxkZXIpIHtcbiAgICAgIGNvbnN0IGFkYXB0ZXIgPSBtYXAuZ2V0KGJ1aWxkZXIpO1xuICAgICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRzKGJ1aWxkZXIpLnRoZW4oYWRkVG9NYXAoYWRhcHRlcikpO1xuICAgIH0sXG4gICAgZ2V0QnVpbGREZXRhaWxzOiBmdW5jdGlvbiBnZXRCdWlsZERldGFpbHMoYnVpbGQpIHtcbiAgICAgIGNvbnN0IGFkYXB0ZXIgPSBtYXAuZ2V0KGJ1aWxkKTtcbiAgICAgIHJldHVybiBhZGFwdGVyLmdldEJ1aWxkRGV0YWlscyhidWlsZCk7XG4gICAgfVxuICB9O1xufVxuIl19