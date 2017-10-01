//=============================================================================
// SnakeFollower.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/09/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SnakeFollowerPlugin
 * @author triacontane
 *
 * @param ValidateSwitchId
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効となります。
 * @default 0
 * @type switch
 *
 * @help SnakeFollower.js
 *
 * フォロワーとプレイヤーが重なることができなくなります。
 * スネークゲームの実装に使えます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc スネークフォロワープラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチID
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効となります。
 * @default 0
 * @type switch
 *
 * @help SnakeFollower.js
 *
 * フォロワーとプレイヤーが重なることができなくなります。
 * スネークゲームの実装に使えます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'SnakeFollower';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        alert('Fail to load plugin parameter of ' + pluginName);
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param       = {};
    param.validateSwitchId = getParamNumber(['ValidateSwitchId', '有効スイッチID'], 0);

    var _Game_Player_isCollidedWithCharacters = Game_Player.prototype.isCollidedWithCharacters;
    Game_Player.prototype.isCollidedWithCharacters = function(x, y) {
        return _Game_Player_isCollidedWithCharacters.apply(this, arguments) || this.isCollidedWithFollowers(x, y)
    };

    Game_Player.prototype.isCollidedWithFollowers = function(x, y) {
        return this.isValidSnake() && this._followers.isSomeoneCollided(x, y) && !this.isThrough();
    };

    Game_Player.prototype.isValidSnake = function(x, y) {
        return param.validateSwitchId === 0 || $gameSwitches.value(param.validateSwitchId);
    };
})();

