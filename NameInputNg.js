/*=============================================================================
 NameInputNg.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/06/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 名前入力NGプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameInputNg.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param ngNames
 * @text NG名前リスト
 * @desc 名前入力NGにする名前文字列のリストです。
 * @default []
 * @type struct<Name>[]
 *
 * @param partialMatch
 * @text 部分一致
 * @desc 有効にするとアクター名に対する部分一致でNG判定を行います。
 * @default false
 * @type boolean
 *
 * @help NameInputNg.js
 *
 * 名前入力画面で入力できない文字列を設定します。
 * 制御文字\V[n]や\N[n]も設定できます。
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

/*~struct~Name:
 * @param name
 * @text 名前
 * @desc 入力NGにする名前文字列です。制御文字が使えます。
 * @default
 * @type string
 *
 * @param disabledSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのときだけ指定文字列がNGになります。0を指定すると常にNGになります。
 * @default 0
 * @type switch
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_NameInput_onNameOk = Window_NameInput.prototype.onNameOk;
    Window_NameInput.prototype.onNameOk = function() {
        if (this._editWindow.isNgName()) {
            SoundManager.playBuzzer();
            return;
        }
        _Window_NameInput_onNameOk.apply(this, arguments);
    };

    Window_NameEdit.prototype.isNgName = function(name = this._name) {
        return this.findNgNames().some(ngName => {
            ngName = PluginManagerEx.convertEscapeCharacters(ngName);
            return param.partialMatch ? name.includes(ngName) : name === ngName
        });
    };

    Window_NameEdit.prototype.findNgNames = function() {
        return param.ngNames.filter(data => data.disabledSwitch === 0 || $gameSwitches.value(data.disabledSwitch))
            .map(data => data.name);
    };
})();
