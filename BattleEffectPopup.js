//=============================================================================
// BattleEffectPopup.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.9.0 2024/11/27 ポップアップテキストのフォントサイズとフォント名称を指定できる機能を追加
// 2.8.0 2024/11/19 対象がステートに対する完全な耐性をもっていた場合にポップアップする機能を追加
//                  ポップアップテキストのカラーをテキストカラーから選択できる機能を追加
// 2.7.0 2024/05/03 弱点と耐性のポップアップ閾値を変更できる機能を追加
// 2.6.1 2023/10/24 物理ダメージ率および魔法ダメージ率によってダメージが無効化されたときもガードのポップアップ判定を有効にするよう修正
// 2.6.0 2022/10/22 ポップアップの対象外スキルを設定できる機能を追加
// 2.5.0 2022/08/12 弱点耐性ポップアップの対象にならない属性を指定できるパラメータを追加
// 2.4.0 2022/07/16 ポップアップメッセージが重なったときに次のメッセージが表示されるY座標を補正できる機能を追加
// 2.3.0 2022/03/25 バフおよびデバフをポップアップする機能を追加
// 2.2.3 2022/02/11 色指定の凡例の記法が一部間違っていたので修正
// 2.2.2 2022/02/11 自動戦闘や他のプラグインと組み合わせたとき、耐性や弱点のポップアップが意図せず表示される場合がある問題を修正
// 2.2.1 2021/08/05 ポップアップパラメータが空の場合にエラーが発生する問題を修正
// 2.2.0 2021/04/21 身代わり発生時にポップアップする機能を追加
// 2.1.4 2021/02/06 2.1.3の修正で特定のポップアップが重なったときにエラーになる問題を修正
// 2.1.3 2021/01/31 戦闘開始時にパーティのポップアップが残っていた場合、消去するよう修正
// 2.1.2 2021/01/24 静止画像を指定してポップアップしたとき、ポップアップ削除時にdestroyしてしまう問題を修正
// 2.1.1 2021/01/24 ベースプラグインの記述を追加
// 2.1.0 2021/01/24 ポップアップカラーの凡例を追加。メッセージの表示タイミングを微調整
// 2.0.0 2021/01/21 MZ版としてほぼ全面的に再作成
// 1.9.2 2020/04/15 MOG_BattleHud.jsと併用したとき、フロントビューで味方にポップアップメッセージが表示されるよう変更
// 1.9.1 2020/03/15 YEP_X_ActSeqPack1.jsでステート付与に成功してもステート付与メッセージがでない不具合を代わりに修正
// 1.9.0 2020/02/11 ポップアップメッセージが重なったときに次のポップアップまでのウェイトが指定できる機能を追加
// 1.8.1 2019/02/26 KMS_SomStyleDamage.jsとの競合を解消。こちらのポップアップもKMS_SomStyleDamage.jsと同じ動きをします。
// 1.8.0 2018/10/13 パラメータの型指定機能に対応
//                  コモンイベントが呼び出された場合は無効ポップアップを出さないよう仕様変更
// 1.7.2 2018/10/07 プラグインコマンド「対象者ポップアップ」にて競合等の理由で対象が見付からない場合にエラーを回避するよう修正
// 1.7.1 2017/08/03 YEP_BattleEngineCore.jsと併用したときに、メッセージの種類によってポップアップ位置が変化する問題を修正
// 1.7.0 2017/06/13 行動がガード（耐性によって完全に防がれた）された場合のポップアップを追加
// 1.6.0 2017/06/10 行動が無効だった場合のポップアップを追加
// 1.5.1 2017/06/10 自動戦闘が有効なアクターがいる場合に一部機能が正常に動作しない問題を修正
// 1.5.0 2017/05/30 弱点と耐性のポップアップで弱点や耐性と見なすための閾値を設定できる機能を追加
// 1.4.0 2017/05/20 CounterExtend.jsとの併用でスキルによる反撃が表示されない問題を修正。
//                  ポップアップのイタリック体および縁取り表示を行う機能を追加。
// 1.3.1 2016/12/18 VE_BasicModule.jsとの競合を解消
// 1.3.0 2016/07/14 アクターと敵キャラの通常ダメージにも専用のフラッシュ色を指定できるようになりました。
// 1.2.3 2016/07/13 1.2.2の修正が不完全だったのを対応
// 1.2.2 2016/07/13 YEP_BattleEngineCore.jsと併用したときに、Missが重複して表示される現象を修正
// 1.2.1 2016/07/12 Z座標を指定しているプラグインとの競合を解消するかもしれない
// 1.2.0 2016/07/10 行動失敗時(Miss!)も任意の文字または画像に置き換えられるようになりました。
// 1.1.0 2016/07/09 ポップアップに任意の画像を指定できるようになりました。
//                  フラッシュするフレーム数を指定できるようになりました。
// 1.0.0 2016/07/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘行動結果ポップアッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleEffectPopup.js
 * @base PluginCommonBase
 * @author トリアコンタン
 * 
 * @param Critical
 * @text クリティカルポップアップ
 * @desc クリティカル発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Critical","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Avoid
 * @text 回避ポップアップ
 * @desc 回避発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Avoid","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Miss
 * @text ミスポップアップ
 * @desc ミス発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Miss","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Buff
 * @text バフポップアップ
 * @desc バフ発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"%1 UP!","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Debuff
 * @text デバフポップアップ
 * @desc デバフ発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"%1 DOWN!","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param ParamName
 * @text パラメータ名称
 * @desc バフポップアップ用のパラメータ名称です。
 * @type string[]
 * @default ["MaxHP","MaxMP","ATK","DEF","MAG","MDF","AGI","LUK"]
 * 
 * @param Invalid
 * @text 無効ポップアップ
 * @desc 行動が無効（行動は成功したが有効な効果がなかった）だった時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Invalid","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Guard
 * @text ガードポップアップ
 * @desc 行動がガード（行動は成功したが相手の耐性によって完全に防がれた）された時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Guard","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param StateGuard
 * @text ステート無効ポップアップ
 * @desc ステートに対する完全な耐性（ステート有効度0%もしくはステート無効化）があった場合のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"State Guard","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Reflection
 * @text 魔法反射ポップアップ
 * @desc 魔法反射時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Reflection","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Counter
 * @text 反撃ポップアップ
 * @desc 反撃時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Counter","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Substitute
 * @text 身代わりポップアップ
 * @desc 身代わり時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Substitute","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param SubstituteTarget
 * @text 身代わり対象にポップアップ
 * @desc 有効にすると身代わりのポップアップ対象が『身代わりしてもらった側』になります。
 * @type boolean
 * @default false
 * 
 * @param Weakness
 * @text 弱点ポップアップ
 * @desc 弱点時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Weakness","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Resistance
 * @text 耐性ポップアップ
 * @desc 耐性時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Resist","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param IgnoreElements
 * @text 弱点耐性無視属性リスト
 * @desc リストに含まれる番号の属性は弱点耐性ポップアップの対象から除外されます。
 * @type number[]
 * @default []
 *
 * @param StateList
 * @text ステートポップアップリスト
 * @desc ステートが発生したときのポップアップ情報リストです。必ず「ステートID」を指定して下さい。
 * @type struct<Popup>[]
 * @default []
 *
 * @param MaxWidth
 * @text メッセージ最大幅
 * @desc ポップアップメッセージの最大幅です。
 * @default 240
 * @type number
 *
 * @param OffsetX
 * @text X座標補正
 * @desc ポップアップのX座標補正値です。
 * @default 0
 * @type number
 * @min -999
 * @max 999
 *
 * @param OffsetY
 * @text Y座標補正
 * @desc ポップアップのY座標の補正値です。
 * @default 0
 * @type number
 * @min -999
 * @max 999
 *
 * @param MessageWait
 * @text メッセージウェイト
 * @desc ポップアップメッセージが重なったときに次のメッセージが表示されるまでのウェイトフレーム数です。
 * @default 16
 * @type number
 *
 * @param MessageMarginY
 * @text メッセージ間隔Y
 * @desc ポップアップメッセージが重なったときに次のメッセージが表示されるY座標を補正します。
 * @default 16
 * @type number
 *
 * @param weaknessThreshold
 * @text 弱点閾値
 * @desc 弱点と見なすダメージ倍率の閾値です。百分率(%)で指定します。
 * @default 110
 * @type number
 *
 * @param resistanceThreshold
 * @text 耐性閾値
 * @desc 耐性と見なすダメージ倍率の閾値です。百分率(%)で指定します。
 * @default 90
 * @type number
 *
 * @command USER_POPUP
 * @text 使用者ポップアップ
 * @desc スキルの使用者にポップアップ表示します。
 *
 * @arg value
 * @text ポップアップ情報
 * @desc ポップアップ表示する情報です。
 * @default 
 * @type struct<Popup>
 *
 * @command TARGET_POPUP
 * @text 対象者ポップアップ
 * @desc スキルの対象者にポップアップ表示します。
 *
 * @arg value
 * @text ポップアップ情報
 * @desc ポップアップ表示する情報です。
 * @default 
 * @type struct<Popup>
 *
 * @help 戦闘中に行動の結果のメッセージをポップアップします。
 * ポップアップするのは動的に作成した文字列もしくは用意したピクチャです。
 * 表示条件は以下の通りです。
 * ポップアップのフォントはデータベースで指定した数字フォントが使われます。
 *
 * ・失敗（通常のMissは表示されなくなります）
 * ・回避（通常のMissは表示されなくなります）
 * ・無効（行動は成功したが有効な効果がなかった）
 * ・ガード（行動は成功したが相手の耐性によって完全に防がれた）
 * ・クリティカル
 * ・反撃
 * ・魔法反射
 * ・弱点（ダメージ倍率が1.1を上回った場合）
 * ・耐性（ダメージ倍率が0.9を下回った場合）
 * ・ステート付与（ステートごとに設定できます）
 * ・コモンイベント（プラグインコマンドから実行します）
 *
 * ※ガードが表示されるのは、ステート有効度もしくは属性有効度が0%の効果が
 * 存在し、かつ他に有効な効果がない場合です。
 * なお、「ステート無効化」で防がれた場合は表示されません。
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

/*~struct~Popup:
 * 
 * @param text
 * @text ポップアップテキスト
 * @desc ポップアップテキストです。
 * 
 * @param fileName
 * @text ポップアップファイル
 * @desc ポップアップする画像ファイルです。指定した場合、テキスト表示より優先されます。
 * @type file
 * @dir img/pictures
 *
 * @param stateId
 * @text ステートID
 * @desc ポップアップ表示対象のステートIDです。ステートリスト以外では指定不要です。
 * @type state
 *
 * @param invalidSkillList
 * @text 無効スキルリスト
 * @desc 指定したスキルではこのポップアップは使用されません。
 * @type skill[]
 * @default []
 *
 * @param color
 * @text ポップアップカラー
 * @desc ポップアップカラーです。CSSの色指定文字列を指定します。
 * @default
 * @type combo
 * @option rgba(255, 255, 255, 1.0)
 * @option hsla(60, 100%, 50%, 1.0)
 * @option #99FF66
 * @option black
 * @option silver
 * @option gray
 * @option white
 * @option maroon
 * @option red
 * @option purple
 * @option fuchsia
 * @option green
 * @option lime
 * @option olive
 * @option yellow
 * @option navy
 * @option blue
 * @option teal
 * @option aqua
 *
 * @param textColor
 * @text テキストカラー
 * @desc ポップアップカラーをテキストカラー(\c[n])から指定します。
 * @type color
 *
 * @param textSize
 * @text テキストサイズ
 * @desc ポップアップテキストのサイズです。0を指定した場合、デフォルトサイズとなります。
 * @default 0
 *
 * @param fontFace
 * @text フォント名称
 * @desc ポップアップテキストのフォント名称です。指定する場合、別途フォントロードプラグインが必要です。
 * @default
 * 
 * @param flash
 * @text フラッシュ
 * @desc ポップアップ時のフラッシュカラーです。
 * @type struct<Color>
 * @default
 *
 * @param se
 * @text 効果音
 * @desc ポップアップ時の効果音です。
 * @type struct<SE>
 * @default
 *
 */

/*~struct~Color:
 *
 * @param red
 * @text 赤色
 * @desc フラッシュの赤色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param green
 * @text 緑色
 * @desc フラッシュの緑色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param blue
 * @text 青色
 * @desc フラッシュの青色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param alpha
 * @text 強さ
 * @desc フラッシュの強さです。
 * @default 0
 * @type number
 * @max 255
 */

/*~struct~SE:
 *
 * @param name
 * @text ファイル名
 * @desc ファイル名です。
 * @require 1
 * @dir audio/se/
 * @type file
 * @default
 *
 * @param volume
 * @text ボリューム
 * @desc ボリュームです。
 * @type number
 * @default 90
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 定位
 * @desc 定位(左右バランス)です。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'USER_POPUP', args => {
        BattleManager.getActionTarget().subject.startMessagePopup(args.value);
    });

    PluginManagerEx.registerCommand(script, 'TARGET_POPUP', args => {
        BattleManager.getActionTarget().targets.forEach(target => target.startMessagePopup(args.value));
    });

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.members().forEach(actor => actor.initMessagePopup());
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        this._actionTarget = {
            subject: this._subject,
            targets: this._targets.clone()
        };
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        this._actionTarget = null;
        _BattleManager_endBattle.apply(this, arguments);
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        _BattleManager_endAction.apply(this, arguments);
        this._usedItem = null;
    };

    BattleManager.getActionTarget = function() {
        return this._actionTarget;
    };

    BattleManager.setUsedItem = function(item) {
        this._usedItem = item;
    };

    BattleManager.isValidEffectPopup = function(popUp) {
        if (DataManager.isSkill(this._usedItem) && popUp.invalidSkillList) {
            return !popUp.invalidSkillList.includes(this._usedItem.id);
        } else {
            return true;
        }
    };


    //=============================================================================
    // Game_Action
    //  弱点によってポップアップを設定します。
    //=============================================================================
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        BattleManager.setUsedItem(this.item());
        this._elementResult = {};
        _Game_Action_apply.apply(this, arguments);
        if (this._elementResult.guard) {
            target.appointMessagePopup(param.Guard);
        }
        if (this._elementResult.weakness) {
            target.appointMessagePopup(param.Weakness);
        }
        if (this._elementResult.resist) {
            target.appointMessagePopup(param.Resistance);
        }
        if (this._elementResult.stateGuard) {
            target.appointMessagePopup(param.StateGuard);
        }
        this._elementResult = null;
    };

    const _Game_Action_itemEffectAddState = Game_Action.prototype.itemEffectAddState;
    Game_Action.prototype.itemEffectAddState = function(target, effect) {
        _Game_Action_itemEffectAddState.apply(this, arguments);
        if (this._elementResult) {
            this.itemEffectStateGuard(target, effect);
        }
    };

    Game_Action.prototype.itemEffectStateGuard = function(target, effect) {
        const states = effect.dataId === 0 ? this.subject().attackStates() : [effect.dataId];
        states.forEach(stateId => {
            if (!target.isStateAffected(stateId) && (target.stateRate(stateId) === 0 || target.isStateResist(stateId))) {
                this._elementResult.stateGuard = true;
            }
        });
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const result = _Game_Action_calcElementRate.apply(this, arguments);
        if (param.IgnoreElements && param.IgnoreElements.includes(this.findActionElement())) {
            return  result;
        }
        if (this._elementResult) {
            const weaknessThreshold = (param.weaknessThreshold || 110) / 100;
            const resistanceThreshold = (param.resistanceThreshold || 90) / 100;
            if (result === 0 || (this.isPhysical() && target.pdr === 0) || (this.isMagical() && target.mdr === 0)) {
                this._elementResult.guard = true;
            } else if (result >= weaknessThreshold) {
                this._elementResult.weakness = true;
            } else if (result <= resistanceThreshold) {
                this._elementResult.resist = true;
            }
        }
        return result;
    };

    Game_Action.prototype.findActionElement = function() {
        if (this.item().damage.elementId < 0) {
            return this.subject().attackElements();
        } else {
            return this.item().damage.elementId;
        }
    };

    //=============================================================================
    // Game_Battler
    //  ポップアップメッセージのリクエストに応答します。
    //=============================================================================
    Game_Battler.prototype.clearMessagePopup = function() {
        this._messagePopup = null;
    };

    Game_Battler.prototype.initMessagePopup = function() {
        this._messagePopup = null;
        this._appointPopup = null;
    };

    Game_Battler.prototype.isMessagePopupRequested = function() {
        return !!this._messagePopup;
    };

    Game_Battler.prototype.startMessagePopup = function(popUp) {
        if (!BattleManager.isValidEffectPopup(popUp)) {
            return;
        }
        if (popUp && (popUp.text || popUp.fileName)) {
            this._messagePopup = popUp;
        }
    };

    Game_Battler.prototype.startAppointMessagePopup = function() {
        this.startMessagePopup(this._appointPopup);
        this._appointPopup = null;
    };

    Game_Battler.prototype.appointMessagePopup = function(popUp) {
        this._appointPopup = popUp;
    };

    Game_Battler.prototype.getMessagePopup = function() {
        return this._messagePopup;
    };

    const _Game_Battler_stateRate = Game_Battler.prototype.stateRate;
    Game_Battler.prototype.stateRate = function(stateId) {
        const rate = _Game_Battler_stateRate.apply(this, arguments);
        if (rate === 0) {
            this.result().guarded = true;
        }
        return rate;
    };

    Game_Battler.prototype.hasAppointPopup = function() {
        return !!this._appointPopup;
    };

    //=============================================================================
    // Game_ActionResult
    //  行動が無効だったかどうかを返します。
    //=============================================================================
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.guarded = false;
    };

    Game_ActionResult.prototype.isInvalid = function() {
        return !this.success && !this.missed && !this.evaded && !$gameTemp.isCommonEventReserved();
    };

    Game_ActionResult.prototype.isGuarded = function() {
        return this.guarded && this.isInvalid();
    };

    Game_ActionResult.prototype.findResultPopup = function() {
        if (this.critical) {
            return param.Critical;
        } else if (this.isGuarded()) {
            return param.Guard;
        } else if (this.isInvalid()) {
            return param.Invalid;
        } else if (this.missed) {
            return param.Miss;
        } else if (this.evaded) {
            return param.Avoid;
        } else {
            return null;
        }
    };

    //=============================================================================
    // Window_BattleLog
    //  ポップアップメッセージをリクエストします。
    //=============================================================================
    Window_BattleLog.prototype.popupMessage = function(target, popUp) {
        target.startMessagePopup(popUp);
    };

    Window_BattleLog.prototype.popupAppointMessage = function(target) {
        target.startAppointMessagePopup();
    };

    const _Window_BattleLog_displayCritical = Window_BattleLog.prototype.displayCritical;
    Window_BattleLog.prototype.displayCritical = function(target) {
        _Window_BattleLog_displayCritical.apply(this, arguments);
        this.displayResultPopup(target);
    };

    Window_BattleLog.prototype.displayResultPopup = function(target) {
        const popup = target.result().findResultPopup();
        if (popup) {
            this.pushPopupMessage(target, popup);
        }
        if (target.hasAppointPopup()) {
            this.pushPopupAppointMessage(target);
        }
    };

    const _Window_BattleLog_displayCounter = Window_BattleLog.prototype.displayCounter;
    Window_BattleLog.prototype.displayCounter = function(target) {
        _Window_BattleLog_displayCounter.apply(this, arguments);
        this.pushPopupMessage(target, param.Counter);
    };

    const _Window_BattleLog_displaySubstitute = Window_BattleLog.prototype.displaySubstitute;
    Window_BattleLog.prototype.displaySubstitute = function(substitute, target) {
        _Window_BattleLog_displaySubstitute.apply(this, arguments);
        this.pushPopupMessage(param.SubstituteTarget ? target : substitute, param.Substitute);
    };

    const _Window_BattleLog_displayReflection = Window_BattleLog.prototype.displayReflection;
    Window_BattleLog.prototype.displayReflection = function(target) {
        _Window_BattleLog_displayReflection.apply(this, arguments);
        this.pushPopupMessage(target, param.Reflection);
    };

    const _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        _Window_BattleLog_displayAddedStates.apply(this, arguments);
        if (!param.StateList) {
            return;
        }
        target.result().addedStateObjects().forEach(state => {
            const popUp = param.StateList.filter(item => item.stateId === state.id)[0];
            if (popUp) {
                this.pushPopupMessage(target, popUp);
            }
        });
    };

    const _Window_BattleLog_displayChangedBuffs = Window_BattleLog.prototype.displayChangedBuffs;
    Window_BattleLog.prototype.displayChangedBuffs = function(target) {
        _Window_BattleLog_displayChangedBuffs.apply(this, arguments);
        target.result().addedBuffs.forEach(paramId => {
            if (param.Buff) {
                const popup = JsonEx.makeDeepCopy(param.Buff._parameter);
                popup.param = param.ParamName[paramId] || TextManager.param(paramId);
                this.pushPopupMessage(target, popup);
            }
        });
        target.result().addedDebuffs.forEach(paramId => {
            if (param.Debuff) {
                const popup = JsonEx.makeDeepCopy(param.Debuff._parameter);
                popup.param = param.ParamName[paramId] || TextManager.param(paramId);
                this.pushPopupMessage(target, popup);
            }
        });
    };

    Window_BattleLog.prototype.pushPopupMessage = function(target, popUp) {
        if (this.hasPopupMessage()) {
            this.push('waitForPopup');
        }
        this.push('popupMessage', target, popUp);
    };

    Window_BattleLog.prototype.pushPopupAppointMessage = function(target) {
        if (this.hasPopupMessage()) {
            this.push('waitForPopup');
        }
        this.push('popupAppointMessage', target);
    };

    Window_BattleLog.prototype.hasPopupMessage = function() {
        return this._methods.some(function(method) {
            return method.name === 'popupMessage' || method.name === 'popupAppointMessage';
        });
    };

    Window_BattleLog.prototype.waitForPopup = function() {
        this._waitCount = param.MessageWait || 0;
    };

    //=============================================================================
    // Sprite_Battler
    //  ポップアップメッセージを作成します。
    //=============================================================================
    const _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        this.setupMessagePopup();
        _Sprite_Battler_updateDamagePopup.apply(this, arguments);
    };

    const _Sprite_Battler_createDamageSprite = Sprite_Battler.prototype.createDamageSprite;
    Sprite_Battler.prototype.createDamageSprite = function() {
        if (this._battler.result().missed && param.Miss) {
            return;
        } else if (this._battler.result().evaded && param.Avoid) {
            return;
        }
        const last = this._damages[this._damages.length - 1];
        _Sprite_Battler_createDamageSprite.apply(this, arguments);
        const sprite = this._damages[this._damages.length - 1];
        if (last && last instanceof Sprite_PopupMessage) {
            sprite.y = last.y - param.MessageMarginY || 16;
        }
    };

    Sprite_Battler.prototype.setupMessagePopup = function() {
        if (this._battler.isMessagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                this.createMessagePopup();
            }
            this._battler.clearMessagePopup();
        }
    };

    Sprite_Battler.prototype.createMessagePopup = function() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_PopupMessage();
        if (last) {
            sprite.x = last.x + 8;
            sprite.y = last.y - param.MessageMarginY || 16;
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
        if (param.OffsetX) {
            sprite.x += param.OffsetX;
        }
        if (param.OffsetY) {
            sprite.y += param.OffsetY;
        }
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this.parent.addChild(sprite);
    };

    //=============================================================================
    // Sprite_PopupMessage
    //  ポップアップメッセージを表示するスプライトです。
    //=============================================================================
    function Sprite_PopupMessage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_PopupMessage.prototype = Object.create(Sprite_Damage.prototype);
    Sprite_PopupMessage.prototype.constructor = Sprite_PopupMessage;

    Sprite_PopupMessage.prototype.setup = function(target) {
        this._popup = target.getMessagePopup();
        const sprite = this.createChildSprite(param.MaxWidth || 240, this.fontSize());
        sprite.dy = 0;
        const flash = this._popup.flash
        if (flash && flash.alpha > 0) {
            this._flashColor = [flash.red, flash.green, flash.blue, flash.alpha];
            this._flashDuration = param.FlashDuration || 60;
        }
        const se = this._popup.se;
        if (se) {
            AudioManager.playSe(se);
        }
    };

    const _Sprite_Damage_damageColor = Sprite_Damage.prototype.damageColor;
    Sprite_PopupMessage.prototype.damageColor = function() {
        if (this._popup && (this._popup.color || this._popup.textColor)) {
            const textColor = this._popup.textColor;
            return textColor ? ColorManager.textColor(textColor) : this._popup.color;
        } else {
            return _Sprite_Damage_damageColor.apply(this, arguments);
        }
    };

    const _Sprite_Damage_createBitmap = Sprite_Damage.prototype.createBitmap;
    Sprite_PopupMessage.prototype.createBitmap = function(width, height) {
        if (this._popup.fileName) {
            return ImageManager.loadPicture(this._popup.fileName, 0);
        } else {
            const bitmap = _Sprite_Damage_createBitmap.apply(this, arguments);
            const message = this._popup.text.format(this._popup.param);
            bitmap.drawText(message, 0, 0, width, height, 'center');
            return bitmap;
        }
    };

    const _Sprite_PopupMessage_destroy = Sprite_PopupMessage.prototype.destroy;
    Sprite_PopupMessage.prototype.destroy = function(options) {
        for (const child of this.children) {
            if (child.bitmap && child.bitmap.url) {
                child.bitmap = null;
            }
        }
        _Sprite_PopupMessage_destroy.apply(this, arguments);
    };

    const _Sprite_PopupMessage_fontFace = Sprite_PopupMessage.prototype.fontFace;
    Sprite_PopupMessage.prototype.fontFace = function() {
        const face = _Sprite_PopupMessage_fontFace.apply(this, arguments);
        return this._popup?.fontFace || face;
    };

    const _Sprite_PopupMessage_fontSize = Sprite_PopupMessage.prototype.fontSize;
    Sprite_PopupMessage.prototype.fontSize = function() {
        const size = _Sprite_PopupMessage_fontSize.apply(this, arguments);
        return this._popup?.textSize || size;
    };
})();
