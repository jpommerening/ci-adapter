import { Adapter } from './adapter';

export function combine(...adapters) {
  const map = new WeakMap();

  const adapter = new Adapter();
  adapter.getInfo = getInfo;
  adapter.getBuilder = getBuilder;
  adapter.getBuild = getBuild;
  adapter.getBuilders = getBuilders;
  adapter.getBuilds = getBuilds;
  return adapter;

  function getInfo() {
    return Promise.all(adapters.map(function (adapter) {
      return adapter.getInfo()
        .then(addToMap(adapter));
    })).then(makeInfo);
  }

  function getBuilder(info, name) {
    const infos = info.data.filter(info => info.builders.indexOf(name) >= 0);
    return Promise.all(infos.map(function (info) {
      const adapter = adapterFor(info);
      return adapter.getBuilder(info, name)
        .then(addToMap(adapter));
    }))
    .then(makeBuilder);
  }

  function getBuild(builder, number) {
    const builders = builder.data.filter(builder => builder.builds.indexOf(number) >= 0);
    return Promise.all(builders.map(function (builder) {
      const adapter = adapterFor(builder);
      return adapter.getBuild(builder, number)
        .then(addToMap(adapter));
    }))
    .then(makeBuild);
  }

  function getBuilders(info) {
    const infos = info.data;
    return Promise.all(infos.map(function (info) {
      const adapter = adapterFor(info);
      return adapter.getBuilders(info)
        .then(addAllToMap(adapter));
    }))
    .then(lists => [].concat(...lists))
    .then(builders => builders.map(builder => makeBuilder([builder])));
  }

  function getBuilds(builder) {
    const builders = builder.data;
    return Promise.all(builders.map(function (builder) {
      const adapter = adapterFor(builder);
      return adapter.getBuilds(builder)
        .then(addAllToMap(adapter));
    }))
    .then(lists => [].concat(...lists))
    .then(builds => builds.map(build => makeBuild([build])));
  }

  function addToMap(adapter) {
    return function (item) {
      map.set(item, adapter);
      return item;
    };
  }

  function addAllToMap(adapter) {
    const add = addToMap(adapter);
    return function (iterable) {
      return iterable.map(add);
    };
  }

  function adapterFor(item) {
    return map.get(item);
  }

  function makeInfo(infos) {
    const names = infos.map(info => info.name);
    const builders = infos.map(info => info.builders);

    return {
      name: names.join(', '),
      builders: [].concat.apply([], builders),
      data: infos
    };
  }

  function makeBuilder(builders) {
    const first = builders && builders[0] || {};

    return {
      name: first.name,
      url: first.url,
      html_url: first.html_url,
      builds: [].concat.apply([], builders.map(builder => builder.builds)).filter(function (k) {
        if (this[k]) return false;
        return this[k] = true;
      }, {}),
      data: builders
    };
  }

  function makeBuild(builds) {
    const first = builds && builds[0] || {};

    return {
      name: first.name,
      number: first.number,
      url: first.url,
      html_url: first.html_url,
      state: first.state,
      start: first.start,
      end: first.end,
      data: builds
    };
  }
}

