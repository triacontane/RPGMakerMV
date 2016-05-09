//=============================================================================
// CustomizeFollowersGraphic.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/05/09 向きとアニメパターンを直接設定する機能を追加
// 1.0.0 2016/05/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc フォロワー画像調整プラグイン
 * @author トリアコンタン
 *
 * @help 本来はプレイヤーの設定に準ずるフォロワー画像の表示方法を調整します。
 * 以下のスクリプトを実行してください。
 *
 * ・フォロワーの移動速度(1-6)を設定します。
 * $gamePlayer.followers().setMoveSpeed(1);
 *
 * ・フォロワーの不透明度(0-255)を設定します。
 * $gamePlayer.followers().setOpacity(128);
 *
 * ・フォロワーの合成方法(0-3)を設定します。
 * $gamePlayer.followers().setBlendMode(1);
 *
 * ・フォロワーの歩行アニメ(true/false)を設定します。
 * $gamePlayer.followers().setWalkAnime(false);
 *
 * ・フォロワーの足踏みアニメ(true/false)を設定します。
 * $gamePlayer.followers().setStepAnime(true);
 *
 * ・フォロワーの向き固定(true/false)を設定します。
 * $gamePlayer.followers().setDirectionFix(true);
 *
 * ・フォロワーの透明状態(true/false)を設定します。
 * $gamePlayer.followers().setTransparent(true);
 *
 * ・フォロワーの向き(2, 4, 6, 8)を設定します。
 *  すでに向き固定されている場合、無効です。
 * $gamePlayer.followers().setDirection(2);
 *
 * ・フォロワーのアニメパターン(0-3)を設定します。
 * $gamePlayer.followers().setPattern(0);
 *
 * ・フォロワーの変更内容を全て消去します。
 * $gamePlayer.followers().clearProperty();
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';

    //=============================================================================
    // Game_Followers
    //  専用のプロパティを追加定義します。
    //=============================================================================
    var _Game_Followers_initialize = Game_Followers.prototype.initialize;
    Game_Followers.prototype.initialize = function() {
        _Game_Followers_initialize.apply(this, arguments);
        this.clearProperty();
    };

    Game_Followers.prototype.clearProperty = function() {
        this._moveSpeed    = undefined;
        this._opacity      = undefined;
        this._blendMode    = undefined;
        this._walkAnime    = undefined;
        this._stepAnime    = undefined;
        this._directionFix = undefined;
        this._transparent  = undefined;
        this._direction    = undefined;
        this._pattern      = undefined;
    };

    Game_Followers.prototype.setPropertyForChild = function(follower) {
        if (this._moveSpeed !== undefined) {
            follower.setMoveSpeed(this._moveSpeed);
        }
        if (this._opacity !== undefined) {
            follower.setOpacity(this._opacity);
        }
        if (this._blendMode !== undefined) {
            follower.setBlendMode(this._blendMode);
        }
        if (this._walkAnime !== undefined) {
            follower.setWalkAnime(this._walkAnime);
        }
        if (this._stepAnime !== undefined) {
            follower.setStepAnime(this._stepAnime);
        }
        if (this._directionFix !== undefined) {
            follower.setDirectionFix(this._directionFix);
        }
        if (this._transparent !== undefined) {
            follower.setTransparent(this._transparent);
        }
        if (this._direction !== undefined) {
            follower.setDirection(this._direction);
        }
        if (this._pattern !== undefined) {
            follower.setPattern(this._pattern);
        }
    };

    Game_Followers.prototype.setMoveSpeed = function(moveSpeed) {
        this._moveSpeed = moveSpeed.clamp(1, 6);
    };

    Game_Followers.prototype.setOpacity = function(opacity) {
        this._opacity = opacity.clamp(0, 255);
    };

    Game_Followers.prototype.setBlendMode = function(blendMode) {
        this._blendMode = blendMode.clamp(0, 100);
    };

    Game_Followers.prototype.setWalkAnime = function(walkAnimation) {
        this._walkAnime = !!walkAnimation;
    };

    Game_Followers.prototype.setStepAnime = function(stepAnimation) {
        this._stepAnime = !!stepAnimation;
    };

    Game_Followers.prototype.setDirectionFix = function(directionFix) {
        this._directionFix = !!directionFix;
    };

    Game_Followers.prototype.setTransparent = function(transparent) {
        this._transparent = !!transparent;
    };

    Game_Followers.prototype.setDirection = function(direction) {
        this._direction = direction.clamp(1, 9);
    };

    Game_Followers.prototype.setPattern = function(pattern) {
        this._pattern = pattern.clamp(0, 3);
    };

    //=============================================================================
    // Game_Follower
    //  専用のプロパティを適用します。
    //=============================================================================
    var _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function() {
        _Game_Follower_update.apply(this, arguments);
        this.updateProperty();
    };

    Game_Follower.prototype.updateProperty = function() {
        var parent = $gamePlayer.followers();
        parent.setPropertyForChild(this);
    };
})();

