//=============================================================================
// BattleFormationCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BattleFormationCustomizePlugin
 * @author triacontane
 *
 * @help BattleFormationCustomize.js
 * 
 * 戦闘における隊列の位置を調整します。
 * 特徴を有するメモ欄に以下の通り指定してください。
 *
 * <BFC_座標:10,20>   # 隊列の座標をX座標を[10]に、Y座標を[20]に設定します。
 * <BFC_Pos:10,20>    # 同上
 * <BFC_相対座標:100> # 隊列の座標を元位置からX方向に[10]、Y方向に[20]ずらします。
 * <BFC_DeltaPos:100> # 同上
 *
 * X座標とY座標は両方指定してください。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘隊列調整プラグイン
 * @author トリアコンタン
 *
 * @help BattleFormationCustomize.js
 * 
 * 戦闘における隊列の位置を調整します。
 * 特徴を有するメモ欄に以下の通り指定してください。
 *
 * <BFC_座標:10,20>   # 隊列の座標をX座標を[10]に、Y座標を[20]に設定します。
 * <BFC_Pos:10,20>    # 同上
 * <BFC_相対座標:100> # 隊列の座標を元位置からX方向に[10]、Y方向に[20]ずらします。
 * <BFC_DeltaPos:100> # 同上
 *
 * X座標とY座標は両方指定してください。
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
    var metaTagPrefix = 'BFC_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgArrayNumber = function(args, min, max) {
        var values = args.split(',');
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return values.map(function(value) {
            return parseInt(value).clamp(min, max);
        });
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // Sprite_Battler
    //  カスタマイズされた位置情報を反映します。
    //=============================================================================
    var _Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._homeDx = 0;
        this._homeDy = 0;
    };

    var _Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler;
    Sprite_Battler.prototype.setBattler = function(battler) {
        _Sprite_Battler_setBattler.apply(this, arguments);
        if (this._battler) {
            this.setCustomHome();
            this.setCustomDeltaHome();
        }
    };

    Sprite_Battler.prototype.setCustomHome = function() {
        var customPosition = this.getCustomHomePosition(['座標', 'Pos']);
        if (customPosition) {
            this.setHome(customPosition[0], customPosition[1]);
        }
    };

    Sprite_Battler.prototype.setCustomDeltaHome = function() {
        var customPosition = this.getCustomHomePosition(['相対座標', 'DeltaPos']);
        if (customPosition) {
            this.setHome(this._homeX + customPosition[0] - this._homeDx, this._homeY + customPosition[1] - this._homeDy);
            this._homeDx = customPosition[0];
            this._homeDy = customPosition[1];
        }
    };

    Sprite_Battler.prototype.getCustomHomePosition = function(types) {
        var position = null;
        this._battler.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, types);
            if (metaValue !== undefined) {
                position = getArgArrayNumber(metaValue);
                return true;
            }
            return false;
        });
        return position;
    };

    var _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        _Sprite_Actor_setActorHome.apply(this, arguments);
        this._homeDx = 0;
        this._homeDy = 0;
    };
})();

