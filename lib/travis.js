'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Travis;

var _urlTemplate = require('url-template');

var _urlTemplate2 = _interopRequireDefault(_urlTemplate);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _util = require('util');

var _adapter = require('./adapter');

var _util2 = require('./util');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var TRAVIS_API_VERSION = 2;
var TRAVIS_MEDIA_TYPE = 'application/vnd.travis-ci.' + TRAVIS_API_VERSION + '+json';
var TRAVIS_USER_AGENT = 'Travis/' + TRAVIS_API_VERSION + ' ' + _constants.USER_AGENT;
var TRAVIS_HTML_URL = /^(https?:\/\/)(api\.(travis-ci\.(org|com))|([^\/]+)\/api)(\/.+)?$/;
var TRAVIS_STATE_MAP = {
  received: _constants.PENDING,
  created: _constants.PENDING,
  queued: _constants.PENDING,
  started: _constants.PENDING,
  passed: _constants.SUCCESS,
  failed: _constants.FAILURE,
  errored: _constants.ERRORED,
  canceled: _constants.ABORTED
};

function getHtmlUrl(url) {
  var match = TRAVIS_HTML_URL.exec(url);
  return match[1] + (match[3] || match[5]) + (match[6] || '');
}

(0, _util.inherits)(Travis, _adapter.Adapter);

function Travis(endpoint) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var h = _ref.headers;
  var github_token = _ref.github_token;
  var account = _ref.account;

  if (!_instanceof(this, Travis)) {
    return new Travis(endpoint, { headers: h, github_token: github_token, account: account });
  }

  var headers = Object.assign({
    'Accept': TRAVIS_MEDIA_TYPE,
    'User-Agent': TRAVIS_USER_AGENT
  }, h);
  var options = {
    headers: headers
  };
  var html_url = getHtmlUrl(endpoint);
  var token = undefined;

  _adapter.Adapter.call(this);

  this.getInfo = getInfo;
  this.getBuilder = getBuilder;
  this.getBuild = getBuild;
  this.getBuilders = getBuilders;

  function getToken(github_token) {
    return token || (token = (0, _fetch2.default)(endpoint + '/auth/github', {
      method: 'post',
      headers: Object.assign({}, options.headers, {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ github_token: github_token })
    }).then(function (response) {
      if (response.status !== 200) {
        return response.text().then(function (text) {
          return Promise.reject(new Error(text));
        });
      }
      return response.json();
    }).then(function (_ref2) {
      var access_token = _ref2.access_token;

      options.headers['Authorization'] = 'token ' + access_token;
      return access_token;
    }));
  }

  function getInfo() {
    return (github_token ? getToken(github_token) : Promise.resolve(null)).then(function () {
      return (0, _fetch2.default)(endpoint + '/repos/' + account, options);
    }).then(_util2.handleResponse).then(makeInfo);
  }

  function getBuilder(info, name) {
    var repo = info.data.repos.find(function (repo) {
      return repo.slug.split('/').pop() === name;
    });
    return makeBuilder(repo);
  }

  function getBuild(builder, number) {
    var template = _urlTemplate2.default.parse(builder.builds_url);
    var url = template.expand({ number: number });

    return (0, _fetch2.default)(url, options).then(_util2.handleResponse).then(function (data) {
      return makeBuild(builder.data, data.builds[0]);
    });
  }

  function getBuilders(info) {
    var repos = info.data.repos.filter(function (repo) {
      return info.builders.indexOf(repo.slug.split('/').pop()) >= 0;
    });
    return Promise.all(repos.map(makeBuilder));
  }

  function makeInfo(data) {
    var name = 'Travis CI - ' + account + ' (' + endpoint + ')';
    var builders = data.repos.map(function (repo) {
      return repo.slug.split('/').pop();
    });

    return {
      name: name,
      url: endpoint + '/repos/' + account,
      html_url: html_url + '/' + account,
      builders_url: endpoint + '/repos/' + account + '{/name}{?ids}',
      builders: builders,
      data: data
    };
  }

  function makeBuilder(repo) {
    var slug = repo.slug;
    var name = slug.split('/').pop();
    var last = parseInt(repo.last_build_number, 10) || 0;
    var builds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
      return last - n;
    }).filter(function (n) {
      return n > 0;
    });
    var data = repo;

    return {
      name: name,
      url: endpoint + '/repos/' + slug,
      html_url: html_url + '/' + slug,
      builds_url: endpoint + '/repos/' + slug + '/builds{?number,after_number}',
      builds: builds,
      data: data
    };
  }

  function makeBuild(repo, build) {
    var slug = repo.slug;
    var name = slug.split('/').pop();
    var number = parseInt(build.number, 10);
    var building = TRAVIS_STATE_MAP[build.state] === _constants.PENDING;
    var data = build;

    return {
      name: name,
      number: number,
      url: endpoint + '/repos/' + slug + '/builds/' + build.id,
      html_url: html_url + '/' + slug + '/builds/' + build.id,
      state: TRAVIS_STATE_MAP[build.state],
      start: new Date(build.started_at),
      end: building ? null : new Date(build.finished_at),
      data: data
    };
  }
}
//# sourceMappingURL=data:application/json;base64,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QUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25DLFFBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLFFBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFFLEtBQUssQ0FBQyxLQUFLLENBQUUsZ0JBL0gzQyxPQUFPLEFBK0hnRCxDQUFDO0FBQzdELFFBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsV0FBTztBQUNMLFVBQUksRUFBSixJQUFJO0FBQ0osWUFBTSxFQUFOLE1BQU07QUFDTixTQUFHLEVBQUssUUFBUSxlQUFVLElBQUksZ0JBQVcsS0FBSyxDQUFDLEVBQUUsQUFBRTtBQUNuRCxjQUFRLEVBQUssUUFBUSxTQUFJLElBQUksZ0JBQVcsS0FBSyxDQUFDLEVBQUUsQUFBRTtBQUNsRCxXQUFLLEVBQUUsZ0JBQWdCLENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBRTtBQUN0QyxXQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUNqQyxTQUFHLEVBQUUsUUFBUSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQ2xELFVBQUksRUFBSixJQUFJO0tBQ0wsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoidHJhdmlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVybHRlbXBsYXRlIGZyb20gJ3VybC10ZW1wbGF0ZSc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnLi9mZXRjaCc7XG5pbXBvcnQgeyBpbmhlcml0cyB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcic7XG5pbXBvcnQgeyBoYW5kbGVSZXNwb25zZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBQRU5ESU5HLCBTVUNDRVNTLCBGQUlMVVJFLCBFUlJPUkVELCBBQk9SVEVELCBVTktOT1dOLCBVU0VSX0FHRU5UIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBUUkFWSVNfQVBJX1ZFUlNJT04gPSAyO1xuY29uc3QgVFJBVklTX01FRElBX1RZUEUgPSBgYXBwbGljYXRpb24vdm5kLnRyYXZpcy1jaS4ke1RSQVZJU19BUElfVkVSU0lPTn0ranNvbmA7XG5jb25zdCBUUkFWSVNfVVNFUl9BR0VOVCA9IGBUcmF2aXMvJHtUUkFWSVNfQVBJX1ZFUlNJT059ICR7VVNFUl9BR0VOVH1gO1xuY29uc3QgVFJBVklTX0hUTUxfVVJMID0gL14oaHR0cHM/OlxcL1xcLykoYXBpXFwuKHRyYXZpcy1jaVxcLihvcmd8Y29tKSl8KFteXFwvXSspXFwvYXBpKShcXC8uKyk/JC87XG5jb25zdCBUUkFWSVNfU1RBVEVfTUFQID0ge1xuICByZWNlaXZlZDogUEVORElORyxcbiAgY3JlYXRlZDogUEVORElORyxcbiAgcXVldWVkOiBQRU5ESU5HLFxuICBzdGFydGVkOiBQRU5ESU5HLFxuICBwYXNzZWQ6IFNVQ0NFU1MsXG4gIGZhaWxlZDogRkFJTFVSRSxcbiAgZXJyb3JlZDogRVJST1JFRCxcbiAgY2FuY2VsZWQ6IEFCT1JURURcbn07XG5cbmZ1bmN0aW9uIGdldEh0bWxVcmwodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gVFJBVklTX0hUTUxfVVJMLmV4ZWModXJsKTtcbiAgcmV0dXJuIG1hdGNoWzFdICsgKG1hdGNoWzNdIHx8IG1hdGNoWzVdKSArIChtYXRjaFs2XSB8fCAnJyk7XG59XG5cbmluaGVyaXRzKFRyYXZpcywgQWRhcHRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRyYXZpcyhlbmRwb2ludCwgeyBoZWFkZXJzOiBoLCBnaXRodWJfdG9rZW4sIGFjY291bnQgfSA9IHt9KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUcmF2aXMpKSB7XG4gICAgcmV0dXJuIG5ldyBUcmF2aXMoZW5kcG9pbnQsIHsgaGVhZGVyczogaCwgZ2l0aHViX3Rva2VuLCBhY2NvdW50IH0pO1xuICB9XG5cbiAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICdBY2NlcHQnOiBUUkFWSVNfTUVESUFfVFlQRSxcbiAgICAnVXNlci1BZ2VudCc6IFRSQVZJU19VU0VSX0FHRU5UXG4gIH0sIGgpO1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGhlYWRlcnNcbiAgfTtcbiAgY29uc3QgaHRtbF91cmwgPSBnZXRIdG1sVXJsKGVuZHBvaW50KTtcbiAgbGV0IHRva2VuO1xuXG4gIEFkYXB0ZXIuY2FsbCh0aGlzKTtcblxuICB0aGlzLmdldEluZm8gPSBnZXRJbmZvO1xuICB0aGlzLmdldEJ1aWxkZXIgPSBnZXRCdWlsZGVyO1xuICB0aGlzLmdldEJ1aWxkID0gZ2V0QnVpbGQ7XG4gIHRoaXMuZ2V0QnVpbGRlcnMgPSBnZXRCdWlsZGVycztcblxuICBmdW5jdGlvbiBnZXRUb2tlbihnaXRodWJfdG9rZW4pIHtcbiAgICByZXR1cm4gdG9rZW4gfHwgKHRva2VuID0gZmV0Y2goYCR7ZW5kcG9pbnR9L2F1dGgvZ2l0aHViYCwge1xuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBoZWFkZXJzOiBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLmhlYWRlcnMsIHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGdpdGh1Yl90b2tlbiB9KVxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKHRleHQpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHsgYWNjZXNzX3Rva2VuIH0pIHtcbiAgICAgIG9wdGlvbnMuaGVhZGVyc1sgJ0F1dGhvcml6YXRpb24nIF0gPSBgdG9rZW4gJHthY2Nlc3NfdG9rZW59YDtcbiAgICAgIHJldHVybiBhY2Nlc3NfdG9rZW47XG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgICByZXR1cm4gKGdpdGh1Yl90b2tlbiA/IGdldFRva2VuKGdpdGh1Yl90b2tlbikgOiBQcm9taXNlLnJlc29sdmUobnVsbCkpXG4gICAgICAudGhlbigoKSA9PiBmZXRjaChgJHtlbmRwb2ludH0vcmVwb3MvJHthY2NvdW50fWAsIG9wdGlvbnMpKVxuICAgICAgLnRoZW4oaGFuZGxlUmVzcG9uc2UpXG4gICAgICAudGhlbihtYWtlSW5mbyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCdWlsZGVyKGluZm8sIG5hbWUpIHtcbiAgICBjb25zdCByZXBvID0gaW5mby5kYXRhLnJlcG9zLmZpbmQocmVwbyA9PiByZXBvLnNsdWcuc3BsaXQoJy8nKS5wb3AoKSA9PT0gbmFtZSk7XG4gICAgcmV0dXJuIG1ha2VCdWlsZGVyKHJlcG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QnVpbGQoYnVpbGRlciwgbnVtYmVyKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB1cmx0ZW1wbGF0ZS5wYXJzZShidWlsZGVyLmJ1aWxkc191cmwpO1xuICAgIGNvbnN0IHVybCA9IHRlbXBsYXRlLmV4cGFuZCh7IG51bWJlciB9KTtcblxuICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXG4gICAgICAudGhlbihoYW5kbGVSZXNwb25zZSlcbiAgICAgIC50aGVuKGRhdGEgPT4gbWFrZUJ1aWxkKGJ1aWxkZXIuZGF0YSwgZGF0YS5idWlsZHNbMF0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJ1aWxkZXJzKGluZm8pIHtcbiAgICBjb25zdCByZXBvcyA9IGluZm8uZGF0YS5yZXBvcy5maWx0ZXIocmVwbyA9PiBpbmZvLmJ1aWxkZXJzLmluZGV4T2YocmVwby5zbHVnLnNwbGl0KCcvJykucG9wKCkpID49IDApO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChyZXBvcy5tYXAobWFrZUJ1aWxkZXIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VJbmZvKGRhdGEpIHtcbiAgICBjb25zdCBuYW1lID0gYFRyYXZpcyBDSSAtICR7YWNjb3VudH0gKCR7ZW5kcG9pbnR9KWA7XG4gICAgY29uc3QgYnVpbGRlcnMgPSBkYXRhLnJlcG9zLm1hcChyZXBvID0+IHJlcG8uc2x1Zy5zcGxpdCgnLycpLnBvcCgpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgdXJsOiBgJHtlbmRwb2ludH0vcmVwb3MvJHthY2NvdW50fWAsXG4gICAgICBodG1sX3VybDogYCR7aHRtbF91cmx9LyR7YWNjb3VudH1gLFxuICAgICAgYnVpbGRlcnNfdXJsOiBgJHtlbmRwb2ludH0vcmVwb3MvJHthY2NvdW50fXsvbmFtZX17P2lkc31gLFxuICAgICAgYnVpbGRlcnMsXG4gICAgICBkYXRhXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VCdWlsZGVyKHJlcG8pIHtcbiAgICBjb25zdCBzbHVnID0gcmVwby5zbHVnO1xuICAgIGNvbnN0IG5hbWUgPSBzbHVnLnNwbGl0KCcvJykucG9wKCk7XG4gICAgY29uc3QgbGFzdCA9IHBhcnNlSW50KCByZXBvLmxhc3RfYnVpbGRfbnVtYmVyLCAxMCApIHx8IDA7XG4gICAgY29uc3QgYnVpbGRzID0gWyAwLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5IF1cbiAgICAgIC5tYXAobiA9PiBsYXN0IC0gbilcbiAgICAgIC5maWx0ZXIobiA9PiBuID4gMCk7XG4gICAgY29uc3QgZGF0YSA9IHJlcG87XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZSxcbiAgICAgIHVybDogYCR7ZW5kcG9pbnR9L3JlcG9zLyR7c2x1Z31gLFxuICAgICAgaHRtbF91cmw6IGAke2h0bWxfdXJsfS8ke3NsdWd9YCxcbiAgICAgIGJ1aWxkc191cmw6IGAke2VuZHBvaW50fS9yZXBvcy8ke3NsdWd9L2J1aWxkc3s/bnVtYmVyLGFmdGVyX251bWJlcn1gLFxuICAgICAgYnVpbGRzLFxuICAgICAgZGF0YVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQnVpbGQocmVwbywgYnVpbGQpIHtcbiAgICBjb25zdCBzbHVnID0gcmVwby5zbHVnO1xuICAgIGNvbnN0IG5hbWUgPSBzbHVnLnNwbGl0KCcvJykucG9wKCk7XG4gICAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQoYnVpbGQubnVtYmVyLCAxMCk7XG4gICAgY29uc3QgYnVpbGRpbmcgPSBUUkFWSVNfU1RBVEVfTUFQWyBidWlsZC5zdGF0ZSBdID09PSBQRU5ESU5HO1xuICAgIGNvbnN0IGRhdGEgPSBidWlsZDtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgbnVtYmVyLFxuICAgICAgdXJsOiBgJHtlbmRwb2ludH0vcmVwb3MvJHtzbHVnfS9idWlsZHMvJHtidWlsZC5pZH1gLFxuICAgICAgaHRtbF91cmw6IGAke2h0bWxfdXJsfS8ke3NsdWd9L2J1aWxkcy8ke2J1aWxkLmlkfWAsXG4gICAgICBzdGF0ZTogVFJBVklTX1NUQVRFX01BUFsgYnVpbGQuc3RhdGUgXSxcbiAgICAgIHN0YXJ0OiBuZXcgRGF0ZShidWlsZC5zdGFydGVkX2F0KSxcbiAgICAgIGVuZDogYnVpbGRpbmcgPyBudWxsIDogbmV3IERhdGUoYnVpbGQuZmluaXNoZWRfYXQpLFxuICAgICAgZGF0YVxuICAgIH07XG4gIH1cbn1cbiJdfQ==