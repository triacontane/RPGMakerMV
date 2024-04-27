/*=============================================================================
 AutoSaveDisable.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc オートセーブ禁止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoSaveDisable.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param switchId
 * @text オートセーブ禁止スイッチ
 * @desc 指定したスイッチがONのときオートセーブを禁止します。
 * @default 1
 * @type switch
 *
 * @help AutoSaveDisable.js
 *
 * 指定したスイッチがONのときにオートセーブを禁止します。
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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_System_isAutosaveEnabled = Game_System.prototype.isAutosaveEnabled;
    Game_System.prototype.isAutosaveEnabled = function() {
        return _Game_System_isAutosaveEnabled.apply(this, arguments) && !this.isAutoSaveDisabled();
    }

    Game_System.prototype.isAutoSaveDisabled = function() {
        return param.switchId && $gameSwitches.value(param.switchId);
    };
})();
