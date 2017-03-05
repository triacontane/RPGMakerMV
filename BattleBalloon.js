//=============================================================================
// BattleBalloon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/02/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BattleBalloonPlugin
 * @author triacontane
 *
 * @param BalloonSpeedRate
 * @desc フキダシを表示する速度倍率（レート）です。マップ画面のフキダシには影響しません。
 * @default 100
 *
 * @param BalloonWaitTime
 * @desc フキダシ表示後の待機時間(フレーム)です。マップ画面のフキダシには影響しません。
 * @default 12
 *
 * @param BalloonIdEvasion
 * @desc 回避時に表示するフキダシIDです。
 * @default 0
 *
 * @param BalloonIdCounter
 * @desc 反撃時に表示するフキダシIDです。
 * @default 0
 *
 * @param BalloonIdSubstitute
 * @desc 身代わり時に表示するフキダシIDです。
 * @default 0
 *
 * @param BalloonIdCounter
 * @desc 反射時に表示するフキダシIDです。
 * @default 0
 *
 * @help 戦闘中に様々なタイミングでフキダシ（バルーン）を表示できます。
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
 * <BB_決定時フキダシ:5> # スキル決定時にフキダシ[5]を表示(敵キャラのみ)(※1)
 * <BB_BalloonInput:5>   # 同上
 * <BB_使用時フキダシ:6> # スキル使用時にフキダシ[6]を表示
 * <BB_BalloonUsing:6>   # 同上
 * ※1 正確には敵キャラAIがスキルを決定したタイミングになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * BB_アクターにバルーン 3 1 ON # アクター[3]にバルーン[1]をウェイトありで表示
 * BB_BALLOON_FOR_ACTOR 3 1 ON  # 同上
 * BB_敵キャラにバルーン 1 2    # インデックス[1]の敵キャラにバルーン[2]を表示
 * BB_BALLOON_FOR_ENEMY 1 2     # 同上
 * BB_使用者にバルーン 3 ON     # スキルの使用者にバルーン[3]を表示
 * BB_BALLOON_FOR_USER 3 ON     # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘中フキダシ表示プラグイン
 * @author トリアコンタン
 *
 * @param フキダシ速度倍率
 * @desc フキダシを表示する速度倍率（レート）です。マップ画面のフキダシには影響しません。
 * @default 100
 *
 * @param フキダシ待機時間
 * @desc フキダシ表示後の待機時間(フレーム)です。マップ画面のフキダシには影響しません。
 * @default 12
 *
 * @param 回避フキダシID
 * @desc 回避時に表示するフキダシIDです。
 * @default 0
 *
 * @param 反撃フキダシID
 * @desc 反撃時に表示するフキダシIDです。
 * @default 0
 *
 * @param 身代わりフキダシID
 * @desc 身代わり時に表示するフキダシIDです。
 * @default 0
 *
 * @param 反射フキダシID
 * @desc 反射時に表示するフキダシIDです。
 * @default 0
 *
 * @help 戦闘中に様々なタイミングでフキダシ（バルーン）を表示できます。
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
 * <BB_決定時フキダシ:5> # スキル決定時にフキダシ[5]を表示(敵キャラのみ)(※1)
 * <BB_BalloonInput:5>   # 同上
 * <BB_使用時フキダシ:6> # スキル使用時にフキダシ[6]を表示
 * <BB_BalloonUsing:6>   # 同上
 * ※1 正確には敵キャラAIがスキルを決定したタイミングになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * BB_アクターにバルーン 3 1 ON # アクター[3]にバルーン[1]をウェイトありで表示
 * BB_BALLOON_FOR_ACTOR 3 1 ON  # 同上
 * BB_敵キャラにバルーン 1 2    # インデックス[1]の敵キャラにバルーン[2]を表示
 * BB_BALLOON_FOR_ENEMY 1 2     # 同上
 * BB_使用者にバルーン 3 ON     # スキルの使用者にバルーン[3]を表示
 * BB_BALLOON_FOR_USER 3 ON     # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'BattleBalloon';
    var metaTagPrefix = 'BB_';

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

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
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

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                 = {};
    param.balloonIdEvasion    = getParamNumber(['BalloonIdEvasion', '回避フキダシID']);
    param.balloonIdReflection = getParamNumber(['BalloonIdReflection', '反射フキダシID']);
    param.balloonIdCounter    = getParamNumber(['BalloonIdCounter', '反撃フキダシID']);
    param.balloonIdSubstitute = getParamNumber(['BalloonIdSubstitute', '身代わりフキダシID']);
    param.balloonSpeedRate    = getParamNumber(['BalloonSpeedRate', 'フキダシ速度倍率']);
    param.balloonWaitTime     = getParamNumber(['BalloonWaitTime', 'フキダシ待機時間']);

    var pluginCommandMap = new Map();
    setPluginCommand('アクターにバルーン', 'requestBalloonActor');
    setPluginCommand('BALLOON_FOR_ACTOR', 'requestBalloonActor');
    setPluginCommand('敵キャラにバルーン', 'requestBalloonEnemy');
    setPluginCommand('BALLOON_FOR_ENEMY', 'requestBalloonEnemy');
    setPluginCommand('使用者にバルーン', 'requestBalloonUser');
    setPluginCommand('BALLOON_FOR_USER', 'requestBalloonUser');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!$gameParty.inBattle()) return;
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    var _Game_Interpreter_updateWaitMode      = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        var waiting = this.updateWaitModeForBattleBalloon();
        return waiting ? true : _Game_Interpreter_updateWaitMode.apply(this, arguments);
    };

    Game_Interpreter.prototype.updateWaitModeForBattleBalloon = function() {
        var waiting = false;
        if (this._waitMode === 'battleBalloon') {
            waiting = this._battler.isBalloonPlaying();
        } else {
            this._battler = null;
        }
        return waiting;
    };

    Game_Interpreter.prototype.requestBalloonActor = function(args) {
        var actor = $gameActors.actor(getArgNumber(args[0]));
        if (actor && $gameParty.battleMembers().contains(actor)) {
            actor.requestBalloonIfNeed(getArgNumber(args[1], 1));
            this.setWaitForBalloon(args[2], actor);
        }
    };

    Game_Interpreter.prototype.requestBalloonEnemy = function(args) {
        var enemy = $gameTroop.members()[getArgNumber(args[0]) - 1];
        if (enemy) {
            enemy.requestBalloonIfNeed(getArgNumber(args[1], 1));
            this.setWaitForBalloon(args[2], enemy);
        }
    };

    Game_Interpreter.prototype.requestBalloonUser = function(args) {
        var user = BattleManager.getSkillUser();
        if (user) {
            user.requestBalloonIfNeed(getArgNumber(args[0], 1));
            this.setWaitForBalloon(args[1], user);
        }
    };

    Game_Interpreter.prototype.setWaitForBalloon = function(waitFlag, battler) {
        if (waitFlag && waitFlag.toUpperCase() !== 'OFF') {
            this.setWaitMode('battleBalloon');
            this._battler = battler;
        }
    };

    //=============================================================================
    // BattleManager
    //  実行主体に対してバルーンスプライトの表示をリクエストします。
    //=============================================================================
    BattleManager.getSkillUser = function() {
        return this._subject;
    };

    //=============================================================================
    // Game_BattlerBase
    //  バルーンスプライトの表示をリクエストします。
    //=============================================================================
    Game_BattlerBase.prototype.requestBalloon   = Game_CharacterBase.prototype.requestBalloon;
    Game_BattlerBase.prototype.balloonId        = Game_CharacterBase.prototype.balloonId;
    Game_BattlerBase.prototype.startBalloon     = Game_CharacterBase.prototype.startBalloon;
    Game_BattlerBase.prototype.isBalloonPlaying = Game_CharacterBase.prototype.isBalloonPlaying;
    Game_BattlerBase.prototype.endBalloon       = Game_CharacterBase.prototype.endBalloon;

    Game_BattlerBase.prototype.requestBalloonIfNeed = function(balloonId) {
        if (balloonId > 0) {
            this.requestBalloon(balloonId);
        }
    };

    //=============================================================================
    // Game_Battler
    //  リアクションバルーンの表示をリクエストします。
    //=============================================================================
    var _Game_Battler_performSubstitute      = Game_Battler.prototype.performSubstitute;
    Game_Battler.prototype.performSubstitute = function(target) {
        _Game_Battler_performSubstitute.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdSubstitute);
    };

    var _Game_Battler_performReflection      = Game_Battler.prototype.performReflection;
    Game_Battler.prototype.performReflection = function(target) {
        _Game_Battler_performReflection.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdReflection);
    };

    var _Game_Battler_performCounter      = Game_Battler.prototype.performCounter;
    Game_Battler.prototype.performCounter = function(target) {
        _Game_Battler_performCounter.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdCounter);
    };

    var _Game_Battler_performEvasion      = Game_Battler.prototype.performEvasion;
    Game_Battler.prototype.performEvasion = function(target) {
        _Game_Battler_performEvasion.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdEvasion);
    };

    var _Game_Battler_performMagicEvasion      = Game_Battler.prototype.performMagicEvasion;
    Game_Battler.prototype.performMagicEvasion = function() {
        _Game_Battler_performMagicEvasion.apply(this, arguments);
        this.requestBalloonIfNeed(param.balloonIdEvasion);
    };

    var _Game_Battler_performActionStart      = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        _Game_Battler_performActionStart.apply(this, arguments);
        this.requestBalloonIfNeed(action.getBalloonIdForUsing());
    };

    //=============================================================================
    // Game_Enemy
    //  行動決定時にバルーンを表示します。
    //=============================================================================
    var _Game_Enemy_makeActions      = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function() {
        _Game_Enemy_makeActions.apply(this, arguments);
        this.requestBalloonInput();
    };

    Game_Enemy.prototype.requestBalloonInput = function() {
        var number = this.numActions();
        for (var i = 0; i < number; i++) {
            this.requestBalloonIfNeed(this.action(i).getBalloonIdForInput());
        }
    };

    //=============================================================================
    // Game_Action
    //  バルーン情報のメモ欄を取得します。
    //=============================================================================
    Game_Action.prototype.getBalloonIdMetaData = function(names) {
        var metaInfo = getMetaValues(this.item(), names);
        return metaInfo ? getArgNumber(metaInfo, 1) : null;
    };

    Game_Action.prototype.getBalloonIdForInput = function() {
        return this.getBalloonIdMetaData(['BalloonInput', '決定時フキダシ']);
    };

    Game_Action.prototype.getBalloonIdForUsing = function() {
        return this.getBalloonIdMetaData(['BalloonUsing', '使用時フキダシ']);
    };

    //=============================================================================
    // Sprite_Battler
    //  バルーンスプライトを追加します。
    //=============================================================================
    var _Sprite_Battler_update      = Sprite_Battler.prototype.update;
    Sprite_Battler.prototype.update = function() {
        _Sprite_Battler_update.apply(this, arguments);
        if (this._battler) {
            this.updateBalloon();
        }
    };

    Sprite_Battler.prototype.setupBalloon = function() {
        if (this._battler.balloonId() > 0) {
            this.startBalloon();
            this._battler.startBalloon();
        }
    };

    Sprite_Battler.prototype.startBalloon = function() {
        if (!this._balloonSprite) {
            this._balloonSprite = new Sprite_BattlerBalloon();
        }
        this._balloonSprite.setup(this._battler.balloonId());
        this.parent.addChild(this._balloonSprite);
    };

    Sprite_Battler.prototype.updateBalloon = function() {
        if (!this.isBalloonPlaying()) {
            this._battler.endBalloon();
        }
        this.setupBalloon();
        if (this._balloonSprite) {
            this._balloonSprite.x = this.x;
            this._balloonSprite.y = this.y - this.getMainHeight();
            if (!this._balloonSprite.isPlaying()) {
                this.endBalloon();
            }
        }
    };

    Sprite_Battler.prototype.endBalloon = function() {
        if (this._balloonSprite) {
            this.parent.removeChild(this._balloonSprite);
            this._balloonSprite = null;
        }
    };

    Sprite_Battler.prototype.isBalloonPlaying = function() {
        return !!this._balloonSprite;
    };

    Sprite_Battler.prototype.getMainHeight = function() {
        return this.height;
    };

    //=============================================================================
    // Sprite_Actor
    //  バルーンスプライトを追加します。
    //=============================================================================
    Sprite_Actor.prototype.getMainHeight = function() {
        return this._mainSprite.height;
    };

    //=============================================================================
    // Sprite_BattlerBalloon
    //  バトラー表示用のフキダシスプライトです。
    //=============================================================================
    function Sprite_BattlerBalloon() {
        this.initialize.apply(this, arguments);
    }

    Sprite_BattlerBalloon.prototype             = Object.create(Sprite_Balloon.prototype);
    Sprite_BattlerBalloon.prototype.constructor = Sprite_BattlerBalloon;

    Sprite_BattlerBalloon.prototype.speed = function() {
        return Math.floor(Sprite_Balloon.prototype.speed.call(this) * 100 / (param.balloonSpeedRate || 100));
    };

    Sprite_BattlerBalloon.prototype.waitTime = function() {
        return param.balloonWaitTime;
    };
})();

