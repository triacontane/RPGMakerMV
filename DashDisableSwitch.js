/*=============================================================================
 DashDisableSwitch.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/04/28 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ダッシュ禁止スイッチプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DashDisableSwitch.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param switchId
 * @text ダッシュ禁止スイッチ
 * @desc ダッシュ禁止にするスイッチのIDを指定します。
 * @default 1
 * @type switch
 *
 * @help DashDisableSwitch.js
 *
 * 指定したスイッチがONのとき、ダッシュを禁止します。
 * マップの設定にかかわらずダッシュが禁止されます。
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

    const _Game_Map__isDashDisabled = Game_Map.prototype.isDashDisabled;
    Game_Map.prototype.isDashDisabled = function() {
        if (this.isDashDisabledBySwitch()) {
            return true;
        }
        return _Game_Map__isDashDisabled.apply(this, arguments);
    };

    Game_Map.prototype.isDashDisabledBySwitch = function() {
        return $gameSwitches.value(param.switchId);
    };
})();
