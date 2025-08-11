/*=============================================================================
 ChoiceRandom.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/08/11 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ランダム選択肢プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceRandom.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param switchId
 * @text ランダム化スイッチID
 * @desc 指定したスイッチがONのとき、選択肢をランダムに並び替えます。
 * @default 1
 * @type switch
 *
 * @param autoOff
 * @text 自動OFF
 * @desc 選択肢のランダム化が行われた際、ランダム化スイッチを自動的にOFFにします。
 * @default true
 * @type boolean
 *
 * @help ChoiceRandom.js
 *
 * イベントコマンド「選択肢の表示」の選択肢の並び順をランダムにします。
 * プラグインパラメータで指定したスイッチがONのときにランダム化されます。
 * デフォルト選択肢とキャンセル選択肢は入れ替え前の設定で選択されます。
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

    const _Game_Message_setChoices = Game_Message.prototype.setChoices;
    Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
        if (this.isChoiceRandomEnabled()) {
            this._originalChoices = choices.clone();
            arguments[0] = choices.sort(() => Math.random() - 0.5);
            if (defaultType >= 0) {
                arguments[1] = choices.indexOf(this._originalChoices[defaultType]);
            }
            if (cancelType >= 0) {
                arguments[2] = choices.indexOf(this._originalChoices[cancelType]);
            }
        }
        _Game_Message_setChoices.apply(this, arguments);
    };

    Game_Message.prototype.isChoiceRandomEnabled = function() {
        return $gameSwitches.value(param.switchId);
    };

    const _Game_Message_onChoice = Game_Message.prototype.onChoice;
    Game_Message.prototype.onChoice = function(n) {
        if (this.isChoiceRandomEnabled()) {
            if (param.autoOff) {
                $gameSwitches.setValue(param.switchId, false);
            }
            if (n >= 0) {
                arguments[0] = this.findRandomChoiceIndex(n);
            }
        }
        _Game_Message_onChoice.apply(this, arguments);
    };

    Game_Message.prototype.findRandomChoiceIndex = function(selectedIndex) {
        const index = this._originalChoices.indexOf(this._choices[selectedIndex]);
        if (index < 0) {
            PluginManagerEx.throwError(`Choice not found. selected index:[${selectedIndex}]`, script);
        }
        this._originalChoices = null;
        return index;
    };
})();
