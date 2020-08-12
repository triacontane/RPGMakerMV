//=============================================================================
// BattleBgmContinue.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2019/10/06 プラグインの機能を無効化するスイッチを追加
// 1.0.0 2016/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘BGM継続演奏プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @param disableSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONになっているとき、プラグインの機能が無効化されます。
 * @default 0
 * @type switch
 *
 * @help 戦闘BGMを演奏する際に、前回と同じ戦闘BGMであれば、
 * 前回演奏の終了時から演奏を再開します。
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

    var param = createPluginParameter('BattleBgmContinue');

    var _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function() {
        var pos = 0;
        if (this.isContinueBgm()) {
            pos = this._lastBattleBgm.pos;
        }
        AudioManager.playBgm($gameSystem.battleBgm(), pos);
        _BattleManager_playBattleBgm.apply(this, arguments);
    };

    BattleManager.isContinueBgm = function() {
        var bgm = $gameSystem.battleBgm();
        return this._lastBattleBgm &&
            !this.isDisableSwitchContinueBgm() &&
            this._lastBattleBgm.name === bgm.name &&
            this._lastBattleBgm.pitch === bgm.pitch;
    };

    BattleManager.isDisableSwitchContinueBgm = function() {
        return param.disableSwitch && $gameSwitches.value(param.disableSwitch);
    };

    var _BattleManager_replayBgmAndBgs = BattleManager.replayBgmAndBgs;
    BattleManager.replayBgmAndBgs = function() {
        this.saveBattleBgm();
        _BattleManager_replayBgmAndBgs.apply(this, arguments);
    };

    BattleManager.saveBattleBgm = function() {
        this._lastBattleBgm = AudioManager.saveBgm();
    };
})();

