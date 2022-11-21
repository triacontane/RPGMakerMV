//=============================================================================
// BigEnemy.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.0 2022/11/21 巨大モンスターに対する下揃えアニメーションの表示座標を補正できる機能を追加
// 2.1.3 2021/11/04 ベースプラグインの必須アノテーションが入っていなかったので修正
// 2.1.2 2021/11/03 連続攻撃が発生したとき、ダメージ表記が上方に大きくズレてしまう問題を修正
// 2.1.1 2021/10/27 エネミー表示時、下端に24ピクセル前後の空きが出来てしまう問題を修正
// 2.1.0 2021/03/30 MZで動作するよう修正
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

/*:ja
 * @plugindesc 巨大モンスタープラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BigEnemy.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param animationOffsetY
 * @text アニメーションY補正
 * @desc 巨大モンスターに対する下揃えアニメーションの表示Y座標を指定ピクセルぶん上方に補正します。
 * @default 0
 * @type number
 *
 * @help BigEnemy.js
 *
 * モンスター画像の下端を画面の下端に強制的に合わせることで
 * 巨大モンスターを表示可能します。
 *
 * 敵キャラのメモ欄を以下の通り設定してください。
 * <BigEnemy>
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    let offsetY = 0;

    const _Spriteset_Battle_battleFieldOffsetY = Spriteset_Battle.prototype.battleFieldOffsetY;
    Spriteset_Battle.prototype.battleFieldOffsetY = function() {
        const result = _Spriteset_Battle_battleFieldOffsetY.apply(this, arguments);
        offsetY = result;
        return result;
    };

    //=============================================================================
    // Game_Enemy
    //  巨大モンスター判定を行います。
    //=============================================================================
    Game_Enemy.prototype.isBigEnemy = function() {
        return PluginManagerEx.findMetaValue(this.enemy(), 'BigEnemy');
    };

    //=============================================================================
    // Sprite_Enemy
    //  必要に応じて敵キャラの位置を調整します。
    //=============================================================================
    const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
    Sprite_Enemy.prototype.updatePosition = function() {
        _Sprite_Enemy_updatePosition.apply(this, arguments);
        if (this._enemy.isBigEnemy() && this.bitmap) {
            this._originalY = this.y;
            this.y = Graphics.height + offsetY;
        }
    };

    const _Sprite_Battler_setupDamagePopup = Sprite_Enemy.prototype.setupDamagePopup;
    Sprite_Enemy.prototype.setupDamagePopup = function() {
        const requested = this._battler.isDamagePopupRequested();
        if (_Sprite_Battler_setupDamagePopup) {
            _Sprite_Battler_setupDamagePopup.apply(this, arguments);
        } else {
            Sprite_Battler.prototype.setupDamagePopup.apply(this, arguments);
        }
        if (requested && this._enemy.isBigEnemy()) this.adjustDamagePopup();
    };

    Sprite_Enemy.prototype.adjustDamagePopup = function() {
        const length = this._damages.length;
        if (length > 0) {
            const last = this._damages[length - 2];
            if (!last) {
                this._damages[length - 1].y -= (this.y - this._originalY);
            }
        }
    };

    Sprite_Enemy.prototype.isBigEnemy = function() {
        return this._enemy?.isBigEnemy();
    };

    const _Sprite_Animation_targetSpritePosition = Sprite_Animation.prototype.targetSpritePosition;
    Sprite_Animation.prototype.targetSpritePosition = function(sprite) {
        if (this.isBigEnemySprite(sprite)) {
            const point = new Point(0, -sprite.height / 2);
            if (this._animation.alignBottom) {
                point.y = -param.animationOffsetY;
            }
            sprite.updateTransform();
            return sprite.worldTransform.apply(point);
        } else {
            return _Sprite_Animation_targetSpritePosition.apply(this, arguments);
        }
    };

    Sprite.prototype.isBigEnemySprite = function(sprite) {
        return param.animationOffsetY > 0 && sprite &&
            sprite instanceof Sprite_Enemy && sprite.isBigEnemy();
    };

    const _Sprite_AnimationMV_updatePosition = Sprite_AnimationMV.prototype.updatePosition;
    Sprite_AnimationMV.prototype.updatePosition = function() {
        _Sprite_AnimationMV_updatePosition.apply(this, arguments);
        if (this.isBigEnemySprite(this._targets[0]) && this._animation.position === 2) {
            this.y -= param.animationOffsetY;
        }
    };
})();

