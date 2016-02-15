//=============================================================================
// LoadLight.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin That ...
 * @author triacontane
 *
 * @param param
 * @desc parameter description
 * @default default value
 *
 * @help Plugin That ...
 *
 * Plugin Command
 *  XXXXX [XXX]
 *  ex1：XXXXX 1
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マップ処理負荷軽減プラグイン
 * @author トリアコンタン
 *
 * @param 色調変更無効化
 * @desc マップ、戦闘における色調変更(Tint)を無効化します。
 * 色調変更のためのupdate処理が行われなくなります。
 * @default OFF
 *
 * @param ピクチャ最大表示数
 * @desc ピクチャの最大表示数を減らします。
 * 減らした最大表示数ぶんのupdate処理が行われなくなります。
 * @default
 *
 * @help 一部のデフォルト機能を封印する代わりに
 * マップ処理の負荷を軽減します。
 * パラメータより不要な機能の削除機能をONにしてください。
 *
 * 現在のスクリプトはPC上での動作を前提に書かれているので
 * スマートフォンやタブレットで快適に動作させるためには
 * 不要な機能を極力制限する必要があります。
 *
 * プラグインの特性上、他のプラグインと競合する可能性があります。
 * 原則、このプラグインはプラグイン管理の一番下に配置してください。
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
    var pluginName = 'LoadLight';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var isParamExist = function(paramNames) {
        return getParamOther(paramNames) != null;
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

    var paramToneInvalid = getParamBoolean(['色調変更無効化', 'ToneInvalid']);
    var paramMaxPictures = getParamNumber(['ピクチャ最大表示数', 'MaxPictures'], 0);
    if (isParamExist(['ピクチャ最大表示数', 'MaxPictures'])) {
        Game_Screen.prototype.maxPictures = function() {
            return paramMaxPictures;
        };
    }

    if (paramToneInvalid) {
        Spriteset_Base.prototype.updateToneChanger = function(){};
        Spriteset_Base.prototype.updateScreenSprites = function(){};
        Spriteset_Base.prototype.createToneChanger = function(){};
        Spriteset_Base.prototype.createScreenSprites = function(){};
        Spriteset_Map.prototype.createParallax = function(){};
        Spriteset_Map.prototype.updateParallax = function(){};
        Spriteset_Map.prototype.createWeather = function(){};
        Spriteset_Map.prototype.updateWeather = function(){};
    }

    var _Sprite_setBlendColor = Sprite.prototype.setBlendColor;
    Sprite.prototype.setBlendColor = function(color) {
        if (Math.abs(this._lastAlpha - color[3]) < 16) return;
        _Sprite_setBlendColor.apply(this, arguments);
        this._lastAlpha = color[3];
    };
})();

