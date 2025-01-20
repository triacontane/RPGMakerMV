/*=============================================================================
 TraitAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2025/01/20 誤って混入していたログ出力を削除
 1.2.0 2021/04/11 複数のアニメーションを同時に表示できるよう修正
 1.1.1 2020/12/16 アニメーション解放処理を微修正
 1.1.0 2020/12/15 MZ版として全面的に修正
 1.0.0 2020/12/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TraitAnimationPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TraitAnimation.js
 * @base PluginCommonBase
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TraitAnimation.js
 * @base PluginCommonBase
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
 * なお、Effekseerを使用したアニメーションを同時に複数再生すると
 * パフォーマンスに影響が出る場合があるのでご注意ください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    /**
     * Game_BattlerBase
     * 特徴の情報を取得します。
     */
    Game_BattlerBase.prototype.findTraitAnimation = function() {
        const animations = [];
        this.traitObjects().forEach(obj => {
            const meta = PluginManagerEx.findMetaValue(obj, ['TraitAnimation', '特徴アニメ']);
            if (meta) {
                animations.push({
                    id : parseInt(meta),
                    mirror: this.isActor()
                });
            }
        });
        return animations;
    };

    Game_BattlerBase.prototype.updateTraitAnimation = function() {
        const list = this.findTraitAnimation();
        list.forEach(data => {
            $gameTemp.requestTraitAnimation([this], data.id, data.mirror);
        });
    };

    const _BattleManager_update = BattleManager.update;
    BattleManager.update = function(timeActive) {
        _BattleManager_update.apply(this, arguments);
        $gameParty.members().forEach(battler => battler.updateTraitAnimation());
        $gameTroop.members().forEach(battler => battler.updateTraitAnimation());
    };

    Game_Temp.prototype.requestTraitAnimation = function(targets, animationId, mirror) {
        this.requestAnimation(targets, animationId, mirror);
        this._animationQueue[this._animationQueue.length - 1].trait = true;
    }

    const _Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
    Spriteset_Base.prototype.initialize = function() {
        _Spriteset_Base_initialize.apply(this, arguments);
        this._traitAnimationSprites = [];
    };

    const _Spriteset_Base_updateAnimations = Spriteset_Base.prototype.updateAnimations;
    Spriteset_Base.prototype.updateAnimations = function() {
        _Spriteset_Base_updateAnimations.apply(this, arguments);
        for (const sprite of this._traitAnimationSprites.clone()) {
            if (!sprite.isPlaying()) {
                this.removeAnimation(sprite);
                this._traitAnimationSprites.remove(sprite);
            }
        }
    };

    const _Spriteset_Base_createAnimation = Spriteset_Base.prototype.createAnimation;
    Spriteset_Base.prototype.createAnimation = function(request) {
        this._createTraitAnimation = request.trait;
        if (request.trait && this.isTraitAnimationPlaying(request)) {
            return;
        }
        _Spriteset_Base_createAnimation.apply(this, arguments);
        this._createTraitAnimation = false;
    };

    Spriteset_Base.prototype.isTraitAnimationPlaying = function(request) {
        const targetSprites = this.makeTargetSprites(request.targets);
        return targetSprites.some(item => item.hasTraitAnimationSprite(request.animationId));
    };

    const _Spriteset_Base_createAnimationSprite = Spriteset_Base.prototype.createAnimationSprite;
    Spriteset_Base.prototype.createAnimationSprite = function(targets, animation, mirror, delay) {
        _Spriteset_Base_createAnimationSprite.apply(this, arguments);
        if (this._createTraitAnimation) {
            this.createTraitAnimationSprite(targets, animation.id);
        }
    };

    Spriteset_Base.prototype.createTraitAnimationSprite = function(targets, animationId) {
        const sprite = this._animationSprites.pop();
        const targetSprites = this.makeTargetSprites(targets);
        targetSprites.forEach(item => item.setTraitAnimationSprite(sprite));
        sprite.animationId = animationId;
        this._traitAnimationSprites.push(sprite);
    };

    const _Sprite_Battler_initialize = Sprite_Battler.prototype.initialize;
    Sprite_Battler.prototype.initialize = function(battler) {
        _Sprite_Battler_initialize.apply(this, arguments);
        this._traitAnimationSprite = [];
    };

    Sprite_Battler.prototype.setTraitAnimationSprite = function(sprite) {
        this._traitAnimationSprite.push(sprite);
    };

    Sprite_Battler.prototype.hasTraitAnimationSprite = function(animationId) {
        let result = false;
        this._traitAnimationSprite.clone().forEach(sprite => {
            const playing = sprite.isPlaying();
            if (!playing) {
                this._traitAnimationSprite.remove(sprite);
            } else if (sprite.animationId === animationId) {
                result = true;
            }
        });
        return result;
    };
})();
