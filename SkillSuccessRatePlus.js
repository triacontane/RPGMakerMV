/*=============================================================================
 SkillSuccessRatePlus.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/01/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキル成功率加算プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillSuccessRatePlus.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help SkillSuccessRatePlus.js
 *
 * スキル成功率に指定値を加算、減算できる特徴を追加します。
 * 命中率と異なり、基本成功率からの乗算ではなく加算、減算です。
 * また物理攻撃以外にも適用されます。
 * 値の加減は命中率の計算のあとに行われます。
 *
 * アクター、職業、敵キャラ、武具、ステートのメモ欄に
 * 以下の通り指定してください。
 *
 * もとの成功率から20%減算されます。
 * 50%の成功率のスキルなら30%になります。
 * <成功率加算:-20>
 * <SuccessPlus:-20>
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

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        const hit = _Game_Action_itemHit.apply(this, arguments);
        return hit + this.subject().findSuccessRatePlus();
    };

    Game_BattlerBase.prototype.findSuccessRatePlus = function() {
        return this.traitObjects().reduce((prev, obj) => {
            const plus = PluginManagerEx.findMetaValue(obj, ['成功率加算', 'SuccessPlus']) || 0;
            return prev + plus;
        }, 0);
    };
})();
