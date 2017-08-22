//=============================================================================
// SubstituteExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2017/08/22 身代わり条件「必中以外」を無効にした場合でも必中攻撃に対する身代わりが発動しない場合がある問題を修正
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/02/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SubstituteExtendPlugin
 * @author triacontane
 *
 * @param CondDying
 * @desc デフォルトの身代わり条件である「瀕死」を有効にします。OFFにすると無効になります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param CondNonCertainHit
 * @desc デフォルトの身代わり条件である「必中以外」を有効にします。OFFにすると無効になります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @help 以下の内容に沿って身代わりの仕様を拡張します。
 *
 * 1. デフォルトの身代わり条件である以下の二つを無効化できます。
 *  ・瀕死(残HP25%以下)
 *  ・スキルタイプ「必中」以外
 *
 * なお「スキルタイプ「必中」以外」の条件を外すと、防御など無関係の
 * スキルに対しても無差別に「身代わり」が発動するようになります。
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
 * 「身代わり対象限定」で指定したパラメータと一致する場合に身代わり対象になります。
 * 例えば、メモ欄に<SE_身代わり対象限定:2>と記入した場合、同じくメモ欄に
 * <SE_身代わり対象者:2>と記入されている特徴を持つアクターに対してのみ
 * 身代わりを実行します。
 *
 * ※3 上級者向け機能です。
 * また、計算式中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 例：<SE_身代わり計算式:\v[2] &gt; 3> # 変数[2]が[3]より大きい場合、発動します。
 *
 * 計算式中では「action」で対象スキルのActionオブジェクトを参照できます。
 * うまく利用すれば身代わりが発動するスキルを細かく限定できます。
 *
 * 以下が記入例です。
 * <SE_身代わり計算式:action.isAttack()>    # 通常攻撃のみ身代わり発動
 * <SE_身代わり計算式:action.isPhysical()>  # 物理攻撃のみ身代わり発動
 * <SE_身代わり計算式:action.isForOne()>    # 単体対象のみ身代わり発動
 *
 * 3. 身代わり発動時に、指定したIDのスキル効果を身代わり実行者に
 * 適用させることができます。
 * <SE_身代わりスキルID:5>  # 身代わり発動時にスキル[5]を実行者に適用。(※1)
 * <SE_SubstituteSkillId:5> # 同上
 *
 * ※1 ダメージポップアップやアニメーション等の演出は表示されません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 身代わり拡張プラグイン
 * @author トリアコンタン
 *
 * @param 身代わり条件_瀕死
 * @desc デフォルトの身代わり条件である「瀕死」を有効にします。OFFにすると無効になります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param 身代わり条件_必中以外
 * @desc デフォルトの身代わり条件である「必中以外」を有効にします。OFFにすると無効になります。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @help 以下の内容に沿って身代わりの仕様を拡張します。
 *
 * 1. デフォルトの身代わり条件である以下の二つを無効化できます。
 *  ・瀕死(残HP25%以下)
 *  ・スキルタイプ「必中」以外
 *
 * なお「スキルタイプ「必中」以外」の条件を外すと、防御など無関係の
 * スキルに対しても無差別に「身代わり」が発動するようになります。
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
 * 「身代わり対象限定」で指定したパラメータと一致する場合に身代わり対象になります。
 * 例えば、メモ欄に<SE_身代わり対象限定:2>と記入した場合、同じくメモ欄に
 * <SE_身代わり対象者:2>と記入されている特徴を持つアクターに対してのみ
 * 身代わりを実行します。
 *
 * ※3 上級者向け機能です。
 * また、計算式中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 例：<SE_身代わり計算式:\v[2] &gt; 3> # 変数[2]が[3]より大きい場合、発動します。
 *
 * 計算式中では「action」で対象スキルのActionオブジェクトを参照できます。
 * うまく利用すれば身代わりが発動するスキルを細かく限定できます。
 *
 * 以下が記入例です。
 * <SE_身代わり計算式:action.isAttack()>    # 通常攻撃のみ身代わり発動
 * <SE_身代わり計算式:action.isPhysical()>  # 物理攻撃のみ身代わり発動
 * <SE_身代わり計算式:action.isForOne()>    # 単体対象のみ身代わり発動
 *
 * 3. 身代わり発動時に、指定したIDのスキル効果を身代わり実行者に
 * 適用させることができます。
 * <SE_身代わりスキルID:5>  # 身代わり発動時にスキル[5]を実行者に適用。(※1)
 * <SE_SubstituteSkillId:5> # 同上
 *
 * ※1 ダメージポップアップやアニメーション等の演出は表示されません。
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
    var pluginName    = 'SubstituteExtend';
    var metaTagPrefix = 'SE_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertEscapeTags = function(text) {
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        return text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param             = {};
    param.condDying         = getParamBoolean(['CondDying', '身代わり条件_瀕死']);
    param.condNonCertainHit = getParamBoolean(['CondNonCertainHit', '身代わり条件_必中以外']);

    //=============================================================================
    // Game_BattlerBase
    //  身代わりを実行するかどうかの判定を拡張します。
    //=============================================================================
    var _Game_BattlerBase_isSubstitute      = Game_BattlerBase.prototype.isSubstitute;
    Game_BattlerBase.prototype.isSubstitute = function() {
        return _Game_BattlerBase_isSubstitute.apply(this, arguments) && this.isSubstituteExtend();
    };

    Game_BattlerBase.prototype.isSubstituteExtend = function() {
        return this.isValidSubstituteHpRate() &&
            (param.condDying || this.isValidSubstituteTargetHpRate()) &&
            this.isValidSubstituteSwitch() &&
            this.isValidSubstituteRestriction() &&
            this.isValidSubstituteFormula();
    };

    Game_BattlerBase.prototype.isValidSubstituteHpRate = function() {
        var subjectHpRate = this.getSubstituteMetaInfo(['SubjectHPRate', '実行者HP率'], true);
        if (subjectHpRate) {
            return this.hpRate() >= subjectHpRate / 100;
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteTargetHpRate = function() {
        var targetHpRate = this.getSubstituteMetaInfo(['TargetHPRate', '対象者HP率'], true);
        if (targetHpRate) {
            return BattleManager.checkSubstituteTargetHpRate(targetHpRate);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteRestriction = function() {
        var restrictionId = this.getSubstituteMetaInfo(['TargetRestriction', '身代わり対象限定'], true);
        if (restrictionId) {
            return BattleManager.checkSubstituteRestriction(restrictionId);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteSwitch = function() {
        var switchId = this.getSubstituteMetaInfo(['SubstituteSwitch', '身代わりスイッチ'], true);
        if (switchId) {
            return $gameSwitches.value(switchId);
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidSubstituteFormula = function() {
        var formula = this.getSubstituteMetaInfo(['SubstituteFormula', '身代わり計算式'], false);
        if (formula) {
            var action = BattleManager.getSubstituteAction();
            return eval(convertEscapeTags(formula));
        }
        return true;
    };

    Game_BattlerBase.prototype.isEqualSubstituteRestrictionId = function(restrictionId) {
        var restrictionTargetId = this.getSubstituteMetaInfo(['SubstituteTarget', '身代わり対象者'], true);
        return restrictionTargetId === restrictionId;
    };

    Game_BattlerBase.prototype.getSubstituteSkillId = function() {
        return this.getSubstituteMetaInfo(['SubstituteSkillId', '身代わりスキルID'], true);
    };

    Game_BattlerBase.prototype.getSubstituteMetaInfo = function(tagNames, isNumber) {
        var metaValue;
        this.traitObjects().some(function(traitObject) {
            metaValue = getMetaValues(traitObject, tagNames);
            return !!metaValue;
        });
        return (metaValue && isNumber) ? parseInt(metaValue) : metaValue;
    };

    //=============================================================================
    // BattleManager
    //  身代わり対象者の情報を保持して必要に応じて評価します。
    //=============================================================================
    var _BattleManager_applySubstitute = BattleManager.applySubstitute;
    BattleManager.applySubstitute      = function(target) {
        this._substituteTarget = target;
        var substitute = _BattleManager_applySubstitute.apply(this, arguments);
        this._substituteTarget = null;
        if (substitute !== target) {
            this.applySubstituteEffect(substitute);
        }
        return substitute;
    };

    BattleManager.applySubstituteEffect = function(substitute) {
        var skillId = substitute.getSubstituteSkillId();
        if (!skillId) return;
        var action = new Game_Action(substitute);
        action.setSkill(skillId);
        action.apply(substitute);
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

    var _BattleManager_checkSubstitute = BattleManager.checkSubstitute;
    BattleManager.checkSubstitute      = function(target) {
        var resultSubstitute = _BattleManager_checkSubstitute.apply(this, arguments);
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

