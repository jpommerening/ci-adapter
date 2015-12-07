import urltemplate from 'url-template';
import fetch from './fetch';
import { inherits } from 'util';
import { Adapter } from './adapter';
import { handleResponse } from './util';
import { PENDING, SUCCESS, FAILURE, WARNING, UNKNOWN, USER_AGENT } from './constants';

const JENKINS_MEDIA_TYPE = 'application/json';
const JENKINS_STATE_MAP = {
  SUCCESS: SUCCESS,
  UNSTABLE: WARNING,
  FAILURE: FAILURE
};

inherits(Jenkins, Adapter);

export default function Jenkins(endpoint, { headers: h, view } = {}) {
  if (!(this instanceof Jenkins)) {
    return new Jenkins(endpoint, { headers: h, view });
  }

  const headers = Object.assign({
    'Accept': JENKINS_MEDIA_TYPE,
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

  function getInfo() {
    return fetch(`${endpoint}/api/json`, options)
      .then(handleResponse)
      .then(makeInfo);
  }

  function getBuilder(info, name) {
    const template = urltemplate.parse(info.builders_url);
    const url = template.expand({ name });

    return fetch(url, options)
      .then(handleResponse)
      .then(makeBuilder);
  }

  function getBuild(builder, number) {
    const template = urltemplate.parse(builder.builds_url);
    const url = template.expand({ number });

    return fetch(url, options)
      .then(handleResponse)
      .then(data => makeBuild(builder.data, data));
  }

  function getBuilders(info) {
    const url = `${endpoint}/api/json?tree=jobs[name,buildable,builds[number]{,10}],views[name,jobs[name]]`;

    return fetch(url, options)
      .then(handleResponse)
      .then(function (data) {
        const filter = view ? (v => v.name === view) : (() => true);
        const jobs = data.views.filter(filter)[ 0 ].jobs.map(job => job.name);
        return data.jobs.filter(function (job) {
          return jobs.indexOf(job.name) >= 0 && job.buildable;
        }).map(makeBuilder);
      });
  }

  function makeInfo(root) {
    const name = root.nodeName;
    const builders = root.jobs.map(job => job.name);
    const data = root;

    return {
      name,
      url: `${endpoint}/api/json`,
      html_url: endpoint,
      builders_url: `${endpoint}/job{/name}/api/json{?tree}`,
      builders,
      data
    };
  }

  function makeBuilder(job) {
    const name = job.name;
    const builds = job.builds.map(build => build.number);
    const data = job;

    return {
      data,
      name,
      url: `${endpoint}/job/${name}/api/json`,
      html_url: `${endpoint}/job/${name}`,
      builds_url: `${endpoint}/job/${name}/{number}/api/json{?tree}`,
      builds
    };
  }

  function makeBuild(job, build) {
    const name = job.name;
    const number = build.number;
    const building = build.building;
    const data = build;

    return {
      name,
      number,
      url: `${endpoint}/job/${name}/${number}/api/json`,
      html_url: `${endpoint}/job/${name}/${number}`,
      state: building ? PENDING : (JENKINS_STATE_MAP[ build.result ] || UNKNOWN),
      start: new Date(build.timestamp),
      end: building ? null : new Date(build.timestamp + build.duration),
      data
    };
  }
}
