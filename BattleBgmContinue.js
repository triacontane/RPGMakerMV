//=============================================================================
// BattleBgmContinue.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘BGM継続演奏プラグイン
 * @author トリアコンタン
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

    var _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function() {
        var pos = 0;
        var bgm = $gameSystem.battleBgm();
        if (this._lastBattleBgm && this._lastBattleBgm.name === bgm.name && this._lastBattleBgm.pitch === bgm.pitch) {
            pos = this._lastBattleBgm.pos;
        }
        AudioManager.playBgm($gameSystem.battleBgm(), pos);
        _BattleManager_playBattleBgm.apply(this, arguments);
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

