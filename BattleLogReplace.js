/*=============================================================================
 BattleLogReplace.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/01/04 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc バトルログの置換プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogReplace.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param messages
 * @text メッセージリスト
 * @desc 置換するメッセージのリストです。
 * @default []
 * @type struct<Message>[]
 *
 * @help BattleLogReplace.js
 *
 * バトルログで表示されるメッセージ全般に対して正規表現を使って置換できます。
 * ステートやスイッチ、確率などを指定すれば条件を満たしたときのみ置換できます。
 *
 * 正規表現についてはMDNのドキュメントを参照するかChatGPTなどで確認してください。
 * 簡単なサンプルはプリセットとして用意しています。
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

/*~struct~Message:
 * @param regExp
 * @text 正規表現
 * @desc メッセージを変化させるための正規表現です。エスケープ記号は重ねて使ってください。(ex:\\d)
 * @default
 * @type combo
 * @option (.+?)は(.+?)を唱えた！
 * @option (\\d+?)
 *
 * @param message
 * @text メッセージ
 * @desc 置換後のメッセージです。後方参照を使った場合は%1、%2...で参照できます。
 * @default
 * @type combo
 * @option %1は%2を放った！
 * @option \c[3]%1\c[0]
 *
 * @param probability
 * @text 置換確率
 * @desc メッセージの置換を実行する確率です。0-100の範囲で指定してください。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param switchId
 * @text スイッチID
 * @desc 指定した場合、スイッチがONのときのみメッセージ置換します。
 *
 * @param subjectState
 * @text 行動者ステート
 * @desc 行動の実行者が指定したステートにかかっているときのみメッセージ置換します。
 * @type state
 *
 * @param script
 * @text スクリプト条件
 * @desc 指定したスクリプトがtrueのときのみメッセージ置換します。変数[a]で行動者を参照できます。
 * @default
 * @type multiline_string
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.messages) {
        param.messages = [];
    }

    const _Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        this._lastSubject = subject;
        _Window_BattleLog_displayAction.apply(this, arguments);
    };

    const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function(text) {
        param.messages.filter(this.isValidRegExp.bind(this)).forEach(message => {
            arguments[0] = arguments[0].replace(new RegExp(message.regExp, 'gm'), function() {
                const args = Array.from(arguments);
                args.shift();
                return message.message.format.apply(message.message, args);
            });
        });
        _Window_BattleLog_addText.apply(this, arguments);
    };

    Window_BattleLog.prototype.isValidRegExp = function(message) {
        const conditions = [];
        const a = this._lastSubject;
        conditions.push(message.probability >= Math.randomInt(100) + 1);
        conditions.push(!message.switchId || $gameSwitches.value(message.switchId));
        conditions.push(!message.subjectState || a?.isStateAffected(message.subjectState));
        conditions.push(!message.script || eval(message.script));
        return conditions.every(condition => condition);
    };
})();
