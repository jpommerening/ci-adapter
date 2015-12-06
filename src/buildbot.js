import fetch from './fetch';
import urltemplate from 'url-template';
import { handleResponse } from './util';
import { PENDING, SUCCESS, WARNING, FAILURE, ERRORED, UNKNOWN, USER_AGENT } from './constants';

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
  const headers = Object.assign({
    'Accept': BUILDBOT_MEDIA_TYPE,
    'User-Agent': USER_AGENT
  }, h);
  const options = {
    headers
  };

  function getInfo() {
    return fetch(`${endpoint}/json`, options)
      .then(handleResponse)
      .then(makeInfo);
  }

  function getBuilder(name) {
    return getInfo()
      .then(function (info) {
        const template = urltemplate.parse(info.builders_url);
        const url = template.expand({ name });

        return fetch(url, options)
          .then(handleResponse)
          .then((data) => makeBuilder(name, data));
      });
  }

  function getBuilders() {
    return getInfo()
      .then(function (info) {
        const template = urltemplate.parse(info.builders_url);
        const url = template.expand({});

        return fetch(url, options);
      })
      .then(handleResponse)
      .then(function (builders) {
        return Object.keys(builders).map((name) => makeBuilder(name, builders[name]));
      });
  }

  function getBuild(name, number) {
    return getBuilder(name)
      .then(function (builder) {
        const template = urltemplate.parse(builder.builds_url);
        const url = template.expand({ number });

        return fetch(url, options)
          .then(handleResponse)
          .then(makeBuild);
      });
  }

  function getBuilds(builder) {
    const select = builder.builds;
    const template = urltemplate.parse( builder.builds_url );
    const url = template.expand({ select });

    return fetch(url, options)
      .then(handleResponse)
      .then(uniqueBuilds)
      .then(builds => builds.map(makeBuild));
  }

  function uniqueBuilds(builds) {
    const numbers = {};

    return Object.keys(builds).map(function (key) {
      return builds[ key ];
    }).filter(function ({ number }) {
      if (numbers[ number ]) return false;
      return numbers[ number ] = true;
    });
  }

  function makeInfo(root) {
    const name = root.project.title;
    const builders = Object.keys(root.builders);
    const data = root;

    return {
      name,
      url: `${endpoint}/json`,
      html_url: endpoint,
      builders_url: `${endpoint}/json/builders{/name}`,
      builders,
      data
    };
  }

  function makeBuilder(name, builder) {
    const builds = [ -1 ].concat(builder.cachedBuilds);
    const data = builder;

    return {
      name,
      url: `${endpoint}/json/builders/${name}`,
      html_url: `${endpoint}/builders/${name}`,
      builds_url: `${endpoint}/json/builders/${name}/builds{/number}{?select*}`,
      builds,
      data
    };
  }

  function makeBuild(build) {
    const name = build.builderName;
    const number = build.number;
    const building = build.times[ 0 ] && !build.times[ 1 ];
    const data = build;

    return {
      name,
      number,
      url: `${endpoint}/json/builders/${name}/builds/${number}`,
      html_url: `${endpoint}/builders/${name}/builds/${number}`,
      state: building ? PENDING : (BUILDBOT_STATE_LIST[ build.results || 0 ] || UNKNOWN),
      start: new Date(build.times[ 0 ] * 1000),
      end: building ? null : new Date(build.times[ 1 ] * 1000),
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
