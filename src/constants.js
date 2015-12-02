const pkg = require('../package.json');

export const PENDING = 'pending';
export const SUCCESS = 'success';
export const WARNING = 'warning';
export const FAILURE = 'failure';
export const ERRORED = 'errored';
export const ABORTED = 'aborted';
export const UNKNOWN = 'unknown';

export const state = {
  PENDING,
  SUCCESS,
  WARNING,
  FAILURE,
  ERRORED,
  ABORTED,
  UNKNOWN
};

export const VERSION = pkg.version;
export const USER_AGENT = `CI-Adapter/${pkg.version} (+${pkg.homepage})`;
