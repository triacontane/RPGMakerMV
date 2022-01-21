/*=============================================================================
 NumberInputLimitation.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 数値入力の上限設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NumberInputLimitation.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command NUMBER_INPUT_LIMITATION
 * @text 数値入力の上限下限設定
 * @desc イベントコマンド『数値入力の処理』に上限値と下限値を設定します。コマンドの直前に指定してください。
 *
 * @arg upperValue
 * @text 上限値
 * @desc 数値入力の上限値です。コマンドで指定した桁数以上にはなりません。
 * @default 99999999
 * @type number
 *
 * @arg lowerValue
 * @text 下限値
 * @desc 数値入力の下限値です。
 * @default 0
 * @type number
 *
 * @help NumberInputLimitation.js
 *
 * イベントコマンド『数値入力の処理』に上限値、下限値を設定できます。
 * 『数値入力の処理』の処理の直前にプラグインコマンドを実行します。
 * 『数値入力の処理』の処理後、設定した上限値、下限値は解除されます。
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

    PluginManagerEx.registerCommand(script, 'NUMBER_INPUT_LIMITATION', args => {
        $gameSystem.setNumberInputLimitation(args.lowerValue, args.upperValue);
    });

    Game_System.prototype.setNumberInputLimitation = function(lower, upper) {
        this._numberInputLimitation = {
            lower: lower,
            upper: upper
        };
    };

    Game_System.prototype.getNumberInputLimitation = function() {
        return this._numberInputLimitation;
    };

    Game_System.prototype.clearNumberInputLimitation = function() {
        this._numberInputLimitation = null;
    };

    const _Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _Window_NumberInput_start.apply(this, arguments);
        this.applyLimitation();
    };

    const _Window_NumberInput_changeDigit = Window_NumberInput.prototype.changeDigit;
    Window_NumberInput.prototype.changeDigit = function(up) {
        _Window_NumberInput_changeDigit.apply(this, arguments);
        this.applyLimitation();
    };

    Window_NumberInput.prototype.applyLimitation = function() {
        const limitation = $gameSystem.getNumberInputLimitation();
        if (!limitation) {
            return;
        }
        const newNumber = this._number.clamp(limitation.lower, limitation.upper);
        if (this._number !== newNumber) {
            this._number = newNumber;
            this.refresh();
        }
    };

    const _Window_NumberInput_processOk = Window_NumberInput.prototype.processOk;
    Window_NumberInput.prototype.processOk = function() {
        _Window_NumberInput_processOk.apply(this, arguments);
        $gameSystem.clearNumberInputLimitation();
    };
})();
