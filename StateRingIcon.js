//=============================================================================
// StateRingIcon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @desc 横方向の半径の値です。(Default:64)
 * @default 64
 *
 * @param RadiusY
 * @desc 縦方向の半径の値です。(Default:16)
 * @default 16
 *
 * @param CycleDuration
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。(Default:60)
 * @default 60
 *
 * @param Reverse
 * @desc 回転方向が反時計回りになります。(Default:OFF)
 * @default OFF
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
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。(Default:60)
 * @default 60
 *
 * @param 反時計回り
 * @desc 回転方向が反時計回りになります。(Default:OFF)
 * @default OFF
 *
 * @help 敵キャラのステートが複数有効になった場合の
 * ステートアイコンを時計回りに回転させてリングで表現します。
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
    var pluginName    = 'StateRingIcon';

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
    var paramRadiusX       = getParamNumber(['RadiusX', 'X半径'], 16);
    var paramRadiusY       = getParamNumber(['RadiusY', 'Y半径'], 16);
    var paramCycleDuration = getParamNumber(['CycleDuration', '周期'], 60);
    var paramReverse       = getParamBoolean(['Reverse', '反時計回り']);

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
        if (this._iconsSprites.length > 1) {
            this.updateRingPosition();
        } else {
            this.updateNormalPosition();
        }
        this._sortChildren();
    };

    Sprite_StateIcon.prototype.updateRingPosition = function() {
        for (var i = 0; i < this._iconsSprites.length; i++) {
            var radian = (this._animationCount / this.getCycleDuration() + i / this._iconsSprites.length) * Math.PI * 2;
            if (paramReverse) radian *= -1;
            this._iconsSprites[i].setRingPosition(radian);
        }
    };

    Sprite_StateIcon.prototype.updateNormalPosition = function() {
        for (var i = 0; i < this._iconsSprites.length; i++) {
            this._iconsSprites[i].setNormalPosition();
        }
    };

    Sprite_StateIcon.prototype.getCycleDuration = function() {
        return paramCycleDuration;
    };

    Sprite_StateIcon.prototype.setupRingIcon = function() {
        for (var i = 0; i < this._icons.length; i++) {
            if (!this._iconsSprites[i]) this.makeNewIcon(i);
            this._iconsSprites[i].setIconIndex(this._icons[i]);
        }
        for (i = this._icons.length; i < this._iconsSprites.length; i++) {
            this.removeIcon(i);
        }
    };

    Sprite_StateIcon.prototype.makeNewIcon = function(index) {
        var iconSprite            = new Sprite_StateIconChild();
        this._iconsSprites[index] = iconSprite;
        this.addChild(iconSprite);
    };

    Sprite_StateIcon.prototype.removeIcon = function(index) {
        this.removeChild(this._iconsSprites[index]);
        this._iconsSprites.splice(index, 1);
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
        this.visible = false;
    };

    Sprite_StateIconChild.prototype.update = function() {};

    Sprite_StateIconChild.prototype.setIconIndex = function(index) {
        this._iconIndex = index;
        this.updateFrame();
    };

    Sprite_StateIconChild.prototype.setRingPosition = function(radian) {
        this.x       = Math.cos(radian) * paramRadiusX;
        this.y       = Math.sin(radian) * paramRadiusY;
        this.visible = true;
    };

    Sprite_StateIconChild.prototype.setNormalPosition = function() {
        this.x       = 0;
        this.y       = 0;
        this.visible = true;
    };
})();

