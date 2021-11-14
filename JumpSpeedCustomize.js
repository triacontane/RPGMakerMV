/*=============================================================================
 JumpSpeedCustomize.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2021/11/14 プラグインを未適用のデータをロードしたときキャラクターが表示されない問題を修正
 1.1.0 2021/07/18 MZで動作するよう修正
 1.0.0 2020/05/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ジャンプ速度調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/JumpSpeedCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help JumpSpeedCustomize.js
 *
 * ジャンプの速度や高度を変更できます。
 * イベントのメモ欄に以下の通り指定してください。
 *
 * <ジャンプ速度:150> // ジャンプ速度を本来の150%に設定
 * <JumpSpeed:150>   // 同上
 * <ジャンプ高度:50>  // ジャンプ高度を本来の50%に設定
 * <JumpHeight:50>   // 同上
 *
 * 移動ルートの設定から以下のスクリプトで変更できます。
 * this.setJumpSpeed(25);   // ジャンプ速度を本来の25%に設定
 * this.setJumpHeight(200); // ジャンプ高度を本来の200%に設定
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    /**
     * Game_CharacterBase
     */
    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this._jumpSpeed = 0;
        this._jumpHeight = 0;
    };

    Game_CharacterBase.prototype.getJumpSpeedRate = function() {
        return (this._jumpSpeed || 0) / 100;
    };

    Game_CharacterBase.prototype.getJumpHeightRate = function() {
        return (this._jumpHeight || 0) / 100;
    };

    Game_CharacterBase.prototype.setJumpSpeed = function(value) {
        this._jumpSpeed = value > 0 ? value : 0;
    };

    Game_CharacterBase.prototype.setJumpHeight = function(value) {
        this._jumpHeight = value;
    };

    const _Game_CharacterBase_jumpHeight = Game_CharacterBase.prototype.jumpHeight;
    Game_CharacterBase.prototype.jumpHeight = function() {
        let height;
        const rate = this.getJumpSpeedRate();
        if (rate > 0) {
            height = (this._jumpPeak * this._jumpPeak -
                Math.pow(Math.abs(this._jumpCount * rate - this._jumpPeak), 2)) / 2;
        } else {
            height =_Game_CharacterBase_jumpHeight.apply(this, arguments);
        }
        return this._jumpHeight !== 0 ? Math.floor(height * this.getJumpHeightRate()) : height
    };

    const _Game_CharacterBase_jump = Game_CharacterBase.prototype.jump;
    Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
        _Game_CharacterBase_jump.apply(this, arguments);
        const rate = this.getJumpSpeedRate();
        if (rate > 0) {
            this._jumpCount = Math.floor(this._jumpPeak * 2 / rate);
        }
    };

    /**
     * Game_Event
     */
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this.initJumpCustomize();
    };

    Game_Event.prototype.initJumpCustomize = function() {
        const jumpSpeed = PluginManagerEx.findMetaValue(this.event(), ['JumpSpeed', 'ジャンプ速度']);
        if (jumpSpeed > 0) {
            this.setJumpSpeed(jumpSpeed);
        }
        const jumpHeight = PluginManagerEx.findMetaValue(this.event(), ['JumpHeight', 'ジャンプ高度']);
        if (jumpHeight) {
            this.setJumpHeight(jumpHeight);
        }
    };
})();
