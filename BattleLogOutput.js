/*=============================================================================
 BattleLogOutput.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc バトルログ出力プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogOutput.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command OUTPUT_LOG
 * @text バトルログ出力
 * @desc バトルログを出力します。
 *
 * @arg message
 * @text 出力メッセージ
 * @desc バトルログとして出力するメッセージです。
 * @default
 * @type multiline_string
 *
 * @arg pushBaseLine
 * @text ベースライン追加
 * @desc バトルログ出力前に表示していたログを消去し、先頭からログ出力します。
 * @default true
 * @type boolean
 *
 * @arg waitCount
 * @text ウェイト
 * @desc 指定したフレームが経過したのち、すべてのログを削除します。0を指定するとログは削除されません。
 * @default 0
 * @type number
 *
 * @help BattleLogOutput.js
 *
 * プラグインコマンドからバトルログを出力できます。
 * このコマンドは戦闘画面でのみ有効です。
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

    PluginManagerEx.registerCommand(script, 'OUTPUT_LOG', args => {
        BattleManager.displayCustomLog(args.message, args.pushBaseLine, args.waitCount);
    });

    BattleManager.displayCustomLog = function(text, pushBaseLine, waitCount) {
        this._logWindow.displayCustomLog(text, pushBaseLine, waitCount);
    };

    Window_BattleLog.prototype.displayCustomLog = function(text, pushBaseLine, waitCount) {
        if (pushBaseLine) {
            this.push("pushBaseLine");
        }
        const textList = text.split('\n');
        textList.forEach(text => this.push('addText', text));
        if (waitCount > 0) {
            this.push('waitForCount', waitCount);
            this.push("clear");
        }
    };

    Window_BattleLog.prototype.waitForCount = function(count) {
        this._waitCount = count;
    };
})();
