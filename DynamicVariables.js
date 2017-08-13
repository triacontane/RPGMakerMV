//=============================================================================
// DynamicVariables.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.3 2017/08/12 パラメータの型指定機能に対応
// 1.0.2 2016/11/04 指定範囲外のスイッチの値を正しく返していなかった問題を修正
// 1.0.1 2016/11/01 結果が空文字の場合に0が設定されないよう修正
// 1.0.0 2016/10/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DynamicVariablesPlugin
 * @author triacontane
 *
 * @param DynamicSwitchStart
 * @desc 動的スイッチの開始位置番号です。
 * @default 0
 * @type switch
 *
 * @param DynamicSwitchEnd
 * @desc 動的スイッチの終了位置番号です。
 * @default 0
 * @type switch
 *
 * @param DynamicVariableStart
 * @desc 動的変数の開始位置番号です。
 * @default 0
 * @type variable
 *
 * @param DynamicVariableEnd
 * @desc 動的変数の終了位置番号です。
 * @default 0
 * @type variable
 *
 * @param ValidException
 * @desc スクリプト実行時に例外処理を行います。不正なスクリプトで強制終了しなくなる代わりに実行速度が僅かに低下します。
 * @default false
 * @type boolean
 *
 * @help 指定範囲内の変数、スイッチを参照しようとした際に、
 * 「変数名称」及び「スイッチ名称」をJavaScriptとして評価した結果を返すようにします。
 * JavaScript中では式の簡略化のために以下のローカル変数が利用できます。
 *
 * v(n)      # [n]番の変数の値
 * s(n)      # [n]番のスイッチの値
 * max       # Math.maxに変換されます。(例 : max(1, 2) -> 2)
 * min       # Math.minに変換されます。(例 : min(1, 2) -> 1)
 * gPlayer   # $gamePlayerに変換されます。(例 : gPlayer.x -> プレイヤーX座標)
 * dSystem   # $dataSystemsに変換されます。(例：dSystem.startX -> 開始位置X座標)
 * ※ Math.max以外にも一般的なMathモジュールのメソッドが使用可能です。
 *    また、他のゲームオブジェクト、データオブジェクトも同じ記法で参照できます。
 *    いずれも利用には、多少のJavaScriptの知識が必要になります。
 *
 * 動的変数は、指定範囲内の変数およびスイッチを参照するすべての箇所(※)で有効です。
 * また、範囲内の変数及びスイッチに対する値の設定は無視されます。
 *
 * ※変数・スイッチを参照する例
 * 1. イベントページの決定処理
 * 2. 敵キャラの行動決定処理
 * 3. 条件分岐
 * 4. イベントコマンドの各種オペランド
 * 5. スキルやアイテムの計算式（ただしv[1]で参照した場合は除く）
 * 6. その他プラグインによる参照
 *
 * スクリプト中でさらに動的変数およびスイッチを参照することもできますが
 * 同じ番号の変数 or スイッチを参照しようとすると循環参照となりエラーが発生します。
 *
 * ・設定例1
 * イベントページの「スイッチ」に「名称」が以下のものを設定する。
 * v(1) > 0 || s(1) # 変数[1]が[0]より大きい、もしくはスイッチ[1]がON
 * 以上の条件を満たした場合に対象ページが表示される。
 *
 * ・設定例2
 * イベントページの「スイッチ」に「名称」が以下のものを設定する。
 * v(1) < v(2) && !s(2) # 変数[1]が変数[2]より小さい、かつスイッチ[2]がOFF
 * 以上の条件を満たした場合に対象ページが表示される。
 *
 * ・設定例3
 * イベントページの「スイッチ」に「名称」が以下のものを設定する。
 * gPlayer.x % 2 === 0 # プレイヤーのX座標が偶数
 * 以上の条件を満たした場合に対象ページが表示される。
 *
 * ・使用上の注意
 * 通常、イベントのページを決定する処理は、いずれかのスイッチもしくは変数が
 * 変更されたときにのみ実行されます。本プラグインでは、パフォーマンス上の理由から
 * その仕様を維持します。
 * もし、指定している条件がスイッチおよび変数と完全に無関係な場合(設定例3のケース等)
 * イベントのメモ欄に以下の通り入力すると、そのイベントのみ
 * 常にページの条件チェックを行うように変更できます。
 *
 * <DV常時リフレッシュ>
 * <DVAlwaysRefresh>
 *
 * （参考）基本的なJavaScript演算子
 * ・四則演算    : + - * /
 * ・論理和(Or)  : ||
 * ・論理積(And) : &&
 * ・否定(Not)   : !
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 動的変数プラグイン
 * @author トリアコンタン
 *
 * @param 動的スイッチ開始位置
 * @desc 動的スイッチの開始位置番号です。
 * @default 0
 * @type switch
 *
 * @param 動的スイッチ終了位置
 * @desc 動的スイッチの終了位置番号です。
 * @default 0
 * @type switch
 *
 * @param 動的変数開始位置
 * @desc 動的変数の開始位置番号です。
 * @default 0
 * @type variable
 *
 * @param 動的変数終了位置
 * @desc 動的変数の終了位置番号です。
 * @default 0
 * @type variable
 *
 * @param 例外処理
 * @desc スクリプト実行時に例外処理を行います。不正なスクリプトで強制終了しなくなる代わりに実行速度が僅かに低下します。
 * @default false
 * @type boolean
 *
 * @help 指定範囲内の変数、スイッチを参照しようとした際に、
 * 「変数名称」及び「スイッチ名称」をJavaScriptとして実行した結果を返すよう
 * 変更します。JavaScript中では式の簡略化のために以下のローカル変数が利用できます。
 *
 * v(n)      # [n]番の変数の値
 * s(n)      # [n]番のスイッチの値
 * max       # Math.maxに変換されます。(例 : max(1, 2) -> 2)
 * min       # Math.minに変換されます。(例 : min(1, 2) -> 1)
 * gPlayer   # $gamePlayerに変換されます。(例 : gPlayer.x -> プレイヤーX座標)
 * dSystem   # $dataSystemsに変換されます。(例：dSystem.startX -> 開始位置X座標)
 * ※ Math.max以外にも一般的なMathモジュールのメソッドが使用可能です。
 *    また、他のゲームオブジェクト、データオブジェクトも同じ記法で参照できます。
 *    いずれも利用には、多少のJavaScriptの知識が必要になります。
 *
 * 動的変数は、指定範囲内の変数およびスイッチを参照するすべての箇所(※)で有効です。
 * また、範囲内の変数及びスイッチに対する値の設定は無視されます。
 *
 * ※変数・スイッチを参照する例
 * 1. イベントページの決定処理
 * 2. 敵キャラの行動決定処理
 * 3. 条件分岐
 * 4. イベントコマンドの各種オペランド
 * 5. スキルやアイテムの計算式（ただしv[1]で参照した場合は除く）
 * 6. その他プラグインによる参照
 *
 * スクリプト中でさらに動的変数およびスイッチを参照することもできますが
 * 同じ番号の変数 or スイッチを参照しようとすると循環参照となりエラーが発生します。
 *
 * ・設定例1
 * イベントページの「スイッチ」に「名称」が以下のものを設定する。
 * v(1) > 0 || s(1) # 変数[1]が[0]より大きい、もしくはスイッチ[1]がON
 * 以上の条件を満たした場合に対象ページが表示される。
 *
 * ・設定例2
 * イベントページの「スイッチ」に「名称」が以下のものを設定する。
 * v(1) < v(2) && !s(2) # 変数[1]が変数[2]より小さい、かつスイッチ[2]がOFF
 * 以上の条件を満たした場合に対象ページが表示される。
 *
 * ・設定例3
 * イベントページの「スイッチ」に「名称」が以下のものを設定する。
 * gPlayer.x % 2 === 0 # プレイヤーのX座標が偶数
 * 以上の条件を満たした場合に対象ページが表示される。
 *
 * ・使用上の注意
 * 通常、イベントのページを決定する処理は、いずれかのスイッチもしくは変数が
 * 変更されたときにのみ実行されます。本プラグインでは、パフォーマンス上の理由から
 * その仕様を維持します。
 * もし、指定している条件がスイッチおよび変数と完全に無関係な場合
 * (設定例3のケース等)イベントのメモ欄に以下の通り入力すると、そのイベントのみ
 * 常にページの条件チェックを行うように変更できます。
 *
 * <DV常時リフレッシュ>
 * <DVAlwaysRefresh>
 *
 * （参考）基本的なJavaScript演算子
 * ・四則演算    : + - * /
 * ・論理和(Or)  : ||
 * ・論理積(And) : &&
 * ・否定(Not)   : !
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
    var pluginName = 'DynamicVariables';
    var metaTagPrefix = 'DV';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDynamicSwitchStart   = getParamNumber(['DynamicSwitchStart', '動的スイッチ開始位置'], 0);
    var paramDynamicSwitchEnd     = getParamNumber(['DynamicSwitchEnd', '動的スイッチ終了位置'], 0);
    var paramDynamicVariableStart = getParamNumber(['DynamicVariableStart', '動的変数開始位置'], 0);
    var paramDynamicVariableEnd   = getParamNumber(['DynamicVariableEnd', '動的変数終了位置'], 0);
    var paramValidException       = getParamBoolean(['ValidException', '例外処理']);

    //=============================================================================
    // Game_Variables
    //  動的変数の取得処理を追加定義します。
    //=============================================================================
    var _Game_Variables_value      = Game_Variables.prototype.value;
    Game_Variables.prototype.value = function(variableId) {
        if (variableId >= paramDynamicVariableStart && variableId <= paramDynamicVariableEnd) {
            return this.getDynamicValue($dataSystem.variables[variableId]);
        } else {
            return _Game_Variables_value.apply(this, arguments);
        }
    };

    Game_Variables.prototype.getDynamicValue = function(dynamicScript) {
        var v   = $gameVariables.value.bind($gameVariables), s = $gameSwitches.value.bind($gameSwitches);
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
        if (paramValidException) {
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
        if (switchId >= paramDynamicSwitchStart && switchId <= paramDynamicSwitchEnd) {
            return !!this.getDynamicValue($dataSystem.switches[switchId]);
        } else {
            return _Game_Switches_value.apply(this, arguments);
        }
    };

    Game_Switches.prototype.getDynamicValue = Game_Variables.prototype.getDynamicValue;

    //=============================================================================
    // Game_Event
    //  必要な場合、イベントページを毎フレームリフレッシュします。
    //=============================================================================
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._needsAlwaysRefresh = this.isNeedAlwaysRefresh();
    };

    Game_Event.prototype.isNeedAlwaysRefresh = function() {
        return getMetaValues(this.event(), ['AlwaysRefresh', '常時リフレッシュ']);
    };

    var _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        if (this._needsAlwaysRefresh) {
            this.refresh();
        }
        _Game_Event_update.apply(this, arguments);
    };
})();

