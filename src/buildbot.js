import fetch from './fetch';
import urltemplate from 'url-template';
import { PENDING, SUCCESS, WARNING, FAILURE, ERRORED, UNKNOWN } from './adapter';

const BUILDBOT_MEDIA_TYPE = 'application/json';
const BUILDBOT_STATE_LIST = [
  SUCCESS,
  WARNING,
  FAILURE,
  UNKNOWN,
  ERRORED,
  ERRORED
];

export default function Buildbot(endpoint, { headers: h } = {}) {
  const headers = Object.assign( {
    Accept: BUILDBOT_MEDIA_TYPE
  }, h );
  const options = {
    headers
  };

  function getInfo() {
    return fetch(`${endpoint}/json`, options)
      .then(function (response) {
        return response.json();
      }).then(function (root) {
        return {
          name: root.project.title,
          url: `${endpoint}/json`,
          html_url: endpoint,
          builders_url: `${endpoint}/json/builders{/name}`,
          builders: Object.keys(root.builders)
        };
      });
  }

  function getBuilders() {
    return getInfo()
      .then(function (info) {
        const template = urltemplate.parse(info.builders_url);
        const url = template.expand({});

        return fetch(url, options);
      }).then(function (response) {
        return response.json();
      }).then(function (builders) {
        return Object.keys(builders).map(function (key) {
          const name = key;
          const builder = builders[ key ];

          return {
            name: name,
            url: `${endpoint}/json/builders/${name}`,
            html_url: `${endpoint}/builders/${name}`,
            builds_url: `${endpoint}/json/builders/${name}/builds{/number}{?select*}`,
            data: builder
          };
        });
      });
  }

  function getBuilds(builder) {
    const select = [ -1 ].concat( builder.data.cachedBuilds );
    const template = urltemplate.parse( builder.builds_url );
    const url = template.expand({ select });

    return fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (builds) {
        const numbers = {};

        return Object.keys(builds).map(function (key) {
          return builds[ key ];
        }).filter(function ({ number }) {
          if (numbers[ number ]) return false;
          return numbers[ number ] = true;
        }).map(function (build) {
          const building = build.times[ 0 ] && !build.times[ 1 ];

          return {
            name: builder.name,
            number: build.number,
            url: `${endpoint}/json/builders/${builder.name}/builds/${build.number}`,
            html_url: `${endpoint}/builders/${builder.name}/builds/${build.number}`,
            state: building ? PENDING : ( BUILDBOT_STATE_LIST[ build.results || 0 ] || UNKNOWN ),
            start: new Date(build.times[ 0 ] * 1000),
            end: building ? null : new Date(build.times[ 1 ] * 1000),
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
