//=============================================================================
// SubstituteExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.8.0 2022/10/16 身代わり中だけ指定してステートを付与できる機能を追加
// 1.7.0 2021/09/01 身代わりの発動率を設定するタグを追加
// 1.6.0 2021/07/31 指定した属性の場合のみ身代わりするためのスクリプト凡例を追加
// 1.5.0 2021/07/18 MZで動作するよう修正
// 1.4.1 2020/06/10 1.4.0の修正でパラメータ「身代わり条件_必中以外」が消えていた問題を修正
// 1.4.0 2020/05/19 行動制約「行動できない」状態でも身代わりが発動するように既存仕様を変更する設定を追加
// 1.3.0 2020/04/14 混乱系のステート有効時は身代わりを発動しないように既存仕様を変更する設定を追加
// 1.2.0 2019/12/22 身代わりの判定仕様を変更し、身代わり後の反撃や魔法反射できる機能を追加
// 1.1.0 2018/09/09 身代わりを無効にするスキルやアイテムを直接指定できる機能を追加
// 1.0.2 2017/08/22 身代わり条件「必中以外」を無効にした場合でも必中攻撃に対する身代わりが発動しない場合がある問題を修正
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/02/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 身代わり拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SubstituteExtend.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param condDying
 * @text 身代わり条件_瀕死
 * @desc デフォルトの身代わりされる条件である「瀕死」を有効にします。OFFにすると無効になります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param condNonCertainHit
 * @text 身代わり条件_必中以外
 * @desc デフォルトの身代わり条件である「必中以外」を有効にします。OFFにすると無効になります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param substituteCounter
 * @text 身代わり反撃
 * @desc 身代わりの判定仕様を変更し、身代わり後の反撃や魔法反射が有効になります。
 * @default false
 * @type boolean
 *
 * @param invalidConfused
 * @text 混乱時の身代わり無効
 * @desc 混乱（行動制約が「〇〇を攻撃」のステート）状態の場合、身代わりの発動を無効化します。
 * @default false
 * @type boolean
 *
 * @param validRestriction
 * @text 行動不能時の身代わり有効
 * @desc 行動不能（行動制約が「行動できない」のステート）状態の場合でも、身代わりの発動を有効化します。
 * @default false
 * @type boolean
 *
 * @help 身代わりの仕様を変更します。
 * まずRPGツクールMZ本体の身代わり仕様について説明します。
 * ・身代わりする側
 * 　　生存している
 * 　　行動制約『行動できない』のステートに掛かっていない
 * 　　特徴『身代わり』を保持している
 * ・身代わりされる側
 * 　　瀕死（HPが1/4以下）
 * 　　身代わりする側と同一バトラーでない
 * ・身代わりが発動するスキル
 * 　　命中タイプが『必中』でない
 * ・身代わりの優先度
 * 　　パーティの先頭から順番に『身代わりするバトラー』を判定
 * ・勘違いされやすい仕様
 * 　　行動制約『〇〇を攻撃』のステートに掛かっていても身代わり可能
 * 　　スキルの『範囲』およびスキルの使用者は、身代わり判定とは一切関係ない
 * 　　（命中タイプが必中でないと回復や防御にも身代わりが発動する）
 * 　　判定は一度だけなので、以下のケースでは身代わりは発動しない
 * 　　　・1番目と2番目のバトラーが身代わり可能
 * 　　　・1番目のバトラーが身代わり対象
 *
 * 1. デフォルトの身代わり条件である以下を無効化できます。
 *  ・瀕死（HPが1/4以下）
 *  ・命中タイプが『必中』でない
 *  ・行動制約『行動できない』のステートに掛かっていない
 *
 * なお「命中タイプが『必中』でない」の条件を外すと、防御など無関係の
 * スキルに対しても無差別に身代わりが発動するようになります。
 * 注意して設定してください。
 *
 * 2. 身代わりの詳細な発動条件を細かく設定できます。
 * 特徴を有するデータベースのメモ欄に、以下の通り記述してください。
 * メモ欄の「全ての条件」を満たした場合に身代わりが発動します。
 * 基本的に「特徴」の「身代わり」とセットで記述します。
 *
 * なお、特徴を有するデータベースのメモ欄とは
 * アクター、職業、武器、防具、ステート、敵キャラのいずれかのメモ欄です。
 *
 * <SE_実行者HP率:50>       # 実行者のHPが50%以上のときのみ発動します。
 * <SE_SubjectHPRate:50>    # 同上
 * <SE_対象者HP率:50>       # 対象者のHPが50%以下のときのみ発動します。(※1)
 * <SE_TargetHPRate:50>     # 同上
 * <SE_身代わり対象限定:1>  # 身代わりの対象者を[1]に限定します。(※2)
 * <SE_TargetRestriction:1> # 同上
 * <SE_身代わりスイッチ:4>  # スイッチ[4]がONのときのみ発動します。
 * <SE_SubstituteSwitch:4>  # 同上
 * <SE_身代わり計算式:f>    # 計算式[f]の結果がtrueのときのみ発動します。(※3)
 * <SE_SubstituteFormula:f> # 同上
 * <SE_身代わり率:50>       # 50%の確率で身代わり発動します。
 * <SE_SubstituteRate:50> # 同上
 * <SE_身代わりステート:5>   # 身代わり中だけステート[5]が自動付与されます。
 * <SE_SubstituteState:5> # 同上
 *
 * ※1 パラメータからデフォルトの身代わり条件である「瀕死」を
 * 無効にした場合のみ判定します。
 *
 * ※2 <SE_身代わり対象限定:n>のタグの対象者を設定したい場合、
 * 特徴を有するデータベースのメモ欄に以下の通り記述します。
 *
 * <SE_身代わり対象者:1>   # <SE_身代わり対象限定:1>の対象になります。
 * <SE_SubstituteTarget:1> # 同上
 *
 * 「身代わり対象限定」で指定したパラメータと一致する場合に
 * 身代わり対象になります。
 * 例えば、メモ欄に<SE_身代わり対象限定:2>と記入した場合、同じくメモ欄に
 * <SE_身代わり対象者:2>と記入されている特徴を持つアクターに対してのみ
 * 身代わりを実行します。
 *
 * ※3 上級者向け機能です。
 * また、計算式中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 例：
 * <SE_身代わり計算式:\v[2] &gt; 3> # 変数[2]が[3]より大きい場合、発動します。
 *
 * 計算式中では「action」で対象スキルのActionオブジェクトを参照できます。
 * うまく利用すれば身代わりが発動するスキルを細かく限定できます。
 *
 * 以下が記入例です。
 * <SE_身代わり計算式:action.isAttack()>    # 通常攻撃のみ身代わり発動
 * <SE_身代わり計算式:action.isPhysical()>  # 物理攻撃のみ身代わり発動
 * <SE_身代わり計算式:action.isForOne()>    # 単体対象のみ身代わり発動
 * <SE_身代わり計算式:action.hasElement(2)> # 属性[2]のスキルのみ身代わり発動
 *
 * 3. 身代わり発動時に、指定したIDのスキル効果を身代わり実行者に
 * 適用させることができます。
 * <SE_身代わりスキルID:5>  # 身代わり発動時にスキル[5]を実行者に適用。(※1)
 * <SE_SubstituteSkillId:5> # 同上
 *
 * ※1 ダメージポップアップやアニメーション等の演出は表示されません。
 *
 * 4. 身代わりを無効にするスキルを個別指定できます。
 * スキルもしくはアイテムのメモ欄に以下の通り指定してください。
 * <SE_身代わり無効>
 * <SE_SubstituteInvalid>
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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_BattlerBase
    //  身代わりを実行するかどうかの判定を拡張します。
    //=============================================================================
    const _Game_BattlerBase_isSubstitute      = Game_BattlerBase.prototype.isSubstitute;
    Game_BattlerBase.prototype.isSubstitute = function() {
        if (param.validRestriction) {
            this._suppressRestriction = true;
        }
        const result = _Game_BattlerBase_isSubstitute.apply(this, arguments) && this.isSubstituteExtend();
        this._suppressRestriction = false;
        return result;
    };

    const _Game_BattlerBase_restriction = Game_BattlerBase.prototype.restriction;
    Game_BattlerBase.prototype.restriction = function() {
        return this._suppressRestriction ? 0 : _Game_BattlerBase_restriction.apply(this, arguments);
    };

    Game_BattlerBase.prototype.isSubstituteExtend = function() {
        if (param.invalidConfused && this.isConfused()) {
            return false;
        }
        return this.isValidSubstituteHpRate() &&
            (param.condDying || this.isValidSubstituteTargetHpRate()) &&
            this.isValidSubstituteSwitch() &&
            this.isValidSubstituteRestriction() &&
            this.isValidSubstituteFormula() &&
            this.isValidSubstituteSkill() &&
            this.isValidSubstituteRate();
    };

    Game_BattlerBase.prototype.isValidSubstituteHpRate = function() {
        const subjectHpRate = this.getSubstituteMetaInfo(['SE_SubjectHPRate', 'SE_実行者HP率'], true);
        if (subjectHpRate) {
            return this.hpRate() >= subjectHpRate / 100;
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteTargetHpRate = function() {
        const targetHpRate = this.getSubstituteMetaInfo(['SE_TargetHPRate', 'SE_対象者HP率'], true);
        if (targetHpRate) {
            return BattleManager.checkSubstituteTargetHpRate(targetHpRate);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteRestriction = function() {
        const restrictionId = this.getSubstituteMetaInfo(['SE_TargetRestriction', 'SE_身代わり対象限定'], true);
        if (restrictionId) {
            return BattleManager.checkSubstituteRestriction(restrictionId);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteSwitch = function() {
        const switchId = this.getSubstituteMetaInfo(['SE_SubstituteSwitch', 'SE_身代わりスイッチ'], true);
        if (switchId) {
            return $gameSwitches.value(switchId);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteFormula = function() {
        const formula = this.getSubstituteMetaInfo(['SE_SubstituteFormula', 'SE_身代わり計算式'], false);
        if (formula) {
            const action = BattleManager.getSubstituteAction();
            return eval(formula);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteRate = function() {
        const rate = this.getSubstituteMetaInfo(['SE_SubstituteRate', 'SE_身代わり率'], false);
        if (rate) {
            return Math.randomInt(100) < rate;
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteSkill = function() {
        const item = BattleManager.getSubstituteAction().item();
        return !PluginManagerEx.findMetaValue(item, ['SE_SubstituteInvalid', 'SE_身代わり無効']);
    };

    Game_BattlerBase.prototype.isEqualSubstituteRestrictionId = function(restrictionId) {
        const restrictionTargetId = this.getSubstituteMetaInfo(['SE_SubstituteTarget', 'SE_身代わり対象者'], true);
        return restrictionTargetId === restrictionId;
    };

    Game_BattlerBase.prototype.getSubstituteSkillId = function() {
        return this.getSubstituteMetaInfo(['SE_SubstituteSkillId', 'SE_身代わりスキルID'], true);
    };

    Game_BattlerBase.prototype.getSubstituteStateId = function() {
        return this.getSubstituteMetaInfo(['SE_SubstituteState', 'SE_身代わりステート'], true);
    };

    Game_BattlerBase.prototype.getSubstituteMetaInfo = function(tagNames, isNumber) {
        let metaValue = null;
        this.traitObjects().some(function(traitObject) {
            metaValue = PluginManagerEx.findMetaValue(traitObject, tagNames);
            return !!metaValue;
        });
        return (metaValue && isNumber) ? parseInt(metaValue) : metaValue;
    };

    Game_Action.prototype.hasElement = function(elementId) {
        if (this.item().damage.type === 0) {
            return false;
        }
        const skillElementId = this.item().damage.elementId;
        // Normal attack elementID[-1]
        if (skillElementId === -1) {
            return this.subject().attackElements().contains(elementId);
        } else {
            return elementId === skillElementId;
        }
    };

    //=============================================================================
    // BattleManager
    //  身代わり対象者の情報を保持して必要に応じて評価します。
    //=============================================================================
    const _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
        if (param.substituteCounter) {
            const realTarget = this.applySubstitute(target);
            _BattleManager_invokeAction.call(this, subject, realTarget);
        } else {
            _BattleManager_invokeAction.apply(this, arguments);
        }
    };

    const _BattleManager_applySubstitute = BattleManager.applySubstitute;
    BattleManager.applySubstitute      = function(target) {
        this._substituteTarget = target;
        const substitute = _BattleManager_applySubstitute.apply(this, arguments);
        this._substituteTarget = null;
        if (substitute !== target) {
            this._substitute = substitute;
            this.applySubstituteEffect(substitute);
        }
        return substitute;
    };

    BattleManager.applySubstituteEffect = function(substitute) {
        const skillId = substitute.getSubstituteSkillId();
        if (skillId) {
            const action = new Game_Action(substitute);
            action.setSkill(skillId);
            action.apply(substitute);
        }
        const stateId = substitute.getSubstituteStateId();
        if (stateId) {
            substitute.addState(stateId);
            this._substituteState = stateId;
        }
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        _BattleManager_endAction.apply(this, arguments);
        if (this._substitute && this._substituteState > 0) {
            this._substitute.removeState(this._substituteState);
        }
        this._substituteState = null;
        this._substitute = null;
    };

    BattleManager.checkSubstituteTargetHpRate = function(hpRate) {
        return this._substituteTarget ? this._substituteTarget.hpRate() <= hpRate / 100 : true;
    };

    BattleManager.checkSubstituteRestriction = function(restrictionId) {
        return this._substituteTarget ? this._substituteTarget.isEqualSubstituteRestrictionId(restrictionId) : true;
    };

    BattleManager.getSubstituteAction = function() {
        return this._action;
    };

    const _BattleManager_checkSubstitute = BattleManager.checkSubstitute;
    BattleManager.checkSubstitute      = function(target) {
        const resultSubstitute = _BattleManager_checkSubstitute.apply(this, arguments);
        if (!resultSubstitute) {
            return this.checkSubstituteDefault(target);
        }
        return resultSubstitute;
    };

    BattleManager.checkSubstituteDefault = function(target) {
        return this.isValidSubstituteDying(target) && this.isValidSubstituteCertainHit();
    };

    BattleManager.isValidSubstituteDying = function(target) {
        return !param.condDying || target.isDying();
    };

    BattleManager.isValidSubstituteCertainHit = function() {
        return !param.condNonCertainHit || !this._action.isCertainHit();
    };
})();

