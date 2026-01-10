/*=============================================================================
 DropItemOnlyOne.js
----------------------------------------------------------------------------
 (C)2026 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2026/01/10 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ドロップアイテムの複数入手禁止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DropItemOnlyOne.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param troopOnlyOne
 * @text 敵グループ単位で1つのみ
 * @desc 敵キャラ単位ではなく、敵グループ全体でドロップアイテムを1つのみ入手可能にします。
 * @type boolean
 * @default false
 *
 * @help DropItemOnlyOne.js
 *
 * 敵キャラのドロップアイテムの複数同時入力を不可として
 * どれかひとつのみを入手できる仕様にします。
 * アイテムリストの上から判定し、入手した場合は以降の判定は無効となります。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function() {
        const items = _Game_Enemy_makeDropItems.apply(this, arguments);
        if (items.length > 0) {
            return [items[0]];
        }
        return items;
    };

    const _Game_Troop_makeDropItems = Game_Troop.prototype.makeDropItems;
    Game_Troop.prototype.makeDropItems = function() {
        const items = _Game_Troop_makeDropItems.apply(this, arguments);
        if (param.troopOnlyOne && items.length > 0) {
            return [items[0]];
        }
        return items;
    };
})();
