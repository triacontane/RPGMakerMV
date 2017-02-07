//=============================================================================
// InitialState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/01/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc InitialStatePlugin
 * @author triacontane
 *
 * @help 敵キャラに初期状態でステートを付与します。
 *
 * 敵キャラのメモ欄に以下の通り記述してください。
 *
 * <ISステート:3> # 戦闘開始時にステートID[3]が自動で付与されます。
 * <ISState:3>    # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 初期ステートプラグイン
 * @author トリアコンタン
 *
 * @help 敵キャラに初期状態でステートを付与します。
 *
 * 敵キャラのメモ欄に以下の通り記述してください。
 *
 * <IS_ステート:3> # 戦闘開始時にステートID[3]が自動で付与されます。
 * <IS_State:3>    # 同上
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
    var metaTagPrefix = 'IS_';

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        this.setupInitialState();
    };

    Game_Enemy.prototype.setupInitialState = function() {
        var state = getMetaValues(this.enemy(), ['State', 'ステート']);
        if (state) this.addState(getArgNumber(state), 1);
    };
})();



