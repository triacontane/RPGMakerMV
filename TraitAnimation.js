/*=============================================================================
 TraitAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/12/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TraitAnimationPlugin
 * @author triacontane
 *
 * @help TraitAnimation.js
 *
 * In Battle, continues to play the animation described in
 * the note of the database with trait.
 * <TraitAnimation:1>
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 特徴によるアニメーションプラグイン
 * @author トリアコンタン
 *
 * @help TraitAnimation.js
 *
 * 戦闘中、特徴を有するデータベース(※)のメモ欄に記述したアニメーションを
 * 再生し続けます。
 * ※ アクター、職業、武器、防具、敵キャラ、ステート
 * <TraitAnimation:1> // アニメーションID[1]を再生し続けます。
 * <特徴アニメ:1>     // 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    /**
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function(object, name) {
        return object.meta.hasOwnProperty(name) ? convertEscapeCharacters(object.meta[name]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function(object, names) {
        var metaValue;
        names.some(function(name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    /**
     * Game_BattlerBase
     * 特徴の情報を取得します。
     */
    Game_BattlerBase.prototype.findTraitAnimation = function() {
        var animationId = 0;
        this.traitObjects().forEach(function(obj) {
            var meta = getMetaValues(obj, ['TraitAnimation', '特徴アニメ']);
            if (meta) {
                animationId = parseInt(meta);
            }
        });
        if (animationId > 0) {
            return {
                id : animationId,
                mirror: this.isActor()
            }
        } else {
            return null;
        }
    };

    /**
     * Sprite_Battler
     * 特徴アニメーションを再生します。
     */
    var _Sprite_Battler_updateAnimation = Sprite_Battler.prototype.updateAnimation
    Sprite_Battler.prototype.updateAnimation = function() {
        _Sprite_Battler_updateAnimation.apply(this, arguments);
        this.updateTraitAnimation();
    };

    Sprite_Battler.prototype.updateTraitAnimation = function() {
        var sprite = this._traitAnimationSprite;
        if (sprite && !sprite.isPlaying()) {
            sprite.remove();
            this._traitAnimationSprite = null;
        }
        if (!this._traitAnimationSprite) {
            this.setupTraitAnimation();
        }
    };

    Sprite_Battler.prototype.setupTraitAnimation = function() {
        var data = this._battler.findTraitAnimation();
        if (data) {
            this.startAnimation($dataAnimations[data.id], data.mirror, 0);
            this._traitAnimationSprite = this._animationSprites.pop();
        }
    };
})();
