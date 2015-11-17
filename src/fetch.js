'use strict';

if (typeof fetch === 'undefined') {
  var fetch = require( 'node-fetch' );
}

module.exports = fetch;
