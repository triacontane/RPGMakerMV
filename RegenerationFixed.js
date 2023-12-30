/*=============================================================================
 RegenerationFixed.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2023/12/30 URLの指定誤りを修正
 1.0.1 2022/08/12 再生倍率に0を指定したとき正常に動作しない問題を修正
 1.0.0 2022/08/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 再生値の固定化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RegenerationFixed.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help RegenerationFixed.js
 *
 * HPやMPの再生率を割合ではなく固定値で指定できます。
 * 特徴を有するデータベースのメモ欄に以下の通り指定してください。
 * <HP再生値:10>
 * <MP再生値:-10>
 * <TP再生値:20>
 *
 * 上記の固定値に倍率を指定したい場合は以下の通り百分率で指定します。
 * 指定が無ければ100%として扱われます。
 * <HP再生倍率:200>
 * <MP再生倍率:0>
 * <TP再生倍率:50>
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

    const _Game_Battler_regenerateHp = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function() {
        _Game_Battler_regenerateHp.apply(this, arguments);
        const value = this.findRegenerateFixed(['HP再生値', 'HpRegValue'], ['HP再生倍率', 'HpRegRate']);
        const minRecover = -this.maxSlipDamage();
        const realValue = Math.max(value, minRecover);
        if (realValue !== 0) {
            this.gainHp(realValue);
        }
    };

    const _Game_Battler_regenerateMp = Game_Battler.prototype.regenerateMp;
    Game_Battler.prototype.regenerateMp = function() {
        _Game_Battler_regenerateMp.apply(this, arguments);
        const value = this.findRegenerateFixed(['MP再生値', 'MpRegValue'], ['MP再生倍率', 'MpRegRate']);
        if (value !== 0) {
            this.gainMp(value);
        }
    };

    const _Game_Battler_regenerateTp = Game_Battler.prototype.regenerateTp;
    Game_Battler.prototype.regenerateTp = function() {
        _Game_Battler_regenerateTp.apply(this, arguments);
        const value = this.findRegenerateFixed(['TP再生値', 'TpRegValue'], ['TP再生倍率', 'TpRegRate']);
        this.gainSilentTp(value);
    };

    Game_Battler.prototype.findRegenerateFixed = function(valueTags, rateTags) {
        return Math.round(this.findRegenerateValue(valueTags) * this.findRegenerateRate(rateTags));
    };

    Game_Battler.prototype.findRegenerateValue = function(tags) {
        return this.traitObjects().reduce((prev, obj) => {
            return prev + (PluginManagerEx.findMetaValue(obj, tags) || 0);
        }, 0);
    };

    Game_Battler.prototype.findRegenerateRate = function(tags) {
        return this.traitObjects().reduce((prev, obj) => {
            const rate = PluginManagerEx.findMetaValue(obj, tags);
            return prev * (rate !== undefined ? rate / 100 : 1);
        }, 1);
    };
})();
