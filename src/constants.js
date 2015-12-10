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

const { version, homepage } = require('../package.json');

export const VERSION = version;
export const HOMEPAGE = homepage;
export const USER_AGENT_DETAILS = typeof navigator !== 'undefined' ? navigator.userAgent : `Node.js ${process.version}`;
export const USER_AGENT = `CI-Adapter/${version} (+${homepage}) ${USER_AGENT_DETAILS}`;
