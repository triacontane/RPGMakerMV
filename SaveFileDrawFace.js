//=============================================================================
// SaveFileDrawFace.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2021/11/27 MZで動作するよう修正
// 1.1.1 2017/03/28 既存のタイトルを非表示にする機能を追加
// 1.1.0 2017/03/26 マップ名表示機能を追加
// 1.0.0 2017/03/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc セーブファイルのフェイス表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileDrawFace.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param visibleItems
 * @text 表示行数
 * @desc セーブファイルウィンドウに表示可能な行数です。デフォルト解像度の場合、3のままで問題ありません。
 * @default 3
 * @number
 *
 * @param hiddenGameTitle
 * @text ゲームタイトル非表示
 * @desc もともとゲームタイトルを表示している箇所を非表示にします。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @help SaveFileDrawFace.js
 * 
 * セーブファイルウィンドウで歩行フラフィックの代わりに
 * 顔グラフィックを表示します。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Window_SavefileList
    //  歩行グラフィックを非表示にして顔グラフィックを表示します。
    //=============================================================================
    Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {};

    if (param.hiddenGameTitle) {
        Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {};
    }

    Window_SavefileList.prototype.drawPartyFaces = function(info, x, y) {
        if (!info.faces) {
            return;
        }
        info.faces.forEach((faceData, index)=> {
            this.drawFace(faceData[0], faceData[1], x + index * (ImageManager.faceWidth + 4), y);
        });
    };

    const _Window_SavefileList_drawItem = Window_SavefileList.prototype.drawItem;
    Window_SavefileList.prototype.drawItem = function(index) {
        const savefileId = this.indexToSavefileId(index);
        const info = DataManager.savefileInfo(savefileId);
        if (info) {
            const rect = this.itemRectWithPadding(index);
            const faceY    = rect.y + this.itemHeight() / 2 - ImageManager.faceHeight / 2 + this.lineHeight() / 2;
            const faceMaxY = rect.y + rect.height - ImageManager.faceHeight;
            this.resetTextColor();
            this.changePaintOpacity(this.isEnabled(savefileId));
            this.drawPartyFaces(info, rect.x, Math.min(faceY, faceMaxY));
        }
        _Window_SavefileList_drawItem.apply(this, arguments);
    };

    const _Window_SavefileList_numVisibleRows = Window_SavefileList.prototype.numVisibleRows;
    Window_SavefileList.prototype.numVisibleRows = function() {
        return param.visibleItems || _Window_SavefileList_numVisibleRows.apply(this, arguments);
    };
})();

