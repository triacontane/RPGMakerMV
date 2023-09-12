/*=============================================================================
 DamagePopupCustomize.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/09/12 ダメージの属性ごとにポップアップ色を設定できる機能を追加
 1.1.0 2023/08/27 ポップアップ座標を敵味方ごとに調整できる機能を追加
 1.0.0 2023/08/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ダメージポップアップ調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamagePopupCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param fontSize
 * @text フォントサイズ
 * @desc ダメージポップアップのフォントサイズです。デフォルトはベースフォントサイズ + 4です。
 * @default 0
 * @type number
 *
 * @param enemyHpDamageColor
 * @text 敵HPダメージ色
 * @desc 敵のHPダメージの色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param enemyHpRecoveryColor
 * @text 敵HP回復色
 * @desc 敵のHP回復の色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param enemyMpDamageColor
 * @text 敵MPダメージ色
 * @desc 敵のMPダメージの色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param enemyMpRecoveryColor
 * @text 敵MP回復色
 * @desc 敵のMP回復の色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param actorHpDamageColor
 * @text 味方HPダメージ色
 * @desc 味方のHPダメージの色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param actorHpRecoveryColor
 * @text 味方HP回復色
 * @desc 味方のHP回復の色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param actorMpDamageColor
 * @text 味方MPダメージ色
 * @desc 味方のMPダメージの色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param actorMpRecoveryColor
 * @text 味方MP回復色
 * @desc 味方のMP回復の色です。テキストカラーから選択するか、色情報を直接入力します。
 * @default 0
 * @type color
 *
 * @param elementPopupColors
 * @text 属性ポップアップ色
 * @desc 属性ごとにポップアップ色を設定します。先頭から順に対応している属性IDになります。0は無属性です。
 * @default []
 * @type color[]
 *
 * @param actorPopupOffsetX
 * @text 味方ポップアップX座標補正
 * @desc 味方のポップアップのX座標補正です。デフォルトは0です。
 * @default 0
 * @type number
 * @min -999
 *
 * @param actorPopupOffsetY
 * @text 味方ポップアップY座標補正
 * @desc 味方のポップアップのY座標補正です。デフォルトは0です。
 * @default 0
 * @type number
 * @min -999
 *
 * @param enemyPopupOffsetX
 * @text 敵ポップアップX座標補正
 * @desc 敵のポップアップのX座標補正です。デフォルトは0です。
 * @default 0
 * @type number
 * @min -999
 *
 * @param enemyPopupOffsetY
 * @text 敵ポップアップY座標補正
 * @desc 敵のポップアップのY座標補正です。デフォルトは0です。
 * @default 0
 * @type number
 * @min -999
 *
 * @help DamagePopupCustomize.js
 *
 * ダメージポップアップの表示内容や色調を調整します。
 * パラメータから情報を設定してください。未設定の場合、デフォルト値が使用されます。
 * 色情報はテキストカラーから選択できますが、CSSによる色指定も可能です。
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

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.elementId = 0;
    };

    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (this.item().damage.elementId < 0) {
            target.result().elementId = this.subject().attackElements()[0];
        } else {
            target.result().elementId = this.item().damage.elementId;
        }
    };

    const _Sprite_Battler_damageOffsetX = Sprite_Battler.prototype.damageOffsetX;
    Sprite_Battler.prototype.damageOffsetX = function() {
        const offsetX = _Sprite_Battler_damageOffsetX.apply(this, arguments);
        if (this instanceof Sprite_Actor) {
            return offsetX + (param.actorPopupOffsetX || 0);
        } else {
            return offsetX + (param.enemyPopupOffsetX || 0);
        }
    };

    const _Sprite_Battler_damageOffsetY = Sprite_Battler.prototype.damageOffsetY;
    Sprite_Battler.prototype.damageOffsetY = function() {
        const offsetY = _Sprite_Battler_damageOffsetY.apply(this, arguments);
        if (this instanceof Sprite_Actor) {
            return offsetY + (param.actorPopupOffsetY || 0);
        } else {
            return offsetY + (param.enemyPopupOffsetY || 0);
        }
    };

    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    Sprite_Damage.prototype.setup = function(target) {
        this._isActor = target.isActor();
        this._elementId = target.result().elementId;
        _Sprite_Damage_setup.apply(this, arguments);
    };

    const _Sprite_Damage_fontSize = Sprite_Damage.prototype.fontSize;
    Sprite_Damage.prototype.fontSize = function() {
        const size = _Sprite_Damage_fontSize.apply(this, arguments);
        return param.fontSize ? param.fontSize : size;
    };

    const _Sprite_Damage_damageColor = Sprite_Damage.prototype.damageColor;
    Sprite_Damage.prototype.damageColor = function() {
        const color = _Sprite_Damage_damageColor.apply(this, arguments);
        return this.customDamageColor() || color;
    }

    Sprite_Damage.prototype.customDamageColor = function() {
        const color = this.findDamageColor();
        if (color > 0) {
            return ColorManager.textColor(color);
        } else if (!!color) {
            return color;
        } else {
            return null;
        }
    };

    Sprite_Damage.prototype.findDamageColor = function() {
        const elementColors = param.elementPopupColors;
        if (this._elementId > 0 && elementColors && elementColors[this._elementId]) {
            return elementColors[this._elementId];
        }
        return this._isActor ? this.actorDamageColor() : this.enemyDamageColor();
    };

    Sprite_Damage.prototype.actorDamageColor = function() {
        switch (this._colorType) {
            case 0:
                return param.actorHpDamageColor;
            case 1:
                return param.actorHpRecoveryColor;
            case 2:
                return param.actorMpDamageColor;
            case 3:
                return param.actorMpRecoveryColor;
            default:
                return null;
        }
    };

    Sprite_Damage.prototype.enemyDamageColor = function() {
        switch (this._colorType) {
            case 0:
                return param.enemyHpDamageColor;
            case 1:
                return param.enemyHpRecoveryColor;
            case 2:
                return param.enemyMpDamageColor;
            case 3:
                return param.enemyMpRecoveryColor;
            default:
                return null;
        }
    };
})();
