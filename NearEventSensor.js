//=============================================================================
// NearEventSensor.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/10/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 周辺イベント感知プラグイン
 * @author トリアコンタン
 *
 * @help 近くに存在するイベントを感知して白くフラッシュさせます。
 * イベント内容が空の場合はフラッシュしません。
 * 調査可能なオブジェクトをプレイヤーに伝えてユーザビリティを向上させます。
 *
 * 注意！
 * モバイル端末では、動作が重くなるようです。ご利用の際はご注意ください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {

    //=============================================================================
    // Sprite_Character
    //  キャラクターのフラッシュ機能を追加定義します。
    //=============================================================================
    var _Sprite_CharacterUpdate = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_CharacterUpdate.call(this);
        this.updateFlash();
    };
    Sprite_Character.prototype.updateFlash = function() {
        if (this._character.isFlash()) {
            this.setBlendColor(this._character._flashColor);
        }
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターのフラッシュ機能を追加定義します。
    //=============================================================================
    var _Game_CharacterBaseInitMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBaseInitMembers.call(this);
        this._flashColor = false;
        this._flashDuration = 0;
    };

    var _Game_CharacterBaseUpdate = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBaseUpdate.call(this);
        this.updateFlash();
    };

    Game_CharacterBase.prototype.startFlash = function(flashColor, flashDuration) {
        this._flashColor = flashColor;
        this._flashDuration = flashDuration;
    };

    Game_CharacterBase.prototype.isFlash = function() {
        return this._flashDuration > 0;
    };

    Game_CharacterBase.prototype.updateFlash = function() {
        if (this.isFlash()) {
            this._flashColor[3] = this._flashColor[3] * (this._flashDuration - 1) / this._flashDuration;
            this._flashDuration--;
        }
    };

    //=============================================================================
    // Game_Event
    //  プレイヤーとの距離を測り、必要な場合にフラッシュさせる機能を追加定義します。
    //=============================================================================
    var _Game_EventUpdate = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_EventUpdate.call(this);
        this.checkFlash();
    };

    Game_Event.prototype.checkFlash = function() {
        var list = this.list();
        // イベントが空でないこと、マップイベント実行中でないこと、フラッシュ中でないこと、プレイヤーとの距離が3以内
        (list && list.length > 1 && !$gameMap.isEventRunning() && !this.isFlash() && this.isVeryNearThePlayer()) &&
            this.startFlash([255,255,255,128], 60);
    };

    Game_Event.prototype.isVeryNearThePlayer = function() {
        var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return sx + sy < 3;
    };
})();