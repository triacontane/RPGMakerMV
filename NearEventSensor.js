//=============================================================================
// NearEventSensor.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.0 2018/11/05 フキダシの表示完了までウェイトするかどうかの設定を追加
// 2.1.1 2018/11/05 マップ移動時にすでに検知範囲内に入っていたイベントについて、一度範囲外に出ないと反応しない問題を修正
// 2.1.0 2017/10/23 特定のスイッチもしくはセルフスイッチが有効なときのみ感知エフェクトを出す機能を追加
//                  パラメータの型指定機能に対応
// 2.0.0 2016/08/27 フラッシュの代わりにフキダシアイコンを利用できる機能を追加
//                  パラメータ名等に一部破壊的な変更が加わっています。
// 1.1.0 2016/07/14 各種パラメータとメモ欄で感知可否の設定を追加
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/10/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 周辺イベント感知プラグイン
 * @author トリアコンタン
 *
 * @param デフォルトフラッシュ
 * @desc 感知時にイベントを指定色でフラッシュさせます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param デフォルトフキダシ
 * @desc 感知時にイベントに自動でフキダシアイコンを出します。
 * (1:びっくり 2:はてな 3:音符 4:ハート 5:怒り....)
 * @default 0
 * @type select
 * @option なし
 * @value 0
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザ定義1
 * @value 11
 * @option ユーザ定義2
 * @value 12
 * @option ユーザ定義3
 * @value 13
 * @option ユーザ定義4
 * @value 14
 * @option ユーザ定義5
 * @value 15
 *
 * @param 空イベントは無効
 * @desc イベント内容が空の場合、感知しなくなります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param 感知距離
 * @desc イベントを関知する距離です。
 * @default 2
 * @type number
 *
 * @param フラッシュカラー
 * @desc 感知時のフラッシュ色です。R(赤),G(緑),B(青),A(強さ)の順番で指定してください。
 * @default
 * @type struct<Color>
 *
 * @param フラッシュ時間
 * @desc フラッシュさせるフレーム数です。
 * @default 60
 * @type number
 *
 * @param フキダシ間隔
 * @desc フキダシを表示する間隔のフレーム数です。
 * @default 15
 * @type number
 *
 * @param フキダシ完了までウェイト
 * @desc 範囲内に居続けた場合の連続フキダシ表示で、フキダシの表示が終わるのを待ってから次のフキダシの表示します。
 * @default true
 * @type boolean
 *
 * @param 向きを考慮
 * @desc プレイヤーがイベントの方を向いている場合のみエフェクトを有効にします。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @help 周囲に存在するイベントを感知してイベントにエフェクトを発生させます。
 * 実行可能なイベントをプレイヤーに伝えてユーザビリティを向上させます。
 * 使用できるエフェクトはフラッシュとフキダシアイコン（およびその両方）です。
 *
 * 各エフェクトの有効可否は、プラグインパラメータによる一括設定と
 * イベントのメモ欄による個別設定があり、個別設定が優先されます。
 *
 * 感知時のエフェクトをフラッシュにしたい場合は、
 * メモ欄を以下の通り指定してください。
 * <NESフラッシュ対象:ON>  # 対象イベントのフラッシュを有効にします。
 * <NESフラッシュ対象:OFF> # 対象イベントのフラッシュを無効にします。
 *
 * 感知時のエフェクトをフキダシアイコンにしたい場合は、
 * メモ欄を以下の通り指定してください。
 * <NESフキダシ対象:1> # 対象イベントのフキダシを(1:びっくり)にします。
 * <NESフキダシ対象:0> # 対象イベントのフキダシを無効にします。
 *
 * 特定のスイッチもしくはセルフスイッチがONのときのみ感知エフェクトを
 * 表示したい場合は、メモ欄を以下の通り指定してください。
 * <NESスイッチ:1>       # スイッチ[1]がONのときのみエフェクトを出します。
 * <NESSwitch:1>         # 同上
 * <NESセルフスイッチ:A> # セルフスイッチ[A]がONのときのみエフェクトを出します。
 * <NESSelfSwitch:1>     # 同上
 *
 * 注意！
 * モバイル端末では、フラッシュを使用すると動作が
 * 少し重くなるようです。ご利用の際はご注意ください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Color:
 * @param Red
 * @desc 赤色の情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param Green
 * @desc 緑色の情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param Blue
 * @desc 青色の情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param Alpha
 * @desc 強さの情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 0
 */

(function() {
    'use strict';
    var pluginName    = 'NearEventSensor';
    var metaTagPrefix = 'NES';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = (getParamOther(paramNames) || '').toUpperCase();
        return value === 'ON' || value === 'TRUE';
    };

    var getParamJson = function(paramNames, defaultValue) {
        var value = getParamOther(paramNames);
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            }
        } catch (e) {
            alert('!!!Plugin param is wrong.!!!\nPlugin:NearEventSensor.js');
            value = defaultValue;
        }
        return value;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return arg === true ? true : (arg || '').toUpperCase() === 'ON' || (arg || '').toUpperCase() === 'TRUE';
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDefaultFlash     = getParamBoolean(['DefaultFlash', 'デフォルトフラッシュ']);
    var paramDefaultBalloon   = getParamNumber(['DefaultBalloon', 'デフォルトフキダシ'], 0);
    var paramDisableEmpty     = getParamBoolean(['DisableEmpty', '空イベントは無効']);
    var paramSensorDistance   = getParamNumber(['SensorDistance', '感知距離'], 1);
    var paramFlashColor       = getParamJson(['FlashColor', 'フラッシュカラー'], null);
    var paramFlashDuration    = getParamNumber(['FlashDuration', 'フラッシュ時間'], 1);
    var paramBalloonInterval  = getParamNumber(['BalloonInterval', 'フキダシ間隔'], 0);
    var paramConsiderationDir = getParamBoolean(['ConsiderationDir', '向きを考慮']);
    var paramWaitForBalloon   = getParamBoolean(['WaitForBalloon', 'フキダシ完了までウェイト']);
    if (paramFlashColor) {
        paramFlashColor = [paramFlashColor.Red, paramFlashColor.Green, paramFlashColor.Blue, paramFlashColor.Alpha];
    }

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
    //  プレイヤーとの距離を測り、必要な場合にエフェクトさせる機能を追加定義します。
    //=============================================================================
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._balloonInterval = 0;
    };

    var _Game_EventUpdate       = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_EventUpdate.apply(this, arguments);
        if (this.page()) {
            this.updateSensorEffect();
        }
    };

    Game_Event.prototype.updateSensorEffect = function() {
        if (this.isEmptyValidate() && this.isVeryNearThePlayer() && !$gameMap.isEventRunning() && this.isValidSensor()) {
            if (!this.isFlash() && this.isFlashEvent() && paramFlashColor) {
                this.startFlash(paramFlashColor.clone(), paramFlashDuration);
            }
            var balloonId = this.getSensorBalloonId();
            if (balloonId && (!paramWaitForBalloon || !this.isBalloonPlaying())) {
                if (this._balloonInterval <= 0) {
                    this.requestBalloon(balloonId);
                    this._balloonInterval = paramBalloonInterval;
                } else {
                    this._balloonInterval--;
                }
            }
        } else {
            this._balloonInterval = 0;
        }
    };

    Game_Event.prototype.isEmptyValidate = function() {
        var list = this.list();
        return (list && list.length > 1) || !paramDisableEmpty;
    };

    Game_Event.prototype.isFlashEvent = function() {
        var useFlash = getMetaValues(this.event(), ['フラッシュ対象', 'FlashEvent']);
        return useFlash ? getArgBoolean(useFlash) : paramDefaultFlash;
    };

    Game_Event.prototype.isValidSensor = function() {
        return this.isValidSensorSwitch() && this.isValidSensorSelfSwitch();
    };

    Game_Event.prototype.isValidSensorSwitch = function() {
        var switchId = getMetaValues(this.event(), ['スイッチ', 'Switch']);
        return switchId ? $gameSwitches.value(getArgNumber(switchId, 1)) : true;
    };

    Game_Event.prototype.isValidSensorSelfSwitch = function() {
        var selfSwitchType = getMetaValues(this.event(), ['セルフスイッチ', 'SelfSwitch']);
        return selfSwitchType ? $gameSelfSwitches.value([this._mapId, this._eventId, selfSwitchType.toUpperCase()]) : true;
    };

    Game_Event.prototype.getSensorBalloonId = function() {
        var balloonId = getMetaValues(this.event(), ['フキダシ対象', 'BalloonEvent']);
        return balloonId ? getArgNumber(balloonId, 0) : paramDefaultBalloon;
    };

    Game_Event.prototype.isVeryNearThePlayer = function() {
        var sx = this.deltaXFrom($gamePlayer.x);
        var sy = this.deltaYFrom($gamePlayer.y);
        var ax = Math.abs(sx);
        var ay = Math.abs(sy);
        var result = (ax + ay <= paramSensorDistance);
        if (result && paramConsiderationDir) {
            if (ax > ay) {
                return $gamePlayer.direction() === (sx > 0 ? 6 : 4);
            } else if (sy !== 0) {
                return $gamePlayer.direction() === (sy > 0 ? 2 : 8);
            } else {
                return true;
            }
        }
        return result;
    };
})();
