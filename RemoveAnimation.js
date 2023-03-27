/*=============================================================================
 RemoveAnimation.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/03/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アニメーション消去プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RemoveAnimation.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command REMOVE_BALLOON
 * @text フキダシアイコン消去
 * @desc 表示中のフキダシアイコンを消去します。
 *
 * @arg id
 * @text イベントID
 * @desc アイコンを消去するイベントIDです。-1:プレイヤー 0:このイベント 1..:指定IDのイベント
 * @default 0
 * @type number
 * @min -1
 *
 * @command REMOVE_ANIMATION
 * @text アニメーション消去
 * @desc 表示中のアニメーションを消去します。
 *
 * @arg id
 * @text イベントID
 * @desc アイコンを消去するイベントIDです。-1:プレイヤー 0:このイベント 1..:指定IDのイベント
 * @default 0
 * @type number
 * @min -1
 *
 * @help RemoveAnimation.js
 *
 * 表示中のアニメーションおよびフキダシアイコンを消去できます。
 * プラグインコマンドから消去コマンドを指定してください。
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

    PluginManagerEx.registerCommand(script, 'REMOVE_ANIMATION', function(args) {
        const character = this.character(args.id);
        if (character) {
            character.endAnimation();
        }
    });

    PluginManagerEx.registerCommand(script, 'REMOVE_BALLOON', function(args) {
        const character = this.character(args.id);
        if (character) {
            character.endBalloon();
        }
    });

    Sprite.prototype.isAbortAnimation = function() {
        if (this.targetObjects) {
            return this.targetObjects.every(obj => obj.isAnimationPlaying && !obj.isAnimationPlaying());
        } else {
            return false;
        }
    };

    const _Sprite_Animation_checkEnd = Sprite_Animation.prototype.checkEnd;
    Sprite_Animation.prototype.checkEnd = function() {
        _Sprite_Animation_checkEnd.apply(this, arguments);
        if (this.isAbortAnimation()) {
            this._playing = false;
            this._flashColor = [0, 0, 0, 0];
            this._flashDuration = 1;
            this.updateFlash();
        }
    };

    const _Sprite_AnimationMV_updateMain = Sprite_AnimationMV.prototype.updateMain;
    Sprite_AnimationMV.prototype.updateMain = function() {
        _Sprite_AnimationMV_updateMain.apply(this, arguments);
        if (this.isAbortAnimation()) {
            this._duration = 0;
            this.onEnd();
        }
    };

    const _Sprite_Balloon_update = Sprite_Balloon.prototype.update;
    Sprite_Balloon.prototype.update = function() {
        _Sprite_Balloon_update.apply(this, arguments);
        if (this.isAbortBalloon()) {
            this._duration = 0;
        }
    };

    Sprite_Balloon.prototype.isAbortBalloon = function() {
        if (this.targetObject) {
            return this.targetObject.isBalloonPlaying && !this.targetObject.isBalloonPlaying();
        } else {
            return false;
        }
    };
})();
