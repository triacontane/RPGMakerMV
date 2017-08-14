//=============================================================================
// DynamicBattlerParam.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/08/14 計算式でパラメータを取得する際に装備品による変動分を含まないよう修正
// 1.0.0 2017/07/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DynamicBattlerParameterPlugin
 * @author triacontane
 *
 * @param FormulaMhp
 * @desc 最大HPを決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaMmp
 * @desc 最大MPを決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaAtk
 * @desc 攻撃力を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaDef
 * @desc 防御力を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaMat
 * @desc 魔法力を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaMdf
 * @desc 魔法防御を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaAgi
 * @desc 敏捷性を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param FormulaLuk
 * @desc 運を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @help DynamicBattlerParameter.js
 *
 * バトラーの基本パラメータをバトラーの状態に応じて動的に変更します。
 * 設定にはJavaScript計算式を使用します。
 * 計算式は、メモ欄もしくはプラグインパラメータから取得します。
 * 特徴を有するデータベースのメモ欄に以下の通り指定してください。
 *
 * <DBP_Atk:[計算式]> # 攻撃力に計算式を適用
 * <DBP_Def:[計算式]> # 防御力に計算式を適用
 * <DBP_Mat:[計算式]> # 魔法力に計算式を適用
 * <DBP_Mdf:[計算式]> # 魔法防御に計算式を適用
 * <DBP_Agi:[計算式]> # 敏捷性に計算式を適用
 * <DBP_Luk:[計算式]> # 運に計算式を適用
 * <DBP_Mhp:[計算式]> # 最大HPに計算式を適用
 * <DBP_Mmp:[計算式]> # 最大MPに計算式を適用
 *
 * 計算式に使用できる要素は以下の通りです。
 * 各パラメータの値は本プラグインや装備品による変動を
 * 含まないバトラー本来のパラメータとなります。
 *
 * param # データベースで指定した元々の値
 * a.hp  # HP
 * a.mp  # MP
 * a.tp  # TP
 * a.mhp # 最大HP
 * a.mmp # 最大MP
 * a.atk # 攻撃力
 * a.def # 防御力
 * a.mat # 魔法力
 * a.mdf # 魔法防御
 * a.agi # 敏捷性
 * a.luk # 運
 * a.hpRate() # HPレート(0.0 - 1.0)
 * a.mpRate() # MPレート(0.0 - 1.0)
 * a.tpRate() # TPレート(0.0 - 1.0)
 * a.special('aaa') # メモ欄の[aaa]の値(※)
 * a.level        # レベル
 * a.actorId()    # アクターID
 * a._classId     # 職業ID
 * a.currentExp() # 経験値
 *
 * ※特徴を有するメモ欄から指定した内容に対応する数値を取得
 * <aaa:100> # a.special('aaa')で[100]を返す。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc バトラーパラメータの動的設定プラグイン
 * @author トリアコンタン
 *
 * @param 最大HP計算式
 * @desc 最大HPを決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 最大MP計算式
 * @desc 最大MPを決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 攻撃力計算式
 * @desc 攻撃力を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 防御力計算式
 * @desc 防御力を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 魔法力計算式
 * @desc 魔法力を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 魔法防御計算式
 * @desc 魔法防御を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 敏捷性計算式
 * @desc 敏捷性を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @param 運計算式
 * @desc 運を決定する計算式です。メモ欄に指定があればそちらを優先します。
 * @default
 *
 * @help DynamicBattlerParameter.js
 *
 * バトラーの基本パラメータをバトラーの状態に応じて動的に変更します。
 * 設定にはJavaScript計算式を使用します。
 * 計算式は、メモ欄もしくはプラグインパラメータから取得します。
 * 特徴を有するデータベースのメモ欄に以下の通り指定してください。
 *
 * <DBP_攻撃力:[計算式]>   # 攻撃力に計算式を適用
 * <DBP_防御力:[計算式]>   # 防御力に計算式を適用
 * <DBP_魔法力:[計算式]>   # 魔法力に計算式を適用
 * <DBP_魔法防御:[計算式]> # 魔法防御に計算式を適用
 * <DBP_敏捷性:[計算式]>   # 敏捷性に計算式を適用
 * <DBP_運:[計算式]>       # 運に計算式を適用
 * <DBP_最大HP:[計算式]>   # 最大HPに計算式を適用
 * <DBP_最大MP:[計算式]>   # 最大MPに計算式を適用
 *
 * 計算式に使用できる要素は以下の通りです。
 * 各パラメータの値は本プラグインや装備品による変動を
 * 含まないバトラー本来のパラメータとなります。
 *
 * param # データベースで指定した元々の値
 * a.hp  # HP
 * a.mp  # MP
 * a.tp  # TP
 * a.mhp # 最大HP
 * a.mmp # 最大MP
 * a.atk # 攻撃力
 * a.def # 防御力
 * a.mat # 魔法力
 * a.mdf # 魔法防御
 * a.agi # 敏捷性
 * a.luk # 運
 * a.hpRate() # HPレート(0.0 - 1.0)
 * a.mpRate() # MPレート(0.0 - 1.0)
 * a.tpRate() # TPレート(0.0 - 1.0)
 * a.special('aaa') # メモ欄の[aaa]の値(※)
 * a.level        # レベル
 * a.actorId()    # アクターID
 * a._classId     # 職業ID
 * a.currentExp() # 経験値
 *
 * ※特徴を有するメモ欄から指定した内容に対応する数値を取得
 * <aaa:100> # a.special('aaa')で[100]を返す。
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
    var pluginName    = 'DynamicBattlerParam';
    var metaTagPrefix = 'DBP_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
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
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    var index = 0;
    param.formula = [];
    param.formula[index++] = getParamString(['FormulaMhp', '最大HP計算式']);
    param.formula[index++] = getParamString(['FormulaMmp', '最大MP計算式']);
    param.formula[index++] = getParamString(['FormulaAtk', '攻撃力計算式']);
    param.formula[index++] = getParamString(['FormulaDef', '防御力計算式']);
    param.formula[index++] = getParamString(['FormulaMat', '魔法力計算式']);
    param.formula[index++] = getParamString(['FormulaMdf', '魔法防御計算式']);
    param.formula[index++] = getParamString(['FormulaAgi', '敏捷性計算式']);
    param.formula[index++] = getParamString(['FormulaLuk', '運計算式']);

    //=============================================================================
    // Game_BattlerBase
    //  バトラーの基本パラメータの動的設定を追加します。
    //=============================================================================
    Game_BattlerBase._paramNames = [
        ['最大HP', 'Mhp'],
        ['最大MP', 'Mmp'],
        ['攻撃力', 'Atk'],
        ['防御力', 'Def'],
        ['魔法力', 'Mat'],
        ['魔法防御', 'Mdf'],
        ['敏捷性', 'Agi'],
        ['運', 'Luk']
    ];

    Game_BattlerBase.prototype.getFormulaParamBase = function(paramId) {
        var formula;
        this.traitObjects().some(function(traitObject) {
            formula = getMetaValues(traitObject, Game_BattlerBase._paramNames[paramId]);
            return !!formula;
        });
        if (!formula) {
            formula = param.formula[paramId];
        }
        return convertEscapeCharacters(formula);
    };

    Game_BattlerBase.prototype.paramBaseDynamic = function(paramId, param) {
        if (this._calcParameter) {
            return param;
        }
        this._calcParameter = true;
        var formula = this.getFormulaParamBase(paramId);
        var a = this;
        var dynamicParam = formula ? Math.round(eval(formula)) : param;
        this._calcParameter = false;
        return dynamicParam;
    };

    Game_BattlerBase.prototype.special = function(tagName) {
        var value = 0;
        this.traitObjects().forEach(function(traitObject) {
            value += getArgNumber(convertEscapeCharacters(traitObject.meta[tagName]));
        });
        return Math.round(value);
    };

    var _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    Game_BattlerBase.prototype.param = function(paramId) {
        if (this._calcParameter) {
            return this.paramBase(paramId);
        } else {
            return _Game_BattlerBase_param.apply(this, arguments);
        }
    };

    var _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        return this.paramBaseDynamic(paramId, _Game_Actor_paramBase.apply(this, arguments));
    };

    var _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        return this.paramBaseDynamic(paramId, _Game_Enemy_paramBase.apply(this, arguments));
    };
})();

