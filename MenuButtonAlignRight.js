/*=============================================================================
 MenuButtonAlignRight.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/19 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メニューボタン右寄せプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuButtonAlignRight.js
 * @author トリアコンタン
 *
 * @help MenuButtonAlignRight.js
 *
 * メニュー画面に表示されるアクター切替ボタンを右寄せにして
 * 左側にスペースを確保します。
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

    const _Scene_MenuBase_createPageButtons = Scene_MenuBase.prototype.createPageButtons;
    Scene_MenuBase.prototype.createPageButtons = function() {
        _Scene_MenuBase_createPageButtons.apply(this, arguments);
        if (this._cancelButton) {
            this.setRightAlignX(this._pagedownButton, this._cancelButton.x);
        } else {
            this.setRightAlignX(this._pagedownButton, Graphics.boxWidth);
        }
        this.setRightAlignX(this._pageupButton, this._pagedownButton.x);
    };

    Scene_MenuBase.prototype.setRightAlignX = function(targetSprite, rightX) {
        targetSprite.x = rightX - targetSprite.width - 4;
    };
})();
