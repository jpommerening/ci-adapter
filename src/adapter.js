export function Adapter(options) {
  if (!(this instanceof Adapter)) {
    return new Adapter(options);
  }
}

Adapter.prototype.getInfo = function getInfo() {
  return Promise.resolve({ builders: [] });
};

Adapter.prototype.getBuilder = function getBuilder(info, name) {
  return Promise.resolve({ name, builds: [] });
};

Adapter.prototype.getBuild = function getBuild(builder, number) {
  return Promise.resolve({ name: builder.name, number });
};

Adapter.prototype.getBuilders = function getBuilders(info) {
  return Promise.all(info.builders.map(name => this.getBuilder(info, name)));
};

Adapter.prototype.getBuilds = function getBuilds(builder) {
  return Promise.all(builder.builds.map(number => this.getBuild(builder, number)));
};

Adapter.prototype.getAllBuilds = function getAllBuilds(info) {
  return this.getBuilders(info)
    .then(builders => Promise.all(builders.map(builder => this.getBuilds(builder))))
    .then(builds => [].concat(...builds));
};
