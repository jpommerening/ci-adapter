'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Travis = exports.Jenkins = exports.BuildBot = exports.combine = undefined;

var _adapter = require('./adapter');

var _buildbot = require('./buildbot');

var _buildbot2 = _interopRequireDefault(_buildbot);

var _jenkins = require('./jenkins');

var _jenkins2 = _interopRequireDefault(_jenkins);

var _travis = require('./travis');

var _travis2 = _interopRequireDefault(_travis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.combine = _adapter.combine;
exports.BuildBot = _buildbot2.default;
exports.Jenkins = _jenkins2.default;
exports.Travis = _travis2.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU1FLE9BQU8sWUFOUyxPQUFPO1FBT3ZCLFFBQVE7UUFDUixPQUFPO1FBQ1AsTUFBTSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFkYXB0ZXIsIGNvbWJpbmUgfSBmcm9tICcuL2FkYXB0ZXInO1xuaW1wb3J0IEJ1aWxkQm90IGZyb20gJy4vYnVpbGRib3QnO1xuaW1wb3J0IEplbmtpbnMgZnJvbSAnLi9qZW5raW5zJztcbmltcG9ydCBUcmF2aXMgZnJvbSAnLi90cmF2aXMnO1xuXG5leHBvcnQge1xuICBjb21iaW5lLFxuICBCdWlsZEJvdCxcbiAgSmVua2lucyxcbiAgVHJhdmlzXG59O1xuIl19