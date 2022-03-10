/*=============================================================================
 MessageAutoPrefix.js
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
 * @plugindesc メッセージ自動接頭辞プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageAutoPrefix.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param prefixList
 * @text 接頭辞リスト
 * @desc すべての『文章の表示』の先頭に追加されるテキストのリストです。それぞれ条件スイッチを指定できます。
 * @default []
 * @type struct<PREFIX>[]
 *
 * @help MessageAutoPrefix.js
 *
 * すべての『文章の表示』の先頭に表示されるテキストを定義できます。
 * 制御文字を使った文字色やフォントの変更を全文章に適用したい場合などに使います。
 * 接頭辞は複数登録でき、条件スイッチも指定できるので状況に応じて
 * 使い分けも可能です。
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

/*~struct~PREFIX:
 *
 * @param text
 * @text 接頭辞テキスト
 * @desc 接頭辞として追加されるテキスト内容です。各種制御文字が使えます。
 * @default
 * @type multiline_string
 *
 * @param switchId
 * @text 条件スイッチ
 * @desc 指定したスイッチがONのときのみ接頭辞が付与されます。指定が無い場合、常に追加されます。
 * @default 0
 * @type switch
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.prefixList) {
        param.prefixList = [];
    }

    const _Game_Message_allText = Game_Message.prototype.allText;
    Game_Message.prototype.allText = function() {
        return this.findTextPrefix() + _Game_Message_allText.apply(this, arguments);
    };

    Game_Message.prototype.findTextPrefix = function() {
        return param.prefixList.reduce((prev, item) => {
            if (!item.switchId || $gameSwitches.value(item.switchId)) {
                return prev + item.text;
            } else {
                return prev;
            }
        }, '');
    };
})();
