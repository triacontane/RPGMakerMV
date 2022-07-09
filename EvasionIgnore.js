/*=============================================================================
 EvasionIgnore.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/07/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 回避無視プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EvasionIgnore.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help EvasionIgnore.js
 *
 * 相手の回避率を無視して攻撃できるステートやスキルを作成できます。
 * アクター、職業、スキル、武器、防具、敵キャラ、ステートのメモ欄に以下の通り
 * 記述してください。
 * <回避無視>
 * <EvasionIgnore>
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

    const _Game_Action_itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function(target) {
        const eva = _Game_Action_itemEva.apply(this, arguments);
        return this.isEvasionIgnore() ? 0 : eva;
    };

    Game_Action.prototype.isEvasionIgnore = function() {
        const traitObjList = this.subject().traitObjects();
        traitObjList.push(this.item());
        return traitObjList.some(obj => {
            return !!PluginManagerEx.findMetaValue(obj, ['EvasionIgnore', '回避無視']);
        });
    };
})();
