'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = filter;

var _adapter = require('./adapter');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function filter(adapter) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var include = _ref.include;
  var exclude = _ref.exclude;

  var matchInclude = toMatcher(include);
  var matchExclude = toMatcher(exclude);

  var match = function match(obj) {
    return matchInclude(obj) || !matchExclude(obj);
  };

  return Object.create(adapter, {
    getBuilder: { value: getBuilder },
    getBuild: { value: getBuild },
    getBuilders: { value: getBuilders },
    getBuilds: { value: getBuilds }
  });

  function getBuilder(info, name) {
    return adapter.getBuilder(info, name).then(function (builder) {
      return match(builder) ? builder : noMatch(builder);
    });
  }

  function getBuild(builder, number) {
    return adapter.getBuild(builder, number).then(function (build) {
      return match(build) ? build : noMatch(build);
    });
  }

  function getBuilders(info) {
    return adapter.getBuilders(info).then(function (builders) {
      return builders.filter(match);
    });
  }

  function getBuilds(builder) {
    return adapter.getBuilds(builder).then(function (builds) {
      return builds.filter(match);
    });
  }
}

function noMatch(object) {
  var error = new Error('Requested object does not match filter');
  error.object = object;

  return Promise.reject(error);
}

function toMatchFn(value) {
  if (_instanceof(value, Function)) {
    return value;
  }
  if (_instanceof(value, RegExp)) {
    return function (v) {
      return value.test(v);
    };
  }
  if (Array.isArray(value)) {
    var _ret = (function () {
      var matchers = value.map(toMatcher);
      return {
        v: function v(_v) {
          return matchers.some(function (m) {
            return m(_v);
          });
        }
      };
    })();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    var _ret2 = (function () {
      var matchers = {};
      Object.keys(value).forEach(function (k) {
        return matchers[k] = toMatcher(value[k]);
      });
      return {
        v: function v(_v2) {
          return Object.keys(matchers).every(function (k) {
            return matchers[k](_v2[k]);
          });
        }
      };
    })();

    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
  }
  return function (v) {
    return v === value;
  };
}

function toMatcher(value) {
  var fn = toMatchFn(value);
  return function (v) {
    return Array.isArray(v) ? v.some(fn) : fn(v);
  };
}
//# sourceMappingURL=data:application/json;base64,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V0FBQSxFQUFDO2lCQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO21CQUFJLENBQUMsQ0FBQyxFQUFDLENBQUM7V0FBQSxDQUFDO1NBQUE7UUFBRTs7OztHQUN4QztBQUNELE1BQUksUUFBTyxLQUFLLHlDQUFMLEtBQUssT0FBSyxRQUFRLEVBQUU7O0FBQzdCLFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixZQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7ZUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUNuRTtXQUFRLFdBQUEsR0FBQztpQkFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUM7bUJBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUM7U0FBQTtRQUFFOzs7O0dBQ25FO0FBQ0QsU0FBUSxVQUFBLENBQUM7V0FBSSxDQUFDLEtBQUssS0FBSztHQUFBLENBQUU7Q0FDM0I7O0FBRUQsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3hCLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixTQUFRLFVBQUEsQ0FBQztXQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBRTtDQUNyRCIsImZpbGUiOiJmaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcihhZGFwdGVyLCB7IGluY2x1ZGUsIGV4Y2x1ZGUgfSA9IHt9KSB7XG4gIGNvbnN0IG1hdGNoSW5jbHVkZSA9IHRvTWF0Y2hlcihpbmNsdWRlKTtcbiAgY29uc3QgbWF0Y2hFeGNsdWRlID0gdG9NYXRjaGVyKGV4Y2x1ZGUpO1xuXG4gIGNvbnN0IG1hdGNoID0gKG9iaiA9PiBtYXRjaEluY2x1ZGUob2JqKSB8fCAhbWF0Y2hFeGNsdWRlKG9iaikpO1xuXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKGFkYXB0ZXIsIHtcbiAgICBnZXRCdWlsZGVyOiB7IHZhbHVlOiBnZXRCdWlsZGVyIH0sXG4gICAgZ2V0QnVpbGQ6IHsgdmFsdWU6IGdldEJ1aWxkIH0sXG4gICAgZ2V0QnVpbGRlcnM6IHsgdmFsdWU6IGdldEJ1aWxkZXJzIH0sXG4gICAgZ2V0QnVpbGRzOiB7IHZhbHVlOiBnZXRCdWlsZHMgfVxuICB9KTtcblxuICBmdW5jdGlvbiBnZXRCdWlsZGVyKGluZm8sIG5hbWUpIHtcbiAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZGVyKGluZm8sIG5hbWUpXG4gICAgICAudGhlbihidWlsZGVyID0+IG1hdGNoKGJ1aWxkZXIpID8gYnVpbGRlciA6IG5vTWF0Y2goYnVpbGRlcikpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QnVpbGQoYnVpbGRlciwgbnVtYmVyKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGQoYnVpbGRlciwgbnVtYmVyKVxuICAgICAgLnRoZW4oYnVpbGQgPT4gbWF0Y2goYnVpbGQpID8gYnVpbGQgOiBub01hdGNoKGJ1aWxkKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCdWlsZGVycyhpbmZvKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRlcnMoaW5mbylcbiAgICAgIC50aGVuKGJ1aWxkZXJzID0+IGJ1aWxkZXJzLmZpbHRlcihtYXRjaCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QnVpbGRzKGJ1aWxkZXIpIHtcbiAgICByZXR1cm4gYWRhcHRlci5nZXRCdWlsZHMoYnVpbGRlcilcbiAgICAgIC50aGVuKGJ1aWxkcyA9PiBidWlsZHMuZmlsdGVyKG1hdGNoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9NYXRjaChvYmplY3QpIHtcbiAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1JlcXVlc3RlZCBvYmplY3QgZG9lcyBub3QgbWF0Y2ggZmlsdGVyJyk7XG4gIGVycm9yLm9iamVjdCA9IG9iamVjdDtcblxuICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xufVxuXG5mdW5jdGlvbiB0b01hdGNoRm4odmFsdWUpIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuICh2ID0+IHZhbHVlLnRlc3QodikpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGNvbnN0IG1hdGNoZXJzID0gdmFsdWUubWFwKHRvTWF0Y2hlcik7XG4gICAgcmV0dXJuICh2ID0+IG1hdGNoZXJzLnNvbWUobSA9PiBtKHYpKSk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCBtYXRjaGVycyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGsgPT4gbWF0Y2hlcnNba10gPSB0b01hdGNoZXIodmFsdWVba10pKTtcbiAgICByZXR1cm4gKHYgPT4gT2JqZWN0LmtleXMobWF0Y2hlcnMpLmV2ZXJ5KGsgPT4gbWF0Y2hlcnNba10odltrXSkpKTtcbiAgfVxuICByZXR1cm4gKHYgPT4gdiA9PT0gdmFsdWUpO1xufVxuXG5mdW5jdGlvbiB0b01hdGNoZXIodmFsdWUpIHtcbiAgY29uc3QgZm4gPSB0b01hdGNoRm4odmFsdWUpO1xuICByZXR1cm4gKHYgPT4gQXJyYXkuaXNBcnJheSh2KSA/IHYuc29tZShmbikgOiBmbih2KSk7XG59XG4iXX0=