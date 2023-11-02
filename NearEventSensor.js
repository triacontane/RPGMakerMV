//=============================================================================
// NearEventSensor.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.6.0 2023/11/02 3.5.0で追加した機能で、イベントごとに異なるスイッチ、セルフスイッチを指定できる機能を追加
// 3.5.0 2023/10/23 検知範囲に入ったときにONになるスイッチ、セルフスイッチを指定できる機能を追加
// 3.4.0 2022/06/03 イベントごと、ページごとにフキダシや感知距離、範囲を変えられる設定を追加
// 3.3.0 2022/06/03 イベント感知の距離を上下左右で個別に指定できる機能を追加
// 3.2.1 2021/06/01 フラッシュとフキダシの無効設定のメモタグが正常に機能していなかった問題を修正
// 3.2.0 2021/01/27 MZで動作するよう修正
// 3.1.1 2020/07/05 3.1.0の修正をイベント開始時にも適用できるよう変更
// 3.1.0 2020/07/05 イベントから離れたらエフェクトを即時消去できる設定を追加
// 3.0.0 2020/05/26 センサーエフェクトをイベントではなくプレイヤーに適用できる機能を追加。パラメータの再設定が必要です。
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NearEventSensor.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param DefaultFlash
 * @text デフォルトフラッシュ
 * @desc 感知時にイベントを指定色でフラッシュさせます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param DefaultBalloon
 * @text デフォルトフキダシ
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
 * @param SensorSelfSwitch
 * @text センサーセルフスイッチ
 * @desc 感知したときに自動でONになるセルフスイッチです。離れたらOFFになります。
 * @default
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @param SensorSwitch
 * @text センサースイッチ
 * @desc 感知したときに自動でONになるスイッチです。離れたらOFFになります。
 * @default 0
 * @type switch
 *
 * @param DisableEmpty
 * @text 空イベントは無効
 * @desc イベント内容が空の場合、感知しなくなります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param SensorDistance
 * @text 感知距離
 * @desc イベントを感知する距離です。
 * @default 2
 * @type number
 *
 * @param SensorRange
 * @text 感知範囲
 * @desc イベントを感知する範囲を上下左右で細かく設定します。
 * @default {}
 * @type struct<Range>
 *
 * @param FlashColor
 * @text フラッシュカラー
 * @desc 感知時のフラッシュ色です。R(赤),G(緑),B(青),A(強さ)の順番で指定してください。
 * @default {"Red":"255","Green":"255","Blue":"255","Alpha":"255"}
 * @type struct<Color>
 *
 * @param FlashDuration
 * @text フラッシュ時間
 * @desc フラッシュさせるフレーム数です。
 * @default 60
 * @type number
 *
 * @param BalloonInterval
 * @text フキダシ間隔
 * @desc フキダシを表示する間隔のフレーム数です。
 * @default 15
 * @type number
 *
 * @param WaitForBalloon
 * @text フキダシ完了までウェイト
 * @desc 範囲内に居続けた場合の連続フキダシ表示で、フキダシの表示が終わるのを待ってから次のフキダシの表示します。
 * @default true
 * @type boolean
 *
 * @param ConsiderationDir
 * @text 向きを考慮
 * @desc プレイヤーがイベントの方を向いている場合のみエフェクトを有効にします。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param ApplyPlayer
 * @text プレイヤーに適用
 * @desc 感知時のエフェクトを対象イベントではなくプレイヤーに対して適用します。
 * @default false
 * @type boolean
 *
 * @param EraseWhenAway
 * @text 離れたら消去
 * @desc イベントから離れたらエフェクトを消去します。
 * @default false
 * @type boolean
 *
 * @param DetailList
 * @text 詳細設定リスト
 * @desc イベントごと、ページごとに異なる設定をしたい場合に使用します。
 * @default []
 * @type struct<Detail>[]
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
 * イベントごと、ページごとに感知設定を細かく指定したい場合は
 * パラメータ「詳細設定」で設定した内容を以下のタグで適用できます。
 * <NES詳細:sensor01>    # 識別子[sensor01]の設定を適用
 * <NESDetail:sensor01> # 同上
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

/*~struct~Color:
 * @param Red
 * @desc 赤色の情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param Green
 * @desc 緑色の情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param Blue
 * @desc 青色の情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param Alpha
 * @desc 強さの情報です。(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 */

/*~struct~Range:
 * @param Left
 * @text 左マス数
 * @desc 左方向のマス数
 * @type number
 * @default 0
 *
 * @param Right
 * @text 右マス数
 * @desc 右方向のマス数
 * @type number
 * @default 0
 *
 * @param Up
 * @text 上マス数
 * @desc 上方向のマス数
 * @type number
 * @default 0
 *
 * @param Down
 * @text 下マス数
 * @desc 下方向のマス数
 * @type number
 * @default 0
 */

/*~struct~Detail:
 * @param Id
 * @text 識別子
 * @desc 設定の識別子です。同一識別子を複数件定義した場合、条件に一致するリスト上の設定が優先されます。
 * @default sensor01
 *
 * @param Page
 * @text ページ条件
 * @desc イベントページが指定した値のときに有効になります。0を指定すると全ページで有効になります。
 * @default 0
 * @type number
 *
 * @param Switch
 * @text スイッチ条件
 * @desc 指定したスイッチがONのときに有効になります。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @param SensorDistance
 * @text 感知距離
 * @desc イベントを感知する距離です。
 * @default 2
 * @type number
 *
 * @param SensorRange
 * @text 感知範囲
 * @desc イベントを感知する範囲を上下左右で細かく設定します。
 * @default {}
 * @type struct<Range>
 *
 * @param Balloon
 * @text フキダシ
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
 * @param FlashColor
 * @text フラッシュカラー
 * @desc 感知時のフラッシュ色です。R(赤),G(緑),B(青),A(強さ)の順番で指定してください。
 * @default
 * @type struct<Color>
 *
 * @param SensorSelfSwitch
 * @text センサーセルフスイッチ
 * @desc 感知したときに自動でONになるセルフスイッチです。離れたらOFFになります。
 * @default
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @param SensorSwitch
 * @text センサースイッチ
 * @desc 感知したときに自動でONになるスイッチです。離れたらOFFになります。
 * @default 0
 * @type switch
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.DetailList) {
        param.DetailList = [];
    }

    //=============================================================================
    // Sprite_Character
    //  キャラクターのフラッシュ機能を追加定義します。
    //=============================================================================
    const _Sprite_CharacterUpdate       = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_CharacterUpdate.call(this);
        this.updateFlash();
    };

    Sprite_Character.prototype.updateFlash = function() {
        if (this._character.isFlash()) {
            this.setBlendColor(this._character._flashColor);
        }
    };

    const _Sprite_Character_updateBalloon = Sprite_Character.prototype.updateBalloon;
    Sprite_Character.prototype.updateBalloon = function() {
        if (this._character.isBalloonCancel()) {
            this._character.endBalloon();
        }
        _Sprite_Character_updateBalloon.apply(this, arguments);
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターのフラッシュ機能を追加定義します。
    //=============================================================================
    const _Game_CharacterBaseInitMembers       = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBaseInitMembers.call(this);
        this._flashColor    = null;
        this._flashDuration = 0;
    };

    const _Game_CharacterBaseUpdate       = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBaseUpdate.call(this);
        this.updateFlash();
    };

    Game_CharacterBase.prototype.startFlash = function(flashColor, flashDuration) {
        this._flashColor    = flashColor;
        this._flashDuration = flashDuration;
    };

    Game_CharacterBase.prototype.clearFlash = function() {
        this._flashColor = [0,0,0,0];
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

    Game_CharacterBase.prototype.applySensorEffect = function(targetEvent) {
        if (!this.isFlash() && targetEvent.isFlashEvent()) {
            const color = targetEvent.findSensorFlash();
            if (color) {
                this.startFlash([color.Red, color.Green, color.Blue, color.Alpha], param.FlashDuration);
            }

        }
        const balloonId = targetEvent.getSensorBalloonId();
        if (balloonId && (!param.WaitForBalloon || !this.isBalloonPlaying())) {
            if (this._balloonInterval <= 0 || isNaN(this._balloonInterval)) {
                $gameTemp.requestBalloon(this, balloonId);
                this._balloonInterval = param.BalloonInterval;
            } else {
                this._balloonInterval--;
            }
        }
        this._sensorApply = true;
    };

    Game_CharacterBase.prototype.eraseSensorEffect = function() {
        if (!this._sensorApply || !param.EraseWhenAway) {
            return;
        }
        this.clearFlash();
        this._balloonCancel = true;
        this._sensorApply = false;
    };

    Game_CharacterBase.prototype.isBalloonCancel = function() {
        const cancel = this._balloonCancel;
        this._balloonCancel = false;
        return cancel;
    };

    //=============================================================================
    // Game_Event
    //  プレイヤーとの距離を測り、必要な場合にエフェクトさせる機能を追加定義します。
    //=============================================================================
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._balloonInterval = 0;
    };

    Game_Event.prototype.findEventSensorDetail = function() {
        const detailTag = this.findEventSensorNote( ['NES詳細', 'NESDetail']);
        if (!detailTag) {
            return null;
        }
        return param.DetailList.find(item => {
            if (item.Id !== detailTag) {
                return false;
            }
            if (item.Page && item.Page !== this._pageIndex + 1) {
                return false;
            }
            if (item.Switch && !$gameSwitches.value(item.Switch)) {
                return false;
            }
            if (item.SelfSwitch && !$gameSelfSwitches.value([$gameMap.mapId(), this._eventId, item.SelfSwitch])) {
                return false;
            }
            return true;
        });
    };

    const _Game_EventUpdate       = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_EventUpdate.apply(this, arguments);
        if (this.page()) {
            this.updateSensorEffect();
        }
    };

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        _Game_Event_start.apply(this, arguments);
        this.eraseSensorEffect();
    };

    Game_Event.prototype.updateSensorEffect = function() {
        const subject = this.findNearEffectSubject();
        const sensorOn = this.isSensorOn();
        if (sensorOn) {
            subject.applySensorEffect(this);
        } else {
            subject.eraseSensorEffect(this);
            this._balloonInterval = 0;
        }
        if (this._sensorOn !== sensorOn) {
            this._sensorOn = sensorOn;
            this.updateSensorSwitch();
        }
    };

    Game_Event.prototype.updateSensorSwitch= function() {
        const switchId = this.findSensorSwitch();
        if (switchId) {
            $gameSwitches.setValue(switchId, this._sensorOn);
        }
        const selfSwitchType = this.findSensorSelfSwitch();
        if (selfSwitchType) {
            $gameSelfSwitches.setValue([this._mapId, this._eventId, selfSwitchType.toUpperCase()], this._sensorOn);
        }
    };

    Game_Event.prototype.isSensorOn = function() {
        return this.isEmptyValidate() && this.isVeryNearThePlayer() &&
            !$gameMap.isEventRunning() && this.isValidSensor();
    };

    Game_Event.prototype.findNearEffectSubject = function() {
        return param.ApplyPlayer ? $gamePlayer : this;
    };

    Game_Event.prototype.isEmptyValidate = function() {
        const list = this.list();
        return (list && list.length > 1) || !param.DisableEmpty;
    };

    Game_Event.prototype.isFlashEvent = function() {
        const useFlash = this.findEventSensorNote( ['NESフラッシュ対象', 'NESFlashEvent']);
        if (useFlash === 'ON') {
            return true;
        } else if (useFlash === 'OFF') {
            return false;
        } else {
            return param.DefaultFlash;
        }
    };

    Game_Event.prototype.isValidSensor = function() {
        return this.isValidSensorSwitch() && this.isValidSensorSelfSwitch();
    };

    Game_Event.prototype.isValidSensorSwitch = function() {
        const switchId = this.findEventSensorNote( ['NESスイッチ', 'NESSwitch']);
        return switchId ? $gameSwitches.value(switchId) : true;
    };

    Game_Event.prototype.isValidSensorSelfSwitch = function() {
        const selfSwitchType = this.findEventSensorNote( ['NESセルフスイッチ', 'NESSelfSwitch']);
        return selfSwitchType ? $gameSelfSwitches.value([this._mapId, this._eventId, selfSwitchType.toUpperCase()]) : true;
    };

    Game_Event.prototype.getSensorBalloonId = function() {
        const detail = this.findEventSensorDetail();
        if (detail && detail.Balloon) {
            return detail.Balloon;
        }
        const balloonId = this.findEventSensorNote( ['NESフキダシ対象', 'NESBalloonEvent']);
        return balloonId >= 0 ? balloonId : param.DefaultBalloon;
    };

    Game_Event.prototype.findEventSensorNote = function(tags) {
        return PluginManagerEx.findMetaValue(this.event(), tags);
    };

    Game_Event.prototype.isVeryNearThePlayer = function() {
        const sx = this.deltaXFrom($gamePlayer.x);
        const sy = this.deltaYFrom($gamePlayer.y);
        const ax = Math.abs(sx);
        const ay = Math.abs(sy);
        const sensorRange = this.findSensorRange();
        if (sensorRange) {
            if (this.x - $gamePlayer.x > sensorRange.Left) {
                return false;
            } else if ($gamePlayer.x - this.x > sensorRange.Right) {
                return false;
            } else if (this.y - $gamePlayer.y > sensorRange.Up) {
                return false;
            } else if ($gamePlayer.y - this.y > sensorRange.Down) {
                return false;
            }
        }
        const sensorDistance = this.findSensorDistance();
        const result = (ax + ay <= sensorDistance) || !sensorDistance;
        if (result && param.ConsiderationDir) {
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

    Game_Event.prototype.findSensorRange = function() {
        const detail = this.findEventSensorDetail();
        if (detail && detail.SensorRange) {
            return detail.SensorRange;
        } else {
            return param.SensorRange;
        }
    };

    Game_Event.prototype.findSensorDistance = function() {
        const detail = this.findEventSensorDetail();
        if (detail && detail.SensorDistance) {
            return detail.SensorDistance;
        } else {
            return param.SensorDistance;
        }
    };

    Game_Event.prototype.findSensorFlash = function() {
        const detail = this.findEventSensorDetail();
        if (detail && detail.FlashColor) {
            return detail.FlashColor;
        } else {
            return param.FlashColor;
        }
    };

    Game_Event.prototype.findSensorSwitch = function() {
        const detail = this.findEventSensorDetail();
        if (detail && detail.SensorSwitch) {
            return detail.SensorSwitch;
        } else {
            return param.SensorSwitch;
        }
    };

    Game_Event.prototype.findSensorSelfSwitch = function() {
        const detail = this.findEventSensorDetail();
        if (detail && detail.SensorSelfSwitch) {
            return detail.SensorSelfSwitch;
        } else {
            return param.SensorSelfSwitch;
        }
    };
})();
