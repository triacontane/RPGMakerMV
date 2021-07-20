//=============================================================================
// BattleBalloon.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2021/07/20 スキルが空の敵キャラと戦闘するとエラーになる問題を修正
// 2.0.0 2021/04/03 MZで動作するよう全面的に修正
// 1.0.0 2017/02/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BattleBalloon
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleBalloon.js
 * @base PluginCommonBase
 * @author Triacontane
 *
 * @param balloonSpeedRate
 * @default 100
 * @type number
 *
 * @param balloonWaitTime
 * @default 12
 * @type number
 *
 * @param balloonIdEvasion
 * @default 0
 * @type number
 *
 * @param balloonIdCounter
 * @default 0
 * @type number
 *
 * @param balloonIdSubstitute
 * @default 0
 * @type number
 *
 * @param balloonIdReflection
 * @default 0
 * @type number
 *
 * @command SHOW_BALLOON
 * @text SHOW_BALLOON
 * @desc
 *
 * @arg target
 * @default {}
 * @type struct<Target>
 *
 * @arg balloonId
 * @default 1
 * @type number
 *
 * @arg wait
 * @default false
 * @type boolean
 *
 * @help BattleBalloon.js
 *
 * The balloon can be displayed at various times during battle.
 * You can also adjust the speed and waiting time of the balloon.
 * The balloon is displayed to actors and enemy characters.
 *
 * Displays a balloon [5] when a skill is decided (enemy characters only).
 * <BalloonInput:5>
 *
 * Display a balloon [6] when a skill is used.
 * <BalloonUsing:6>
 *
 */

/*:ja
 * @plugindesc 戦闘中フキダシ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleBalloon.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param balloonSpeedRate
 * @text フキダシ速度倍率
 * @desc フキダシを表示する速度倍率（レート）です。マップ画面のフキダシには影響しません。
 * @default 100
 * @type number
 *
 * @param balloonWaitTime
 * @text フキダシ待機時間
 * @desc フキダシ表示後の待機時間(フレーム)です。マップ画面のフキダシには影響しません。
 * @default 12
 * @type number
 *
 * @param balloonIdEvasion
 * @text 回避フキダシID
 * @desc 回避時に表示するフキダシIDです。
 * @default 0
 * @type number
 *
 * @param balloonIdCounter
 * @text 反撃フキダシID
 * @desc 反撃時に表示するフキダシIDです。
 * @default 0
 * @type number
 *
 * @param balloonIdSubstitute
 * @text 身代わりフキダシID
 * @desc 身代わり時に表示するフキダシIDです。
 * @default 0
 * @type number
 *
 * @param balloonIdReflection
 * @text 反射フキダシID
 * @desc 反射時に表示するフキダシIDです。
 * @default 0
 * @type number
 *
 * @command SHOW_BALLOON
 * @text フキダシ表示
 * @desc 指定した対象にフキダシを表示します。
 *
 * @arg target
 * @text 対象
 * @desc フキダシを表示する対象です。いずれかの項目を入力してください。
 * @default {}
 * @type struct<Target>
 *
 * @arg balloonId
 * @text フキダシID
 * @desc 表示するフキダシID
 * @default 1
 * @type select
 * @option なし
 * @value 0
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザ定義1
 * @value 11
 * @option ユーザ定義2
 * @value 12
 * @option ユーザ定義3
 * @value 13
 * @option ユーザ定義4
 * @value 14
 * @option ユーザ定義5
 * @value 15
 *
 * @arg wait
 * @text 表示完了までウェイト
 * @desc フキダシが表示完了するまでウェイとします。
 * @default false
 * @type boolean
 *
 * @help BattleBalloon.js
 *
 * 戦闘中に様々なタイミングでフキダシ（バルーン）を表示できます。
 * さらにフキダシの速度や待機時間を調整できます。
 * 表示対象はアクターおよび敵キャラです。主に以下のタイミングで表示できます。
 *
 * 1. バトルイベント中にプラグインコマンドを実行
 * 　アクター、敵キャラ、スキル使用者を対象にできます。
 * 　スキル使用者を対象にする場合は、スキル実行後のコモンイベント等で
 * 　表示させてください。
 * 　フキダシ表示が完了するまでウェイトすることもできます。
 *
 * 2. 反撃や回避を行った際に自動発動
 * 　パラメータで指定しておけば反撃、回避、魔法反射、身代わりの瞬間に
 * 　指定したIDのバルーンを自動表示します。
 *
 * 3. スキル実行時に自動発動
 * 　スキルもしくはアイテム使用時に自動発動します。
 * 　メモ欄に以下の通り記述してください。
 *
 * スキル決定時にフキダシ[5]を表示(敵キャラのみ)
 * <決定時フキダシ:5>
 * <BalloonInput:5>
 * ※ 正確には敵キャラAIがスキルを決定したタイミングになります。
 * 敵が特別なスキルを使用する際の予兆などに使えます。
 *
 * スキル使用時にフキダシ[6]を表示
 * <使用時フキダシ:6>
 * <BalloonUsing:6>
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

/*~struct~Target:
 * @param actorId
 * @text アクターID
 * @desc フキダシを表示するアクターID
 * @default 0
 * @type actor
 *
 * @param enemyIndex
 * @text 敵キャラインデックス
 * @desc フキダシを表示する敵キャラのインデックス(開始番号は[1])
 * @default 0
 * @type number
 *
 * @param user
 * @text 使用者
 * @desc スキルやアイテムの使用者
 * @default false
 * @type boolean
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'SHOW_BALLOON', function (args) {
        const target = args.target;
        if (!target) {
            return;
        }
        const actor = $gameActors.actor(target.actorId);
        if (actor && $gameParty.battleMembers().contains(actor)) {
            this.requestBattleBalloon(args, actor);
            return;
        }
        const enemy = $gameTroop.members()[target.enemyIndex - 1];
        if (enemy) {
            this.requestBattleBalloon(args, enemy);
            return;
        }
        if (target.user) {
            const user = $gameTemp.findLastSubject();
            if (user) {
                this.requestBattleBalloon(args, user);
            }
        }
    });

    const _Game_Temp_setLastSubjectActorId = Game_Temp.prototype.setLastSubjectActorId;
    Game_Temp.prototype.setLastSubjectActorId = function(actorID) {
        _Game_Temp_setLastSubjectActorId.apply(this, arguments);
        this._lastUnit = 'party';
    };

    const _Game_Temp_setLastSubjectEnemyIndex = Game_Temp.prototype.setLastSubjectEnemyIndex;
    Game_Temp.prototype.setLastSubjectEnemyIndex = function(enemyIndex) {
        _Game_Temp_setLastSubjectEnemyIndex.apply(this, arguments);
        this._lastUnit = 'troop';
    };

    Game_Temp.prototype.findLastSubject = function() {
        if (this._lastUnit === 'party') {
            return $gameParty.members().find(member => member.actorId() === this.lastActionData(2));
        } else {
            return $gameTroop.members()[this.lastActionData(3) - 1];
        }
    };

    Game_Interpreter.prototype.requestBattleBalloon = function(args, battler) {
        battler.requestBalloonIfNeed(args.balloonId);
        if (args.wait) {
            this.setWaitMode('battleBalloon');
            this._battler = battler;
        }
    };

    const _Game_Interpreter_updateWaitMode      = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        const waiting = this.updateWaitModeForBattleBalloon();
        return waiting ? true : _Game_Interpreter_updateWaitMode.apply(this, arguments);
    };

    Game_Interpreter.prototype.updateWaitModeForBattleBalloon = function() {
        let waiting = false;
        if (this._waitMode === 'battleBalloon') {
            waiting = this._battler.isBalloonPlaying();
        } else {
            this._battler = null;
        }
        return waiting;
    };

    //=============================================================================
    // Game_BattlerBase
    //  バルーンスプライトの表示をリクエストします。
    //=============================================================================
    Game_BattlerBase.prototype.startBalloon     = Game_CharacterBase.prototype.startBalloon;
    Game_BattlerBase.prototype.isBalloonPlaying = Game_CharacterBase.prototype.isBalloonPlaying;
    Game_BattlerBase.prototype.endBalloon       = Game_CharacterBase.prototype.endBalloon;

    Game_BattlerBase.prototype.requestBalloonIfNeed = function(balloonId) {
        if (balloonId > 0) {
            $gameTemp.requestBalloon(this, balloonId);
        }
    };

    //=============================================================================
    // Game_Battler
    //  リアクションバルーンの表示をリクエストします。
    //=============================================================================
    const _Game_Battler_performSubstitute      = Game_Battler.prototype.performSubstitute;
    Game_Battler.prototype.performSubstitute = function(target) {
        _Game_Battler_performSubstitute.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdSubstitute);
    };

    const _Game_Battler_performReflection      = Game_Battler.prototype.performReflection;
    Game_Battler.prototype.performReflection = function(target) {
        _Game_Battler_performReflection.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdReflection);
    };

    const _Game_Battler_performCounter      = Game_Battler.prototype.performCounter;
    Game_Battler.prototype.performCounter = function(target) {
        _Game_Battler_performCounter.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdCounter);
    };

    const _Game_Battler_performEvasion      = Game_Battler.prototype.performEvasion;
    Game_Battler.prototype.performEvasion = function(target) {
        _Game_Battler_performEvasion.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdEvasion);
    };

    const _Game_Battler_performMagicEvasion      = Game_Battler.prototype.performMagicEvasion;
    Game_Battler.prototype.performMagicEvasion = function() {
        _Game_Battler_performMagicEvasion.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdEvasion);
    };

    const _Game_Battler_performActionStart      = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        _Game_Battler_performActionStart.apply(this, arguments);
        this.requestBalloonIfNeed(action.getBalloonIdForUsing());
    };

    //=============================================================================
    // Game_Enemy
    //  行動決定時にバルーンを表示します。
    //=============================================================================
    const _Game_Enemy_makeActions      = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function() {
        _Game_Enemy_makeActions.apply(this, arguments);
        this.requestBalloonInput();
    };

    Game_Enemy.prototype.requestBalloonInput = function() {
        const number = this.numActions();
        for (let i = 0; i < number; i++) {
            this.requestBalloonIfNeed(this.action(i).getBalloonIdForInput());
        }
    };

    //=============================================================================
    // Game_Action
    //  バルーン情報のメモ欄を取得します。
    //=============================================================================
    Game_Action.prototype.getBalloonIdForInput = function() {
        if (!this.item()) {
            return 0;
        }
        return PluginManagerEx.findMetaValue(this.item(), ['BalloonInput', '決定時フキダシ']);
    };

    Game_Action.prototype.getBalloonIdForUsing = function() {
        return PluginManagerEx.findMetaValue(this.item(),['BalloonUsing', '使用時フキダシ']);
    };

    const _Sprite_Balloon_speed = Sprite_Balloon.prototype.speed;
    Sprite_Balloon.prototype.speed = function() {
        const speed = _Sprite_Balloon_speed.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return Math.floor(speed * 100 / (param.balloonSpeedRate || 100));
        } else {
            return speed;
        }
    };

    const _Sprite_Balloon_waitTime = Sprite_Balloon.prototype.waitTime;
    Sprite_Balloon.prototype.waitTime = function() {
        if ($gameParty.inBattle()) {
            return param.balloonWaitTime;
        } else {
            return _Sprite_Balloon_waitTime.apply(this, arguments);
        }
    };

    //=============================================================================
    // Spriteset_Battle
    //  フキダシ表示機能をSpriteset_Mapからコピー
    //=============================================================================
    const _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
    Spriteset_Battle.prototype.initialize = function() {
        _Spriteset_Battle_initialize.apply(this, arguments);
        this._balloonSprites = [];
    };
    Spriteset_Battle.prototype.updateBalloons = Spriteset_Map.prototype.updateBalloons;
    Spriteset_Battle.prototype.processBalloonRequests = Spriteset_Map.prototype.processBalloonRequests;
    Spriteset_Battle.prototype.createBalloon = Spriteset_Map.prototype.createBalloon;
    Spriteset_Battle.prototype.removeBalloon = Spriteset_Map.prototype.removeBalloon;
    Spriteset_Battle.prototype.removeAllBalloons = Spriteset_Map.prototype.removeAllBalloons;

    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.apply(this, arguments);
        this.updateBalloons();
    };

    const _Spriteset_Battle_destroy = Spriteset_Battle.prototype.destroy;
    Spriteset_Battle.prototype.destroy = function(options) {
        this.removeAllBalloons();
        _Spriteset_Battle_destroy.apply(this, arguments);
    };
})();

