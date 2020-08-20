/*=============================================================================
 CustomizeProgressSpeed.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/08/20 実装方法変更(仕様変更なし)
 1.0.0 2020/08/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc CustomizeProgressSpeedPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeProgressSpeed.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * Allows you to adjust the overall gauge buildup in time progress battle.
 * The value obtained from the specified number of variables will be the multiplier.
 *
 * If you combine it with the "CustomizeConfigItem.js" which is published separately,
 * you can adjust the overall gauge in time progress battles.
 * The player will be able to adjust the magnification from the options screen.
 *
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/mz_master/CustomizeConfigItem.js
 *
 * @help CustomizeProgressSpeed.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイムプログレス速度調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeProgressSpeed.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param SpeedVariableId
 * @text 速度取得変数ID
 * @desc 指定した番号の変数値がタイムプログレス速度の倍率になります。100が標準速度です。0以下の値が入っていると100として扱われます。
 * @default 1
 * @type variable
 *
 * @help CustomizeProgressSpeed.js
 *
 * タイムプログレス戦闘において全体的なゲージの溜まりやすさを調整できます。
 * 指定した番号の変数から取得した値が倍率になります。
 *
 * 別途公開している『オプション任意項目作成プラグイン』と組み合わせると
 * オプション画面から倍率をプレイヤーが調整できるようになります。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/mz_master/CustomizeConfigItem.js
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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Unit_tpbReferenceTime = Game_Unit.prototype.tpbReferenceTime;
    Game_Unit.prototype.tpbReferenceTime = function() {
        return _Game_Unit_tpbReferenceTime.apply(this, arguments) / this.findProgressSpeedRate();
    };

    Game_Unit.prototype.findProgressSpeedRate = function() {
        const rate = $gameVariables.value(param.SpeedVariableId);
        return rate > 0 ? rate / 100 : 1.0;
    };
})();
