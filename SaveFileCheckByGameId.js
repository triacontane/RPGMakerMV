/*=============================================================================
 SaveFileCheckByGameId.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/09/13 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc セーブデータのゲームIDチェックプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileCheckByGameId.js
 * @author トリアコンタン
 *
 * @help SaveFileCheckByGameId.js
 *
 * ロード画面表示時にセーブデータのゲームIDをチェックして
 * 異なる場合はロードできないようにします。
 * 本プラグインを適用前にセーブしたデータもロードできなくなります。
 * ゲームIDはRPGツクールMZのシステム設定で変更できます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        const info = _DataManager_makeSavefileInfo.apply(this, arguments);
        info.gameId = $dataSystem.advanced.gameId;
        return info;
    };

    const _DataManager_savefileExists = DataManager.savefileExists;
    DataManager.savefileExists = function(savefileId) {
        const exist = _DataManager_savefileExists.apply(this, arguments);
        if (exist && this._globalInfo) {
            const data = this._globalInfo[savefileId];
            if (data && data.gameId !== $dataSystem.advanced.gameId) {
                return false;
            }
        }
        return exist;
    };
})();