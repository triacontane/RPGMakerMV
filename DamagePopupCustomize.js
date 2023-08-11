/*=============================================================================
 DamagePopupCustomize.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
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

    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    Sprite_Damage.prototype.setup = function(target) {
        this._isActor = target.isActor();
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
        const color = this._isActor ? this.actorDamageColor() : this.enemyDamageColor();
        if (color > 0) {
            return ColorManager.textColor(color);
        } else if (!!color) {
            return color;
        } else {
            return null;
        }
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
