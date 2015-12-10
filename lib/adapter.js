'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Adapter = Adapter;
exports.combine = combine;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function Adapter(options) {
  if (!_instanceof(this, Adapter)) {
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
//# sourceMappingURL=data:application/json;base64,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TyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ3REOztBQUVELFNBQU87QUFDTCxXQUFPLEVBQUUsU0FBUyxPQUFPLEdBQUc7QUFDMUIsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2VBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQyxDQUMzRCxJQUFJLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFDckIsZUFBTztBQUNMLGNBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTttQkFBSSxJQUFJLENBQUMsSUFBSTtXQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzdDLGNBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQztPQUNILENBQUMsQ0FBQztLQUNOO0FBQ0QsZUFBVyxFQUFFLFNBQVMsV0FBVyxHQUFHO0FBQ2xDLGFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQ2xDLElBQUksQ0FBQyxVQUFBLEtBQUs7OztlQUFJLFNBQUEsRUFBRSxFQUFDLE1BQU0sTUFBQSwyQkFBSSxLQUFLLEVBQUM7T0FBQSxDQUFDLENBQUM7S0FDbkQ7QUFDRCxhQUFTLEVBQUUsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFO0FBQ3JDLFVBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsYUFBTyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUMzRDtHQUNGLENBQUM7Q0FDSCIsImZpbGUiOiJhZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIEFkYXB0ZXIob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQWRhcHRlcikpIHtcbiAgICByZXR1cm4gbmV3IEFkYXB0ZXIob3B0aW9ucyk7XG4gIH1cbn1cblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0SW5mbyA9IGZ1bmN0aW9uIGdldEluZm8oKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBidWlsZGVyczogW10gfSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZGVyID0gZnVuY3Rpb24gZ2V0QnVpbGRlcihpbmZvLCBuYW1lKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBuYW1lLCBidWlsZHM6IFtdIH0pO1xufTtcblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0QnVpbGQgPSBmdW5jdGlvbiBnZXRCdWlsZChidWlsZGVyLCBudW1iZXIpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IG5hbWU6IGJ1aWxkZXIubmFtZSwgbnVtYmVyIH0pO1xufTtcblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0QnVpbGRlcnMgPSBmdW5jdGlvbiBnZXRCdWlsZGVycyhpbmZvKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChpbmZvLmJ1aWxkZXJzLm1hcChuYW1lID0+IHRoaXMuZ2V0QnVpbGRlcihpbmZvLCBuYW1lKSkpO1xufTtcblxuQWRhcHRlci5wcm90b3R5cGUuZ2V0QnVpbGRzID0gZnVuY3Rpb24gZ2V0QnVpbGRzKGJ1aWxkZXIpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKGJ1aWxkZXIuYnVpbGRzLm1hcChudW1iZXIgPT4gdGhpcy5nZXRCdWlsZChidWlsZGVyLCBudW1iZXIpKSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRBbGxCdWlsZHMgPSBmdW5jdGlvbiBnZXRBbGxCdWlsZHMoaW5mbykge1xuICByZXR1cm4gdGhpcy5nZXRCdWlsZGVycyhpbmZvKVxuICAgIC50aGVuKGJ1aWxkZXJzID0+IFByb21pc2UuYWxsKGJ1aWxkZXJzLm1hcChidWlsZGVyID0+IHRoaXMuZ2V0QnVpbGRzKGJ1aWxkZXIpKSkpXG4gICAgLnRoZW4oYnVpbGRzID0+IFtdLmNvbmNhdCguLi5idWlsZHMpKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lKC4uLmFkYXB0ZXJzKSB7XG4gIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcblxuICBmdW5jdGlvbiBhZGRUb01hcChhZGFwdGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVyYWJsZSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIG1hcC5zZXQoaXRlbSwgYWRhcHRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkYXB0ZXJCdWlsZGVycyhhZGFwdGVyKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRlcnMoKS50aGVuKGFkZFRvTWFwKGFkYXB0ZXIpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0SW5mbzogZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChhZGFwdGVycy5tYXAoYWRhcHRlciA9PiBhZGFwdGVyLmdldEluZm8oKSkpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChpbmZvcykge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiBpbmZvcy5tYXAoaW5mbyA9PiBpbmZvLm5hbWUpLmpvaW4oJywgJyksXG4gICAgICAgICAgICBkYXRhOiBpbmZvc1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0QnVpbGRlcnM6IGZ1bmN0aW9uIGdldEJ1aWxkZXJzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGFkYXB0ZXJzLm1hcChhZGFwdGVyQnVpbGRlcnMpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihsaXN0cyA9PiBbXS5jb25jYXQoLi4ubGlzdHMpKTtcbiAgICB9LFxuICAgIGdldEJ1aWxkczogZnVuY3Rpb24gZ2V0QnVpbGRzKGJ1aWxkZXIpIHtcbiAgICAgIGNvbnN0IGFkYXB0ZXIgPSBtYXAuZ2V0KGJ1aWxkZXIpO1xuICAgICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRzKGJ1aWxkZXIpLnRoZW4oYWRkVG9NYXAoYWRhcHRlcikpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==