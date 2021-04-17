/*=============================================================================
 DebugEnemyActionTable.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2021/04/17 MZ用に微修正
 1.0.0 2021/04/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc DebugEnemyActionTablePlugin
 * @author triacontane
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DebugEnemyActionTable.js
 *
 * @help DebugEnemyActionTable.js
 *
 * This is a debug plugin that outputs
 * the enemy character's action table to the log.
 *
 * This is output when the action is decided.
 * Does not work except in test play.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 敵キャラ行動テーブルデバッグプラグイン
 * @author トリアコンタン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DebugEnemyActionTable.js
 *
 * @help DebugEnemyActionTable.js
 *
 * 敵キャラの行動テーブルをログに出力するデバッグプラグインです。
 * 行動決定時に出力されます。テストプレー以外では動作しません。
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

    if (!Utils.isOptionValid('test')) {
        return;
    }

    const _Game_Enemy_selectAction = Game_Enemy.prototype.selectAction;
    Game_Enemy.prototype.selectAction = function (actionList, ratingZero) {
        const resultAction = _Game_Enemy_selectAction.apply(this, arguments);
        this.recordActionTable(actionList, ratingZero, resultAction);
        return resultAction;
    }

    Game_Enemy.prototype.recordActionTable = function (actionList, ratingZero, resultAction) {
        const sum = actionList.reduce((r, a) => r + a.rating - ratingZero, 0);
        if (sum <= 0) {
            return;
        }
        const data = actionList.map(action => {
            const item = {};
            const skill = $dataSkills[action.skillId] || {};
            item['Skill Name'] = skill.name;
            item['Rating'] = action.rating;
            item['Percent'] = (action.rating - ratingZero) / sum * 100;
            item['Use'] = action.skillId === resultAction.skillId ? 'Yes' : 'No';
            return item;
        });
        console.group(`[${this.name()}] Action List`);
        console.table(data);
        console.groupEnd();
    }
})();
