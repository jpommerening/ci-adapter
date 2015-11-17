if (!window.fetch) {
  throw new Error('Browser has no fetch. Please use a polyfill!');
}
module.exports = window.fetch;
