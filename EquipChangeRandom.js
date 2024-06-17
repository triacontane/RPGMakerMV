//=============================================================================
// EquipChangeRandom.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2024/06/17 MZ版を新規作成
// 1.0.0 2017/06/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 装備品ランダム変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EquipChangeRandom.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command FORCE_CHANGE
 * @text 装備品ランダム変更
 * @desc アクターの装備品を所持品の中からランダムで強制変更します。
 *
 * @arg actorId
 * @text アクターID
 * @desc 変更対象のアクターIDです。変数で指定したいときは制御文字\V[n]を利用してください。
 * @default 1
 * @type actor
 *
 * @arg slotId
 * @text スロットID
 * @desc 変更対象のスロットIDです。データベースのタイプで設定した『装備タイプ』の数値（1以上）を入力します。
 * @default 1
 * @type number
 *
 * @help EquipChangeRandom.js
 *
 * アクターの装備品を所持品の中からランダムで強制変更します。
 * プラグインコマンドから実行してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'FORCE_CHANGE', args => {
        const actor = $gameActors.actor(args.actorId);
        if (actor) {
            actor.randomizeEquipments(args.slotId - 1);
        }
    });

    //=============================================================================
    // Game_Actor
    //  装備品をランダムに変更します。
    //=============================================================================
    Game_Actor.prototype.randomizeEquipments = function(slotId) {
        this.changeEquip(slotId, null);
        this.changeEquip(slotId, this.randomEquipItem(slotId));
    };

    Game_Actor.prototype.randomEquipItem = function(slotId) {
        const equipTypeId = this.equipSlots()[slotId];
        const items = $gameParty.equipItems().filter(item => item.etypeId === equipTypeId && this.canEquip(item));
        return items[Math.randomInt(items.length)];
    };
})();

