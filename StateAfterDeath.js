/*=============================================================================
 StateAfterDeath.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2018/08/12 継続ステートが戦闘不能後にターン数で解除されなくなっていた問題を修正
 1.0.0 2018/08/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc StateAfterDeathPlugin
 * @author triacontane
 *
 * @param states
 * @desc 戦闘不能後も継続するステートの配列の一覧です。
 * @type state[]
 * @default []
 *
 * @help StateAfterDeath.js
 *
 * 戦闘不能後も解除されず継続するステートを作成できます。
 * パラメータから対象となるステートを指定してください。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘不能後継続ステートプラグイン
 * @author トリアコンタン
 *
 * @param states
 * @text 対象ステート
 * @desc 戦闘不能後も継続するステートの配列の一覧です。
 * @type state[]
 * @default []
 *
 * @help StateAfterDeath.js
 *
 * 戦闘不能後も解除されず継続するステートを作成できます。
 * パラメータから対象となるステートを指定してください。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
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

    var param = createPluginParameter('StateAfterDeath');
    if (!param.states) {
        param.states = [];
    }

    var _Game_BattlerBase_die      = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        var stillStates     = this._states.filter(function(stateId) {
            return param.states.contains(stateId);
        });
        var stillStateTurns = {};
        stillStates.forEach(function(stateId) {
            stillStateTurns[stateId] = this._stateTurns[stateId];
        }, this);
        _Game_BattlerBase_die.apply(this, arguments);
        this._states     = this._states.concat(stillStates);
        this._stateTurns = stillStateTurns;
    };
})();
