/*=============================================================================
 TraitAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/04/16 戦闘中にメンバーを入れ替えたとき即座にアニメーションを消去するよう修正
 1.1.0 2021/04/11 複数のアニメーションを同時に表示できるよう修正
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
 * 同一バトラーに複数のアニメーションを表示させることも可能ですが
 * パフォーマンスにはご注意ください。
 * また、同一のデータベースに対して同一のメモ欄は指定できません。
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
        const animations = [];
        this.traitObjects().forEach(obj => {
            const meta = getMetaValues(obj, ['TraitAnimation', '特徴アニメ']);
            if (meta) {
                animations.push({
                    id : parseInt(meta),
                    mirror: this.isActor()
                });
            }
        });
        return animations;
    };

    /**
     * Sprite_Battler
     * 特徴アニメーションを再生します。
     */
    const _Sprite_Battler_initialize = Sprite_Battler.prototype.initialize;
    Sprite_Battler.prototype.initialize = function(battler) {
        _Sprite_Battler_initialize.apply(this, arguments);
        this._traitAnimationSprite = [];
    };

    var _Sprite_Battler_updateAnimation = Sprite_Battler.prototype.updateAnimation
    Sprite_Battler.prototype.updateAnimation = function() {
        _Sprite_Battler_updateAnimation.apply(this, arguments);
        this.updateTraitAnimation();
    };

    Sprite_Battler.prototype.updateTraitAnimation = function() {
        this._traitAnimationSprite = this._traitAnimationSprite.filter(function(sprite) {
            if (!sprite.isPlaying()) {
                sprite.remove();
            }
            if (this._battler instanceof Game_Actor && !$gameParty.members().contains(this._battler)) {
                sprite.remove();
            }
            return sprite.isPlaying();
        }, this);
        this.setupTraitAnimation();
    };

    Sprite_Battler.prototype.hasTraitAnimation = function(id) {
        return this._traitAnimationSprite.some(function(sprite) {
            return sprite.animationId === id;
        });
    };

    Sprite_Battler.prototype.setupTraitAnimation = function() {
        var list = this._battler.findTraitAnimation();
        list.forEach(function(data) {
            if (this.hasTraitAnimation(data.id)) {
                return;
            }
            this.startAnimation($dataAnimations[data.id], data.mirror, 0);
            var sprite = this._animationSprites.pop();
            sprite.animationId = data.id;
            this._traitAnimationSprite.push(sprite);
        }, this);
    };
})();
