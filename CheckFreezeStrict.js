/*=============================================================================
 CheckFreezeStrict.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2022/09/17 MV版を作成
 1.0.1 2022/09/16 メッセージを日本語に変更
 1.0.0 2022/09/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 厳格フリーズチェックプラグイン
 * @author トリアコンタン
 *
 * @param freezeCommandCount
 * @text フリーズ判定コマンド数
 * @desc イベント実行中に同一フレーム内で指定した数を超過してコマンド実行するとフリーズとして扱われます。
 * @default 100000
 * @type number
 *
 * @help CheckFreezeStrict.js
 *
 * イベント実行中に同一フレーム内でのコマンド実行数に制限を掛けます。
 * 制限を超えるとエラーが発生してゲームが止まるため、フリーズを早期検出でき
 * デバイスに負荷を掛けるようなイベントの組み方も事前に検知できます。
 * 低すぎる値を指定すると、意図せず処理が止まってしまうので注意してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    var script = document.currentScript;
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('CheckFreezeStrict');

    var _Game_Interpreter_checkFreeze = Game_Interpreter.prototype.checkFreeze;
    Game_Interpreter.prototype.checkFreeze = function() {
        _Game_Interpreter_checkFreeze.apply(this, arguments);
        if (this._freezeChecker >= param.freezeCommandCount) {
            throw new Error(`コマンド実行数が制限を超えました。 
            EventID:${this._eventId} Index:${this._index} Count:${this._freezeChecker}`)
        }
        // this._freezeCheckerのデフォルト仕様は無視する
        return false;
    };
})();
