//=============================================================================
// ParamTransfer.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/07/29 ヘルプと実装の記述が食い違っていたので修正
// 1.1.0 2016/07/28 変換後の倍率を自由に設定できる機能を追加
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
 * <PT0:1> # 最大HPの値が最大MPで上書きされます。
 * <PT1:0> # 最大MPの値が最大HPで上書きされます。
 *
 * 変換した上でさらにn倍したい場合は以下の通り記述してください。
 * 倍率には制御文字\v[n]およびJavaScript計算式が利用できます。
 * <PT0:1>
 * <PTRate0:\v[1]+50> # 最大HPの値が最大MPの「変数[1]の値 + 50%」の倍率の値で上書きされます。
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
 * <PT0:1> # 最大HPの値が最大MPで上書きされます。
 * <PT1:0> # 最大MPの値が最大HPで上書きされます。
 *
 * 変換した上でさらにn倍したい場合は以下の通り記述してください。
 * 倍率には制御文字\v[n]およびJavaScript計算式が利用できます。
 * <PT0:1>
 * <PTRate0:\v[1]+50> # 最大HPの値が最大MPの「変数[1]の値 + 50%」の倍率の値で
 *                      上書きされます。
 *
 * 変換先を同じ値に指定すると、単にパラメータを指定した条件でn倍できます。
 * 計算式中で「battler」と入力すると対象のバトラー情報を参照できます。
 * <PT2:2>
 * <PTRate2:100 + battler.tp> # 攻撃力の値が現在のTPにより変動します。
 *                              (TP100で攻撃力2倍)
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

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
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
        return text;
    };

    //=============================================================================
    // Game_BattlerBase
    //  変換後のパラメータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getTransParam = function(originalParamId, originalFunction) {
        var realParamId = -1;
        var realParamRate = 1;
        var battler = this;
        this.traitObjects().some(function(data) {
            var value1 = getMetaValue(data, String(originalParamId));
            if (value1) realParamId = getArgNumberWithEval(value1, 0, 7);
            var value2 = getMetaValue(data, 'Rate' + String(originalParamId));
            try {
                if (value2) realParamRate = eval(getArgString(value2)) / 100;
            } catch (e) {
                console.log(e.stack);
            }
            return !!value1;
        });
        return realParamId >= 0 ? Math.floor(originalFunction(realParamId) * realParamRate) : originalFunction(originalParamId);
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

