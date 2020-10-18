//=============================================================================
// DynamicVariables.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2020/10/18 リファクタリングとヘルプの整理
// 1.1.1 2018/09/27 テストプレー時はパラメータ「例外処理」の値に関係なくスクリプトエラーで異常終了しないよう修正
// 1.1.0 2018/08/19 イベントページの出現条件および敵キャラの行動パターンで各オブジェクトおよびデータを参照できる機能を追加
// 1.0.5 2018/01/27 1.0.4の更新でもともと入っていた値の取得方法をvalueに変更
// 1.0.4 2018/01/15 実行時に対象スイッチIDおよび代入されているもとの値を参照できる機能を追加
// 1.0.3 2017/08/12 パラメータの型指定機能に対応
// 1.0.2 2016/11/04 指定範囲外のスイッチの値を正しく返していなかった問題を修正
// 1.0.1 2016/11/01 結果が空文字の場合に0が設定されないよう修正
// 1.0.0 2016/10/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DynamicVariablesPlugin
 * @author triacontane
 *
 * @param DynamicSwitchStart
 * @desc The start position number of the dynamic switch.
 * @default 0
 * @type switch
 *
 * @param DynamicSwitchEnd
 * @desc The end position number of the dynamic switch.
 * @default 0
 * @type switch
 *
 * @param DynamicVariableStart
 * @desc The start position number of the dynamic variable.
 * @default 0
 * @type variable
 *
 * @param DynamicVariableEnd
 * @desc The end position number of the dynamic variable.
 * @default 0
 * @type variable
 *
 * @param ValidException
 * @desc Handles exceptions during script execution.
 * @default false
 * @type boolean
 *
 * @help When a variable or switch in the specified range is referenced
 * Returns the result of evaluating "variable name" and "switch name" as a script.
 * The following local variables can be used in the script
 *
 * id # ID of the switch or variable to be processed
 * value # the value that was originally in the switch or variable ID to be processed
 *
 * Dynamic variables are valid in all places (*) that refer to variables and switches.
 *
 * Examples of referring to variables and switches
 * 1. decision processing of the event page
 * 2. enemy character action decision processing
 * 3. conditional branching
 * 4. various operands of event commands.
 * 5. Other plug-in references
 *
 * You can also reference additional dynamic variables and switches in your scripts, but you can also use the
 * If you try to reference the variable (switch) with the same number, a circular reference occurs and an error occurs.
 *
 * If you try to refer to a variable (switch) with the same number, it will be a circular reference and an error will occur.
 * Normally, the process of determining the page of events is done when one of the switches or variables is
 * It only runs when it is changed.
 * The plugin retains that specification for performance reasons.
 * If you enter the following in the event memo field, only that event will be executed when
 * You can change it to always check the page conditions.
 *
 * <DVAlwaysRefresh>
 *
 * There are no plug-in commands in this plugin.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 動的変数プラグイン
 * @author トリアコンタン
 *
 * @param DynamicSwitchStart
 * @text 動的スイッチ開始位置
 * @desc 動的スイッチの開始位置番号です。
 * @default 0
 * @type switch
 *
 * @param DynamicSwitchEnd
 * @text 動的スイッチ終了位置
 * @desc 動的スイッチの終了位置番号です。
 * @default 0
 * @type switch
 *
 * @param DynamicVariableStart
 * @text 動的変数開始位置
 * @desc 動的変数の開始位置番号です。
 * @default 0
 * @type variable
 *
 * @param DynamicVariableEnd
 * @text 動的変数終了位置
 * @desc 動的変数の終了位置番号です。
 * @default 0
 * @type variable
 *
 * @param ValidException
 * @text 例外処理
 * @desc スクリプト実行時に例外処理を行います。不正なスクリプトで強制終了しなくなる代わりに実行速度が僅かに低下します。
 * @default false
 * @type boolean
 *
 * @help 指定範囲内の変数、スイッチを参照したとき
 * 「変数名称」及び「スイッチ名称」をスクリプトとして評価した結果を返します。
 * スクリプト中では以下のローカル変数が利用できます。
 *
 * id    # 処理対象のスイッチ、変数ID
 * value # 処理対象のスイッチ、変数IDにもともと入っていた値
 *
 * イベントページの出現条件でスイッチを参照する場合、追加で以下の変数が使えます。
 * e     # イベントオブジェクトへの参照
 * d     # イベントデータへの参照
 *
 * 敵キャラの行動パターンでスイッチを参照する場合、追加で以下の変数が使えます。
 * e     # 敵キャラオブジェクトへの参照
 * d     # 敵キャラデータへの参照
 *
 * 動的変数は、変数およびスイッチを参照するすべての箇所(※)で有効です。
 *
 * ※ 変数・スイッチを参照する例
 * 1. イベントページの決定処理
 * 2. 敵キャラの行動決定処理
 * 3. 条件分岐
 * 4. イベントコマンドの各種オペランド
 * 5. その他プラグインによる参照
 *
 * スクリプト中でさらに動的変数およびスイッチを参照することもできますが
 * 同じ番号の変数(スイッチ)を参照しようとすると循環参照となりエラーが発生します。
 *
 * ・使用上の注意
 * 通常、イベントのページを決定する処理は、いずれかのスイッチもしくは変数が
 * 変更されたときにのみ実行されます。
 * 本プラグインでは、パフォーマンス上の理由からその仕様を維持します。
 * イベントのメモ欄に以下の通り入力すると、そのイベントのみ
 * 常にページの条件チェックを行うように変更できます。
 *
 * <DV常時リフレッシュ>
 * <DVAlwaysRefresh>
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
    var metaTagPrefix = 'DV';

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

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('DynamicVariables');

    // eval参照用
    var e = null;
    var d = null;
    var max = Math.max, min = Math.min, abs = Math.abs, floor = Math.floor, pow = Math.pow, random = Math.random;
    var dActors       = $dataActors;
    var dClasses      = $dataClasses;
    var dSkills       = $dataSkills;
    var dItems        = $dataItems;
    var dWeapons      = $dataWeapons;
    var dArmors       = $dataArmors;
    var dEnemies      = $dataEnemies;
    var dTroops       = $dataTroops;
    var dStates       = $dataStates;
    var dAnimations   = $dataAnimations;
    var dTilesets     = $dataTilesets;
    var dCommonEvents = $dataCommonEvents;
    var dSystem       = $dataSystem;
    var dMapInfos     = $dataMapInfos;
    var dMap          = $dataMap;
    var gTemp         = $gameTemp;
    var gSystem       = $gameSystem;
    var gScreen       = $gameScreen;
    var gTimer        = $gameTimer;
    var gMessage      = $gameMessage;
    var gSwitches     = $gameSwitches;
    var gActors       = $gameActors;
    var gParty        = $gameParty;
    var gTroop        = $gameTroop;
    var gMap          = $gameMap;
    var gPlayer       = $gamePlayer;

    //=============================================================================
    // Game_Variables
    //  動的変数の取得処理を追加定義します。
    //=============================================================================
    var _Game_Variables_value      = Game_Variables.prototype.value;
    Game_Variables.prototype.value = function(variableId) {
        var value = _Game_Variables_value.apply(this, arguments);
        if (variableId >= param.DynamicVariableStart && variableId <= param.DynamicVariableEnd) {
            return this.getDynamicValue($dataSystem.variables[variableId], variableId, value);
        } else {
            return value;
        }
    };

    Game_Variables.prototype.getOriginalValue = function(variableId) {
        return _Game_Variables_value.apply(this, arguments);
    };

    Game_Variables.prototype.getDynamicValue = function(dynamicScript, id, value) {
        if (!dynamicScript) {
            return value;
        }
        var v = $gameVariables.value.bind($gameVariables);
        var s = $gameSwitches.value.bind($gameSwitches);
        if (param.ValidException || $gameTemp.isPlaytest()) {
            try {
                return eval(dynamicScript);
            } catch (e) {
                console.error(e.message);
                return 0;
            }
        } else {
            return eval(dynamicScript);
        }
    };

    //=============================================================================
    // Game_Switches
    //  動的スイッチの取得処理を追加定義します。
    //=============================================================================
    var _Game_Switches_value      = Game_Switches.prototype.value;
    Game_Switches.prototype.value = function(switchId) {
        var value = _Game_Switches_value.apply(this, arguments);
        if (switchId >= param.DynamicSwitchStart && switchId <= param.DynamicSwitchEnd) {
            return !!this.getDynamicValue($dataSystem.switches[switchId], switchId, value);
        } else {
            return value;
        }
    };

    Game_Switches.prototype.getOriginalValue = function(switchId) {
        return _Game_Switches_value.apply(this, arguments);
    };

    Game_Switches.prototype.getDynamicValue = Game_Variables.prototype.getDynamicValue;

    //=============================================================================
    // Game_Event
    //  必要な場合、イベントページを毎フレームリフレッシュします。
    //=============================================================================
    var _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._needsAlwaysRefresh = this.isNeedAlwaysRefresh();
    };

    Game_Event.prototype.isNeedAlwaysRefresh = function() {
        return getMetaValues(this.event(), ['AlwaysRefresh', '常時リフレッシュ']);
    };

    var _Game_Event_update      = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        if (this._needsAlwaysRefresh) {
            this.refresh();
        }
        _Game_Event_update.apply(this, arguments);
    };

    var _Game_Event_meetsConditions      = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function(page) {
        e          = this;
        d          = this.event();
        var result = _Game_Event_meetsConditions.apply(this, arguments);
        e          = null;
        d          = null;
        return result;
    };

    /**
     * Game_Enemy
     * 敵キャラ情報をスクリプト実行用に記憶します。
     */
    var _Game_Enemy_meetsSwitchCondition      = Game_Enemy.prototype.meetsSwitchCondition;
    Game_Enemy.prototype.meetsSwitchCondition = function(param) {
        e          = this;
        d          = this.enemy();
        var result = _Game_Enemy_meetsSwitchCondition.apply(this, arguments);
        e          = null;
        d          = null;
        return result;
    };
})();

