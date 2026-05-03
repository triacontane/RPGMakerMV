/*=============================================================================
 RemoveAnimation.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2026/05/03 同じキャラクターに複数のアニメーションを表示していたとき、最初のアニメーションが終了したときに後続のアニメーションも終了してしまう問題を修正
 1.0.1 2023/03/27 AnimationByPoint.jsで表示したアニメーションを消去できる機能を追加
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
            character.abortAnimation();
        }
    });

    PluginManagerEx.registerCommand(script, 'REMOVE_BALLOON', function(args) {
        const character = this.character(args.id);
        if (character) {
            character.abortBalloon();
        }
    });

    Game_CharacterBase.prototype.abortAnimation = function() {
        this.endAnimation();
        this._abort = true;
    };

    Game_CharacterBase.prototype.abortBalloon = function() {
        this.endBalloon();
        this._abort = true;
    };

    Game_CharacterBase.prototype.isAbort = function() {
        return this._abort;
    };

    const _Game_CharacterBase_startAnimation = Game_CharacterBase.prototype.startAnimation;
    Game_CharacterBase.prototype.startAnimation = function() {
        _Game_CharacterBase_startAnimation.apply(this, arguments);
        this._abort = false;
    };

    const _Game_CharacterBase_startBalloon = Game_CharacterBase.prototype.startBalloon;
    Game_CharacterBase.prototype.startBalloon = function() {
        _Game_CharacterBase_startBalloon.apply(this, arguments);
        this._abort = false;
    };

    Sprite.prototype.isAbortAnimation = function() {
        if (this.targetObjects) {
            return this.targetObjects.every(obj => {
                return obj.isAbort && obj.isAbort() && obj.isAnimationPlaying && !obj.isAnimationPlaying()
            });
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
        const obj = this.targetObject;
        if (obj) {
            return obj.isAbort && obj.isAbort() && obj.isBalloonPlaying && !obj.isBalloonPlaying();
        } else {
            return false;
        }
    };
})();
