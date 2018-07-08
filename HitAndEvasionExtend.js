/*=============================================================================
 HitAndEvasionExtend.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/07/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc HitAndEvasionExtendPlugin
 * @author triacontane
 *
 * @param formulaPhysicalHit
 * @text 物理命中計算式
 * @desc 物理命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @param formulaMagicalHit
 * @text 魔法命中計算式
 * @desc 魔法命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @param formulaPhysicalEvasion
 * @text 物理回避計算式
 * @desc 物理回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @param formulaMagicalEvasion
 * @text 魔法回避計算式
 * @desc 魔法回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @help HitAndEvasionExtend.js
 *
 * 命中と回避の計算式を拡張します。
 * パラメータにて物理、魔法ごとに命中計算式、回避計算式を指定できます。
 * 計算式の結果は原則「0」～「1」の範囲に収まるように設定してください。
 * 「0」以下だと0%、「1」以上だと100%として扱われます。
 *
 * 計算式はJavaScript計算式を指定しますので文法エラーにはご注意ください。
 * ダメージ計算式と同様に、使用者を「a」、対象者を「b」で参照します。
 * 詳細はデータベースのダメージ計算式のtooltipを参照してください。
 * (例)
 * a.atk : 使用者の攻撃力
 * b.agi : 対象者の敏捷性
 * またデフォルトの判定結果を「d」で参照できます。
 * ゲーム変数の値は制御文字「\v[n]」で参照できます。
 *
 * 【参考】デフォルトの計算式は以下の通りです。
 * 命中判定もしくは回避判定のいずれかで失敗すると行動は失敗となります。
 * ・物理命中
 * スキルの成功率 * 実行者の命中率
 *
 * ・魔法命中
 * スキルの成功率
 *
 * ・物理回避
 * 対象者の回避率
 *
 * ・魔法回避
 * 対象者の魔法回避率
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 命中回避拡張プラグイン
 * @author トリアコンタン
 *
 * @param formulaPhysicalHit
 * @text 物理命中計算式
 * @desc 物理命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @param formulaMagicalHit
 * @text 魔法命中計算式
 * @desc 魔法命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @param formulaPhysicalEvasion
 * @text 物理回避計算式
 * @desc 物理回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @param formulaMagicalEvasion
 * @text 魔法回避計算式
 * @desc 魔法回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default
 *
 * @help HitAndEvasionExtend.js
 *
 * 命中と回避の計算式を拡張します。
 * パラメータにて物理、魔法ごとに命中計算式、回避計算式を指定できます。
 * 計算式の結果は原則「0」～「1」の範囲に収まるように設定してください。
 * 「0」以下だと0%、「1」以上だと100%として扱われます。
 *
 * 計算式はJavaScript計算式を指定しますので文法エラーにはご注意ください。
 * ダメージ計算式と同様に、使用者を「a」、対象者を「b」で参照します。
 * 詳細はデータベースのダメージ計算式のtooltipを参照してください。
 * (例)
 * a.atk : 使用者の攻撃力
 * b.agi : 対象者の敏捷性
 * またデフォルトの判定結果を「d」で参照できます。
 * ゲーム変数の値は制御文字「\v[n]」で参照できます。
 *
 * 【参考】デフォルトの計算式は以下の通りです。
 * 命中判定もしくは回避判定のいずれかで失敗すると行動は失敗となります。
 * ・物理命中
 * スキルの成功率 * 実行者の命中率
 *
 * ・魔法命中
 * スキルの成功率
 *
 * ・物理回避
 * 対象者の回避率
 *
 * ・魔法回避
 * 対象者の魔法回避率
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('HitAndEvasionExtend');

    var _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        var d = _Game_Action_itemHit.apply(this, arguments);
        if (this.isPhysical() && param.formulaPhysicalHit !== '') {
            return eval(convertEscapeCharacters(param.formulaPhysicalHit));
        } else if (this.isMagical() && param.formulaMagicalHit !== '') {
            return eval(convertEscapeCharacters(param.formulaMagicalHit));
        }
        return d;
    };

    var _Game_Action_itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function(target) {
        var d = _Game_Action_itemEva.apply(this, arguments);
        if (this.isPhysical() && param.formulaPhysicalEvasion !== '') {
            return eval(convertEscapeCharacters(param.formulaPhysicalEvasion));
        } else if (this.isMagical() && param.formulaMagicalEvasion !== '') {
            return eval(convertEscapeCharacters(param.formulaMagicalEvasion));
        }
        return d;
    };
})();
