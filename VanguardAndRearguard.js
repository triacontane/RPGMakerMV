//=============================================================================
// VanguardAndRearguard.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.0 2022/06/13 後衛の座標補正を敵キャラとアクターで別々に管理するよう変更
// 2.1.1 2022/02/17 味方の敗北条件のパラメータが正常に機能していなかった問題を修正
// 2.1.0 2022/01/17 敵キャラ座標補正値に負の値を指定できるよう修正
// 2.0.1 2021/05/13 並び順固定のパラメータが正しく取得できていなかった問題を修正
// 2.0.0 2021/05/13 MZで動作するよう全面的に修正
// 1.9.0 2020/02/15 先頭メンバーの並び替えを禁止できるスイッチを追加
// 1.8.1 2019/06/17 1.8.0の修正で「後衛メンバー上限」のパラメータ取得処理が消えていたのを戻した
// 1.8.0 2019/06/15 戦闘画面でX座標やY座標が指定値以下の場合、自動で後衛に配置できる機能を追加
// 1.7.3 2019/01/20 後衛の人数の上限が設定されているとき、控えメンバーは常に前衛に設定されるよう仕様変更
// 1.7.2 2019/01/19 後衛の人数の上限を設定できる機能で控えメンバーを常に含めた上限にするよう仕様変更
// 1.7.1 2019/01/14 MPP_ActiveTimeBattle.jsと併用したときにアクターコマンドからチェンジが選択できない競合を修正
// 1.7.0 2019/01/01 後衛の人数の上限を設定できる機能を追加
// 1.6.0 2018/10/21 前衛・後衛の仕様を味方側もしくは敵側のみに適用できる機能を追加
// 1.5.4 2018/05/27 前衛のみ、後衛のみのスキルについて効果範囲を単体にすると対象外のバトラーを選択できてしまう制約事項を明記
// 1.5.3 2018/04/10 前衛に詰める機能有効時、控えのメンバーがいるときに戦闘メンバーを全員後衛にできてしまう問題を修正
// 1.5.2 2018/01/07 FTKR_CSS_MenuStatus.jsとの競合を解消
// 1.5.1 2017/10/25 ヘルプの英語化対応
// 1.5.0 2017/08/18 前衛が全滅したときに後衛が前衛に詰められる設定を追加
// 1.4.0 2017/06/11 メニュー画面でフェイスを右にずらす機能を有効にするかどうかのパラメータを追加
// 1.3.2 2017/04/22 全回復のイベント後、隊列ステートが解除されてしまう不具合を修正
// 1.3.1 2017/02/27 YEP_BattleEngineCore.jsと組み合わせたときに、後衛時のノックバックが過剰になる現象を修正
// 1.3.0 2017/01/14 敵キャラの前衛、後衛ステートアイコンを非表示にできる機能を追加
// 1.2.2 2016/10/25 後衛の敵キャラが逃走したときに位置が元に戻ってしまう現象を修正
// 1.2.1 2016/10/25 前衛・後衛の位置補正値に負の値を設定できるよう修正
// 1.2.0 2016/09/15 特定のキャラクターに対するチェンジを禁止する設定を追加
//                  前衛(あるいは後衛)のバトラーが全員戦闘不能で敗北になるような設定を追加
// 1.1.1 2016/06/18 アクター加入時に前衛ステートを強制設定する処理を追加
// 1.1.0 2016/06/06 戦闘不能時に隊列ステートが解除される不具合を修正
//                  前衛メンバーが生存している限り、後衛メンバーが狙われなくなる機能を追加
// 1.0.0 2016/06/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 前衛後衛プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VanguardAndRearguard.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param VanguardStateId
 * @text 前衛ステートID
 * @desc 前衛のステートIDです。
 * @default 11
 * @type state
 *
 * @param RearguardStateId
 * @text 後衛ステートID
 * @desc 後衛のステートIDです。
 * @default 12
 * @type state
 *
 * @param ChangeInMenu
 * @text メニューチェンジ可能
 * @desc メニュー画面で前衛・後衛の切り替えが可能になります。
 * @default true
 * @type boolean
 *
 * @param TopActorFixedSwitch
 * @text 先頭アクター固定スイッチ
 * @desc 指定したスイッチがONのとき先頭アクターの並び順を固定できます。
 * @default 0
 * @type switch
 *
 * @param RearDefense
 * @text 後衛防御
 * @desc 前衛メンバーが生存している限り、後衛メンバーが狙われなくなります。
 * @default false
 * @type boolean
 *
 * @param SkillIdChange
 * @text チェンジスキルID
 * @desc 戦闘中の前衛・後衛切り替えコマンドで実行されるスキルIDです。0を指定すると戦闘中はチェンジ不可となります。
 * @default 0
 * @type skill
 *
 * @param RearguardOffsetX
 * @text 後衛時X補正
 * @desc 後衛時のX座標を前衛時に対する相対値で指定します。
 * @default 48
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param RearguardOffsetY
 * @text 後衛時Y補正
 * @desc 後衛時のX座標を前衛時に対する相対値で指定します。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param EnemyRearguardOffsetX
 * @text 後衛時敵キャラX補正
 * @desc 後衛時の敵キャラのX座標を前衛時に対する相対値で指定します。サイドビューの場合は反転します。
 * @default 48
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param EnemyRearguardOffsetY
 * @text 後衛時敵キャラY補正
 * @desc 後衛時の敵キャラのX座標を前衛時に対する相対値で指定します。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param ChangeSpeed
 * @text チェンジ速度
 * @desc 戦闘中にチェンジした場合のグラフィックの移動速度です。
 * @default 8
 * @type number
 *
 * @param HiddenIcon
 * @text アイコン非表示
 * @desc 敵キャラの前衛、後衛のステートアイコンを非表示にします。（アクターのアイコンは表示されます）
 * @default false
 * @type boolean
 *
 * @param FaceShift
 * @text フェイスシフト
 * @desc メニュー画面で、後衛の顔グラフィックを右に少しずらして表示します。
 * @default true
 * @type boolean
 *
 * @param ShiftVanguard
 * @text 前衛に詰める
 * @desc 前衛が全滅した時点で後衛が強制的に前衛に移動します。また、前衛がいない状態では後衛に移動できなくなります。
 * @default false
 * @type boolean
 *
 * @param ValidActor
 * @text アクターに適用
 * @desc 前衛・後衛の仕様をアクター側に適用します。
 * @default true
 * @type boolean
 *
 * @param ValidEnemy
 * @text 敵キャラに適用
 * @desc 前衛・後衛の仕様を敵キャラ側に適用します。
 * @default true
 * @type boolean
 *
 * @param RearguardLimit
 * @text 後衛メンバー上限
 * @desc 後衛になれるメンバーの上限です。0に設定すると無制限になります。
 * @default 0
 * @type number
 *
 * @param EnemyRearBorderX
 * @text 敵キャラ後衛ラインX座標
 * @desc 敵キャラの配置X座標(中心原点)が指定したラインより小さいと自動的に後衛配置されます。
 * @default 0
 * @type number
 *
 * @param EnemyRearBorderY
 * @text 敵キャラ後衛ラインY座標
 * @desc 敵キャラの配置Y座標(下原点)が指定したラインより小さいと自動的に後衛配置されます。
 * @default 0
 * @type number
 *
 * @param PartyDefeat
 * @text パーティ敗北条件
 * @desc パーティの敗北条件を取得する変数です。
 * 変数値　[0]:全滅 [1]:前衛全滅 [2]:後衛全滅
 * @default 0
 * @type variable
 *
 * @param TroopDefeat
 * @text 敵グループ敗北条件
 * @desc 敵グループの敗北条件を取得する変数です。
 * 変数値　[0]:全滅 [1]:前衛全滅 [2]:後衛全滅
 * @default 0
 * @type variable
 *
 * @help VanguardAndRearguard.js
 * 
 * 戦闘に「前衛」「後衛」の概念を追加します。
 * 「前衛」時のステートと「後衛」時のステートを指定したうえで
 * 「特徴」などで「前衛」「後衛」の特殊効果を設定してください。
 *
 * 「前衛」「後衛」に指定されたステートは、解除条件を満たしても解除されません。
 * 変更するには以下のいずれかの方法を選択します。
 *
 * ・メニュー画面の「並び替え」で同じキャラクターを選択する。
 * ・戦闘画面で「チェンジ」コマンドを実行する。
 * ・イベントから対象ステートを付与する。
 *
 * 戦闘中のチェンジを有効した場合、チェンジ用スキルの対象を「使用者」にして
 * さらにメモ欄に以下の通り設定してください。
 * (既存スキル「防御」をコピーすることをオススメします)
 * <チェンジ>
 * <Change>
 *
 * 上記メモ欄はチェンジ以外のスキルでも有効です。
 * スキル使用者をチェンジ対象にしたい場合はメモ欄に以下の通り設定してください。
 * <使用者チェンジ>
 * <UserChange>
 *
 * 前衛のみ、後衛のみを対象にしたスキルを作成したい場合、
 * スキルのメモ欄に以下の通り設定してください。
 * <前衛のみ> # 前衛のみ対象スキル
 * <VanguardOnly>
 * <後衛のみ> # 後衛のみ対象スキル
 * <RearguardOnly>
 *
 * ただし、メニュー画面から使用する場合は無効です。
 * また、ターゲットの選択制限はできないので原則として効果範囲が「全体」の
 * スキルにのみ使用できます。
 *
 * 敵キャラの初期配置を後衛にしたい場合、メモ欄に以下の通り設定してください。
 * <後衛>
 * <Rearguard>
 *
 * 前衛後衛のチェンジを禁止して前衛か後衛で固定したい場合、
 * アクターおよび敵キャラのメモ欄に以下の通り設定してください。
 * <チェンジ禁止>  # 対象バトラーに対するチェンジは禁止されます。
 * <ChangeDisable> # 同上
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
    //  前衛・後衛の概念を追加定義します。
    //=============================================================================
    const _Game_BattlerBase_recoverAll      = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() {
        const prevVanguard = !this.isRearguard();
        _Game_BattlerBase_recoverAll.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    const _Game_BattlerBase_die      = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        const prevVanguard = !this.isRearguard();
        _Game_BattlerBase_die.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    const _Game_BattlerBase_addNewState      = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        if (stateId === this.deathStateId()) {
            this.friendsUnit().shiftVanguard();
        }
    };

    const _Game_BattlerBase_hide      = Game_BattlerBase.prototype.hide;
    Game_BattlerBase.prototype.hide = function() {
        _Game_BattlerBase_hide.apply(this, arguments);
        this.friendsUnit().shiftVanguard();
    };

    Game_BattlerBase.prototype.setFormationState = function(vanguardFlg) {
        if (!this.isValidFormationState()) {
            return;
        }
        if (this.friendsUnit().isNeedShiftVanguard(this)) {
            vanguardFlg = true;
        }
        const additionalStateId = (vanguardFlg ? param.VanguardStateId : param.RearguardStateId);
        const removeStateId     = (vanguardFlg ? param.RearguardStateId : param.VanguardStateId);
        if (!this.isStateAffected(additionalStateId)) {
            this.addNewState(additionalStateId);
        }
        if (this.isStateAffected(removeStateId)) {
            this.eraseState(removeStateId);
        }
    };

    Game_BattlerBase.prototype.changeFormationState = function() {
        if (this.isChangeableFormationState()) {
            this.setFormationState(!this.isVanguard());
            return true;
        }
        return false;
    };

    Game_BattlerBase.prototype.isChangeableRearguard = function() {
        return this.isRearguard() || param.RearguardLimit <= 0 ||
            this.friendsUnit().rearguardMembers().length < param.RearguardLimit;
    };

    Game_BattlerBase.prototype.isValidFormationState = function() {
        return true;
    };

    Game_BattlerBase.prototype.isVanguard = function() {
        return this.isStateAffected(param.VanguardStateId);
    };

    Game_BattlerBase.prototype.isRearguard = function() {
        return this.isStateAffected(param.RearguardStateId);
    };

    Game_BattlerBase.prototype.isVanguardStateOf = function(stateId) {
        return stateId === param.VanguardStateId;
    };

    Game_BattlerBase.prototype.isRearguardStateOf = function(stateId) {
        return stateId === param.RearguardStateId;
    };

    Game_BattlerBase.prototype.changeSkillId = function() {
        return param.SkillIdChange;
    };

    Game_BattlerBase.prototype.getFormationOffsetX = function() {
        return this.isRearguard() ? this.getRearguardOffsetX() : 0;
    };

    Game_BattlerBase.prototype.getFormationOffsetY = function() {
        return this.isRearguard() ? this.getRearguardOffsetY() : 0;
    };

    Game_BattlerBase.prototype.getRearguardOffsetX = function() {
        return param.RearguardOffsetX;
    };

    Game_BattlerBase.prototype.getRearguardOffsetY = function() {
        return param.RearguardOffsetY;
    };

    Game_Enemy.prototype.getRearguardOffsetX = function() {
        return param.EnemyRearguardOffsetX;
    };

    Game_Enemy.prototype.getRearguardOffsetY = function() {
        return param.EnemyRearguardOffsetY;
    };

    Game_BattlerBase.prototype.getFormationOffsetY = function() {
        return this.isRearguard() ? param.RearguardOffsetY : 0;
    };

    Game_BattlerBase.prototype.isChangeableFormationState = function() {
        if (!this.isChangeableRearguard()) {
            return false;
        }
        const battler = (this.isActor() ? this.actor() : this.isEnemy() ? this.enemy() : null);
        if (battler) {
            return !PluginManagerEx.findMetaValue(battler, ['チェンジ禁止', 'ChangeDisable']);
        }
        return false;
    };

    //=============================================================================
    // Game_Battler
    //  前衛・後衛ステートの解除を無効にします。
    //=============================================================================
    const _Game_Battler_removeState      = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        if (!this.isVanguardStateOf(stateId) && !this.isVanguardStateOf(stateId)) {
            _Game_Battler_removeState.apply(this, arguments);
        }
    };

    const _Game_Battler_addState      = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        if (this.isVanguardStateOf(stateId)) {
            this.setFormationState(true);
        } else if (this.isRearguardStateOf(stateId)) {
            this.setFormationState(false);
        } else {
            _Game_Battler_addState.apply(this, arguments);
        }
    };

    const _Game_Battler_performActionStart      = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        if (!action.isChange()) {
            _Game_Battler_performActionStart.apply(this, arguments);
        }
    };

    const _Game_Battler_escape      = Game_Battler.prototype.escape;
    Game_Battler.prototype.escape = function() {
        const prevVanguard = this.isVanguard();
        _Game_Battler_escape.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    //=============================================================================
    // Game_Actor
    //  チェンジ用のモーションを定義します。
    //=============================================================================
    const _Game_Actor_setup      = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.apply(this, arguments);
        if (!this.isVanguard() && !this.isRearguard()) {
            this.setFormationState(true);
        }
    };

    const _Game_Actor_performAction      = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        _Game_Actor_performAction.apply(this, arguments);
        if (action.isChange()) {
            this.requestMotion('guard');
        }
    };

    Game_Actor.prototype.isValidFormationState = function() {
        return param.ValidActor;
    };

    //=============================================================================
    // Game_Enemy
    //  前衛・後衛ステートの初期値を設定します。
    //=============================================================================
    Game_Enemy.prototype.initFormationState = function() {
        this.setFormationState(this.getInitialFormationState());
    };

    Game_Enemy.prototype.getInitialFormationState = function() {
        if (PluginManagerEx.findMetaValue(this.enemy(), ['Rearguard', '後衛'])) {
            return false;
        }
        return this._screenX > param.EnemyRearBorderX && this._screenY > param.EnemyRearBorderY;
    };

    Game_Enemy.prototype.getFormationOffsetX = function() {
        return Game_BattlerBase.prototype.getFormationOffsetX.call(this) * ($gameSystem.isSideView() ? -1 : 1);
    };

    Game_Enemy.prototype.stateIcons = function() {
        const icons = Game_BattlerBase.prototype.stateIcons.apply(this, arguments);
        return param.HiddenIcon ? this.filterFormationIcon(icons) : icons;
    };

    Game_Enemy.prototype.filterFormationIcon = function(icons) {
        const vanguardState  = $dataStates[param.VanguardStateId];
        const rearguardState = $dataStates[param.RearguardStateId];
        return icons.filter(iconIndex => {
            if (vanguardState && vanguardState.iconIndex === iconIndex) {
                return false;
            } else if (rearguardState && rearguardState.iconIndex === iconIndex) {
                return false;
            }
            return true;
        });
    };

    Game_Enemy.prototype.isValidFormationState = function() {
        return param.ValidEnemy;
    };

    //=============================================================================
    // Game_Unit
    //  メンバー全体の前衛・後衛状態を管理します。
    //=============================================================================
    const _Game_Unit_aliveMembers = Game_Unit.prototype.aliveMembers;
    if (param.RearDefense) {
        Game_Unit.prototype.aliveMembers = function() {
            const members = this.vanguardMembers();
            return members.length > 0 ? members : _Game_Unit_aliveMembers.apply(this, arguments);
        };
    }

    Game_Unit.prototype.vanguardMembers = function() {
        return _Game_Unit_aliveMembers.apply(this, arguments).filter(function(member) {
            return member.isVanguard();
        });
    };

    Game_Unit.prototype.rearguardMembers = function() {
        return _Game_Unit_aliveMembers.apply(this, arguments).filter(function(member) {
            return member.isRearguard();
        });
    };

    Game_Unit.prototype.getDefeatCondition = function() {
        return 0;
    };

    const _Game_Unit_isAllDead      = Game_Unit.prototype.isAllDead;
    Game_Unit.prototype.isAllDead = function() {
        const defeatCondition = this.getDefeatCondition();
        switch (defeatCondition) {
            case 2:
                return this.rearguardMembers().length === 0;
            case 1:
                return this.vanguardMembers().length === 0;
            default :
                return _Game_Unit_isAllDead.apply(this, arguments);
        }
    };

    Game_Unit.prototype.isNeedShiftVanguard = function(exceptionBattler) {
        const inBattle   = this._inBattle;
        this._inBattle = true;
        const result     = param.ShiftVanguard && !this.isAliveVanguardMember(exceptionBattler);
        this._inBattle = inBattle;
        return result;
    };

    Game_Unit.prototype.isAliveVanguardMember = function(exceptionBattler) {
        const vanguardMember = this.vanguardMembers();
        return vanguardMember.length > 0 && (vanguardMember.length > 1 || vanguardMember[0] !== exceptionBattler);
    };

    Game_Unit.prototype.shiftVanguard = function() {
        if (!this.isNeedShiftVanguard(null)) {
            return;
        }
        this.aliveMembers().forEach(member => member.setFormationState(true));
    };

    const _Game_Party_swapOrder      = Game_Party.prototype.swapOrder;
    Game_Party.prototype.swapOrder = function(index1, index2) {
        _Game_Party_swapOrder.apply(this, arguments);
        if (param.RearguardLimit <= 0) {
            return;
        }
        const size = this.battleMembers().length;
        if (index1 >= size) {
            $gameActors.actor(this._actors[index1]).setFormationState(true);
        }
        if (index2 >= size) {
            $gameActors.actor(this._actors[index2]).setFormationState(true);
        }
    };

    Game_Party.prototype.getDefeatCondition = function() {
        return param.PartyDefeat > 0 ? $gameVariables.value(param.PartyDefeat) : 0;
    };

    //=============================================================================
    // Game_Troop
    //  敵キャラの前衛・後衛状態を初期設定します。
    //=============================================================================
    const _Game_Troop_setup      = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        this.members().forEach(enemy => enemy.initFormationState());
    };

    Game_Troop.prototype.getDefeatCondition = function() {
        return param.TroopDefeat > 0 ? $gameVariables.value(param.TroopDefeat) : 0;
    };

    //=============================================================================
    // Game_Action
    //  チェンジスキルを設定します。
    //=============================================================================
    Game_Action.prototype.setChange = function() {
        this.setSkill(this.subject().changeSkillId());
    };

    Game_Action.prototype.isChange = function() {
        return this.item() === $dataSkills[this.subject().changeSkillId()];
    };

    const _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        if (PluginManagerEx.findMetaValue(this.item(), ['Change', 'チェンジ'])) {
            const result1 = target.changeFormationState();
            if (result1) {
                this.makeSuccess(target);
            }
        }
        if (PluginManagerEx.findMetaValue(this.item(), ['UserChange', '使用者チェンジ'])) {
            const result2 = this.subject().changeFormationState();
            if (result2) {
                this.makeSuccess(target);
            }
        }
    };

    const _Game_Action_repeatTargets      = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function(targets) {
        if (PluginManagerEx.findMetaValue(this.item(), ['VanguardOnly', '前衛のみ'])) {
            arguments[0] = targets.filter(target => target.isVanguard());
        }
        if (PluginManagerEx.findMetaValue(this.item(), ['RearguardOnly', '後衛のみ'])) {
            arguments[0] = targets.filter(target => target.isRearguard());
        }
        return _Game_Action_repeatTargets.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Battle
    //  前衛・後衛のチェンジを追加定義します。
    //=============================================================================
    const _Scene_Battle_createActorCommandWindow      = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        this._actorCommandWindow.setHandler('change', this.commandChange.bind(this));
    };

    Scene_Battle.prototype.commandChange = function() {
        BattleManager.inputtingAction().setChange();
        this.selectNextCommand();
    };

    //=============================================================================
    // Scene_Menu
    //  前衛・後衛のチェンジを追加定義します。
    //=============================================================================
    const _Scene_Menu_onFormationOk      = Scene_Menu.prototype.onFormationOk;
    Scene_Menu.prototype.onFormationOk = function() {
        const pendingIndex = this._statusWindow.pendingIndex();
        const index        = this._statusWindow.index();
        if (param.ChangeInMenu) {
            const actor        = $gameParty.members()[index];
            if (pendingIndex >= 0 && index === pendingIndex &&
                (index < $gameParty.battleMembers().length || param.RearguardLimit <= 0)) {
                actor.changeFormationState();
            }
        }
        if (!this.canChangeFormation(pendingIndex, index)) {
            this.onFormationNg(pendingIndex, index);
            return;
        }
        _Scene_Menu_onFormationOk.apply(this, arguments);
    };

    Scene_Menu.prototype.onFormationNg = function(pendingIndex, index) {
        this._statusWindow.activate();
        this._statusWindow.select(pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
        AudioManager.stopAllStaticSe();
        SoundManager.playBuzzer();
    };

    Scene_Menu.prototype.canChangeFormation = function(pendingIndex, index) {
        if (!$gameSwitches.value(param.TopActorFixedSwitch) || pendingIndex === -1) {
            return true;
        }
        return pendingIndex === index || (pendingIndex > 0 && index > 0);
    };

    const _Window_MenuCommand_isFormationEnabled = Window_MenuCommand.prototype.isFormationEnabled;
    Window_MenuCommand.prototype.isFormationEnabled = function() {
        const result = _Window_MenuCommand_isFormationEnabled.apply(this, arguments);
        if ($gameParty.size() === 1 && $gameSystem.isFormationEnabled() && param.ChangeInMenu) {
            return true;
        } else {
            return result;
        }
    };

    //=============================================================================
    // Window_MenuStatus
    //  前衛・後衛で描画位置を変更します。
    //=============================================================================
    Window_MenuStatus.shiftWidth              = param.FaceShift ? 24 : 0;
    Window_MenuStatus.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isRearguard()) {
            arguments[1] += Window_MenuStatus.shiftWidth;
        }
        Window_StatusBase.prototype.drawActorFace.apply(this, arguments);
    };

    Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        if (actor.isRearguard()) {
            arguments[1] += Window_MenuStatus.shiftWidth;
            arguments[3] -= Window_MenuStatus.shiftWidth;
        }
        Window_StatusBase.prototype.drawActorSimpleStatus.apply(this, arguments);
    };

    //=============================================================================
    // Window_ActorCommand
    //  チェンジコマンドを追加定義します。
    //=============================================================================
    const _Window_ActorCommand_makeCommandList      = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._actor && param.SkillIdChange) {
            this.addChangeCommand();
        }
    };

    Window_ActorCommand.prototype.addChangeCommand = function() {
        const skill = $dataSkills[param.SkillIdChange];
        this.addCommand(skill ? skill.name : 'Change', 'change', this.isChangeEnabled());
    };

    Window_ActorCommand.prototype.isChangeEnabled = function() {
        return this._actor ? this._actor.isChangeableFormationState() : false;
    };

    //=============================================================================
    // Sprite_Battler
    //  前衛・後衛によって位置を変動させます。
    //=============================================================================
    const _Sprite_Battler_initMembers      = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._formationX = 0;
        this._formationY = 0;
    };

    const _Sprite_Battler_setHome      = Sprite_Battler.prototype.setHome;
    Sprite_Battler.prototype.setHome = function(x, y) {
        _Sprite_Battler_setHome.apply(this, arguments);
        this._formationX = this._battler.getFormationOffsetX();
        this._formationY = this._battler.getFormationOffsetY();
    };

    const _Sprite_Battler_updatePosition      = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        _Sprite_Battler_updatePosition.apply(this, arguments);
        this.updateFormation();
        this.x += this._formationX;
        this.y += this._formationY;
    };

    Sprite_Battler.prototype.updateFormation = function() {
        const targetFormationX = this._battler.getFormationOffsetX();
        const targetFormationY = this._battler.getFormationOffsetY();
        if (targetFormationX > this._formationX) {
            this._formationX = Math.min(this._formationX + param.ChangeSpeed, targetFormationX);
        }
        if (targetFormationX < this._formationX) {
            this._formationX = Math.max(this._formationX - param.ChangeSpeed, targetFormationX);
        }
        if (targetFormationY > this._formationY) {
            this._formationY = Math.min(this._formationY + param.ChangeSpeed, targetFormationY);
        }
        if (targetFormationY < this._formationY) {
            this._formationY = Math.max(this._formationY - param.ChangeSpeed, targetFormationY);
        }
    };

    const _Sprite_Battler_stepFlinch      = Sprite_Battler.prototype.stepFlinch;
    Sprite_Battler.prototype.stepFlinch = function() {
        this._homeX += this._formationX;
        this._homeY += this._formationY;
        _Sprite_Battler_stepFlinch.apply(this, arguments);
        this._homeX -= this._formationX;
        this._homeY -= this._formationY;
    };

    const _Sprite_Actor_stepFlinch      = Sprite_Actor.prototype.stepFlinch;
    Sprite_Actor.prototype.stepFlinch = function() {
        this._homeX += this._formationX;
        this._homeY += this._formationY;
        _Sprite_Actor_stepFlinch.apply(this, arguments);
        this._homeX -= this._formationX;
        this._homeY -= this._formationY;
    };

    //=============================================================================
    // AudioManager
    //  全てのシステムSEを停止します。
    //=============================================================================
    AudioManager.stopAllStaticSe = function() {
        this._staticBuffers.forEach(buffer => buffer.stop());
        this._staticBuffers = [];
    };
})();

