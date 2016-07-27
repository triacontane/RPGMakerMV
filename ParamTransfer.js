//=============================================================================
// ParamTransfer.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/07/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Param Transfer Plugin
 * @author triacontane
 *
 * @help 以下の主要8パラメータを別のパラメータに変換します。
 * ・最大HP(0)
 * ・最大MP(1)
 * ・攻撃力(2)
 * ・防御力(3)
 * ・魔法力(4)
 * ・魔法防御(5)
 * ・敏捷性(6)
 * ・運(7)
 *
 * これにより最大HPと最大MPが一時的に入れ替わる装備や
 * 魔法力の値が攻撃力に変換されるステートが作成できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記述してください。
 * 数字は上の記述を参照してください。
 * <PT0:1> # 最大HPの値を最大MPに変換します。
 * <PT1:0> # 最大MPの値を最大HPに変換します。
 *
 * 変換されるのはベースパラメータで、装備品やバフによる加算は
 * 含まれません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc パラメータ変換プラグイン
 * @author トリアコンタン
 *
 * @help 以下の主要8パラメータを別のパラメータに変換します。
 * ・最大HP(0)
 * ・最大MP(1)
 * ・攻撃力(2)
 * ・防御力(3)
 * ・魔法力(4)
 * ・魔法防御(5)
 * ・敏捷性(6)
 * ・運(7)
 *
 * これにより最大HPと最大MPが一時的に入れ替わる装備や
 * 魔法力の値が攻撃力に変換されるステートが作成できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記述してください。
 * 数字は上の記述を参照してください。
 * <PT0:1> # 最大HPの値を最大MPに変換します。
 * <PT1:0> # 最大MPの値を最大HPに変換します。
 *
 * 変換されるのはベースパラメータで、装備品やバフによる加算は
 * 含まれません。
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
    var metaTagPrefix = 'PT';

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getArgNumberWithEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(eval(convertEscapeCharacters(arg)), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_BattlerBase
    //  変換後のパラメータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getTransParam = function(originalParamId, originalFunction) {
        var realParamId = -1;
        this.traitObjects().some(function(data) {
            var value = getMetaValue(data, String(originalParamId));
            if (value) realParamId = getArgNumberWithEval(value, 0, 7);
            return !!value;
        });
        return realParamId >= 0 ? originalFunction(realParamId) : originalFunction(originalParamId);
    };

    //=============================================================================
    // Game_Enemy
    //  ベースパラメータを変換します。
    //=============================================================================
    var _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        return this.getTransParam(paramId, _Game_Actor_paramBase.bind(this));
    };

    //=============================================================================
    // Game_Enemy
    //  ベースパラメータを変換します。
    //=============================================================================
    var _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        return this.getTransParam(paramId, _Game_Enemy_paramBase.bind(this));
    };
})();

