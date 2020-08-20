/*=============================================================================
 HasteAndSlow.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/08/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc HasteAndSlowPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HasteAndSlow.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @help HasteAndSlow.js
 *
 * Adds a feature that changes the rate at which gauges accumulate in time progress battle.
 * Agility value remains the same and only affects the gauge accumulation speed.
 * Enter the following in the memo field of the database(*) that has the feature.
 * You can use the control character \[n]
 * <HasteAndSlow:50> // The accumulation rate will be 50%.
 * <HasteAndSlow:200> // The accumulation rate will be 200%.
 * * Actors, Classes, Weapons, Armors, Enemies, and States.
 *
 * There are no plug-in commands in this plugin.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ヘイストスロウプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HasteAndSlow.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @help HasteAndSlow.js
 *
 * タイムプログレス戦闘においてゲージが溜まる速度を変更させる特徴を追加します。
 * 敏捷性の値はそのままでゲージ蓄積速度にのみ影響します。
 * 特徴を有するデータベース(※)のメモ欄に以下の通り入力します。
 * 制御文字\v[n]が使用できます。
 * <HasteAndSlow:50>  // 蓄積速度が50%になります。
 * <HasteAndSlow:200> // 蓄積速度が200%になります。
 * ※ アクター、職業、武器、防具、敵キャラ、ステート
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const metaName = PluginManagerEx.findPluginName(document.currentScript);

    const _Game_Battler_tpbAcceleration = Game_Battler.prototype.tpbAcceleration;
    Game_Battler.prototype.tpbAcceleration = function() {
        return _Game_Battler_tpbAcceleration.apply(this, arguments) * this.findHasteAndSlow();
    };

    Game_Battler.prototype.findHasteAndSlow = function() {
        return this.traitObjects().reduce((prev, trait) => {
            const value = PluginManagerEx.findMetaValue(trait, metaName);
            return value ? prev * value / 100 : prev;
        }, 1);
    };
})();
