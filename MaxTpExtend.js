/*=============================================================================
 MaxTpExtend.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2022/07/16 TP拡張のタグの対象にスキルを追加
 1.0.2 2021/03/27 タグを付けてメニューを開くとエラーになっていた問題を修正
 1.0.1 2021/02/06 MZ向けにヘルプのアノテーションを微修正
 1.0.0 2020/05/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MaxTpExtendPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MaxTpExtend.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @help MaxTpExtend.js
 *
 * Extend the maximum TP.
 * Please describe the following in the memo field of
 * the database (*) that has the feature as follows.
 * <MaxTp:30> // The maximum TP will be added by 30.
 *
 * (*) Actors, Classes, Weapons, Armors, Enemies, and States
 *
 * Negative values can also be set.
 * The actual TP is the basic value of 100 with the specified
 * The values of all the memo fields will be added together.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 最大TP拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MaxTpExtend.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @help MaxTpExtend.js
 *
 * 最大TPを拡張します。
 * 特徴を有するデータベース(※)のメモ欄に以下の通り記述してください。
 * <MaxTp:30>  // 最大TPが30加算されます。
 * <最大TP:30> // 同上
 * ※アクター、職業、武器、防具、敵キャラ、ステート、スキル
 *
 * 負の値も設定できます。実際のTPは基本値の100に対して指定した
 * メモ欄全ての値が合算されます。制御文字\v[n]で変数の値を参照できます。
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

(function() {
    'use strict';

    /**
     * Game_BattlerBase
     * TPの最大値をメモ欄から取得します。
     */
    const _Game_BattlerBase_maxTp = Game_BattlerBase.prototype.maxTp;
    Game_BattlerBase.prototype.maxTp = function() {
        return _Game_BattlerBase_maxTp.apply(this, arguments) + this.findMaxTpExtend();
    };

    Game_BattlerBase.prototype.findMaxTpExtend = function() {
        return this.findMaxTpTraits().reduce(function(tp, traitObj) {
            const meta = PluginManagerEx.findMetaValue(traitObj, ['最大TP', 'MaxTp']);
            if (meta) {
                tp = tp + parseInt(meta);
            }
            return tp;
        }, 0);
    };

    Game_BattlerBase.prototype.findMaxTpTraits = function() {
        return this.traitObjects();
    };

    Game_Actor.prototype.findMaxTpTraits = function() {
        const traits = Game_BattlerBase.prototype.findMaxTpTraits.apply(this, arguments);
        return traits.concat(this.skills());
    };
})();
