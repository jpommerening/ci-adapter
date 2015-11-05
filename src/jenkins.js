import fetch from './fetch';
import urltemplate from './url-template';

const JENKINS_MEDIA_TYPE = 'application/json';

export default function Jenkins(endpoint, { headers: h } = {}) {
  const headers = Object.assign( {
    Accept: JENKINS_MEDIA_TYPE
  }, h );
  const options = {
    headers
  };

  options.headers = Object.assign( {}, options.headers, headers );

  function getInfo() {
    return fetch(`${endpoint}/api/json`, options)
      .then(function (response) {
        return response.json();
      }).then(function (root) {
        return {
          name: root.nodeName,
          url: `${endpoint}/api/json`,
          html_url: endpoint,
          builders_url: `${endpoint}/job{/name}/api/json{?tree}`,
          builders: root.jobs.map(job => job.name),
          data: root
        };
      });
  }

  function getBuilders() {
    return getInfo()
      .then(function (info) {
        const url = `${endpoint}/api/json?tree=jobs[name,builds[number]{,10}],views[name,jobs[name]]`;

        return fetch(url, options);
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        return data.jobs.map(function (job) {
          const name = job.name;

          return {
            name: name,
            url: `${endpoint}/job/${name}/api/json`,
            html_url: `${endpoint}/job/${name}`,
            builds_url: `${endpoint}/job/${name}/{number}/api/json{?tree}`,
            builds: job.builds.map(build => build.number),
            data: data
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
    })).then(function (builds) {
      return builds.map(function (build) {
        return {
          name: builder.name,
          number: build.number,
          url: `${endpoint}/job/${builder.name}/${build.number}/api/json`,
          html_url: `${endpoint}/job/${builder.name}/${build.number}`,
          start: new Date(build.timestamp),
          end: new Date(build.timestamp + build.duration),
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