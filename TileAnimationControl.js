//=============================================================================
// TileAnimationControl.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/06/12 より軽量化できるよう設計を見直し
// 1.0.0 2016/06/11 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Tile animation control
 * @author triacontane
 *
 * @param MobileDeviceOnly
 * @desc モバイル端末で動作した場合のみ本プラグインの仕様を適用します。
 * @default OFF
 *
 * @help オートタイルによるアニメーション頻度を低下もしくは停止します。
 * タイルセットごとに頻度を指定することができます。
 *
 * タイルセットのメモ欄に以下の通り記述してください。
 * <TACAnimationFrequency:n> // n : 頻度
 *
 * 頻度は通常は「1」でこの値を大きくすると頻度が低下します。
 * 「0」を指定するとアニメーションしなくなります。
 * もとの頻度よりも高くすることはできません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイルアニメーション制御プラグイン
 * @author トリアコンタン
 *
 * @param モバイル端末専用
 * @desc モバイル端末で動作した場合のみ本プラグインの仕様を適用します。
 * @default OFF
 *
 * @help オートタイルによるアニメーション頻度を低下もしくは停止します。
 * タイルセットごとに頻度を指定することができます。
 *
 * タイルセットのメモ欄に以下の通り記述してください。
 * <TACアニメーション頻度:n> // n : 頻度
 * 
 * 頻度は通常は「1」でこの値を大きくすると頻度が低下します。
 * 「0」を指定するとアニメーションしなくなります。
 * もとの頻度よりも高くすることはできません。
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
    var pluginName    = 'TileAnimationControl';
    var metaTagPrefix = 'TAC';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return evalFlg ? eval(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramMobileDeviceOnly = getParamBoolean(['MobileDeviceOnly', 'モバイル端末専用']);

    if (!Utils.isMobileDevice() && paramMobileDeviceOnly) return;

    //=============================================================================
    // Tilemap
    //  アニメーション頻度を調整します。
    //=============================================================================
    Tilemap._animationFrequency = 1;

    var _Tilemap_update      = Tilemap.prototype.update;
    Tilemap.prototype.update = function() {
        _Tilemap_update.apply(this, arguments);
        var freq = Tilemap._animationFrequency;
        if (freq === 0) {
            this.animationCount = NaN;
        } else if (Graphics.frameCount % freq > 0) {
            this.animationCount--;
        }
    };

    var _Tilemap__drawAutotile = Tilemap.prototype._drawAutotile;
    Tilemap.prototype._drawAutotile = function(bitmap, tileId, dx, dy) {
        if (Tilemap._animationFrequency === 0) this._animationFrame = 0;
        _Tilemap__drawAutotile.apply(this, arguments);
    };

    //=============================================================================
    // Game_Map
    //  タイルセットから頻度情報を取得します。
    //=============================================================================
    var _Game_Map_setup      = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.apply(this, arguments);
        var animationFrequency      = getMetaValues(this.tileset(), ['アニメーション頻度', 'AnimationFrequency']);
        Tilemap._animationFrequency = (animationFrequency ? getArgNumber(animationFrequency, 0) : 1);
    };
})();

