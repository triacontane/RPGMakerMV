/*=============================================================================
 CastTimeControl.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/07/28 キャストタイム倍率の変更を特定のスキルタイプのみに限定できる機能を追加
 1.0.0 2021/05/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc キャストタイム制御プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CastTimeControl.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help CastTimeControl.js
 *
 * タイムプログレス戦闘において、
 * キャストタイム(詠唱時間)の倍率を変更できる特徴を提供します。
 * 特徴を有するデータベースのメモ欄(※1)に以下のとおり指定してください。
 *
 * ・キャストタイムが2倍になります。
 * <キャストタイム倍率:200>
 * <CastTimeRate:200>
 *
 * ・スキルタイプ[1]に対してのみキャストタイム倍率が有効になります。
 * <キャストタイム倍率スキルタイプ:1>
 * <CastTimeRateSkillType:1>
 *
 * ※1 アクター、職業、武器、防具、敵キャラ、ステート
 *
 * キャストタイムはスキル等の『速度補正』に負の値を設定すると機能します。
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

    const _Game_Battler_tpbRequiredCastTime = Game_Battler.prototype.tpbRequiredCastTime;
    Game_Battler.prototype.tpbRequiredCastTime = function() {
        const time = _Game_Battler_tpbRequiredCastTime.apply(this, arguments);
        return time > 0 ? time * this.findCastTimeRate() : time;
    };

    Game_Battler.prototype.findCastTimeRate = function() {
        return this.traitObjects().reduce((prev, obj) => {
            const rate = PluginManagerEx.findMetaValue(obj, ['CastTimeRate', 'キャストタイム倍率']);
            const type = PluginManagerEx.findMetaValue(obj, ['CastTimeRateSkillType', 'キャストタイム倍率スキルタイプ']);
            const action = this.currentAction();
            if (type && action && action.item().stypeId !== type) {
                return prev;
            }
            return rate !== undefined ? prev * rate / 100 : prev;
        }, 1);
    };
})();
