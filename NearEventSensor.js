//=============================================================================
// NearEventSensor.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/07/14 各種パラメータとメモ欄で感知可否の設定を追加
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
 * @param デフォルト設定
 * @desc イベントをフラッシュさせます。OFFにするとメモ欄に設定した場合のみフラッシュさせます。(ON/OFF)
 * @default ON
 *
 * @param 空イベントは無効
 * @desc イベント内容が空の場合、フラッシュは無効になります。(ON/OFF)
 * @default ON
 *
 * @param 感知距離
 * @desc イベントを関知する距離です。
 * @default 3
 *
 * @param フラッシュカラー
 * @desc 感知時のフラッシュ色です。R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。
 * @default 255,255,255,128
 *
 * @param フラッシュ時間
 * @desc フラッシュさせるフレーム数です。
 * @default 60
 *
 * @help 近くに存在するイベントを感知して白くフラッシュさせます。
 * イベント内容が空の場合はフラッシュしません。
 * 調査可能なオブジェクトをプレイヤーに伝えてユーザビリティを向上させます。
 *
 * 特定のイベントのみ感知対象にしたい場合は、パラメータ「デフォルト設定」をOFFに
 * 設定した上でイベントのメモ欄を以下の通り指定してください。
 * <NESフラッシュ対象>
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
(function() {
    'use strict';
    var pluginName = 'NearEventSensor';
    var metaTagPrefix = 'NES';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDefaultSetting = getParamBoolean(['DefaultSetting', 'デフォルト設定']);
    var paramDisableEmpty   = getParamBoolean(['DisableEmpty', '空イベントは無効']);
    var paramSensorDistance = getParamNumber(['SensorDistance', '感知距離'], 1);
    var paramFlashDuration  = getParamNumber(['FlashDuration', 'フラッシュ時間'], 1);
    var paramFlashColor     = getParamArrayNumber(['FlashColor', 'フラッシュカラー'], 0, 256);

    //=============================================================================
    // Sprite_Character
    //  キャラクターのフラッシュ機能を追加定義します。
    //=============================================================================
    var _Sprite_CharacterUpdate       = Sprite_Character.prototype.update;
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
    var _Game_CharacterBaseInitMembers       = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBaseInitMembers.call(this);
        this._flashColor    = false;
        this._flashDuration = 0;
    };

    var _Game_CharacterBaseUpdate       = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBaseUpdate.call(this);
        this.updateFlash();
    };

    Game_CharacterBase.prototype.startFlash = function(flashColor, flashDuration) {
        this._flashColor    = flashColor;
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
    var _Game_EventUpdate       = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_EventUpdate.apply(this, arguments);
        if (this.page()) {
            this.checkFlash();
        }
    };

    Game_Event.prototype.checkFlash = function() {
        if (this.isEmptyValidate() && !this.isFlashBusy() && this.isVeryNearThePlayer() && this.isFlashEvent()) {
            this.startFlash(paramFlashColor.clone(), paramFlashDuration);
        }
    };

    Game_Event.prototype.isEmptyValidate = function() {
        var list = this.list();
        return (list && list.length > 1) || !paramDisableEmpty;
    };

    Game_Event.prototype.isFlashBusy = function() {
        return $gameMap.isEventRunning() || this.isFlash();
    };

    Game_Event.prototype.isFlashEvent = function() {
        return paramDefaultSetting || getMetaValues(this.event(), ['フラッシュ対象', 'FlashEvent']);
    };

    Game_Event.prototype.isVeryNearThePlayer = function() {
        var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return sx + sy < paramSensorDistance;
    };
})();