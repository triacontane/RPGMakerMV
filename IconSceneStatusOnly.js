/*=============================================================================
 IconSceneStatusOnly.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/02/19 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ステータス画面専用アイコンプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/IconSceneStatusOnly.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param iconList
 * @text アイコンリスト
 * @desc ステータス画面でのみ表示されるアイコンのリストです。アイコンインデックスを指定します。
 * @default []
 * @type string[]
 *
 * @param iconShowNumber
 * @text アイコン表示数
 * @desc ステータス画面で表示されるアイコンの最大数です。
 * @default 8
 * @type number
 * @min 1
 *
 * @help IconSceneStatusOnly.js
 *
 * ステータス画面でのみ表示されるステート、バフアイコンを設定できます。
 * 同時にステータス画面で表示されるアイコン最大数を変更できます。
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

    /**
     * Window_StatusBase
     */
    const _Window_StatusBase_drawActorIcons = Window_StatusBase.prototype.drawActorIcons;
    Window_StatusBase.prototype.drawActorIcons = function(actor, x, y, width) {
        const fullIcon = this.findFullIconNumber();
        if (fullIcon > 0) {
            actor.requestFullIcon(true);
            _Window_StatusBase_drawActorIcons.call(this, actor, x, y, ImageManager.iconWidth * fullIcon);
            actor.requestFullIcon(false);
        } else {
            _Window_StatusBase_drawActorIcons.apply(this, arguments);
        }
    };

    Window_StatusBase.prototype.findFullIconNumber = function () {
        return 0;
    }

    Window_Status.prototype.findFullIconNumber = function () {
        return param.iconShowNumber || 4;
    }

    /**
     * Game_BattlerBase
     */
    Game_BattlerBase.prototype.requestFullIcon = function(value) {
        this._needFullIcon = value;
    };

    const _Game_BattlerBase_allIcons = Game_BattlerBase.prototype.allIcons;
    Game_BattlerBase.prototype.allIcons = function() {
        const icons = _Game_BattlerBase_allIcons.apply(this, arguments);
        if (this._needFullIcon) {
            return icons;
        } else {
            return icons.filter(index => !param.iconList.contains(index));
        }
    };
})();
