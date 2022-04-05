/*=============================================================================
 MessageAutoReplace.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/03/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージ自動置換プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageAutoReplace.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param replaceList
 * @text 置換リスト
 * @desc すべての『文章の表示』の内容を自動で置換するリストです。
 * @default []
 * @type struct<REPLACE>[]
 *
 * @help MessageAutoReplace.js
 *
 * すべての『文章の表示』について指定されたパラメータに基づいて置換処理をします。
 * 特定の文字列に対して制御文字による装飾やフォントサイズの変更、誤記の修正などを
 * 一括で行う場合などに使用できます。
 * 置換条件スイッチも指定できるので状況に応じた使い分けも可能です。
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

/*~struct~REPLACE:
 *
 * @param targetText
 * @text 置換対象テキスト
 * @desc 指定したテキストに一致する文字列を置換後のテキストに置き換えます。
 * @default
 * @type string
 *
 * @param text
 * @text 置換後のテキスト
 * @desc 置き換え後のテキストです。
 * @default
 * @type string
 *
 * @param switchId
 * @text 条件スイッチ
 * @desc 指定したスイッチがONのときのみ置換されます。指定が無い場合、常に追加されます。
 * @default 0
 * @type switch
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.replaceList) {
        param.replaceList = [];
    }

    const _Game_Message_allText = Game_Message.prototype.allText;
    Game_Message.prototype.allText = function() {
        return this.applyTextReplace(_Game_Message_allText.apply(this, arguments))
    };

    Game_Message.prototype.applyTextReplace = function(text) {
        param.replaceList.forEach(item => {
            if (item.switchId && !$gameSwitches.value(item.switchId)) {
                return;
            }
            const regExp = new RegExp(item.targetText, 'g');
            text = text.replace(regExp, function() {
                const params = Array.from(arguments).slice(1);
                return item.text.format.apply(item.text, params);
            });
        });
        return text;
    };
})();
