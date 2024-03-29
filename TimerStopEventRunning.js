//=============================================================================
// TimerStopEventRunning.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/10/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc イベント処理中のタイマー停止プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help イベント処理中にタイマーの動作を停止します。
 * 時間制限イベントでメッセージ表示中などにタイマーが停止するので
 * ユーザーフレンドリーになります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {

    //=============================================================================
    // Game_Timer
    //  イベント実行中はタイマーを更新しないように修正します。
    //=============================================================================
    var _Game_TimerUpdate = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        if (!$gameMap.isEventRunning()) _Game_TimerUpdate.call(this, sceneActive);
    };
})();