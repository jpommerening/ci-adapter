"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Adapter = Adapter;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hZGFwdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLE9BQU8sR0FBUCxPQUFPOzs7Ozs7QUFBaEIsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQy9CLE1BQUksYUFBRSxJQUFJLEVBQVksT0FBTyxDQUFDLEVBQUU7QUFDOUIsV0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUM3QjtDQUNGOztBQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxHQUFHO0FBQzdDLFNBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQzFDLENBQUM7O0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUM3RCxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQzlDLENBQUM7O0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM5RCxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztDQUN4RCxDQUFDOztBQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTs7O0FBQ3pELFNBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7V0FBSSxNQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0dBQUEsQ0FBQyxDQUFDLENBQUM7Q0FDNUUsQ0FBQzs7QUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUU7OztBQUN4RCxTQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNO1dBQUksT0FBSyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztHQUFBLENBQUMsQ0FBQyxDQUFDO0NBQ2xGLENBQUM7O0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFOzs7QUFDM0QsU0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUMxQixJQUFJLENBQUMsVUFBQSxRQUFRO1dBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTzthQUFJLE9BQUssU0FBUyxDQUFDLE9BQU8sQ0FBQztLQUFBLENBQUMsQ0FBQztHQUFBLENBQUMsQ0FDL0UsSUFBSSxDQUFDLFVBQUEsTUFBTTs7O1dBQUksUUFBQSxFQUFFLEVBQUMsTUFBTSxNQUFBLDBCQUFJLE1BQU0sRUFBQztHQUFBLENBQUMsQ0FBQztDQUN6QyxDQUFDIiwiZmlsZSI6ImFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gQWRhcHRlcihvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBZGFwdGVyKSkge1xuICAgIHJldHVybiBuZXcgQWRhcHRlcihvcHRpb25zKTtcbiAgfVxufVxuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRJbmZvID0gZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGJ1aWxkZXJzOiBbXSB9KTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEJ1aWxkZXIgPSBmdW5jdGlvbiBnZXRCdWlsZGVyKGluZm8sIG5hbWUpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IG5hbWUsIGJ1aWxkczogW10gfSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZCA9IGZ1bmN0aW9uIGdldEJ1aWxkKGJ1aWxkZXIsIG51bWJlcikge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgbmFtZTogYnVpbGRlci5uYW1lLCBudW1iZXIgfSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZGVycyA9IGZ1bmN0aW9uIGdldEJ1aWxkZXJzKGluZm8pIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKGluZm8uYnVpbGRlcnMubWFwKG5hbWUgPT4gdGhpcy5nZXRCdWlsZGVyKGluZm8sIG5hbWUpKSk7XG59O1xuXG5BZGFwdGVyLnByb3RvdHlwZS5nZXRCdWlsZHMgPSBmdW5jdGlvbiBnZXRCdWlsZHMoYnVpbGRlcikge1xuICByZXR1cm4gUHJvbWlzZS5hbGwoYnVpbGRlci5idWlsZHMubWFwKG51bWJlciA9PiB0aGlzLmdldEJ1aWxkKGJ1aWxkZXIsIG51bWJlcikpKTtcbn07XG5cbkFkYXB0ZXIucHJvdG90eXBlLmdldEFsbEJ1aWxkcyA9IGZ1bmN0aW9uIGdldEFsbEJ1aWxkcyhpbmZvKSB7XG4gIHJldHVybiB0aGlzLmdldEJ1aWxkZXJzKGluZm8pXG4gICAgLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGJ1aWxkZXIgPT4gdGhpcy5nZXRCdWlsZHMoYnVpbGRlcikpKSlcbiAgICAudGhlbihidWlsZHMgPT4gW10uY29uY2F0KC4uLmJ1aWxkcykpO1xufTtcbiJdfQ==