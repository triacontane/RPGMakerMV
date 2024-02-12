/*=============================================================================
 DamagePopBackImage.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 2.1.0 2024/02/12 DarkPlasma_DisplayHpMpDamageでHPMPダメージのポップアップを行ったときに両方の背景画像が表示されるよう対応
 2.0.0 2024/02/08 ダメージの量や種別に応じて複数のポップアップ画像を使い分けられるよう仕様変更
 1.1.0 2024/02/04 MPダメージとMP回復の背景画像を指定できる機能を追加
 1.0.0 2024/02/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ダメージポップ背景画像プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamagePopBackImage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param damageImageList
 * @text ダメージ背景リスト
 * @desc ダメージや回復を受けたときの背景画像のリストです。条件を満たす最初の画像が表示されます。
 * @default []
 * @type struct<Image>[]
 *
 * @param offsetX
 * @text X座標調整値
 * @desc ダメージポップのX座標の調整値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param offsetY
 * @text Y座標調整値
 * @desc ダメージポップのY座標の調整値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param opacity
 * @text 背景画像の不透明度
 * @desc 背景画像の不透明度です。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @help DamagePopBackImage.js
 *
 * ダメージポップアップに背景画像を指定できます。
 * ダメージと回復とで異なる画像を指定可能です。
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

/*~struct~Image:
 *
 * @param damageImage
 * @text 背景画像
 * @desc ダメージを受けたときの背景画像
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param damageType
 * @text ダメージ種別
 * @desc ダメージをHP,MPのいずれかで指定します。
 * @default hp
 * @type select
 * @option HP
 * @value hp
 * @option MP
 * @value mp
 *
 * @param damageUpper
 * @text ダメージ上限
 * @desc ダメージが指定値以下だった場合に表示されます。
 * @default
 * @type number
 *
 * @param damageLower
 * @text ダメージ下限
 * @desc ダメージが指定値以上だった場合に演奏されます。
 * @default
 * @type number
 *
 * @param miss
 * @text ミス条件
 * @desc ミスだった場合に表示されます。
 * @default false
 * @type boolean
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        this.createBackImageSprite(result);
        _Sprite_Damage_setup.apply(this, arguments);
    };

    // for DarkPlasma_DisplayHpMpDamage.js
    const _Sprite_Damage_setupMpChangeWithHp = Sprite_Damage.prototype.setupMpChangeWithHp;
    Sprite_Damage.prototype.setupMpChangeWithHp = function (target) {
        const result = target.result();
        this.createBackImageSprite(result, true);
        _Sprite_Damage_setupMpChangeWithHp.apply(this, arguments);
    };
    // for DarkPlasma_DisplayHpMpDamage.js end

    const _Sprite_Damage_createDigits = Sprite_Damage.prototype.createDigits;
    Sprite_Damage.prototype.createDigits = function(value) {
        _Sprite_Damage_createDigits.apply(this, arguments);
        if (this._digit) {
            this._backSprite.digit = (this._digit - 1) / 2;
        }
    };

    Sprite_Damage.prototype.createBackImageSprite = function(result, mpOnly = false) {
        const sprite = this.createChildSprite(200, 200);
        sprite.bitmap = ImageManager.loadPicture(this.findBackImageName(result, mpOnly));
        sprite.anchor.y = 0.5;
        sprite.x = param.offsetX || 0;
        sprite.dy = 0;
        sprite.opacity = param.opacity || 255;
        if (this._digit) {
            this._digit = 0;
        }
        this._backSprite = sprite;
        return sprite;
    };

    Sprite_Damage.prototype.findBackImageName = function(result, mpOnly) {
        const list = param.damageImageList;
        for (const data of list) {
            if (this.isMatchCondition(data, result, mpOnly)) {
                return data.damageImage;
            }
        }
        return '';
    };

    Sprite_Damage.prototype.isMatchCondition = function(data, result, mpOnly) {
        if (data.damageType === 'hp' && result.hpAffected && !mpOnly) {
            return this.isMatchDamageCondition(data, result.hpDamage);
        } else if (data.damageType === 'mp' && result.mpDamage !== 0) {
            return this.isMatchDamageCondition(data, result.mpDamage);
        } else if (data.miss && result.missed) {
            return true;
        }
        return false;
    }

    Sprite_Damage.prototype.isMatchDamageCondition = function(data, damage) {
        const lower = data.damageLower !== '' ? data.damageLower : -Infinity;
        const upper = data.damageUpper !== '' ? data.damageUpper : Infinity;
        return lower <= damage && damage <= upper;
    }

    const _Sprite_Damage_updateChild = Sprite_Damage.prototype.updateChild;
    Sprite_Damage.prototype.updateChild = function(sprite) {
        _Sprite_Damage_updateChild.apply(this, arguments);
        if (sprite === this._backSprite) {
            sprite.y += (-this.fontSize() / 2) + param.offsetY || 0;
        }
    }

    const _Sprite_Damage_destroy = Sprite_Damage.prototype.destroy;
    Sprite_Damage.prototype.destroy = function(options) {
        if (this._backSprite) {
            this.removeChild(this._backSprite);
            this._backSprite = null;
        }
        _Sprite_Damage_destroy.apply(this, arguments);
    }
})();
