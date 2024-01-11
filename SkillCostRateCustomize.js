/*=============================================================================
 SkillCostRateCustomize.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/04/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキルコスト倍率調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillCostRateCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param skillCostRateList
 * @text スキルコスト倍率リスト
 * @desc スキルコスト倍率を調整するリストです。
 * @default []
 * @type struct<SkillCostRate>[]
 *
 * @help SkillCostRateCustomize.js
 *
 * 特定のスキルもしくはスキルタイプごとにスキルコスト倍率を調整できます。
 * 特徴を有するデータベース(※)のメモ欄に以下の通り設定してください。
 *
 * <SkillCostRate:id01> // 識別子[id01]の倍率が適用されます。
 *
 * ※アクター、職業、武器、防具、敵キャラ、ステート
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~SkillCostRate:
 * @param id
 * @text 識別子
 * @desc メモ欄で指定するタグの値です。<SkillCostRate:id01>の形式で指定します。
 * @default id01
 * @type string
 *
 * @param skillIdList
 * @text スキルIDリスト
 * @desc 倍率を調整するスキルIDのリストです。
 * @default []
 * @type skill[]
 *
 * @param skillType
 * @text スキルタイプ
 * @desc 倍率を調整するスキルタイプ(魔法など)です。
 * @default 0
 *
 * @param costType
 * @text コストタイプ
 * @desc 倍率を調整するコストタイプ(MPもしくはTP)です。
 * @default Mp
 * @type select
 * @option MP
 * @value Mp
 * @option TP
 * @value Tp
 * 
 * @param rate
 * @text 倍率
 * @desc スキルコストの倍率です。
 * @default 100
 * @type number
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.skillCostRateList) {
        param.skillCostRateList = [];
    }

    /**
     * Game_BattlerBase
     * IDおよびタイプごとにコスト倍率を計算します。
     */
    const _Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        const result = _Game_BattlerBase_skillMpCost.apply(this, arguments);
        return this.applyCostRateCustomize(result, 'Mp', skill);
    };

    const _Game_BattlerBase_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        const result =  _Game_BattlerBase_skillTpCost.apply(this, arguments);
        return this.applyCostRateCustomize(result, 'Tp', skill);
    };

    Game_BattlerBase.prototype.applyCostRateCustomize = function(originalRate, mpOrTp, skill) {
        const rate = this.findCostRateCustomize(mpOrTp, skill);
        return Math.floor(originalRate * rate);
    };

    Game_BattlerBase.prototype.findCostRateCustomize = function(mpOrTp, skill) {
        const rateList = param.skillCostRateList.filter(data => {
            return (data.skillIdList.includes(skill.id) || data.skillType === skill.stypeId) && data.costType === mpOrTp;
        });
        return this.traitObjects().reduce((prev, obj) => {
            const rateData = rateList.find(data => data.id === obj.meta['SkillCostRate']);
            return rateData ? prev * rateData.rate / 100 : prev;
        }, 1.0);
    };
})();
