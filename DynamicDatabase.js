//=============================================================================
// DynamicDatabase.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/01/03 iterateとisEmptyが重複定義されないよう対応
// 1.0.0 2015/12/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 動的データベース構築プラグイン
 * @author トリアコンタン
 *
 * @help データベースの各項目を動的な値に変更するプラグインです。
 * 変数やJavaScriptの関数を使ってより高度なデータベースを構築できます。
 *
 * 注意！　データベースファイルを保存、更新するプラグインと併用しないでください。
 *
 * 文字列項目：各項目に直接入力した制御文字が利用できます。
 * 数値項目：メモ欄に入力した制御文字＋JavaScript計算式が利用できます。
 * 選択項目：メモ欄に入力した制御文字＋JavaScript計算式が利用できます。
 * 　　　　　※一番上の選択肢が 0 になります。
 *
 * 数値、選択項目の場合、メモ欄に以下の通り指定してください。
 * 　<DD（項目名）:（計算式）>
 *
 * 設定例１（アイテムの価格に10番の変数の2倍の値を設定したい場合）
 * 　<DD価格:\V[10] * 2>
 *
 * 設定例２（武器の攻撃力に、元の値と10番の変数の値との乗算値を設定したい場合）
 * 　<DD攻撃力:元の値 * \V[10]>
 *
 * 対象データベースは以下の全項目になります。
 * 　スキル
 * 　アイテム
 * 　武器
 * 　防具
 * 　敵キャラ
 * 　ステート　
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

    //=============================================================================
    // Object
    //  プロパティの定義
    //=============================================================================
    if (!Object.prototype.hasOwnProperty('iterate')) {
        Object.defineProperty(Object.prototype, 'iterate', {
            value : function (handler) {
                Object.keys(this).forEach(function (key, index) {
                    handler.call(this, key, this[key], index);
                }, this);
            }
        });
    }

    if (!Object.prototype.hasOwnProperty('isEmpty')) {
        Object.defineProperty(Object.prototype, 'isEmpty', {
            value : function () {
                return Object.keys(this).length <= 0;
            }
        });
    }

    Number.prototype.times = function(handler) {
        var i = 0; while(i < this) handler.call(this, i++);
    };

    //=============================================================================
    // Scene_Boot
    //  ダイナミックデータベースの構築開始
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        DynamicDatabaseManager.makeDynamicDatabase();
    };
})();

//=============================================================================
// DynamicDatabaseManager
//  ダイナミックデータベースの構築処理を定義します。
//=============================================================================
function DynamicDatabaseManager() {
    throw new Error('This is a static class');
}

DynamicDatabaseManager._columnMapper = null;
DynamicDatabaseManager._targetData = null;

DynamicDatabaseManager._columnMapperCoomon = {
    animationId : 'アニメーション',
    hitType : '命中タイプ',
    iconIndex : 'アイコン',
    occasion : '使用可能時',
    repeats : '連続回数',
    scope:'範囲',
    speed:'速度補正',
    successRate:'成功率',
    tpCost:'消費TP',
    tpGain:'得TP',
    mpCost:'消費MP',
    damage_elementId:'属性',
    damage_type:'タイプ',
    damage_variance:'分散度',
    price:'価格',
    params_0:'最大HP',
    params_1:'最大MP',
    params_2:'攻撃力',
    params_3:'防御力',
    params_4:'魔法力',
    params_5:'魔法防御',
    params_6:'敏捷性',
    params_7:'運'
};

DynamicDatabaseManager._columnMapperSkills = {
    stypeId:'スキルタイプ',
    requiredWtypeId1:'武器タイプ1',
    requiredWtypeId2:'武器タイプ2'
};

DynamicDatabaseManager._columnMapperItems = {
    itypeId:'アイテムタイプ',
    consumable:'消耗'
};

DynamicDatabaseManager._columnMapperWeapons = {
    wtypeId:'武器タイプ'
};

DynamicDatabaseManager._columnMapperArmors = {
    atypeId:'防具タイプ',
    etypeId:'装備タイプ'
};

DynamicDatabaseManager._columnMapperEnemies = {
    battlerHue : '色相',
    exp : '経験値',
    gold : '所持金'
};

DynamicDatabaseManager._columnMapperStates = {
    autoRemovalTiming:'自動解除のタイミング',
    chanceByDamage:'ダメージで解除_ダメージ',
    maxTurns:'継続ターン数_最大',
    minTurns:'継続ターン数_最小',
    motion:'[SV] モーション',
    overlay:'[SV] 重ね合わせ',
    priority: '優先度',
    removeAtBattleEnd:'戦闘終了時に解除',
    removeByDamage: 'ダメージで解除',
    removeByRestriction: '行動制約で解除',
    removeByWalking: '歩数で解除',
    restriction: '行動制約',
    stepsToRemove: '歩数で解除_歩数'
};

DynamicDatabaseManager._targetDynamicDatabase = {
    $dataSkills : DynamicDatabaseManager._columnMapperSkills,
    $dataItems : DynamicDatabaseManager._columnMapperItems,
    $dataWeapons : DynamicDatabaseManager._columnMapperWeapons,
    $dataArmors : DynamicDatabaseManager._columnMapperArmors,
    $dataEnemies : DynamicDatabaseManager._columnMapperEnemies,
    $dataStates : DynamicDatabaseManager._columnMapperStates
};

DynamicDatabaseManager.makeDynamicDatabase = function() {
    this._setColumnMapperDynamic();
    this._targetDynamicDatabase.iterate(function(dataKey, columnMap) {
        this._makeDynamicData(window[dataKey], columnMap);
    }.bind(this));
};

DynamicDatabaseManager._setColumnMapperDynamic = function() {
    this._getMaxLength('effects').times(function(i) {
        this._columnMapperCoomon['effects_%1_code'.format(i)]   = '使用効果%1_タイプ'.format(i + 1);
        this._columnMapperCoomon['effects_%1_value1'.format(i)] = '使用効果%1_内容1'.format(i + 1);
        this._columnMapperCoomon['effects_%1_value2'.format(i)] = '使用効果%1_内容2'.format(i + 1);
    }.bind(this));
    this._getMaxLength('traits').times(function(i) {
        this._columnMapperCoomon['traits_%1_code'.format(i)]  = '特徴%1_タイプ'.format(i + 1);
        this._columnMapperCoomon['traits_%1_value'.format(i)] = '特徴%1_内容'.format(i + 1);
    }.bind(this));
    this._getMaxLength('actions').times(function(i) {
        this._columnMapperEnemies['actions_%1_conditionParam1'.format(i)] = '行動%1_条件1'.format(i + 1);
        this._columnMapperEnemies['actions_%1_conditionParam2'.format(i)] = '行動%1_条件2'.format(i + 1);
        this._columnMapperEnemies['actions_%1_conditionType'.format(i)]   = '行動%1_条件タイプ'.format(i + 1);
        this._columnMapperEnemies['actions_%1_rating'.format(i)]          = '行動%1_R'.format(i + 1);
        this._columnMapperEnemies['actions_%1_skillId'.format(i)]         = '行動%1_スキル'.format(i + 1);
    }.bind(this));
    Number(3).times(function(i) {
        this._columnMapperEnemies['dropItems_%1_denominator'.format(i)] = 'ドロップアイテム%1_ドロップアイテム'.format(i + 1);
        this._columnMapperEnemies['dropItems_%1_kind'.format(i)]        = 'ドロップアイテム%1_出現率'.format(i + 1);
    }.bind(this));
};

DynamicDatabaseManager._getMaxLength = function(keyName) {
    var length = 0;
    this._targetDynamicDatabase.iterate(function(dataKey) {
        var dataArray = window[dataKey];
        dataArray.forEach(function(data) {
            if (data != null && data.hasOwnProperty(keyName)) length = Math.max(data[keyName].length, length);
        });
    });
    return length;
};

DynamicDatabaseManager._makeDynamicData = function(dataArray, columnMap) {
    this._columnMapper = columnMap;
    dataArray.forEach(function(data) {
        if (data != null) {
            this._targetData = data;
            data.iterate(function(key, value) {this._makeProperty(data, key, key, value)}.bind(this));
        }
    }.bind(this));
};

DynamicDatabaseManager._makeProperty = function(parent, keyPath, key, child) {
    if (key === 'meta') return;
    switch (typeof child) {
        case 'string':
            if (child.match(/\\/g))
                this._makePropertyString(parent, key, child);
            break;
        case 'boolean':
        case 'number':
            if (parent.meta.isEmpty()) return;
            var propName = this._columnMapper[keyPath] || this._columnMapperCoomon[keyPath];
            var metaTag = 'DD' + propName;
            if (propName != null && parent.meta[metaTag] != null)
                this._makePropertyFormula(parent, key, child, metaTag);
            parent[propName] = child;
            break;
        case 'object':
            if (parent.meta.isEmpty()) return;
            child.meta = parent.meta;
            child.iterate(function(valuesKey, valuesItem) {
                this._makeProperty(child, keyPath + '_' + valuesKey, valuesKey, valuesItem);
            }.bind(this));
            break;
    }
};

DynamicDatabaseManager._makePropertyFormula = function(parent, key, child, metaTag) {
    var data = this._targetData, データ = this._targetData;
    Object.defineProperty(parent, key, {
        get: function() {
            try {
                var prev = child, 元の値 = child;
                var result = eval(DynamicDatabaseManager._convertEscapeCharacters(this.meta[metaTag]));
                return typeof child === 'number' ? DynamicDatabaseManager._parseIntStrict(result) : result == true;
            } catch (e) {
                return DynamicDatabaseManager._processEvalException(e, this.meta[metaTag]);
            }
        },
        configurable: false
    });
};

DynamicDatabaseManager._makePropertyString = function(parent, key, child) {
    Object.defineProperty(parent, key, {
        get: function() {
            return DynamicDatabaseManager._convertEscapeCharacters(child);
        },
        configurable: false
    });
};

DynamicDatabaseManager._convertEscapeCharacters = function(text) {
    if (text == null) text = '';
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1], 10));
    });
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1], 10));
    });
    text = text.replace(/\x1bS\[(\d+)\]/gi, function() {
        return $gameSwitches.value(parseInt(arguments[1], 10)) ? '1' : '0';
    });
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        var n = parseInt(arguments[1]);
        var actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : '';
    });
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        var n = parseInt(arguments[1]);
        var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : '';
    });
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

DynamicDatabaseManager._parseIntStrict = function(value, errorMessage) {
    var result = parseInt(value, 10);
    if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
    return result;
};

DynamicDatabaseManager._processEvalException = function(e, formula) {
    if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
        var window = require('nw.gui').Window.get();
        if (!window.isDevToolsOpen()) {
            var devTool = window.showDevTools();
            devTool.moveTo(0, 0);
            devTool.resizeTo(Graphics.width, Graphics.height);
            window.focus();
        }
    }
    console.log('計算式の評価中にエラーが発生しました。強制的に 0 が返却されます。');
    console.log('- 計算式     : ' + formula);
    console.log('- エラー原因 : ' + e.toString());
    return 0;
};
