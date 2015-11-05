'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Jenkins;

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _urlTemplate = require('./url-template');

var _urlTemplate2 = _interopRequireDefault(_urlTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JENKINS_MEDIA_TYPE = 'application/json';

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
        return {
          name: builder.name,
          number: build.number,
          url: endpoint + '/job/' + builder.name + '/' + build.number + '/api/json',
          html_url: endpoint + '/job/' + builder.name + '/' + build.number,
          start: new Date(build.timestamp),
          end: new Date(build.timestamp + build.duration),
          data: build
        };
      });
    });
  }

  function getBuildDetails(build) {}

  return {
    getInfo: getInfo,
    getBuilders: getBuilders,
    getBuilds: getBuilds,
    getBuildDetails: getBuildDetails
  };
}
//# sourceMappingURL=data:application/json;base64,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LENBQUMsSUFBSSxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQ2xELGVBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ3hCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLE1BQU0sRUFBRTtBQUN6QixhQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFDakMsZUFBTztBQUNMLGNBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtBQUNsQixnQkFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ3BCLGFBQUcsRUFBSyxRQUFRLGFBQVEsT0FBTyxDQUFDLElBQUksU0FBSSxLQUFLLENBQUMsTUFBTSxjQUFXO0FBQy9ELGtCQUFRLEVBQUssUUFBUSxhQUFRLE9BQU8sQ0FBQyxJQUFJLFNBQUksS0FBSyxDQUFDLE1BQU0sQUFBRTtBQUMzRCxlQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUNoQyxhQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQy9DLGNBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQztPQUNILENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKOztBQUVELFdBQVMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUMvQjs7QUFFRCxTQUFPO0FBQ0wsV0FBTyxFQUFQLE9BQU87QUFDUCxlQUFXLEVBQVgsV0FBVztBQUNYLGFBQVMsRUFBVCxTQUFTO0FBQ1QsbUJBQWUsRUFBZixlQUFlO0dBQ2hCLENBQUM7Q0FDSCIsImZpbGUiOiJqZW5raW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZldGNoIGZyb20gJy4vZmV0Y2gnO1xuaW1wb3J0IHVybHRlbXBsYXRlIGZyb20gJy4vdXJsLXRlbXBsYXRlJztcblxuY29uc3QgSkVOS0lOU19NRURJQV9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBKZW5raW5zKGVuZHBvaW50LCB7IGhlYWRlcnM6IGggfSA9IHt9KSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBPYmplY3QuYXNzaWduKCB7XG4gICAgQWNjZXB0OiBKRU5LSU5TX01FRElBX1RZUEVcbiAgfSwgaCApO1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGhlYWRlcnNcbiAgfTtcblxuICBvcHRpb25zLmhlYWRlcnMgPSBPYmplY3QuYXNzaWduKCB7fSwgb3B0aW9ucy5oZWFkZXJzLCBoZWFkZXJzICk7XG5cbiAgZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgICByZXR1cm4gZmV0Y2goYCR7ZW5kcG9pbnR9L2FwaS9qc29uYCwgb3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IHJvb3Qubm9kZU5hbWUsXG4gICAgICAgICAgdXJsOiBgJHtlbmRwb2ludH0vYXBpL2pzb25gLFxuICAgICAgICAgIGh0bWxfdXJsOiBlbmRwb2ludCxcbiAgICAgICAgICBidWlsZGVyc191cmw6IGAke2VuZHBvaW50fS9qb2J7L25hbWV9L2FwaS9qc29uez90cmVlfWAsXG4gICAgICAgICAgYnVpbGRlcnM6IHJvb3Quam9icy5tYXAoam9iID0+IGpvYi5uYW1lKSxcbiAgICAgICAgICBkYXRhOiByb290XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJ1aWxkZXJzKCkge1xuICAgIHJldHVybiBnZXRJbmZvKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2VuZHBvaW50fS9hcGkvanNvbj90cmVlPWpvYnNbbmFtZSxidWlsZHNbbnVtYmVyXXssMTB9XSx2aWV3c1tuYW1lLGpvYnNbbmFtZV1dYDtcblxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmpvYnMubWFwKGZ1bmN0aW9uIChqb2IpIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gam9iLm5hbWU7XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIHVybDogYCR7ZW5kcG9pbnR9L2pvYi8ke25hbWV9L2FwaS9qc29uYCxcbiAgICAgICAgICAgIGh0bWxfdXJsOiBgJHtlbmRwb2ludH0vam9iLyR7bmFtZX1gLFxuICAgICAgICAgICAgYnVpbGRzX3VybDogYCR7ZW5kcG9pbnR9L2pvYi8ke25hbWV9L3tudW1iZXJ9L2FwaS9qc29uez90cmVlfWAsXG4gICAgICAgICAgICBidWlsZHM6IGpvYi5idWlsZHMubWFwKGJ1aWxkID0+IGJ1aWxkLm51bWJlciksXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJ1aWxkcyhidWlsZGVyKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGJ1aWxkZXIuYnVpbGRzLm1hcChmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHVybHRlbXBsYXRlLnBhcnNlKCBidWlsZGVyLmJ1aWxkc191cmwgKTtcbiAgICAgIGNvbnN0IHVybCA9IHRlbXBsYXRlLmV4cGFuZCh7IG51bWJlciB9KTtcblxuICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIH0pO1xuICAgIH0pKS50aGVuKGZ1bmN0aW9uIChidWlsZHMpIHtcbiAgICAgIHJldHVybiBidWlsZHMubWFwKGZ1bmN0aW9uIChidWlsZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGJ1aWxkZXIubmFtZSxcbiAgICAgICAgICBudW1iZXI6IGJ1aWxkLm51bWJlcixcbiAgICAgICAgICB1cmw6IGAke2VuZHBvaW50fS9qb2IvJHtidWlsZGVyLm5hbWV9LyR7YnVpbGQubnVtYmVyfS9hcGkvanNvbmAsXG4gICAgICAgICAgaHRtbF91cmw6IGAke2VuZHBvaW50fS9qb2IvJHtidWlsZGVyLm5hbWV9LyR7YnVpbGQubnVtYmVyfWAsXG4gICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGJ1aWxkLnRpbWVzdGFtcCksXG4gICAgICAgICAgZW5kOiBuZXcgRGF0ZShidWlsZC50aW1lc3RhbXAgKyBidWlsZC5kdXJhdGlvbiksXG4gICAgICAgICAgZGF0YTogYnVpbGRcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QnVpbGREZXRhaWxzKGJ1aWxkKSB7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEluZm8sXG4gICAgZ2V0QnVpbGRlcnMsXG4gICAgZ2V0QnVpbGRzLFxuICAgIGdldEJ1aWxkRGV0YWlsc1xuICB9O1xufVxuIl19