/*=============================================================================
 MenuReturnActorSelect.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
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

    Scene_Menu._selectPersonal = false;

    const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    Scene_Menu.prototype.onPersonalOk = function() {
        _Scene_Menu_onPersonalOk.apply(this, arguments);
        Scene_Menu._selectPersonal = true;
    };

    const _Scene_Menu_onPersonalCancel = Scene_Menu.prototype.onPersonalCancel;
    Scene_Menu.prototype.onPersonalCancel = function() {
        _Scene_Menu_onPersonalCancel.apply(this, arguments);
        Scene_Menu._selectPersonal = false;
    };

    const _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.apply(this, arguments);
        if (Scene_Menu._selectPersonal) {
            this._commandWindow.deactivate();
            this.commandPersonal();
        }
    }
})();
