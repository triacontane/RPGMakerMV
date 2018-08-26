/*=============================================================================
 MenuItemEnableAlways.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/08/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MenuItemEnableAlwaysPlugin
 * @author triacontane
 *
 * @help MenuItemEnableAlways.js
 *
 * 本来はパーティに誰かがいないと使用できないメニューコマンドを
 * 常時使用可能にします。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アイテムメニューの常時使用可能プラグイン
 * @author トリアコンタン
 *
 * @help MenuItemEnableAlways.js
 *
 * 本来はパーティに誰かがいないと使用できないメニューコマンドを
 * 常時使用可能にします。
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

    var _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        this.addCommand(TextManager.item, 'item', true);
        _Window_MenuCommand_addMainCommands.apply(this, arguments);
        this._list.splice(1, 1);
    };
})();
