'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Jenkins;

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _urlTemplate = require('./url-template');

var _urlTemplate2 = _interopRequireDefault(_urlTemplate);

var _adapter = require('./adapter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JENKINS_MEDIA_TYPE = 'application/json';
var JENKINS_STATE_MAP = {
  SUCCESS: _adapter.SUCCESS,
  UNSTABLE: _adapter.WARNING,
  FAILURE: _adapter.FAILURE
};

function Jenkins(endpoint) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var h = _ref.headers;

  var headers = Object.assign({
    Accept: JENKINS_MEDIA_TYPE
  }, h);
  var options = {
    headers: headers
  };

  options.headers = Object.assign({}, options.headers, headers);

  function getInfo() {
    return (0, _fetch2.default)(endpoint + '/api/json', options).then(function (response) {
      return response.json();
    }).then(function (root) {
      return {
        name: root.nodeName,
        url: endpoint + '/api/json',
        html_url: endpoint,
        builders_url: endpoint + '/job{/name}/api/json{?tree}',
        builders: root.jobs.map(function (job) {
          return job.name;
        }),
        data: root
      };
    });
  }

  function getBuilders() {
    return getInfo().then(function (info) {
      var url = endpoint + '/api/json?tree=jobs[name,builds[number]{,10}],views[name,jobs[name]]';

      return (0, _fetch2.default)(url, options);
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      return data.jobs.map(function (job) {
        var name = job.name;

        return {
          name: name,
          url: endpoint + '/job/' + name + '/api/json',
          html_url: endpoint + '/job/' + name,
          builds_url: endpoint + '/job/' + name + '/{number}/api/json{?tree}',
          builds: job.builds.map(function (build) {
            return build.number;
          }),
          data: data
        };
      });
    });
  }

  function getBuilds(builder) {
    return Promise.all(builder.builds.map(function (number) {
      var template = _urlTemplate2.default.parse(builder.builds_url);
      var url = template.expand({ number: number });

      return (0, _fetch2.default)(url, options).then(function (response) {
        return response.json();
      });
    })).then(function (builds) {
      return builds.map(function (build) {
        var building = build.building;

        return {
          name: builder.name,
          number: build.number,
          url: endpoint + '/job/' + builder.name + '/' + build.number + '/api/json',
          html_url: endpoint + '/job/' + builder.name + '/' + build.number,
          state: building ? PENDING : JENKINS_STATE_MAP[build.result] || _adapter.UNKNOWN,
          start: new Date(build.timestamp),
          end: building ? null : new Date(build.timestamp + build.duration),
          data: build
        };
      });
    });
  }

  return {
    getInfo: getInfo,
    getBuilders: getBuilders,
    getBuilds: getBuilds
  };
}
//# sourceMappingURL=data:application/json;base64,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VCxTQUFTO0dBQ1YsQ0FBQztDQUNIIiwiZmlsZSI6ImplbmtpbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmV0Y2ggZnJvbSAnLi9mZXRjaCc7XG5pbXBvcnQgdXJsdGVtcGxhdGUgZnJvbSAnLi91cmwtdGVtcGxhdGUnO1xuaW1wb3J0IHsgU1VDQ0VTUywgRkFJTFVSRSwgV0FSTklORywgVU5LTk9XTiB9IGZyb20gJy4vYWRhcHRlcic7XG5cbmNvbnN0IEpFTktJTlNfTUVESUFfVFlQRSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbmNvbnN0IEpFTktJTlNfU1RBVEVfTUFQID0ge1xuICBTVUNDRVNTOiBTVUNDRVNTLFxuICBVTlNUQUJMRTogV0FSTklORyxcbiAgRkFJTFVSRTogRkFJTFVSRVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSmVua2lucyhlbmRwb2ludCwgeyBoZWFkZXJzOiBoIH0gPSB7fSkge1xuICBjb25zdCBoZWFkZXJzID0gT2JqZWN0LmFzc2lnbigge1xuICAgIEFjY2VwdDogSkVOS0lOU19NRURJQV9UWVBFXG4gIH0sIGggKTtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBoZWFkZXJzXG4gIH07XG5cbiAgb3B0aW9ucy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbigge30sIG9wdGlvbnMuaGVhZGVycywgaGVhZGVycyApO1xuXG4gIGZ1bmN0aW9uIGdldEluZm8oKSB7XG4gICAgcmV0dXJuIGZldGNoKGAke2VuZHBvaW50fS9hcGkvanNvbmAsIG9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiByb290Lm5vZGVOYW1lLFxuICAgICAgICAgIHVybDogYCR7ZW5kcG9pbnR9L2FwaS9qc29uYCxcbiAgICAgICAgICBodG1sX3VybDogZW5kcG9pbnQsXG4gICAgICAgICAgYnVpbGRlcnNfdXJsOiBgJHtlbmRwb2ludH0vam9iey9uYW1lfS9hcGkvanNvbns/dHJlZX1gLFxuICAgICAgICAgIGJ1aWxkZXJzOiByb290LmpvYnMubWFwKGpvYiA9PiBqb2IubmFtZSksXG4gICAgICAgICAgZGF0YTogcm9vdFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCdWlsZGVycygpIHtcbiAgICByZXR1cm4gZ2V0SW5mbygpXG4gICAgICAudGhlbihmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtlbmRwb2ludH0vYXBpL2pzb24/dHJlZT1qb2JzW25hbWUsYnVpbGRzW251bWJlcl17LDEwfV0sdmlld3NbbmFtZSxqb2JzW25hbWVdXWA7XG5cbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5qb2JzLm1hcChmdW5jdGlvbiAoam9iKSB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IGpvYi5uYW1lO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB1cmw6IGAke2VuZHBvaW50fS9qb2IvJHtuYW1lfS9hcGkvanNvbmAsXG4gICAgICAgICAgICBodG1sX3VybDogYCR7ZW5kcG9pbnR9L2pvYi8ke25hbWV9YCxcbiAgICAgICAgICAgIGJ1aWxkc191cmw6IGAke2VuZHBvaW50fS9qb2IvJHtuYW1lfS97bnVtYmVyfS9hcGkvanNvbns/dHJlZX1gLFxuICAgICAgICAgICAgYnVpbGRzOiBqb2IuYnVpbGRzLm1hcChidWlsZCA9PiBidWlsZC5udW1iZXIpLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCdWlsZHMoYnVpbGRlcikge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChidWlsZGVyLmJ1aWxkcy5tYXAoZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSB1cmx0ZW1wbGF0ZS5wYXJzZSggYnVpbGRlci5idWlsZHNfdXJsICk7XG4gICAgICBjb25zdCB1cmwgPSB0ZW1wbGF0ZS5leHBhbmQoeyBudW1iZXIgfSk7XG5cbiAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICB9KTtcbiAgICB9KSkudGhlbihmdW5jdGlvbiAoYnVpbGRzKSB7XG4gICAgICByZXR1cm4gYnVpbGRzLm1hcChmdW5jdGlvbiAoYnVpbGQpIHtcbiAgICAgICAgY29uc3QgYnVpbGRpbmcgPSBidWlsZC5idWlsZGluZztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGJ1aWxkZXIubmFtZSxcbiAgICAgICAgICBudW1iZXI6IGJ1aWxkLm51bWJlcixcbiAgICAgICAgICB1cmw6IGAke2VuZHBvaW50fS9qb2IvJHtidWlsZGVyLm5hbWV9LyR7YnVpbGQubnVtYmVyfS9hcGkvanNvbmAsXG4gICAgICAgICAgaHRtbF91cmw6IGAke2VuZHBvaW50fS9qb2IvJHtidWlsZGVyLm5hbWV9LyR7YnVpbGQubnVtYmVyfWAsXG4gICAgICAgICAgc3RhdGU6IGJ1aWxkaW5nID8gUEVORElORyA6ICggSkVOS0lOU19TVEFURV9NQVBbIGJ1aWxkLnJlc3VsdCBdIHx8IFVOS05PV04gKSxcbiAgICAgICAgICBzdGFydDogbmV3IERhdGUoYnVpbGQudGltZXN0YW1wKSxcbiAgICAgICAgICBlbmQ6IGJ1aWxkaW5nID8gbnVsbCA6IG5ldyBEYXRlKGJ1aWxkLnRpbWVzdGFtcCArIGJ1aWxkLmR1cmF0aW9uKSxcbiAgICAgICAgICBkYXRhOiBidWlsZFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEluZm8sXG4gICAgZ2V0QnVpbGRlcnMsXG4gICAgZ2V0QnVpbGRzXG4gIH07XG59XG4iXX0=