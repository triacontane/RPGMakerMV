//=============================================================================
// StateRingIcon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.2 2017/06/22 一度に複数のステートが解除された場合に一部アイコンが正しく消去されない問題を修正
// 1.3.1 2017/05/05 残りターン数のフォントサイズ指定機能を追加
// 1.3.0 2017/05/05 味方の残りターン数も表示する機能を追加
// 1.2.1 2017/05/05 1.2.0の機能でプラグイン等の機能により残りターン数が小数になった場合に切り上げする仕様を追加
// 1.2.0 2017/05/04 ステートおよびバフの残りターン数を表示する機能を追加
// 1.1.0 2017/02/28 ステートアイコンを横に並べる機能を追加。ステート数によって演出を分けることもできます。
// 1.0.0 2016/08/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Ring State Plugin
 * @author triacontane
 *
 * @param RadiusX
 * @desc 横方向の半径の値です。
 * @default 64
 *
 * @param RadiusY
 * @desc 縦方向の半径の値です。
 * @default 16
 *
 * @param CycleDuration
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。0に指定すると回転しなくなります。
 * @default 60
 *
 * @param LineViewLimit
 * @desc ステート数がこの値以下の場合はリングアイコンではなく1列で表示されます。0にすると常に1列表示になります。
 * @default 1
 *
 * @param Reverse
 * @desc 回転方向が反時計回りになります。(Default:OFF)
 * @default OFF
 *
 * @param ShowTurnCount
 * @desc ステートの残りターン数を表示します。
 * @default ON
 *
 * @param TurnCountX
 * @desc ターン数のX座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 *
 * @param TurnCountY
 * @desc ターン数のY座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 *
 * @param ShowActorTurnCount
 * @desc 味方のステートの残りターン数を表示します。使用しているプラグイン次第で動作しない場合もあります。
 * @default ON
 *
 * @param FontSize
 * @desc 残りターン数表示のフォントサイズです。
 * @default 32
 *
 * @help 敵キャラのステートが複数有効になった場合の
 * ステートアイコンを時計回りに回転させてリングで表現します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc リングステートプラグイン
 * @author トリアコンタン
 *
 * @param X半径
 * @desc 横方向の半径の値です。(Default:64)
 * @default 64
 *
 * @param Y半径
 * @desc 縦方向の半径の値です。(Default:16)
 * @default 16
 *
 * @param 周期
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。0に指定すると回転しなくなります。
 * @default 60
 *
 * @param 一列配置上限
 * @desc ステート数がこの値以下の場合はリングアイコンではなく1列で表示されます。0にすると常に1列表示になります。
 * @default 1
 *
 * @param 反時計回り
 * @desc 回転方向が反時計回りになります。(Default:OFF)
 * @default OFF
 *
 * @param ターン数表示
 * @desc ステートの残りターン数を表示します。
 * @default ON
 *
 * @param ターン数X座標
 * @desc ターン数のX座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 *
 * @param ターン数Y座標
 * @desc ターン数のY座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 *
 * @param 味方ターン数表示
 * @desc 味方のステートの残りターン数を表示します。使用しているプラグイン次第で動作しない場合もあります。
 * @default ON
 *
 * @param フォントサイズ
 * @desc 残りターン数表示のフォントサイズです。
 * @default 32
 *
 * @help 敵キャラのステートが複数有効になった場合のステートアイコンを時計回りに
 * 回転させてリング表示したり一列に並べて表示したりできます。
 *
 * また、各ステートの残りターンを表示することもできます。
 *
 * 追加機能として、味方のステートの残りターンを表示することもできます。
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
    var pluginName = 'StateRingIcon';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramRadiusX            = getParamNumber(['RadiusX', 'X半径'], 0);
    var paramRadiusY            = getParamNumber(['RadiusY', 'Y半径'], 0);
    var paramCycleDuration      = getParamNumber(['CycleDuration', '周期'], 0);
    var paramReverse            = getParamBoolean(['Reverse', '反時計回り']);
    var paramLineViewLimit      = getParamNumber(['LineViewLimit', '一列配置上限'], 0);
    var paramShowTurnCount      = getParamBoolean(['ShowTurnCount', 'ターン数表示']);
    var paramTurnCountX         = getParamNumber(['TurnCountX', 'ターン数X座標']);
    var paramTurnCountY         = getParamNumber(['TurnCountY', 'ターン数Y座標']);
    var paramShowActorTurnCount = getParamBoolean(['ShowActorTurnCount', '味方ターン数表示']);
    var paramFontSize           = getParamNumber(['FontSize', 'フォントサイズ']) || 32;

    //=============================================================================
    // Game_BattlerBase
    //  ステートの残りターン数を取得します。
    //=============================================================================
    Game_BattlerBase.prototype.stateTurns = function() {
        var stateTurns = this.states().map(function(state) {
            if (state.iconIndex <= 0) {
                return null;
            } else if (state.autoRemovalTiming <= 0) {
                return '';
            } else {
                return Math.ceil(this._stateTurns[state.id]);
            }
        }, this);
        return stateTurns.filter(function(turns) {
            return turns !== null;
        });
    };

    Game_BattlerBase.prototype.buffTurns = function() {
        return this._buffTurns.filter(function(turns, index) {
            return this._buffs[index] !== 0;
        }, this);
    };

    Game_BattlerBase.prototype.allTurns = function() {
        return this.stateTurns().concat(this.buffTurns());
    };

    //=============================================================================
    // Sprite_StateIcon
    //  ステートアイコンを回転させます。
    //=============================================================================
    var _Sprite_StateIcon_initMembers      = Sprite_StateIcon.prototype.initMembers;
    Sprite_StateIcon.prototype.initMembers = function() {
        _Sprite_StateIcon_initMembers.apply(this, arguments);
        this._icons        = [];
        this._iconsSprites = [];
    };

    Sprite_StateIcon.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.getCycleDuration()) {
            this._animationCount = 0;
        }
        this.updateRingIcon();
    };

    Sprite_StateIcon.prototype.updateRingIcon = function() {
        var icons = [];
        if (this._battler && this._battler.isAlive()) {
            icons = this._battler.allIcons();
        }
        if (!this._icons.equals(icons)) {
            this._icons = icons;
            this.setupRingIcon();
        }
        if (this._iconsSprites.length > paramLineViewLimit && paramLineViewLimit > 0) {
            this.updateRingPosition();
        } else {
            this.updateNormalPosition();
        }
        if (paramShowTurnCount) {
            this.updateTurns();
        }
        this._sortChildren();
    };

    Sprite_StateIcon.prototype.updateRingPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setRingPosition(this.getIconRadian(index));
        }, this);
    };

    Sprite_StateIcon.prototype.updateNormalPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setNormalPosition(index, this._iconsSprites.length);
        }, this);
    };

    Sprite_StateIcon.prototype.updateTurns = function() {
        var turns = this._battler.allTurns();
        this._icons.forEach(function(icon, index) {
            this._iconsSprites[index].setIconTurn(turns[index]);
        }, this);
    };

    Sprite_StateIcon.prototype.getIconRadian = function(index) {
        var radian = (this._animationCount / this.getCycleDuration() + index / this._iconsSprites.length) * Math.PI * 2;
        if (paramReverse) radian *= -1;
        return radian;
    };

    Sprite_StateIcon.prototype.getCycleDuration = function() {
        return paramCycleDuration || Infinity;
    };

    Sprite_StateIcon.prototype.setupRingIcon = function() {
        this._icons.forEach(function(icon, index) {
            if (!this._iconsSprites[index]) this.makeNewIcon(index);
            this._iconsSprites[index].setIconIndex(icon);
        }, this);
        var spriteLength = this._iconsSprites.length;
        for (var i = this._icons.length; i < spriteLength; i++) {
            this.popIcon();
        }
    };

    Sprite_StateIcon.prototype.makeNewIcon = function(index) {
        var iconSprite            = new Sprite_StateIconChild();
        this._iconsSprites[index] = iconSprite;
        this.addChild(iconSprite);
    };

    Sprite_StateIcon.prototype.popIcon = function() {
        var removedSprite = this._iconsSprites.pop();
        this.removeChild(removedSprite);
    };

    Sprite_StateIcon.prototype._sortChildren = function() {
        this.children.sort(this._compareChildOrder.bind(this));
    };

    Sprite_StateIcon.prototype._compareChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    //=============================================================================
    // Sprite_StateIconChild
    //  ステートアイコンを回転させます。
    //=============================================================================
    function Sprite_StateIconChild() {
        this.initialize.apply(this, arguments);
    }

    Sprite_StateIconChild.prototype             = Object.create(Sprite_StateIcon.prototype);
    Sprite_StateIconChild.prototype.constructor = Sprite_StateIconChild;

    Sprite_StateIconChild.prototype.initialize = function() {
        Sprite_StateIcon.prototype.initialize.call(this);
        this.visible     = false;
        this._turnSprite = null;
        this._turn       = 0;
    };

    Sprite_StateIconChild.prototype.update = function() {};

    Sprite_StateIconChild.prototype.setIconIndex = function(index) {
        this._iconIndex = index;
        this.updateFrame();
    };

    Sprite_StateIconChild.prototype.setIconTurn = function(turn) {
        this.makeTurnSpriteIfNeed();
        if (this._turn === turn) return;
        this._turn = turn;
        this.refreshIconTurn();
    };

    Sprite_StateIconChild.prototype.refreshIconTurn = function() {
        var bitmap = this._turnSprite.bitmap;
        bitmap.clear();
        bitmap.drawText(this._turn, 0, 0, bitmap.width, bitmap.height, 'center');
    };

    Sprite_StateIconChild.prototype.makeTurnSpriteIfNeed = function() {
        if (this._turnSprite) return;
        var sprite             = new Sprite();
        sprite.bitmap          = new Bitmap(Sprite_StateIcon._iconWidth, Sprite_StateIcon._iconHeight);
        sprite.bitmap.fontSize = paramFontSize;
        sprite.x               = paramTurnCountX;
        sprite.y               = paramTurnCountY;
        this._turnSprite       = sprite;
        this.addChild(this._turnSprite);
    };

    Sprite_StateIconChild.prototype.setRingPosition = function(radian) {
        this.x       = Math.cos(radian) * paramRadiusX;
        this.y       = Math.sin(radian) * paramRadiusY;
        this.visible = true;
    };

    Sprite_StateIconChild.prototype.setNormalPosition = function(index, max) {
        this.x       = ((-max + 1) / 2 + index) * Sprite_StateIcon._iconWidth;
        this.y       = 0;
        this.visible = true;
    };

    //=============================================================================
    // Window_BattleStatus
    //  味方の残りターン数を表示します。
    //=============================================================================
    if (paramShowActorTurnCount) {
        var _Window_BattleStatus_drawActorIcons      = Window_BattleStatus.prototype.drawActorIcons;
        Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
            this._drawIconCount = 0;
            _Window_BattleStatus_drawActorIcons.apply(this, arguments);
            this.drawActorIconsTurn(actor, x, y);
        };

        Window_BattleStatus.prototype.drawActorIconsTurn = function(actor, x, y) {
            var turns = actor.allTurns();
            this.contents.fontSize = paramFontSize;
            for (var i = 0; i < this._drawIconCount; i++) {
                this.drawText(turns[i], x + Window_Base._iconWidth * i, y + 2, Window_Base._iconWidth, 'right');
            }
            this.resetFontSettings();
            this._drawIconCount = undefined;
        };

        var _Window_BattleStatus_drawIcon      = Window_BattleStatus.prototype.drawIcon;
        Window_BattleStatus.prototype.drawIcon = function(iconIndex, x, y) {
            _Window_BattleStatus_drawIcon.apply(this, arguments);
            if (this._drawIconCount !== undefined) {
                this._drawIconCount++;
            }
        };
    }
})();

