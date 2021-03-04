/*=============================================================================
 DisableExitMenu.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/03/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc DisableExitMenuPlugin
 * @author triacontane
 *
 * @param switch
 * @desc When the switch of the specified number is ON, the menu screen will not be able to be closed.
 * @default 0
 * @type switch
 *
 * @help DisableExitMenu.js
 *
 * When the specified switch is ON, you will not be able to leave the menu screen.
 * You can return to the map screen by using an item and calling a common event.
 * Please use with caution, as this may make it impossible to continue playing.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メニュー画面を閉じられなくするプラグイン
 * @author トリアコンタン
 *
 * @param switch
 * @text スイッチ番号
 * @desc 指定した番号のスイッチがONのとき、メニュー画面を閉じられなくなります。
 * @default 0
 * @type switch
 *
 * @help DisableExitMenu.js
 *
 * 指定したスイッチがONのときメニュー画面から出られなくなります。
 * アイテムを使用してコモンイベントを呼ぶとマップ画面に戻れます。
 * プレー続行不可能になる場合もあるので注意してご利用ください。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('DisableExitMenu');

    var _Scene_Menu_popScene = Scene_Menu.prototype.popScene;
    Scene_Menu.prototype.popScene = function() {
        if ($gameSwitches.value(param.switch)) {
            AudioManager.stopStaticAllSe();
            SoundManager.playBuzzer();
            this._commandWindow.activate();
        } else {
            _Scene_Menu_popScene.apply(this, arguments);
        }
    };

    AudioManager.stopStaticAllSe = function() {
        this._staticBuffers.forEach(function(buffer) {
            buffer.stop();
        });
        this._staticBuffers = [];
    };
})();
