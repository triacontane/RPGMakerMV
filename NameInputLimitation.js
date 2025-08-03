/*=============================================================================
 NameInputLimitation.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/08/03 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 名前入力の文字種限定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameInputLimitation.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param hiraganaDisableSwitchId
 * @text ひらがな禁止スイッチ
 * @desc このスイッチがONのとき、ひらがな入力が禁止されます。0を指定すると制限されません。
 * @default 0
 * @type switch
 *
 * @param katakanaDisableSwitchId
 * @text カタカナ禁止スイッチ
 * @desc このスイッチがONのとき、カタカナ入力が禁止されます。0を指定すると制限されません。
 * @default 0
 * @type switch
 *
 * @param alphabetDisableSwitchId
 * @text 英数禁止スイッチ
 * @desc このスイッチがONのとき、英数記号入力が禁止されます。0を指定すると制限されません。
 * @default 0
 * @type switch
 *
 * @help NameInputLimitation.js
 *
 * 名前入力画面で入力可能な文字種を制限できます。文字種毎にスイッチで禁止します。
 * すべての文字種が禁止の状態で名前入力画面を開くとエラーになります。
 * また、このプラグインは「日本語入力」用です。
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
    const param = PluginManagerEx.createParameter(script);

    const _Window_NameInput_table = Window_NameInput.prototype.table;
    Window_NameInput.prototype.table = function() {
        let table = _Window_NameInput_table.call(this);
        if ($gameSwitches.value(param.hiraganaDisableSwitchId)) {
            table = table.filter(c => c !== Window_NameInput.JAPAN1);
        }
        if ($gameSwitches.value(param.katakanaDisableSwitchId)) {
            table = table.filter(c => c !== Window_NameInput.JAPAN2);
        }
        if ($gameSwitches.value(param.alphabetDisableSwitchId)) {
            table = table.filter(c => c !== Window_NameInput.JAPAN3);
        }
        if (table.length === 0) {
            PluginManagerEx.throwError('入力可能な文字種がありません。', script);
        }
        if ($gameSystem.isJapanese()) {
            this.updateCharacterChange(table);
        }
        return table;
    };

    Window_NameInput.prototype.updateCharacterChange = function(table) {
        for (let i = 0; i < table.length; i++) {
            const nextIndex = (i + 1) % table.length;
            const tableItem = table[i];
            if (i !== nextIndex) {
                tableItem[tableItem.length - 2] = this.findChangeCharacter(table[nextIndex]);
            } else {
                tableItem[tableItem.length - 2] = '';
            }
        }
    };

    Window_NameInput.prototype.findChangeCharacter = function(nextTableItem) {
        switch (nextTableItem) {
            case Window_NameInput.JAPAN1:
                return 'かな';
            case Window_NameInput.JAPAN2:
                return 'カナ';
            case Window_NameInput.JAPAN3:
                return '英数';
            default:
                return null;
        }
    };
})();
