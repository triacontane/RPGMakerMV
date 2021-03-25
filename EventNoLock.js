//=============================================================================
// EventNoLock.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/03/25 MZで動作するよう修正
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2016/12/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc EventNoLockPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventNoLock.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param defaultDisable
 * @desc Disables the locking of all events without specifying a memo field.
 * @default false
 * @type boolean
 *
 * @help EventNoLock.js
 *
 * Disables the process of turning the player's direction
 * when the event starts (event lock).
 * Write the following in the memo field of the event
 * you want to disable the lock for
 * Disables the locking of all events without
 * specifying a memo field.
 *
 * <DisableLock>
 *
 */
/*:ja
 * @plugindesc イベントロック無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventNoLock.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param defaultDisable
 * @text デフォルトで無効
 * @desc メモ欄の指定なしで全てのイベントのロックを無効化します。
 * @default false
 * @type boolean
 *
 * @help EventNoLock.js
 *
 * イベント起動時にプレイヤーの方向を向く処理（イベントロック）を無効化します。
 * ロックを無効にしたいイベントのメモ欄に以下の通り記述してください。
 *
 * <ロック無効>
 * <DisableLock>
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

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Event
    //  イベントロックを無効にします。
    //=============================================================================
    const _Game_Event_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function() {
        _Game_Event_lock.apply(this, arguments);
        if (this.isValidNoLock()) {
            this.setDirection(this._prelockDirection);
        }
    };

    Game_Event.prototype.isValidNoLock = function() {
        return param.defaultDisable ||
            PluginManagerEx.findMetaValue(this.event(), ['ロック無効', 'DisableLock']);
    };
})();

