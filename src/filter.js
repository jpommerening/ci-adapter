import { Adapter } from './adapter';

export function filter(adapter, { include, exclude } = {}) {
  const matchInclude = toMatcher(include);
  const matchExclude = toMatcher(exclude);

  const match = (obj => matchInclude(obj) || !matchExclude(obj));

  return Object.create(adapter, {
    getBuilder: { value: getBuilder },
    getBuild: { value: getBuild },
    getBuilders: { value: getBuilders },
    getBuilds: { value: getBuilds }
  });

  function getBuilder(info, name) {
    return adapter.getBuilder(info, name)
      .then(builder => match(builder) ? builder : noMatch(builder));
  }

  function getBuild(builder, number) {
    return adapter.getBuild(builder, number)
      .then(build => match(build) ? build : noMatch(build));
  }

  function getBuilders(info) {
    return adapter.getBuilders(info)
      .then(builders => builders.filter(match));
  }

  function getBuilds(builder) {
    return adapter.getBuilds(builder)
      .then(builds => builds.filter(match));
  }
}

function noMatch(object) {
  const error = new Error('Requested object does not match filter');
  error.object = object;

  return Promise.reject(error);
}

function toMatchFn(value) {
  if (value instanceof Function) {
    return value;
  }
  if (value instanceof RegExp) {
    return (v => value.test(v));
  }
  if (Array.isArray(value)) {
    const matchers = value.map(toMatcher);
    return (v => matchers.some(m => m(v)));
  }
  if (typeof value === 'object') {
    const matchers = {};
    Object.keys(value).forEach(k => matchers[k] = toMatcher(value[k]));
    return (v => Object.keys(matchers).every(k => matchers[k](v[k])));
  }
  return (v => v === value);
}

function toMatcher(value) {
  const fn = toMatchFn(value);
  return (v => Array.isArray(v) ? v.some(fn) : fn(v));
}
