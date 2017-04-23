//=============================================================================
// TraitConditions.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/04/23 ランダム要素を簡単に扱える関数を追加
// 1.1.2 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.1.0 2016/06/15 スクリプト「data」で対象のオブジェクトを参照できる機能を追加
//                  スクリプト評価時にエラーになった場合に異常終了しないよう修正
// 1.0.1 2016/05/25 スクリプトに「>」「<」を使えるように修正
// 1.0.0 2016/05/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 特徴の条件適用プラグイン
 * @author トリアコンタン
 *
 * @help 特徴のひとつひとつに適用条件を設定します。
 * 条件を満たさない特徴は無効になります。
 * 特徴を記述するデータベースのメモ欄に以下の通り入力してください。
 *
 * <TC1スイッチ:10>     // スイッチ[10]がONの場合、1番目の特徴が有効になる
 * <TC1ステート:4>      // ステート[4]が有効な場合、1番目の特徴が有効になる
 * <TC1スクリプト:JS式> // [式]の評価結果がtrueの場合、1番目の特徴が有効になる
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<TC1スクリプト:\v[1] &gt; 10> // 変数[1]が10より大きい場合
 *
 * スクリプト中で「data」と記述すると
 * 対象のアクター・エネミーオブジェクトを参照できます。
 * 使いこなすにはスクリプトに関する一定の知識が必要です。
 *
 * 例1:対象がID[1]のアクターの場合のみ有効になります。
 * <TC1スクリプト:data.isActor() && data.actorId() === 1>
 *
 * 例2:50%の確率で有効になります。
 * <TC1スクリプト:random(50)>
 *
 * 2番目以降の特徴も同様に設定可能です。
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
    var pluginName    = 'TraitConditions';
    var metaTagPrefix = 'TC';

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
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

    var convertEscapeCharacters = function(text) {
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
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

    var random = function(percent) {
        return Math.random() < percent / 100;
    };
    
    //=============================================================================
    // Game_BattlerBase
    //  特徴に条件を設定します。
    //=============================================================================
    var _Game_BattlerBase_allTraits = Game_BattlerBase.prototype.allTraits;
    Game_BattlerBase.prototype.allTraits = function() {
        _Game_BattlerBase_allTraits.apply(this, arguments);
        return this.traitObjects().reduce(function(r, obj) {
            for (var i = 0, n = obj.traits.length; i < n; i++) {
                if (this.isValidTrait(i, obj)) r.push(obj.traits[i]);
            }
            return r;
        }.bind(this), []);
    };

    Game_BattlerBase.prototype.isValidTrait = function(i, obj) {
        var id = String(i + 1);
        var result = true;
        if (!this.isValidTraitSwitch(id , obj)) result = false;
        if (!this.isValidTraitState (id , obj)) result = false;
        if (!this.isValidTraitScript(id , obj)) result = false;
        return result;
    };

    Game_BattlerBase.prototype.isValidTraitSwitch = function(id, obj) {
        var metaValue = getMetaValues(obj, [id + 'スイッチ', id + 'Switch']);
        if (!metaValue) return true;
        return $gameSwitches.value(getArgNumber(metaValue, 1));
    };

    Game_BattlerBase.prototype.isValidTraitState = function(id, obj) {
        var metaValue = getMetaValues(obj, [id + 'ステート', id + 'State']);
        if (!metaValue) return true;
        return this.isStateAffected(getArgNumber(metaValue, 1));
    };

    Game_BattlerBase.prototype.isValidTraitScript = function(id, obj) {
        var metaValue = getMetaValues(obj, [id + 'スクリプト', id + 'Script']);
        if (!metaValue) return true;
        var data = this;
        try {
            return eval(getArgString(metaValue));
        } catch (e) {
            throw new Error(pluginName + 'で指定したスクリプト実行中にエラーが発生しました。実行内容:' + metaValue);
        }
    };
})();

