/*=============================================================================
 MenuReturnActorSelect.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.3 2021/11/18 1.0.2の修正により、オプション画面などから戻ったときにアクターが選択された状態で表示されてしまう問題を修正
 1.0.2 2021/10/20 メニューからスキルやアイテムの効果でマップに戻ってから再度メニューを開くとアクターが選択された状態で表示されてしまう問題を修正
 1.0.1 2021/03/16 MZ向けに修正
 1.0.0 2021/03/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MenuReturnActorSelectPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuReturnActorSelect.js
 * @author triacontane
 *
 * @help MenuReturnActorSelect.js
 *
 * When returning to the main menu from a
 * menu detail scene (skills, equipment, status),
 * the Focus on the actor selection window
 * instead of the main menu selection.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メニュー詳細画面からアクター選択に戻るプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuReturnActorSelect.js
 * @author トリアコンタン
 *
 * @help MenuReturnActorSelect.js
 *
 * メニュー詳細画面（スキル、装備、ステータス）からメインメニューに戻ったときに、
 * メインメニュー選択ではなく、アクター選択のウィンドウをフォーカスします。
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

    const _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.apply(this, arguments);
        if (Window_MenuCommand._lastCommandSymbol &&
            Window_MenuCommand._lastCommandSymbol === Window_MenuCommand._lastPersonalCommandSymbol) {
            this._commandWindow.deactivate();
            this.commandPersonal();
        }
    }

    const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    Scene_Menu.prototype.onPersonalOk = function() {
        _Scene_Menu_onPersonalOk.apply(this, arguments);
        Window_MenuCommand._lastPersonalCommandSymbol = this._commandWindow.currentSymbol();
    };

    const _Window_MenuCommand_initCommandPosition = Window_MenuCommand.initCommandPosition;
    Window_MenuCommand.initCommandPosition = function() {
        _Window_MenuCommand_initCommandPosition.apply(this, arguments);
        Window_MenuCommand._lastPersonalCommandSymbol = null;
    };
})();
