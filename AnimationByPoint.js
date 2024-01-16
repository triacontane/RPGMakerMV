/*=============================================================================
 AnimationByPoint.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 2.1.1 2024/01/16 戦闘中にアニメーションを表示したとき、完了までウェイトを無効にしていてもイベント実行が止まってしまう場合がある問題を修正
 2.1.0 2023/03/27 RemoveAnimation.jsと組み合わせて表示中のアニメーションやフキダシを即時消去できる機能を追加
 2.0.0 2022/10/16 フキダシもアニメーションと同様に表示できる機能を追加
 1.2.1 2022/06/30 ヘルプ文言修正
 1.2.0 2022/06/30 アニメーションをマップのスクロールに合わせる機能を追加
 1.1.0 2021/01/03 マップ座標にアニメーションを表示できるコマンドを追加
 1.0.0 2020/12/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 指定座標へのアニメ表示プラグイン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationByPoint.js
 * @author トリアコンタン
 * 
 * @command SHOW_ANIMATION
 * @text アニメーション表示
 * @desc 画面上の指定座標(ピクセル指定)にアニメーションやフキダシを表示します。
 *
 * @arg label
 * @text ラベル
 * @desc 表示するアニメーションのラベルです。途中消去する場合にあらかじめ指定しておきます。
 * @default
 *
 * @arg id
 * @text アニメーションID
 * @desc 表示するアニメーションIDです。
 * @default 1
 * @type animation
 *
 * @arg balloonId
 * @text フキダシID
 * @desc 表示するフキダシIDです。アニメーションではなくフキダシを表示したいときはこちらを指定します。
 * @default 0
 * @type select
 * @option なし
 * @value 0
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザ定義1
 * @value 11
 * @option ユーザ定義2
 * @value 12
 * @option ユーザ定義3
 * @value 13
 * @option ユーザ定義4
 * @value 14
 * @option ユーザ定義5
 * @value 15
 *
 * @arg positionType
 * @text 座標タイプ
 * @desc 座標の決定タイプを画面座標とマップ座標から選択します。
 * @default screen
 * @type select
 * @option 画面座標
 * @value screen
 * @option マップ座標
 * @value map
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
 * @arg scroll
 * @text スクロールに連動
 * @desc マップをスクロールに合わせてアニメーションの表示座標が変わります。
 * @default false
 * @type boolean
 *
 * @command REMOVE_ANIMATION
 * @text アニメーション消去
 * @desc ラベルを指定して表示中のアニメーションやフキダシを即時消去します。利用にはRemoveAnimation.jsが必要です。
 *
 * @arg label
 * @text ラベル
 * @desc 表示する際に指定してアニメーションのラベルです。
 * @default
 *
 * @help AnimationByPoint.js
 *
 * 画面上の指定座標(ピクセル指定)にアニメーションやフキダシをを表示する
 * コマンドを提供します。
 * アニメーションの対象が存在しないため、対象へのフラッシュは無効です。
 * またプラグインの構造上、プライオリティ変更の機能追加はできません。
 *
 * フキダシを戦闘画面で表示したい場合、別途『BattleBalloon.js』が
 * 必要です。本プラグインと同じ場所で配布しています。
 *
 * 表示中のアニメーションやフキダシを即時消去したいときは
 * 別途『RemoveAnimation.js』を適用して消去コマンドを実行してください。
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
        if (args.positionType === 'map') {
            args.x = $gameMap.convertToScreenX(args.x);
            args.y = $gameMap.convertToScreenY(args.y);
        }
        this.requestAnimationByPoint(args);
    });

    PluginManagerEx.registerCommand(script, 'REMOVE_ANIMATION', function(args) {
        $gameTemp.removePointAnimation(args.label);
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
        if (args.id > 0) {
            $gameTemp.requestAnimation([point], args.id);
        } else if (args.balloonId > 0) {
            $gameTemp.requestBalloon(point, args.balloonId);
        }
        if (args.label) {
            $gameTemp.pushPointAnimation(point);
        }
        if (args.wait) {
            this.setWaitMode("pointAnimation");
        }
    };

    Game_Temp.prototype.pushPointAnimation = function(point) {
        if (!this._pointQueue) {
            this._pointQueue = [];
        }
        this._pointQueue.push(point);
    };

    Game_Temp.prototype.removePointAnimation = function(label) {
        if (!this._pointQueue) {
            return;
        }
        this._pointQueue
            .filter(target => target.getLabel() === label)
            .forEach(target => target.endAnimation());
        this._pointQueue = this._pointQueue.filter(target => target.isAnimationPlaying());
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

    const _Spriteset_Map_removeBalloon = Spriteset_Map.prototype.removeBalloon;
    Spriteset_Map.prototype.removeBalloon = function(sprite) {
        _Spriteset_Map_removeBalloon.apply(this, arguments);
        const targetSprite = sprite._target;
        if (targetSprite instanceof Sprite_AnimationPoint) {
            this.removeChild(targetSprite);
        }
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

    const _Spriteset_Base_isAnimationPlaying = Spriteset_Base.prototype.isAnimationPlaying;
    Spriteset_Base.prototype.isAnimationPlaying = function() {
        const result = _Spriteset_Base_isAnimationPlaying.apply(this, arguments);
        if (result) {
            if (this._animationSprites.every(sprite => sprite.targetObjects[0] instanceof Point)) {
                return false;
            }
        }
        return result;
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
            this._scroll = args.scroll;
            this._label = args.label;
        }

        startAnimation() {
            if (this._wait) {
                pointAnimationCount++;
            }
            this._playing = true;
        }

        endAnimation() {
            if (this._wait) {
                pointAnimationCount--;
            }
            this._playing = false;
        }

        startBalloon() {
            if (this._wait) {
                pointAnimationCount++;
            }
            this._playing = true;
        }

        endBalloon() {
            if (this._wait) {
                pointAnimationCount--;
            }
            this._playing = false;
        }

        isScroll() {
            return this._scroll;
        }

        isAnimationPlaying() {
            return this._playing;
        }

        isBalloonPlaying() {
            return this._playing;
        }

        getLabel() {
            return this._label;
        }
    }

    class Sprite_AnimationPoint extends Sprite {
        constructor(point) {
            super();
            this._point = point;
            this._dx = $gameMap.displayX();
            this._dy = $gameMap.displayY();
            this.update();
        }

        update() {
            super.update();
            this.x = this._point.x;
            this.y = this._point.y;
            if (this._point.isScroll()) {
                this.x += (this._dx - $gameMap.displayX()) * $gameMap.tileWidth();
                this.y += (this._dy - $gameMap.displayY()) * $gameMap.tileWidth();
            }
        }
    }
})();
