import fetch from './fetch';
import urltemplate from 'url-template';
import { PENDING, SUCCESS, FAILURE, ERRORED, ABORTED, UNKNOWN, USER_AGENT } from './constants';

const TRAVIS_API_VERSION = 2;
const TRAVIS_MEDIA_TYPE = `application/vnd.travis-ci.${TRAVIS_API_VERSION}+json`;
const TRAVIS_HTML_URL = /^(https?:\/\/)(api\.(travis-ci\.(org|com))|([^\/]+)\/api)(\/.+)?$/;
const TRAVIS_STATE_MAP = {
  received: PENDING,
  created: PENDING,
  queued: PENDING,
  started: PENDING,
  passed: SUCCESS,
  failed: FAILURE,
  errored: ERRORED,
  canceled: ABORTED
};

function getHtmlUrl(url) {
  const match = TRAVIS_HTML_URL.exec(url);
  return match[1] + (match[3] || match[5]) + (match[6] || '');
}

export default function Travis(endpoint, { headers: h, github_token, account } = {}) {
  const headers = Object.assign({
    'Accept': TRAVIS_MEDIA_TYPE,
    'User-Agent': USER_AGENT
  }, h);
  const options = {
    headers
  };
  const html_url = getHtmlUrl(endpoint);
  let token;

  function getToken(github_token) {
    return token || (token = fetch(`${endpoint}/auth/github`, {
      method: 'post',
      headers: Object.assign({}, options.headers, {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ github_token })
    }).then(function (response) {
      if (response.status !== 200) {
        return response.text().then(text => Promise.reject(new Error(text)));
      }
      return response.json();
    }).then(function ({ access_token }) {
      options.headers[ 'Authorization' ] = `token ${access_token}`;
      return access_token;
    }));
  }

  function getInfo() {
    return (github_token ? getToken(github_token) : Promise.resolve(null))
      .then(function() {
        return fetch(`${endpoint}/repos/${account}`, options);
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        return {
          name: `Travis CI - ${account} (${endpoint})`,
          url: `${endpoint}/repos/${account}`,
          html_url: `${html_url}/${account}`,
          builders_url: `${endpoint}/repos/${account}{/name}{?ids}`,
          builders: data.repos.map(repo => repo.slug.split('/')[1]),
          data: data
        };
      });
  }

  function getBuilders() {
    return getInfo()
      .then(function (info) {
        const repos = info.data.repos.filter(repo => repo.last_build_number !== null);
        return repos.map(function (repo) {
          const slug = repo.slug;
          const name = slug.split('/')[1];
          const last = parseInt( repo.last_build_number, 10 );
          const builds = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
            .map( x => last - x )
            .filter( x => x >= 0 );

          return {
            name: name,
            url: `${endpoint}/repos/${slug}`,
            html_url: `${html_url}/${slug}`,
            builds_url: `${endpoint}/repos/${slug}/builds{?number,after_number}`,
            builds: builds,
            data: repo
          };
        });
      });
  }

  function getBuilds(builder) {
    return Promise.all(builder.builds.map(function (number) {
      const template = urltemplate.parse( builder.builds_url );
      const url = template.expand({ number });

      return fetch(url, options).then(function (response) {
        return response.json();
      });
    })).then(function (data) {
      const builds = [].concat.apply( [], data.map(data => data.builds) );

      return builds.map(function (build) {
        const building = TRAVIS_STATE_MAP[ build.state ] === PENDING;

        return {
          name: builder.name,
          number: parseInt(build.number, 10),
          url: `${endpoint}/repos/${account}/${builder.name}/builds/${build.id}`,
          html_url: `${html_url}/${account}/${builder.name}/builds/${build.id}`,
          state: TRAVIS_STATE_MAP[ build.state ],
          start: new Date(build.started_at),
          end: building ? null : new Date(build.finished_at),
          data: build
        };
      });
    });
  }

  return {
    getInfo,
    getBuilders,
    getBuilds
  };
}
