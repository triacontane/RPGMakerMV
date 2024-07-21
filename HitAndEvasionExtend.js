/*=============================================================================
 HitAndEvasionExtend.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2024/07/21 命中しなかった場合のメッセージ種別を物理魔法ごとに変更できる機能を追加
 1.2.1 2021/08/08 計算式の間違いを修正
 1.2.0 2021/08/08 MZ向けにリファクタリング
 1.1.0 2021/08/08 デフォルトの計算式をプラグインパラメータのデフォルト値に設定
 1.0.1 2020/04/23 計算式で使用者[a]と対象者[b]のローカル変数が正常に機能していなかった問題を修正
 1.0.0 2018/07/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 命中回避拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HitAndEvasionExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param formulaPhysicalHit
 * @text 物理命中計算式
 * @desc 物理命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default r * a.hit
 *
 * @param formulaMagicalHit
 * @text 魔法命中計算式
 * @desc 魔法命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default r
 *
 * @param formulaPhysicalEvasion
 * @text 物理回避計算式
 * @desc 物理回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default b.eva
 *
 * @param formulaMagicalEvasion
 * @text 魔法回避計算式
 * @desc 魔法回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
 * @default b.mev
 *
 * @param physicalFailureMessageType
 * @text 物理失敗メッセージ種別
 * @desc 物理攻撃が失敗した場合のメッセージ種別(ミス or 行動失敗)
 * @default miss
 * @type select
 * @option ミス
 * @value miss
 * @option 行動失敗
 * @value failure
 *
 * @param magicalFailureMessageType
 * @text 魔法失敗メッセージ種別
 * @desc 魔法攻撃が失敗した場合のメッセージ種別(ミス or 行動失敗)
 * @default failure
 * @type select
 * @option ミス
 * @value miss
 * @option 行動失敗
 * @value failure
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
 * スキルの成功率を「r」で参照できます。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        const a = this.subject();
        const b = target;
        const d = _Game_Action_itemHit.apply(this, arguments);
        const r = this.item().successRate * 0.01;
        if (this.isPhysical() && param.formulaPhysicalHit !== '') {
            return eval(param.formulaPhysicalHit);
        } else if (this.isMagical() && param.formulaMagicalHit !== '') {
            return eval(param.formulaMagicalHit);
        }
        return d;
    };

    const _Game_Action_itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function(target) {
        const a = this.subject();
        const b = target;
        const d = _Game_Action_itemEva.apply(this, arguments);
        const r = this.item().successRate * 0.01;
        if (this.isPhysical() && param.formulaPhysicalEvasion !== '') {
            return eval(param.formulaPhysicalEvasion);
        } else if (this.isMagical() && param.formulaMagicalEvasion !== '') {
            return eval(param.formulaMagicalEvasion);
        }
        return d;
    };

    const _Window_BattleLog_displayMiss = Window_BattleLog.prototype.displayMiss;
    Window_BattleLog.prototype.displayMiss = function(target) {
        const result = target.result();
        const isPhysical = result.physical;
        if (isPhysical) {
            if (param.physicalFailureMessageType === 'failure') {
                result.physical = false;
            }
        } else {
            if (param.magicalFailureMessageType === 'miss') {
                result.physical = true;
            }
        }
        _Window_BattleLog_displayMiss.apply(this, arguments);
        result.physical = isPhysical;
    };
})();
