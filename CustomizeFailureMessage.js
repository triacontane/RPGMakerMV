//=============================================================================
// CustomizeFailureMessage.js
// ----------------------------------------------------------------------------
// (c) 2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/01/23 有効な効果を与えられなかった場合にもカスタム失敗メッセージを表示するよう変更
// 1.1.0 2021/10/03 MZ用にリファクタリング
// 1.0.1 2018/02/11 失敗メッセージ表示後に別のスキルで失敗した場合、もとの失敗メッセージが表示される不具合を修正
// 1.0.0 2016/07/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 行動失敗メッセージ設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeFailureMessage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help 行動失敗時のメッセージがスキルごとに
 * 設定可能になります。
 *
 * スキルのメモ欄に以下の通り記述してください。
 * <失敗メッセージ:%1aaa> # 「[対象バトラー名]aaa」が表示される
 * <FailureMessage:%1aaa> # 同上
 *
 * ※カスタマイズできるのは「失敗」時のメッセージです。
 * 相手に回避された場合のメッセージではありません。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    
    //=============================================================================
    // Game_BattlerBase
    //  失敗時の固有メッセージを保持します。
    //=============================================================================
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
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
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        const message = PluginManagerEx.findMetaValue(this.item(), ['FailureMessage', '失敗メッセージ']);
        if (message) {
            target.setFailureMessage(message);
        }
    };

    //=============================================================================
    // Window_BattleLog
    //  失敗時の固有メッセージを表示します。
    //=============================================================================
    const _Window_BattleLog_displayMiss = Window_BattleLog.prototype.displayMiss;
    Window_BattleLog.prototype.displayMiss = function(target) {
        _Window_BattleLog_displayMiss.apply(this, arguments);
        this.displayCustomFailure(target);
    };

    const _Window_BattleLog_displayFailure = Window_BattleLog.prototype.displayFailure;
    Window_BattleLog.prototype.displayFailure = function(target) {
        _Window_BattleLog_displayFailure.apply(this, arguments);
        if (target.result().isHit() && !target.result().success) {
            this.displayCustomFailure(target);
        }
    };

    Window_BattleLog.prototype.displayCustomFailure = function(target) {
        const fmt = target.getFailureMessage();
        if (fmt) {
            for (let i = this._methods.length - 1; i >= 0; i--) {
                if (this._methods[i].name === 'addText') {
                    this._methods.splice(i, 1);
                }
            }
            this.push('addText', fmt.format(target.name()));
            target.setFailureMessage('');
        }
    };
})();

