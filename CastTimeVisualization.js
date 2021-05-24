/*=============================================================================
 CastTimeVisualization.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2021/05/25 ゲージ色の決定条件を変更(通常の動作に影響はありません)
 1.0.1 2021/95/24 より競合が起きにくい実装に変更
 1.0.0 2021/05/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc キャストタイム可視化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CastTimeVisualization.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param castGaugeColorLeft
 * @text キャストゲージ色(左)
 * @desc キャストゲージの左側の色です。システムカラーの数値を入力します。
 * @default 2
 * @type number
 *
 * @param castGaugeColorRight
 * @text キャストゲージ色(右)
 * @desc キャストゲージの右側の色です。システムカラーの数値を入力します。
 * @default 3
 * @type number
 *
 * @help CastTimeVisualization.js
 *
 * キャストタイムをゲージで可視化します。
 * キャスト中は、プログレスゲージがキャストゲージに切り替わります。
 *
 * キャストタイムはスキルやアイテムの『速度補正』に負の値を設定すると機能します。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * Game_Battler
     * キャスト中かどうかを判定します。
     */
    Game_Battler.prototype.isTpbCasting = function() {
        return this._tpbState === 'casting' && this.tpbRequiredCastTime() > 0;
    };

    Game_Battler.prototype.getCastTime = function() {
        return this._tpbCastTime;
    };

    /**
     * Sprite_Gauge
     * キャストゲージを可視化します。
     */
    const _Sprite_Gauge_updateBitmap = Sprite_Gauge.prototype.updateBitmap;
    Sprite_Gauge.prototype.updateBitmap = function() {
        this.updateTimeCast();
        _Sprite_Gauge_updateBitmap.apply(this, arguments);
    };

    Sprite_Gauge.prototype.updateTimeCast = function() {
        const timeType =  this.findTimeType();
        if (this._timeType !== timeType) {
            this._timeType = timeType;
            this.redraw();
        }
    };

    Sprite_Gauge.prototype.findTimeType = function() {
        if (this._statusType !== 'time' || !this._battler) {
            return null;
        } else if (this._battler.isTpbCasting()) {
            return 'casting';
        } else if (this._battler.isActing() || this._battler.isTpbReady()) {
            return 'acting';
        } else {
            return null;
        }
    };

    const _Sprite_Gauge_gaugeColor1 = Sprite_Gauge.prototype.gaugeColor1;
    Sprite_Gauge.prototype.gaugeColor1 = function() {
        if (this._timeType) {
            return ColorManager.textColor(param.castGaugeColorLeft);
        } else {
            return _Sprite_Gauge_gaugeColor1.apply(this, arguments);
        }
    };

    const _Sprite_Gauge_gaugeColor2 = Sprite_Gauge.prototype.gaugeColor2;
    Sprite_Gauge.prototype.gaugeColor2 = function() {
        if (this._timeType) {
            return ColorManager.textColor(param.castGaugeColorRight);
        } else {
            return _Sprite_Gauge_gaugeColor2.apply(this, arguments);
        }
    };

    const _Sprite_Gauge_currentValue = Sprite_Gauge.prototype.currentValue;
    Sprite_Gauge.prototype.currentValue = function() {
        if (this._timeType === 'casting') {
            return this._battler.getCastTime();
        } else if (this._timeType === 'acting') {
            return 1;
        } else {
            return _Sprite_Gauge_currentValue.apply(this, arguments);
        }
    };

    const _Sprite_Gauge_currentMaxValue = Sprite_Gauge.prototype.currentMaxValue;
    Sprite_Gauge.prototype.currentMaxValue = function() {
        if (this._timeType === 'casting') {
            return this._battler.tpbRequiredCastTime();
        } else if (this._timeType === 'acting') {
            return 1;
        } else {
            return _Sprite_Gauge_currentMaxValue.apply(this, arguments);
        }
    };
})();
