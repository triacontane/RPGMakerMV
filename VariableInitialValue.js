/*=============================================================================
 VariableInitialValue.js
----------------------------------------------------------------------------
 (C)2026 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2026/06/15 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ゲーム変数初期値設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableInitialValue.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param variableList
 * @text 変数初期値リスト
 * @desc ゲーム開始時に設定するゲーム変数の初期値リストです。
 * @default []
 * @type struct<VariableInitial>[]
 *
 * @help VariableInitialValue.js
 *
 * ゲーム変数に初期値を設定できるプラグインです。
 * プラグインパラメータで指定した変数IDと値のリストを基に、
 * ゲーム開始時（ニューゲーム）に自動でゲーム変数へ値を設定します。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~VariableInitial:
 * @param variableId
 * @text 変数ID
 * @desc 初期値を設定するゲーム変数のIDです。
 * @default 1
 * @type variable
 *
 * @param value
 * @text 初期値
 * @desc ゲーム開始時に設定する初期値です。
 * @default 0
 * @type number
 * @min -9999999
 * @max 9999999
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        this.applyVariableInitialValues();
    };

    DataManager.applyVariableInitialValues = function() {
        if (!param.variableList || param.variableList.length === 0) {
            return;
        }
        for (const entry of param.variableList) {
            if (entry.variableId > 0) {
                $gameVariables.setValue(entry.variableId, entry.value);
            }
        }
    };
})();


