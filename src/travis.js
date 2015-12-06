import fetch from './fetch';
import urltemplate from 'url-template';
import { PENDING, SUCCESS, FAILURE, ERRORED, ABORTED, UNKNOWN, USER_AGENT } from './constants';

const TRAVIS_API_VERSION = 2;
const TRAVIS_MEDIA_TYPE = `application/vnd.travis-ci.${TRAVIS_API_VERSION}+json`;
const TRAVIS_USER_AGENT = `Travis/${TRAVIS_API_VERSION} ${USER_AGENT}`;
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
    'User-Agent': TRAVIS_USER_AGENT
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
      .then(() => fetch(`${endpoint}/repos/${account}`, options))
      .then(handleResponse)
      .then(makeInfo);
  }

  function getBuilder(name) {
    return getInfo()
      .then(function (info) {
        const repo = info.data.repos.find(repo => repo.slug.split('/').pop() === name);
        return makeBuilder(repo);
      });
  }

  function getBuilders() {
    return getInfo()
      .then(function (info) {
        const repos = info.data.repos.filter(repo => info.builders.indexOf(repo.slug.split('/').pop() >= 0));
        return repos.map(makeBuilder);
      });
  }

  function getBuild(name, number) {
    return getBuilder(name)
      .then(function (builder) {
        const template = urltemplate.parse( builder.builds_url );
        const url = template.expand({ number });

        return fetch(url, options)
          .then(handleResponse)
          .then(data => makeBuild(builder.data, data.builds[0]));
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

      return builds.map(data => makeBuild(builder.data, data));
    });
  }

  function handleResponse(response) {
    if (response.status === 200)
      return response.json();
    return response.text()
      .then(text => Promise.reject(new Error(`${response.status} ${response.statusText}: ${text}`)));
  }

  function makeInfo(data) {
    const name = `Travis CI - ${account} (${endpoint})`;
    const builders = data.repos
      .filter(repo => repo.last_build_number !== null)
      .map(repo => repo.slug.split('/')[1]);

    return {
      name,
      url: `${endpoint}/repos/${account}`,
      html_url: `${html_url}/${account}`,
      builders_url: `${endpoint}/repos/${account}{/name}{?ids}`,
      builders,
      data
    };
  }

  function makeBuilder(repo) {
    const slug = repo.slug;
    const name = slug.split('/').pop();
    const last = parseInt( repo.last_build_number, 10 );
    const builds = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
      .map( x => last - x )
      .filter( x => x >= 0 );
    const data = repo;

    return {
      name,
      url: `${endpoint}/repos/${slug}`,
      html_url: `${html_url}/${slug}`,
      builds_url: `${endpoint}/repos/${slug}/builds{?number,after_number}`,
      builds,
      data
    };
  }

  function makeBuild(repo, build) {
    const slug = repo.slug;
    const name = slug.split('/').pop();
    const number = parseInt(build.number, 10);
    const building = TRAVIS_STATE_MAP[ build.state ] === PENDING;
    const data = build;

    return {
      name,
      number,
      url: `${endpoint}/repos/${slug}/builds/${build.id}`,
      html_url: `${html_url}/${slug}/builds/${build.id}`,
      state: TRAVIS_STATE_MAP[ build.state ],
      start: new Date(build.started_at),
      end: building ? null : new Date(build.finished_at),
      data
    };
  }

  return {
    getInfo,
    getBuilder,
    getBuilders,
    getBuild,
    getBuilds
  };
}
