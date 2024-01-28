/*=============================================================================
 ExtraGaugePressAttachment.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2024/01/28 長押しボタンを離したときにゲージをリセットするか維持するかを設定できる機能を追加
 1.2.1 2024/01/20 最大値スイッチがONになったあとで場所移動すると、再度最大値スイッチがONになる問題を修正
 1.2.0 2024/01/19 汎用ゲージプラグインで設定した「取得変数ID」の変数に長押しによって蓄積された値が設定されるよう修正
 1.1.0 2024/01/18 長押しにマウスクリックを追加、リファクタリング
 1.0.0 2024/01/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 汎用ゲージプラグイン長押しアタッチメント
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ExtraGaugePressAttachment.js
 * @base ExtraGauge
 * @orderAfter ExtraGauge
 * @author トリアコンタン
 *
 * @param LongPressGaugeList
 * @text 長押しゲージリスト
 * @desc 長押しにより増減する対象のゲージです。汎用ゲージプラグインで指定した識別子を指定します。
 * @default []
 * @type struct<LongPressGauge>[]
 *
 * @help ExtraGaugePressAttachment.js
 *
 * 汎用ゲージプラグインのボタン長押しアタッチメントです。
 * 同プラグインのv1.19.0以降が必要です。
 *
 * パラメータで指定したボタンを長押ししているあいだ、ゲージが増加します。
 * 指定した場合、汎用ゲージプラグインの現在値設定は無視されます。(※1)
 * ゲージの増加量は1フレームにつき1なので、ゲージ最大値を変更することで
 * 満タンになるまでの時間を調整できます。
 *
 * 汎用ゲージプラグイン側の表示スイッチの条件を満たしていないときは
 * 長押しは無効となります。
 *
 * ※1
 * ただし、取得変数IDを指定しておくとその変数に
 * 長押しで蓄積された値が自動設定されます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~LongPressGauge:
 *
 * @param Id
 * @text 識別子
 * @desc 長押しにより増減する対象のゲージです。汎用ゲージプラグインで指定した識別子を指定します。
 * @default gauge01
 *
 * @param Buttons
 * @text 長押しボタン
 * @desc 長押し対象のボタンです。複数指定した場合は、いずれかのボタンの長押しでゲージが増加します。
 * @default []
 * @type select[]
 * @option
 * @option ok
 * @option cancel
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option left
 * @option up
 * @option right
 * @option down
 * @option debug
 * @option escape
 * @option menu
 * @option left_click
 *
 * @param hiddenByDefault
 * @text 長押し以外では非表示
 * @desc 有効にすると長押ししていないときはゲージを非表示にします。
 * @default true
 * @type boolean
 *
 * @param hiddenByMax
 * @text 最大値のときは非表示
 * @desc 有効にするとゲージが最大値になると非表示になります。
 * @default true
 * @type boolean
 *
 * @param maxSe
 * @text 最大値SE
 * @desc ゲージが最大値になったときに演奏されるSEです。
 * @default
 * @type struct<AudioSe>
 *
 * @param maxSwitchId
 * @text 最大値スイッチ
 * @desc ゲージが最大値になったときにONになるスイッチです。
 * @default 0
 * @type switch
 *
 * @param onRelease
 * @text 離したときの動作
 * @desc 長押しを離したときの動作です。
 * @default reset
 * @type select
 * @option リセット
 * @value reset
 * @option 維持
 * @value keep
 */

/*~struct~AudioSe:
 * @param name
 * @text ファイル名称
 * @desc ファイル名称です。
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text ボリューム
 * @desc ボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 左右バランス
 * @desc 左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.LongPressGaugeList) {
        param.LongPressGaugeList = [];
    }

    const _Sprite_ExtraGaugeContainer_create = Sprite_ExtraGaugeContainer.prototype.create;
    Sprite_ExtraGaugeContainer.prototype.create = function() {
        const id = this._data.Id;
        this._longPress = param.LongPressGaugeList.find(item => item.Id === id);
        this._longPressGaugeValue = 0;
        _Sprite_ExtraGaugeContainer_create.apply(this, arguments);
    };

    const _Sprite_ExtraGaugeContainer_createGauge = Sprite_ExtraGaugeContainer.prototype.update;
    Sprite_ExtraGaugeContainer.prototype.update = function() {
        _Sprite_ExtraGaugeContainer_createGauge.apply(this, arguments);
        if (this._longPress && this.isVisible()) {
            this.updateLongPress();
        }
    };

    Sprite_ExtraGaugeContainer.prototype.updateLongPress = function() {
        if (this.isButtonPress()) {
            this._longPressGaugeValue = Math.min(this._longPressGaugeValue + 1, this._gauge.currentMaxValue());
        } else {
            if (this._longPress.onRelease !== 'keep') {
                this._longPressGaugeValue = 0;
            }
        }
        this._gauge.setLongPressValue(this._longPressGaugeValue);
        if (this._gauge.isFull()) {
            if (!this._onMax) {
                this.updateLongPressOnMax();
            }
            this._onMax = true;
        } else {
            this._onMax = false;
        }
    };

    Sprite_ExtraGaugeContainer.prototype.updateLongPressOnMax = function() {
        const se = this._longPress.maxSe;
        if (se && se.name) {
            AudioManager.playSe(se);
        }
        const switchId = this._longPress.maxSwitchId;
        if (switchId) {
            $gameSwitches.setValue(switchId, true);
        }
    };

    const _Sprite_ExtraGaugeContainer_updateVisibly = Sprite_ExtraGaugeContainer.prototype.updateVisibly;
    Sprite_ExtraGaugeContainer.prototype.updateVisibly = function() {
        _Sprite_ExtraGaugeContainer_updateVisibly.apply(this, arguments);
        if (!this._longPress) {
            return;
        }
        if (this._longPress.hiddenByDefault && !this.isButtonPress()) {
            this.visible = false;
        }
        if (this._longPress.hiddenByMax && this._gauge.isFull()) {
            this.visible = false;
        }
    };

    Sprite_ExtraGaugeContainer.prototype.isButtonPress = function() {
        const buttons = this._longPress.Buttons || [];
        if (buttons.includes('left_click') && TouchInput.isPressed()) {
            return true;
        }
        return buttons.some(button => Input.isPressed(button));
    };

    Sprite_ExtraGauge.prototype.setLongPressValue = function(value) {
        if (this._longPressGaugeValue === value) {
            return;
        }
        this._longPressGaugeValue = value;
        this._value = value;
        if (value > 0) {
            const variableId = this._data.CurrentMethod?.VariableId;
            if (variableId) {
                $gameVariables.setValue(variableId, value);
            }
        }
    };

    const _Sprite_ExtraGauge_currentValue = Sprite_ExtraGauge.prototype.currentValue;
    Sprite_ExtraGauge.prototype.currentValue = function() {
        if (this._longPressGaugeValue !== undefined) {
            return this._longPressGaugeValue;
        } else {
            return _Sprite_ExtraGauge_currentValue.apply(this, arguments);
        }
    };
})();
