/*=============================================================================
 AutoActionExclude.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/05/03 条件にスクリプトを追加
 1.0.0 2023/05/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 自動戦闘の対象外スキル設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoActionExclude.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param skillList
 * @text スキルリスト
 * @desc 自動戦闘時に対象外にするスキルのリストです。
 * @default []
 * @type struct<SKILL>[]
 *
 * @help AutoActionExclude.js
 *
 * 自動戦闘時に対象外にするスキルを設定できます。
 * パラメータから対象外にするスキルを設定してください。
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

/*~struct~SKILL:
 * @param id
 * @text スキルID
 * @desc スキルIDです。
 * @default 1
 * @type skill
 *
 * @param conditionSwitch
 * @text 条件スイッチ
 * @desc 指定したスイッチがONのときのみ対象外になります。
 * @default 0
 * @type switch
 *
 * @param conditionScript
 * @text 条件スクリプト
 * @desc 指定したスクリプトがtrueのときのみ対象外になります。
 * @default
 * @type multiline_string
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.skillList) {
        param.skillList = [];
    }

    const _Game_Action_evaluate = Game_Action.prototype.evaluate;
    Game_Action.prototype.evaluate = function() {
        const evaluate = _Game_Action_evaluate.apply(this, arguments);
        if (this.isAutoExclude()) {
            return -Number.MAX_VALUE;
        } else {
            return evaluate;
        }
    };

    Game_Action.prototype.isAutoExclude = function() {
        return param.skillList.some(skill => {
            return skill.id === this.item().id
                && (!skill.conditionSwitch || $gameSwitches.value(skill.conditionSwitch))
                && (!skill.conditionScript || eval(skill.conditionScript));
        });
    };
})();
