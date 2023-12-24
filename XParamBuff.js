/*=============================================================================
 XParamBuff.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/12/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 追加能力値のバフプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/XParamBuff.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help XParamBuff.js
 *
 * 追加能力値に対してバフを設定できます。
 * 例えば、命中率に対して150%のバフを設定すると、もとの1.5倍になります。
 * デフォルト仕様では命中率など追加能力値の特徴は加算となりますが
 * 本プラグインでは倍率を乗算できます。
 *
 * アクター、職業、武器、防具、ステート、敵キャラのメモ欄に
 * 以下の通り指定してください。
 * <HitBuff:150> # 命中率に対して150%のバフを設定
 * <EvaBuff:150> # 回避率に対して150%のバフを設定
 * <CriBuff:150> # 会心率に対して150%のバフを設定
 * <CevBuff:150> # 会心回避率に対して150%のバフを設定
 * <MevBuff:150> # 魔法回避率に対して150%のバフを設定
 * <MrfBuff:150> # 魔法反射率に対して150%のバフを設定
 * <CntBuff:150> # 反撃率に対して150%のバフを設定
 * <HrgBuff:150> # HP再生率に対して150%のバフを設定
 * <MrgBuff:150> # MP再生率に対して150%のバフを設定
 * <TrgBuff:150> # TP再生率に対して150%のバフを設定
 *
 * 100以下の値を指定したらデバフになります。
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

    Game_BattlerBase.XPARAM_BUFF_NAMES = [
        'HitBuff',
        'EvaBuff',
        'CriBuff',
        'CevBuff',
        'MevBuff',
        'MrfBuff',
        'CntBuff',
        'HrgBuff',
        'MrgBuff',
        'TrgBuff'
    ];

    const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        let value = _Game_BattlerBase_xparam.apply(this, arguments);
        this.traitObjects().forEach(traitObj => {
            const tagName = Game_BattlerBase.XPARAM_BUFF_NAMES[xparamId];
            if (traitObj.meta.hasOwnProperty(tagName)) {
                const rate = PluginManagerEx.findMetaValue(traitObj, tagName) / 100;
                value *= rate;
            }
        });
        return value;
    };
})();
