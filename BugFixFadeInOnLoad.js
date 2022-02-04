/*=============================================================================
 BugFixFadeInOnLoad.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/02/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ロード時にフェードインが行われないバグ修正パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixFadeInOnLoad.js
 * @author トリアコンタン
 *
 * @help BugFixFadeInOnLoad.js
 *　
 * データロード時、プロジェクトデータが変更されていると
 * フェードインが正常に行われないコアスクリプトの問題を修正します。
 *
 * この問題はv1.4.3のコアスクリプトで再現しました。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    Scene_Load.prototype.reloadMapIfUpdated = function() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            const mapId = $gameMap.mapId();
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            // 必要な引数をreserveTransferに渡していなかった
            const d = $gamePlayer.direction();
            const fadeType = $gamePlayer.fadeType();
            $gamePlayer.reserveTransfer(mapId, x, y, d, fadeType);
            $gamePlayer.requestMapReload();
        }
    };
})();
