/*=============================================================================
 VariableEscape.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/10/15 PluginCommonBaseとの定義順を指定するアノテーションを追加
 1.0.0 2023/08/05 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 変数値に制御文字使用可能プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableEscape.js
 * @author トリアコンタン
 * @orderBefore PluginCommonBase
 *
 * @help VariableEscape.js
 *
 * 変数値に制御文字を含む文字列が設定されている場合に、文章の表示などで制御文字が
 * 反映されるようになります。（デフォルト仕様では制御文字がそのまま表示されます）
 *
 * スクリプトから変数値を設定する場合は、以下の例のようにバックスラッシュを
 * 2つ重ねてください。
 * \\i[i] \\v[i]
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    // 上書きを止めるにはコアスクリプトの実装改善が必要
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        /* eslint no-control-regex: 0 */
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        while (text.match(/\x1bV\[(\d+)\]/gi)) {
            text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) => {
                const value = $gameVariables.value(parseInt(p1));
                if (value === String(value)) {
                    return value.replace(/\\/g, "\x1b");
                } else {
                    return value;
                }
            });
        }
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
            this.actorName(parseInt(p1))
        );
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
            this.partyMemberName(parseInt(p1))
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
})();
