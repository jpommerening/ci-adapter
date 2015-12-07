import urltemplate from 'url-template';
import fetch from './fetch';
import { inherits } from 'util';
import { Adapter } from './adapter';
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

function uniqueBuilds(builds) {
  const numbers = {};

  return Object.keys(builds)
    .map(key => builds[key])
    .filter(function ({ number }) {
      if (numbers[ number ]) return false;
      return numbers[ number ] = true;
    });
}

inherits(Buildbot, Adapter);

export default function Buildbot(endpoint, { headers: h } = {}) {
  if (!(this instanceof Buildbot)) {
    return new Buildbot(endpoint, { headers: h });
  }

  const headers = Object.assign({
    'Accept': BUILDBOT_MEDIA_TYPE,
    'User-Agent': USER_AGENT
  }, h);
  const options = {
    headers
  };

  Adapter.call(this);

  this.getInfo = getInfo;
  this.getBuilder = getBuilder;
  this.getBuild = getBuild;
  this.getBuilders = getBuilders;
  this.getBuilds = getBuilds;

  function getInfo() {
    return fetch(`${endpoint}/json`, options)
      .then(handleResponse)
      .then(makeInfo);
  }

  function getBuilder(info, name) {
    const template = urltemplate.parse(info.builders_url);
    const url = template.expand({ name });

    return fetch(url, options)
      .then(handleResponse)
      .then((data) => makeBuilder(name, data));
  }

  function getBuild(builder, number) {
    const template = urltemplate.parse(builder.builds_url);
    const url = template.expand({ number });

    return fetch(url, options)
      .then(handleResponse)
      .then(makeBuild);
  }

  function getBuilders(info) {
    const select = info.builders;
    const template = urltemplate.parse(info.builders_url);
    const url = template.expand({ select });

    return fetch(url, options)
      .then(handleResponse)
      .then(data => Object.keys(data)
                          .map(key => makeBuilder(key, data[key])));
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

  function makeInfo(root) {
    const name = root.project.title;
    const builders = Object.keys(root.builders);
    const data = root;

    return {
      name,
      url: `${endpoint}/json`,
      html_url: endpoint,
      builders_url: `${endpoint}/json/builders{/name}{?select*}`,
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
}

