//=============================================================================
// SaveFileLoadOnly.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/10/22 MZで動作するよう修正
// 1.0.0 2017/08/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc セーブファイルのロード専用化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileLoadOnly.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param condition
 * @text ロード専用条件
 * @desc ロード専用対象の判定式です。ローカル変数[fileId]および制御文字\v[n]が使えます。
 * @default 
 * @type combo
 * @option fileId === 1; // ファイルID[1]を読み取り専用にします。
 * @option fileId === \v[1]; // ファイルID[変数[1]の値]を読み取り専用にします。
 * @option fileId >= 1 && fileId <= 3; // ファイルID[1-3]を読み取り専用にします。
 *
 * @param iconId
 * @text ロード専用アイコンID
 * @desc セーブファイルウィンドウで、ロード専用ファイルにのみ描画されるアイコンIDです。
 * @default 195
 * @type number
 *
 * @help SaveFileLoadOnly.js
 *
 * 特定のセーブファイルを読み取り専用にできます。
 * パラメータでロード専用条件を指定してください。指定には計算式が使えます。
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
    //  ロード専用ファイルの判定を追加定義します。
    //=============================================================================
    const _Window_SavefileList_isEnabled      = Window_SavefileList.prototype.isEnabled;
    Window_SavefileList.prototype.isEnabled = function(savefileId) {
        return _Window_SavefileList_isEnabled.apply(this, arguments) &&
            !(this.isModeSave() && this.isLoadOnly(savefileId));
    };

    Window_SavefileList.prototype.isLoadOnly = function(fileId) {
        return !!eval(param.condition);
    };

    const _Window_SavefileList_drawTitle      = Window_SavefileList.prototype.drawTitle;
    Window_SavefileList.prototype.drawTitle = function(id, x, y) {
        _Window_SavefileList_drawTitle.apply(this, arguments);
        if (this.isLoadOnly(id) && param.iconId > 0) {
            this.drawIcon(param.iconId, x + 188 - ImageManager.iconWidth, y + 2);
        }
    };

    Window_SavefileList.prototype.isModeSave = function() {
        return this._mode === 'save';
    };
})();

