//=============================================================================
// BigEnemy.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.3 2020/11/01 中心、足下に指定したアニメーションの表示位置を調整
// 2.0.2 2018/10/05 連続回数が2以上のダメージを表示する際、一瞬だけおかしな位置に表示される問題を修正
// 2.0.1 2017/03/16 2.0.0で巨大サイズ以外の敵に対するポップアップが表示されなくなっていた問題を修正
// 2.0.0 2017/01/05 アニメーションの表示位置を補正
// 1.0.1 2016/11/17 YEP_CoreEngine.jsで画面サイズを変更すると、位置の不整合が起きる現象に対応
// 1.0.0 2016/10/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BigEnemyPlugin
 * @author triacontane
 *
 * @help フロントビューで巨大モンスターを表示可能にするプラグインです。
 * 具体的にはY座標を強制的に画面の下端に設定します。
 *
 * 敵キャラのメモ欄を以下の通り設定してください。
 * <BE有効>
 * <BEValid>
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 巨大モンスタープラグイン
 * @author トリアコンタン
 *
 * @help フロントビューで巨大モンスターを表示可能にするプラグインです。
 * 具体的には画像の下端が画面の下端に強制的に合わせられます。
 *
 * 敵キャラのメモ欄を以下の通り設定してください。
 * <BE有効>
 * <BEValid>
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
    var metaTagPrefix = 'BE';

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
    // Game_Enemy
    //  巨大モンスター判定を行います。
    //=============================================================================
    Game_Enemy.prototype.isBigEnemy = function() {
        return getMetaValues(this.enemy(), ['有効', 'Valid']);
    };

    //=============================================================================
    // Sprite_Enemy
    //  必要に応じて敵キャラの位置を調整します。
    //=============================================================================
    var _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
    Sprite_Enemy.prototype.updatePosition = function() {
        _Sprite_Enemy_updatePosition.apply(this, arguments);
        if (this._enemy.isBigEnemy() && this.bitmap) {
            this._originalY = this.y;
            this.y = Graphics.boxHeight;
        }
    };

    var _Sprite_Battler_setupDamagePopup = Sprite_Enemy.prototype.setupDamagePopup;
    Sprite_Enemy.prototype.setupDamagePopup = function() {
        var requested = this._battler.isDamagePopupRequested();
        if (_Sprite_Battler_setupDamagePopup) {
            _Sprite_Battler_setupDamagePopup.apply(this, arguments);
        } else {
            Sprite_Battler.prototype.setupDamagePopup.apply(this, arguments);
        }
        if (requested && this._enemy.isBigEnemy()) this.adjustDamagePopup();
    };

    Sprite_Enemy.prototype.adjustDamagePopup = function() {
        if (this._damages.length > 0) {
            this._damages[this._damages.length - 1].y -= (this.y - this._originalY);
        }
    };

    var _Sprite_Animation_updatePosition = Sprite_Animation.prototype.updatePosition;
    Sprite_Animation.prototype.updatePosition = function() {
        _Sprite_Animation_updatePosition.apply(this, arguments);
        var position = this._animation.position;
        if (position === 1 || position === 2) {
            var originalY = this._target._originalY;
            if (originalY) {
                var shiftY = this._target.y - originalY;
                if (position === 1) {
                    shiftY /= 2;
                }
                this.y -= shiftY;
            }
        }
    };
})();

