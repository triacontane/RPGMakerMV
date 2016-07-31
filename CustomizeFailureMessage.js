//=============================================================================
// CustomizeFailureMessage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/07/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 行動失敗メッセージ設定プラグイン
 * @author トリアコンタン
 *
 * @help 行動失敗時のメッセージがスキルごとに
 * 設定可能になります。
 *
 * スキルのメモ欄に以下の通り記述してください。
 * <CFM:%1aaa> # 「[対象バトラー名]aaa」が表示される
 *
 * ※カスタマイズできるのは「失敗」時のメッセージです。
 * 相手に回避された場合のメッセージではありません。
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
    var metaTagPrefix = 'CFM';

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    //=============================================================================
    // Game_BattlerBase
    //  失敗時の固有メッセージを保持します。
    //=============================================================================
    var _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.apply(this, arguments);
        this._failureMessage = '';
    };

    Game_BattlerBase.prototype.getFailureMessage = function() {
        return this._failureMessage;
    };

    Game_BattlerBase.prototype.setFailureMessage = function(value) {
        this._failureMessage = value;
    };

    //=============================================================================
    // Game_Action
    //  失敗時の固有メッセージを保持します。
    //=============================================================================
    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        var message = getMetaValue(this.item(), '');
        if (message) target.setFailureMessage(message);
    };

    //=============================================================================
    // Window_BattleLog
    //  失敗時の固有メッセージを表示します。
    //=============================================================================
    var _Window_BattleLog_displayMiss = Window_BattleLog.prototype.displayMiss;
    Window_BattleLog.prototype.displayMiss = function(target) {
        _Window_BattleLog_displayMiss.apply(this, arguments);
        var fmt = target.getFailureMessage();
        if (fmt) {
            for (var i = this._methods.length - 1; i >= 0; i--) {
                if (this._methods[i].name === 'addText') {
                    this._methods.splice(i, 1);
                }
            }
            this.push('addText', fmt.format(target.name()));
        }
    };
})();

