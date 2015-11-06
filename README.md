# ci-adapter

> Uniform access to a bunch of continuous integration providers.

## Supported providers

- [Travis][]
- [Jenkins][]
- [Buildbot][] (0.8.x)

## Adapter API

### getInfo()

Return a `Promise` and resolve it with an object containing information
about the adapter instance.

```js
adapter.getInfo().then(function (info) {
  console.log(info);
});
// {
//   "name": "Travis CI - your_account (https://api.travis-ci.org)",
//   "url": "https://api.travis-ci.org/repos/your_account",
//   "html_url": "https://travis-ci.org/your_account",
//   "builders_url": "https://api.travis-ci.org/repos/your_account{/name}{?ids}",
//   "builders": [ "your_repo", "your_other_repo" ],
//   "data": { ... }
// }
```

### getBuilders()

Return a `Promise` and resolve it with a list of builders that are known
to this adapter. A "builder" may be called differenty by your CI solution, for
example, _Travis CI_ mainly talks about "repositories" while _Jenkins_ calls
them "jobs".

```js
adapter.getBuilders().then(function (builders) {
  console.log(builders);
});
// [
//   {
//     "name": "your_repo",
//     "url": "https://api.travis-ci.org/repos/your_account/your_repo",
//     "html_url": "https://travis-ci.org/your_account/your_repo",
//     "builds_url": "https://api.travis-ci.org/repos/your_account/your_repo/build{?number,after_number}",
//     "builds": [ 120, 119, 118, 117, 116 ],
//     "data": { ... }
//   },
//   {
//     "name": "your_other_repo",
//     "url": "https://api.travis-ci.org/repos/your_account/your_other_repo",
//     "html_url": "https://travis-ci.org/your_account/your_other_repo",
//     "builds_url": "https://api.travis-ci.org/repos/your_account/your_other_repo/build{?number,after_number}",
//     "builds": [ 174, 173, 172, 171, 170 ],
//     "data": { ... }
//   }
// ]
```

### getBuilds( builder )

Return a `Promise` and resolve it with a list of builds that were run by the
given builder.

```js
adapter.getBuilds( builder ).then(function (builds) {
  console.log(builds);
});
// [
//   {
//     "name": "your_repo",
//     "number": 120,
//     "url": "https://api.travis-ci.org/repos/your_account/your_repo/builds/56413624",
//     "html_url": "https://travis-ci.org/your_account/your_repo/builds/56413624",
//     "state": "success",
//     "start": Sat Oct 26 2015 01:20:00 GMT-0800 (PST),
//     "end": Sat Oct 26 2015 01:21:00 GMT-0800 (PST),
//     "data": { ... }
//   }
// ]
```

## Hypermedia

The returned responses contain URIs ([RFC3986][]) and URI templates
([RFC6570][]).  Since this library provides no HTTP endpoint in and of itself,
these URIs point to the respective service the adapter is connected to. That
is, the `url` field of a build object obtained from the Travis adapter will
point to the Travis API endpoint endpoint of the given build.

Each object has an `html_url` property that points to an HTML representation
of the given object. For example the build-results page on Travis or the job
overview page on a Jenkins server.

Further, objects may link to sub resources, such as the builder linking to its
builds. In that case the property is to be interpreted as a URI template. The
object should provide a set of possible substitutions for the given template.
In case of the builder example above, the builder would have a `builds_url`
property which accepts a `number` variable. The `number` variable can then
be expanded with the values of the `builds` array.

```js
const builds_url = builder.builds_url; // "https://api.travis-ci.org/repos/your_account/your_repo/builds/{?number}"
const builds = builder.builds; // [ 15, 14, 13, 12 ]
const template = urltemplate(builds_url);
const urls = builder.builds.map(number => template.expand({ number }));
// [
//   "https://api.travis-ci.org/repos/your_account/your_repo/builds/?number=15",
//   "https://api.travis-ci.org/repos/your_account/your_repo/builds/?number=14",
//   "https://api.travis-ci.org/repos/your_account/your_repo/builds/?number=13",
//   "https://api.travis-ci.org/repos/your_account/your_repo/builds/?number=12"
// ]
```

[Travis]: https://travis-ci.org "Travis CI"
[Jenkins]: http://jenkins-ci.org "Jenkins ­ An extensible open source continuous integration server"
[Buildbot]: http://buildbot.net "Buildbot ­ The Continuous Integration Framework"
[RFC3986]: http://tools.ietf.org/html/rfc3986 "IETF ­ Uniform Resource Identifier (URI): Generic Syntax"
[RFC6570]: http://tools.ietf.org/html/rfc6570 "IETF ­ URI Template"
