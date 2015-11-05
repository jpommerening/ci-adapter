import fetch from './fetch';
import urltemplate from './url-template';

const TRAVIS_MEDIA_TYPE = 'application/vnd.travis-ci.2+json';
const TRAVIS_HTML_URL = /^(https?:\/\/)(api\.(travis-ci\.(org|com))|([^\/]+)\/api)(\/.+)?$/;

function getHtmlUrl(url) {
  const match = TRAVIS_HTML_URL.exec(url);
  return match[1] + (match[3] || match[5]) + (match[6] || '');
}

export default function Travis(endpoint, { headers: h, github_token, account } = {}) {
  const headers = Object.assign( {
    Accept: TRAVIS_MEDIA_TYPE
  }, h );
  const options = {
    headers
  };
  const html_url = getHtmlUrl(endpoint);

  function getToken() {
    return fetch(`${endpoint}/auth/github`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ github_token })
    }).then(function (response) {
      return response.json();
    }).then(function ({ access_token }) {
      options.headers[ 'Authorization' ] = `token ${access_token}`;
      return access_token;
    });
  }

  function getInfo() {
    return getToken()
      .then(function(token) {
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

          return {
            name: name,
            url: `${endpoint}/repos/${slug}`,
            html_url: `${html_url}/${slug}`,
            builds_url: `${endpoint}/repos/${slug}/builds{?number,after_number}`,
            builds: [ parseInt( repo.last_build_number, 10 ) ],
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
        return {
          name: builder.name,
          number: parseInt(build.number, 10),
          url: `${endpoint}/repos/${account}/${builder.name}/builds/${build.id}`,
          html_url: `${html_url}/${account}/${builder.name}/builds/${build.id}`,
          start: new Date(build.started_at),
          end: new Date(build.finished_at),
          data: build
        };
      });
    });
  }

  function getBuildDetails(build) {
  }

  return {
    getInfo,
    getBuilders,
    getBuilds,
    getBuildDetails
  };
}
