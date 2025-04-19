/*=============================================================================
 EscapeInvalidate.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2025/04/19 引数を削除しない設定を追加
 1.1.1 2025/04/19 制御文字の入れ子に対応
 1.1.0 2025/04/19 制御文字をコンボボックスから指定できる機能を追加、記号の制御文字を自動でエスケープするよう修正
 1.0.0 2025/04/19 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 制御文字の条件付き無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EscapeInvalidate.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param escapeList
 * @text 制御文字無効化リスト
 * @desc 無効化する制御文字のリストを設定します。
 * @default []
 * @type struct<InvalidEscape>[]
 *
 * @help EscapeInvalidate.js
 *
 * 指定したスイッチがONのとき、制御文字をテキストから除去します。
 * 制御文字ごとに無効化状況を設定できます。
 *
 * 他のプラグインで追加された制御文字や
 * メッセージ以外のプラグインの機能で制御文字をサポートしているケースでも
 * 無効化できる可能性はありますが、希望する挙動になるとは限りません。
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

/*~struct~InvalidEscape:
 * @param escapeCode
 * @text 制御文字
 * @desc 無効化する制御文字のコードを設定します。\v[n]を無効化する場合は、vを指定してください。
 * @default
 * @type combo
 * @option v
 * @option n
 * @option c
 * @option i
 * @option g
 * @option !
 * @option fs
 * @option px
 * @option py
 * @option {
 * @option }
 * @option <
 * @option >
 * @option $
 * @option |
 * @option ^
 * @option .
 *
 * @param switchId
 * @text スイッチID
 * @desc 指定したスイッチがONの時、制御文字を無効化します。指定が無い場合は、常に無効化します。
 * @default 0
 * @type switch
 *
 * @param noArgument
 * @text 引数を消去しない
 * @desc 制御文字に続く[n]や<aaa>などが削除対象になりません。想定外の文字が削除された場合のみ有効にします。
 * @default false
 * @type boolean
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.escapeList) {
        param.escapeList = [];
    }

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        param.escapeList.filter(item => {
            return !item.switchId || $gameSwitches.value(item.switchId);
        }).forEach(item => {
            const code = item.escapeCode;
            const escapedCode = code.match(/^\W$/) ? '\\' + code : code;
            if (item.noArgument) {
                arguments[0] =  arguments[0]
                    .replace(new RegExp('\\\\' + escapedCode, 'mgi'), '');
            } else {
                arguments[0] =  arguments[0]
                    .replace(new RegExp('\\\\' + escapedCode + '[\\<\\[][0-9]+[\\]\\>]', 'mgi'), '')
                    .replace(new RegExp('\\\\' + escapedCode + '[\\<\\[].*?[\\]\\>]', 'mgi'), '')
                    .replace(new RegExp('\\\\' + escapedCode, 'mgi'), '');
            }
        });
        return _Window_Base_convertEscapeCharacters.apply(this, arguments);
    };
})();
