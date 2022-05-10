/*=============================================================================
 StateAfterDeath.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2022/05/10 全回復実行時もステートが解除されない設定を追加
 1.2.1 2021/09/16 戦闘不能後継続ステートをすでに戦闘不能のバトラーに付与したときにも付与できるよう修正
 1.2.0 2021/08/25 対象ステートを範囲指定できるパラメータを追加
 1.1.0 2021/05/28 MZ用にリファクタリング
 1.0.1 2018/08/12 継続ステートが戦闘不能後にターン数で解除されなくなっていた問題を修正
 1.0.0 2018/08/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc StateAfterDeathPlugin
 * @target MZ 
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateAfterDeath.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author triacontane
 *
 * @param states
 * @desc 戦闘不能後も継続するステートの配列の一覧です。
 * @type state[]
 * @default []
 *
 * @param stateIdStart
 * @text 対象ステート(範囲設定開始)
 * @desc 戦闘不能後も継続するステートを範囲指定したい場合の開始IDです。
 * @type state
 * @default 0
 *
 * @param stateIdEnd
 * @text 対象ステート(範囲設定終了)
 * @desc 戦闘不能後も継続するステートを範囲指定したい場合の終了IDです。
 * @type state
 * @default 0
 *
 * @param considerRecoverAll
 * @text 全回復を考慮
 * @desc 戦闘不能だけでなく全回復をした場合もステートが解除されず、永続的に付与されるようになります。
 * @type boolean
 * @default false
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
 * @target MZ 
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateAfterDeath.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param states
 * @text 対象ステート
 * @desc 戦闘不能後も継続するステートの配列の一覧です。
 * @type state[]
 * @default []
 *
 * @param stateIdStart
 * @text 対象ステート(範囲設定開始)
 * @desc 戦闘不能後も継続するステートを範囲指定したい場合の開始IDです。
 * @type state
 * @default 0
 *
 * @param stateIdEnd
 * @text 対象ステート(範囲設定終了)
 * @desc 戦闘不能後も継続するステートを範囲指定したい場合の終了IDです。
 * @type state
 * @default 0
 *
 * @param considerRecoverAll
 * @text 全回復を考慮
 * @desc 戦闘不能だけでなく全回復をした場合もステートが解除されず、永続的に付与されるようになります。
 * @type boolean
 * @default false
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.states) {
        param.states = [];
    }

    const _Game_BattlerBase_clearStates      = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        if (!this._states) {
            _Game_BattlerBase_clearStates.apply(this, arguments);
            return;
        }
        const deathStates = this.findStateAfterDeath();
        const stillStates = this._states.filter(stateId => deathStates.includes(stateId));
        const stillStateTurns = {};
        stillStates.forEach(stateId => stillStateTurns[stateId] = this._stateTurns[stateId]);
        _Game_BattlerBase_clearStates.apply(this, arguments);
        if (!param.considerRecoverAll && this.hp > 0) {
            return;
        }
        this._states     = this._states.concat(stillStates);
        this._stateTurns = stillStateTurns;
    };

    Game_BattlerBase.prototype.findStateAfterDeath = function() {
        const deathStates = param.states.clone();
        for (let id = param.stateIdStart; id <= param.stateIdEnd; id++) {
            deathStates.push(id);
        }
        return deathStates;
    };

    const _Game_BattlerBase_isAlive = Game_BattlerBase.prototype.isAlive;
    Game_BattlerBase.prototype.isAlive = function() {
        const result = _Game_BattlerBase_isAlive.apply(this, arguments);
        return this._ignoreDeath ? true : result;
    };

    const _Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;
    Game_Battler.prototype.isStateAddable = function(stateId) {
        const deathStates = this.findStateAfterDeath();
        if (deathStates.includes(stateId)) {
            this._ignoreDeath = true;
        }
        const result = _Game_Battler_isStateAddable.apply(this, arguments);
        this._ignoreDeath = false;
        return result;
    };
})();
