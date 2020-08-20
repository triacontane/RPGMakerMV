/*=============================================================================
 CustomizeProgressType.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2020/08/20 英語版の翻訳漏れ
 1.0.1 2020/08/20 英語版ヘルプ作成
 1.0.0 2020/08/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc CustomizeProgressTypePlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeProgressType.js
 * @author triacontane
 *
 * @param progressTypeSwitch
 * @desc Activated when ON, this switch determines the type of time progress battle.
 * @default 1
 * @type switch
 *
 * @help CustomizeProgressType.js
 *
 * You can change the type of time progress combat (active and wait) during the game.
 * It becomes 'Active' when the specified switch is ON and 'Weight' when it is OFF.
 * By default, the gauge accumulates 4 times as much in weight mode as in active mode.
 *
 * If you combine it with "CustomizeConfigItem.js" which is published separately,
 * you can create a plugin for The player will be able to change the type from the options screen.
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/mz_master/CustomizeConfigItem.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイムプログレス種別変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeProgressType.js
 * @author トリアコンタン
 *
 * @param progressTypeSwitch
 * @text プログレス種別スイッチ
 * @desc タイムプログレス戦闘の種別(アクティブ・ウェイト)を決めるスイッチです。ONのときアクティブになります。
 * @default 1
 * @type switch
 *
 * @help CustomizeProgressType.js
 *
 * タイムプログレス戦闘の種別(アクティブ・ウェイト)をゲーム中に変更できます。
 * 指定したスイッチがONのとき『アクティブ』OFFのとき『ウェイト』になります。
 * デフォルト仕様でウェイトモードではゲージの溜まり方がアクティブの4倍になります。
 *
 * 別途公開している『オプション任意項目作成プラグイン』と組み合わせると
 * オプション画面から種別をプレイヤーが変更できるようになります。
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
    const param = PluginManagerEx.createParameter(document.currentScript);

    const _BattleManager_isActiveTpb = BattleManager.isActiveTpb;
    BattleManager.isActiveTpb = function() {
        _BattleManager_isActiveTpb.apply(this, arguments);
        return $gameSwitches.value(param.progressTypeSwitch);
    };
})();
