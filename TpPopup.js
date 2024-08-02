/*=============================================================================
 TpPopup.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/08/02 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TPポップアッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TpPopup.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param tpDamageColor
 * @text TPダメージカラー
 * @desc TPダメージのポップアップ色です。指定がない場合、MPダメージと同じ色になります。
 * @default 0
 * @type color
 *
 * @param tpRecoverColor
 * @text TP回復カラー
 * @desc TP回復のポップアップ色です。指定がない場合、MP回復と同じ色になります。
 * @default 0
 * @type color
 *
 * @help TpPopup.js
 *
 * TPの増減をポップアップ表示します。
 * ポップアップの基準はHPやMPの増減と同じですが、
 * HP,MPが優先されるので、同時にそれらの増減がないときだけポップアップします。
 *
 * 具体的には以下の通りです。
 * ・使用効果「TP増加」が発揮されたとき
 * ・特徴「TP再生率」によって増減したとき
 *
 * 以下ではポップアップされません。
 * ・ダメージを受けてTPが増加したとき
 * ・スキル使用によってTPを消費したとき
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

    const _Game_Battler_shouldPopupDamage = Game_Battler.prototype.shouldPopupDamage;
    Game_Battler.prototype.shouldPopupDamage = function() {
        const result = _Game_Battler_shouldPopupDamage.apply(this, arguments);
        return result || this.result().tpDamage !== 0;
    };

    const _Game_Battler_regenerateTp = Game_Battler.prototype.regenerateTp;
    Game_Battler.prototype.regenerateTp = function() {
        this._noSlentTp = true;
        _Game_Battler_regenerateTp.apply(this, arguments);
        this._noSlentTp = false;
    };

    const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
    Game_Battler.prototype.gainSilentTp = function(value) {
        if (this._noSlentTp) {
            this._result.tpDamage = -value;
        }
        _Game_Battler_gainSilentTp.apply(this, arguments);
    };

    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    Sprite_Damage.prototype.setup = function(target) {
        this._createAnySprite = false;
        _Sprite_Damage_setup.apply(this, arguments);
        const result = target.result();
        if (!this._createAnySprite && result.tpDamage !== 0) {
            this._colorType = result.tpDamage >= 0 ? 4 : 5;
            this.createDigits(result.tpDamage);
        }
    };

    const _Sprite_Damage_createChildSprite = Sprite_Damage.prototype.createChildSprite;
    Sprite_Damage.prototype.createChildSprite = function(width, height) {
        this._createAnySprite = true;
        return _Sprite_Damage_createChildSprite.apply(this, arguments);
    };

    const _ColorManager_damageColor = ColorManager.damageColor;
    ColorManager.damageColor = function(colorType) {
        if (colorType === 4) {
            if (param.tpDamageColor) {
                return this.findTpColor(param.tpDamageColor);
            } else {
                colorType = 2;
            }
        } else if (colorType === 5) {
            if (param.tpRecoverColor) {
                return this.findTpColor(param.tpRecoverColor);
            } else {
                colorType = 3;
            }
        }
        return _ColorManager_damageColor.call(this, colorType);
    };

    ColorManager.findTpColor = function(color) {
        if (isFinite(color)) {
            return this.textColor(color);
        } else {
            return color;
        }
    };
})();
