/*=============================================================================
 AnimationByPoint.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/01/03 マップ座標にアニメーションを表示できるコマンドを追加
 1.0.0 2020/12/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc AnimationByPointPlugin
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationByPoint.js
 * @author triacontane
 *
 * @command SHOW_ANIMATION
 * @desc Displays the animation at the specified coordinates (specified in pixels) on the screen.
 *
 * @arg id
 * @text Animation ID
 * @desc The animation ID to display.
 * @default 1
 * @type animation
 *
 * @arg x
 * @text X
 * @desc The X to display the animation.
 * @default 0
 * @type number
 *
 * @arg y
 * @text Y
 * @desc The Y to display the animation.
 * @default 0
 * @type number
 *
 * @arg wait
 * @text Wait to completion
 * @desc Wait for the event to progress until the animation display finishes.
 * @default false
 * @type boolean
 *
 * @help AnimationByPoint.js
 *
 * Provides a command to display an animation at a
 * specified coordinate (pixel specification) on the screen.
 * Since the target of the animation does not exist,
 * flashing to the target is invalid.
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 * The "PluginCommonBase.js" is here.
 * (MZ install path)dlc/BasicResources/plugins/official/PluginCommonBase.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 指定座標へのアニメ表示プラグイン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationByPoint.js
 * @author トリアコンタン
 * 
 * @command SHOW_ANIMATION
 * @text アニメーション表示
 * @desc 画面上の指定座標(ピクセル指定)にアニメーションを表示します。
 *
 * @arg id
 * @text アニメーションID
 * @desc 表示するアニメーションIDです。
 * @default 1
 * @type animation
 *
 * @arg x
 * @text X座標
 * @desc アニメーションを表示するX座標です。
 * @default 0
 * @type number
 *
 * @arg y
 * @text Y座標
 * @desc アニメーションを表示するY座標です。
 * @default 0
 * @type number
 *
 * @arg wait
 * @text 完了までウェイト
 * @desc アニメーション表示が終わるまでイベントの進行を待機します。
 * @default false
 * @type boolean
 *
 * @command SHOW_ANIMATION_BY_MAP_POINT
 * @text マップ座標にアニメーション表示
 * @desc マップ上の指定座標(マス指定)にアニメーションを表示します。
 *
 * @arg id
 * @text アニメーションID
 * @desc 表示するアニメーションIDです。
 * @default 1
 * @type animation
 *
 * @arg x
 * @text X座標
 * @desc アニメーションを表示するマップX座標です。
 * @default 0
 * @type number
 *
 * @arg y
 * @text Y座標
 * @desc アニメーションを表示するマップY座標です。
 * @default 0
 * @type number
 *
 * @arg wait
 * @text 完了までウェイト
 * @desc アニメーション表示が終わるまでイベントの進行を待機します。
 * @default false
 * @type boolean
 *
 * @help AnimationByPoint.js
 *
 * 画面上の指定座標(ピクセル指定)にアニメーションを表示するコマンドを提供します。
 * アニメーションの対象が存在しないため、対象へのフラッシュは無効です。
 * またプラグインの構造上、プライオリティ変更の機能追加はできません。
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

    PluginManagerEx.registerCommand(script, 'SHOW_ANIMATION', function(args) {
        this.requestAnimationByPoint(args);
    });

    PluginManagerEx.registerCommand(script, 'SHOW_ANIMATION_BY_MAP_POINT', function(args) {
        args.x = $gameMap.convertToScreenX(args.x);
        args.y = $gameMap.convertToScreenY(args.y);
        this.requestAnimationByPoint(args);
    });

    Game_Map.prototype.convertToScreenX = function(mapX) {
        const tw = $gameMap.tileWidth();
        return Math.floor($gameMap.adjustX(mapX) * tw + tw / 2);
    };

    Game_Map.prototype.convertToScreenY = function(mapY) {
        const th = $gameMap.tileHeight();
        return Math.floor($gameMap.adjustY(mapY) * th + th / 2);
    };

    Game_Interpreter.prototype.requestAnimationByPoint = function(args) {
        const point = new Game_AnimationPoint(args);
        $gameTemp.requestAnimation([point], args.id);
        if (args.wait) {
            this.setWaitMode("pointAnimation");
        }
    };

    Spriteset_Base.prototype.findPointTargetSprite = function(point) {
        if (point instanceof Point) {
            const sprite = new Sprite_AnimationPoint(point);
            this.addChild(sprite);
            return sprite;
        } else {
            return null;
        }
    };

    const _Spriteset_Base_removeAnimation = Spriteset_Base.prototype.removeAnimation;
    Spriteset_Base.prototype.removeAnimation = function(sprite) {
        _Spriteset_Base_removeAnimation.apply(this, arguments);
        sprite._targets.forEach(targetSprite => {
            if (targetSprite instanceof Sprite_AnimationPoint) {
                this.removeChild(targetSprite);
            }
        })
    };

    const _Spriteset_Map_findTargetSprite = Spriteset_Map.prototype.findTargetSprite
    Spriteset_Map.prototype.findTargetSprite = function(target) {
        const sprite = _Spriteset_Map_findTargetSprite.apply(this, arguments);
        return sprite ? sprite : this.findPointTargetSprite(target);
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        const sprite = _Spriteset_Battle_findTargetSprite.apply(this, arguments);
        return sprite ? sprite : this.findPointTargetSprite(target);
    };

    let pointAnimationCount = 0;

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'pointAnimation') {
            if (pointAnimationCount === 0) {
                this._waitMode = '';
                return false;
            } else {
                return true;
            }
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    class Game_AnimationPoint extends Point {
        constructor(args) {
            super(args.x, args.y);
            this._wait = args.wait;
        }

        startAnimation() {
            if (this._wait) {
                pointAnimationCount++;
            }
        }

        endAnimation() {
            if (this._wait) {
                pointAnimationCount--;
            }
        }
    }

    class Sprite_AnimationPoint extends Sprite {
        constructor(point) {
            super();
            this.x = point.x;
            this.y = point.y;
        }
    }
})();
