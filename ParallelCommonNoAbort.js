/*=============================================================================
 ParallelCommonNoAbort.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/05/04 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 並列コモンの中断阻止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelCommonNoAbort.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ParallelCommonNoAbort.js
 *
 * 並列処理のコモンイベントを実行中に条件スイッチがOFFになった場合に
 * 即座に中断せず、最後までコマンドを実行してから終了するよう仕様変更します。
 * マップイベントの並列処理は対象外です。
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

    const _Game_CommonEvent_refresh = Game_CommonEvent.prototype.refresh;
    Game_CommonEvent.prototype.refresh = function() {
        if (!this.isActive() && this._interpreter?.isRunning()) {
            this._deactivateRequest = true;
            return;
        }
        _Game_CommonEvent_refresh.apply(this, arguments);
    };

    const _Game_CommonEvent_update = Game_CommonEvent.prototype.update;
    Game_CommonEvent.prototype.update = function() {
        _Game_CommonEvent_update.apply(this, arguments);
        if (this._deactivateRequest && !this._interpreter?.isRunning()) {
            if (!this.isActive()) {
                this._interpreter = null;
            }
            this._deactivateRequest = false;
        }
    };
})();
