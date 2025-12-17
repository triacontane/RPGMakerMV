/*=============================================================================
 ParallelCommonCall.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/12/17 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 並列コモン呼び出しプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelCommonCall.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command CALL
 * @text コモンイベント呼び出し
 * @desc 指定したコモンイベントを並列処理として呼び出します。
 *
 * @arg id
 * @text コモンイベントID
 * @desc 呼び出す対象のコモンイベントIDです。
 * @default 1
 * @type common_event
 *
 * @help ParallelCommonCall.js
 *
 * コモンイベントを並列処理扱いで呼び出します。
 * 実行中のイベントの実行を妨げることなく、同時に動作します。
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

    PluginManagerEx.registerCommand(script, 'CALL', args => {
        if ($gameParty.inBattle()) {
            return;
        }
        $gameMap.setupDynamicCommon(args.id);
    });
})();
