/*=============================================================================
 GameClearFlag.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/10/19 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ゲームクリアフラグプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GameClearFlag.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param gameClearSwitch
 * @text ゲームクリアスイッチ
 * @desc ゲームクリアしたデータであることを判断するスイッチ番号です。
 * @default 1
 * @type switch
 *
 * @param fileNameFormat
 * @text セーブデータ名フォーマット
 * @desc セーブデータ名のフォーマットです。%1が元のセーブデータ名に置き換えられます。
 * @default %1 ★
 *
 * @help GameClearFlag.js
 *
 * セーブ時に指定したスイッチがONの場合、
 * そのセーブデータはゲームクリア済みとして扱われます。
 * セーブデータ名の末尾に★が追加されます。(表示フォーマット変更可能)
 * 変更は本プラグイン適用後にセーブされたデータにのみ反映されます。
 *
 * 以下スクリプトで、ゲームクリア済みのセーブデータが存在するかを判定できます。
 * DataManager.isGameClear();
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


    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        const info = _DataManager_makeSavefileInfo.apply(this, arguments);
        info.gameClear = $gameSwitches.value(param.gameClearSwitch);
        return info;
    };

    DataManager.isGameClear = function() {
        return this._globalInfo.some(info => info && info.gameClear);
    };

    DataManager.isGameClearBySaveId = function(savefileId) {
        return this.savefileInfo(savefileId)?.gameClear;
    };

    const _Window_SavefileList_drawTitle = Window_SavefileList.prototype.drawTitle;
    Window_SavefileList.prototype.drawTitle = function(savefileId, x, y) {
        if (DataManager.isGameClearBySaveId(savefileId)) {
            const originalText = this.findTitleText(savefileId);
            const text = param.fileNameFormat.format(originalText);
            this.drawTextEx(text, x, y, 180);
        } else {
            _Window_SavefileList_drawTitle.apply(this, arguments);
        }
    };

    Window_SavefileList.prototype.findTitleText = function(savefileId) {
        if (savefileId === 0) {
            return TextManager.autosave;
        } else {
            return TextManager.file + " " + savefileId;
        }
    };
})();
