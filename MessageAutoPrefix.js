/*=============================================================================
 MessageAutoPrefix.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2024/12/21 名前欄にも接頭辞を設定する機能を追加
 1.2.0 2022/08/15 公式プラグインTextPicture.jsに接頭辞を適用できる機能を追加
 1.1.0 2022/07/15 全ての行頭に追加される接頭辞を指定できるパラメータを追加
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
 * @orderAfter TextPicture
 * @author トリアコンタン
 *
 * @param prefixList
 * @text 接頭辞リスト
 * @desc すべての『文章の表示』の先頭に追加されるテキストのリストです。それぞれ条件スイッチを指定できます。
 * @default []
 * @type struct<PREFIX>[]
 *
 * @param rowPrefixList
 * @text 行頭接頭辞リスト
 * @desc すべての『文章の表示』の行頭に追加されるテキストのリストです。それぞれ条件スイッチを指定できます。
 * @default []
 * @type struct<PREFIX>[]
 *
 * @param speakerPrefixList
 * @text 名前接頭辞リスト
 * @desc すべての『文章の表示』の『名前』の先頭に追加されるテキストのリストです。それぞれ条件スイッチを指定できます。
 * @default []
 * @type struct<PREFIX>[]
 *
 * @param applyTextPicture
 * @text テキストピクチャに適用
 * @desc 公式プラグインTextPicture.jsに接頭辞を適用します。
 * @default false
 * @type boolean
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
        const rowPrefix = this.findTextPrefix(param.rowPrefixList);
        for (let i = 0; i < this._texts.length; i++) {
            this._texts[i] = rowPrefix + this._texts[i];
        }
        return this.findTextPrefix(param.prefixList) + _Game_Message_allText.apply(this, arguments);
    };

    Game_Message.prototype.findTextPrefix = function(list) {
        return list.reduce((prev, item) => {
            if (!item.switchId || $gameSwitches.value(item.switchId)) {
                return prev + item.text;
            } else {
                return prev;
            }
        }, '');
    };

    const _Game_Message_speakerName = Game_Message.prototype.speakerName;
    Game_Message.prototype.speakerName = function() {
        const name = _Game_Message_speakerName.apply(this, arguments);
        const rowPrefix = this.findTextPrefix(param.speakerPrefixList);
        return rowPrefix ? rowPrefix + name : name;
    };

    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function() {
        _Game_Picture_show.apply(this, arguments);
        if (param.applyTextPicture && this.mzkp_text && this.mzkp_textChanged) {
            const rowPrefix = $gameMessage.findTextPrefix(param.rowPrefixList);
            this.mzkp_text = this.mzkp_text.replace(/^/gm, text => rowPrefix + text);
            this.mzkp_text = $gameMessage.findTextPrefix(param.prefixList) + this.mzkp_text;
        }
    };
})();
