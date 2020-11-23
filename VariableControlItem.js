//=============================================================================
// VariableControlItem.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2020/11/23 変数操作の実行条件に実行者を指定できる機能を追加
// 1.2.0 2020/11/22 MZで動作するよう全面的に修正
// 1.1.1 2017/04/19 範囲が「なし」の場合も操作できるよう修正
// 1.1.0 2016/10/21 加算と代入を別々のメモ欄で設定できるよう変更
// 1.0.0 2016/10/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc VariableControlItemPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableControlItem.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @help You can manipulate variables when you use an
 * item (skill) and when the action is successful.
 * Specify the following in the memo field of the item or skill.
 * <VCIVarNumber:3>
 * <VCISetValue:5>
 * <VCIAddValue:5>
 * <VCISubject:actor>
 * <VCISubject:enemy>
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 * The "PluginCommonBase.js" is here.
 * (MZ install path)dlc/BasicResources/plugins/official/PluginCommonBase.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 変数操作アイテムプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableControlItem.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @help アイテム（スキル）を使用し、かつ行動が成功した場合に変数を操作できます。
 * アイテムもしくはスキルのメモ欄に以下の通り指定してください。
 *
 * <VCI変数番号:3>  # 変数番号[3]に値を設定します。
 * <VCIVarNumber:3> # 同上
 * <VCI代入値:5>    # 指定した変数に値[5]を代入します。
 * <VCISetValue:5>  # 同上
 * <VCI加算値:5>    # 指定した変数に値[5]を加算します。
 * <VCIAddValue:5>  # 同上
 * <VCI実行者:actor>   # 実行者がアクターの場合のみ変数操作します。
 * <VCISubject:actor> # 同上
 * <VCI実行者:enemy>   # 実行者が敵キャラの場合のみ変数操作します。
 * <VCISubject:enemy> # 同上
 * ※加算値に負の値を指定すると減算になります。
 *
 * 設定値は、制御文字を適用した上でJavaScript計算式として評価されます。
 * 例えばアイテムの使用で変数[1]に[5]を乗算したい場合は以下の通り設定します。
 * <VCI変数番号:1>
 * <VCI代入値:\v[1] * 5> # 変数[1]の値に[5]を乗算した結果を変数[1]に設定
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

(function() {
    'use strict';

    //=============================================================================
    // Game_Action
    //  行動が成功した場合、変数の操作を実行します。
    //=============================================================================
    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        if (!this.isForNone()) {
            this.applyVariableControl();
        }
    };

    const _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function(target) {
        _Game_Action_applyGlobal.apply(this, arguments);
        if (this.isForNone()) {
            this.applyVariableControl();
        }
    };

    Game_Action.prototype.isForNone = function() {
        return this.checkItemScope([0]);
    };

    Game_Action.prototype.applyVariableControl = function() {
        if (!this.isVariableControlSubject()) {
            return;
        }
        const varNumberStr = this.findMetaForVariableControl(['VarNumber', '変数番号']);
        if (varNumberStr) {
            const varNumber = parseInt(varNumberStr);
            const setValue = this.findMetaForVariableControl(['SetValue', '代入値']);
            if (setValue) {
                $gameVariables.setValue(varNumber, eval(setValue));
                return;
            }
            const addValue = this.findMetaForVariableControl(['AddValue', '加算値']);
            if (addValue) {
                const originalValue = $gameVariables.value(varNumber);
                $gameVariables.setValue(varNumber, originalValue + eval(addValue));
            }
        }
    };

    Game_Action.prototype.isVariableControlSubject = function() {
        let subject = this.findMetaForVariableControl(['Subject', '実行者']);
        if (!subject || subject === true) {
            return true;
        }
        subject = subject.toLowerCase();
        if (subject === 'actor' && this._subjectEnemyIndex >= 0) {
            return false;
        }
        if (subject === 'enemy' && this._subjectActorId > 0) {
            return false;
        }
        return true;
    };

    Game_Action.prototype.findMetaForVariableControl = function(tags) {
        return PluginManagerEx.findMetaValue(this.item(), tags.map(tag => 'VCI' + tag))
    };
})();

