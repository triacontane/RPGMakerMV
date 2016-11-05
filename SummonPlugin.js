/*
 * Summon Plugin for RPG Tkool MV
 * Version
 * 1.0.1 2016/11/05 召喚モンスター死亡時のメッセージおよびアニメーションを指定する機能を追加
 */

/*:
 * @plugindesc Add summon magic.
 * @author aoitofu
 *
 * @param DeadMessage
 * @desc 召喚モンスター死亡時の専用メッセージです。%1が召喚したモンスターの名前に変換されます。
 * @default %1は元の世界に戻りました。
 *
 * @param DeadMessageWait
 * @desc 召喚モンスター死亡時のメッセージ表示後のウェイト(フレーム単位)です。
 * @default 16
 *
 * @param DeadAnimationId
 * @desc 召喚モンスター死亡時に再生されるアニメーションIDです。
 * @default 0
 *
 * @help 
 */

/*:ja
 * @plugindesc 召喚魔法を追加します。
 * @author aoitofu
 *
 * @param 死亡時メッセージ
 * @desc 召喚モンスター死亡時の専用メッセージです。%1が召喚したモンスターの名前に変換されます。
 * @default %1は元の世界に戻りました。
 *
 * @param 死亡時ウェイト
 * @desc 召喚モンスター死亡時のメッセージ表示後のウェイト(フレーム単位)です。
 * @default 60
 *
 * @param 死亡時アニメID
 * @desc 召喚モンスター死亡時に再生されるアニメーションIDです。
 * @default 0
 *
 * @help 
 */

(function() {
    'use strict';
    var pluginName = 'SummonPlugin';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var paramDeadMessage     = getParamString(['DeadMessage', '死亡時メッセージ']);
    var paramDeadAnimationId = getParamNumber(['DeadAnimationId', '死亡時アニメID']);
    var paramDeadMessageWait = getParamNumber(['DeadMessageWait', '死亡時ウェイト']);

    //---------------------------------------------------------//
    // Game_Actor                                              //
    //---------------------------------------------------------//
    var __Game_Actor_initMembers     = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        __Game_Actor_initMembers.call(this);
        this._deadAttacked = false;
    };

    Game_Actor.prototype.deadAttackSkillId = function() {
        var actor = $dataActors[this._actorId];
        if (actor.meta.deadAttackSkill != null)
            return parseInt(actor.meta.deadAttackSkill, 10);
        else return -1;
    };

    Game_Actor.prototype.hasDeadAttack = function() {
        return ( this.deadAttackSkillId() > -1 && !this._deadAttacked )
    };

    Game_Actor.prototype.deadAttack = function() {
        var skillId = this.deadAttackSkillId();
        if (skillId > -1) {
            this.forceAction(skillId, -1);
            this._deadAttacked = true;
        }
    };

    //---------------------------------------------------------//
    // Game_Party                                              //
    //---------------------------------------------------------//
    var __Game_Party_initialize     = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        __Game_Party_initialize.call(this);
        this._owners = [];
    };

    Game_Party.prototype.setupStartingMembers = function() {
        this._actors = [];
        $dataSystem.partyMembers.forEach(function(actorId) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
                this._owners.push(-1);
            }
        }, this);
    };

    Game_Party.prototype.addActor = function(actorId) {
        if (!this._actors.contains(actorId)) {
            this._actors.push(actorId);
            this._owners.push(-1);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    };

    Game_Party.prototype.removeActor = function(actorId) {
        if (this._actors.contains(actorId)) {
            var index = this._actors.indexOf(actorId);
            this._actors.splice(index, 1);
            this._owners.splice(index, 1);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    };

    Game_Party.prototype.swapOrder = function(index1, index2) {
        var temp             = this._actors[index1];
        var temp2            = this._owners[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        this._owners[index1] = this._actors[index2];
        this._owners[index2] = temp2;
        $gamePlayer.refresh();
    };

    Game_Party.prototype.clearOwners = function() {
        this._owners = Array.apply(null, Array(this._actors.length))
            .map(function() { return -1; });
    };

    Game_Party.prototype.summonMonster = function(caller, monster) {
        if (this._actors.contains(caller) && !this._actors.contains(monster)) {
            var index                                = this._actors.indexOf(caller);
            this._actors[index]                      = monster;
            this._owners[index]                      = caller;
            $gameActors.actor(monster)._deadAttacked = false;
            $gamePlayer.refresh();
        }
    };

    Game_Party.prototype.swapDeadMonsters = function() {
        for (var i = 0; i < this._actors.length; i++) {
            var actor = $gameActors.actor(this._actors[i]);
            var owner = $gameActors.actor(this._owners[i]);
            if (this._owners[i] > -1 && actor.isDead()) {
                if (actor.hasDeadAttack())
                    BattleManager.deadAttack(actor);
                else {
                    actor.recoverAll();
                    this._actors[i] = this._owners[i];
                    this._owners[i] = -1;
                }
                BattleManager.processMonsterDead(actor, owner);
            }
        }
        $gamePlayer.refresh();
    };

    Game_Party.prototype.returnMonsters = function() {
        for (var i = 0; i < this._actors.length; i++) {
            if (this._owners[i] > -1) {
                $gameActors.actor(this._actors[i]).recoverAll();
                this._actors[i] = this._owners[i];
                this._owners[i] = -1;
            }
        }
        $gamePlayer.refresh();
    };

    //---------------------------------------------------------//
    // Game_Action                                             //
    //---------------------------------------------------------//
    Game_Action.prototype.isSummonSkill = function() {
        return this.isSkill() && this.subject().isActor() && (this.item().meta.summonActorId != null);
    };

    var __Game_Action_apply     = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        __Game_Action_apply.call(this, target);

        if (this.isSummonSkill()) {
            var monsterId = this.item().meta.summonActorId;
            $gameParty.summonMonster(this.subject().actorId(), parseInt(monsterId, 10));
        }
    };

    //---------------------------------------------------------//
    // BattleManager                                           //
    //---------------------------------------------------------//
    var __BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers       = function() {
        __BattleManager_initMembers.call(this);
        $gameParty.clearOwners();
    };

    BattleManager.invokeNormalAction = function(subject, target) {
        var realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);

        if (!this._action.isSummonSkill())
            this._logWindow.displayActionResults(subject, realTarget);
    };

    BattleManager.deadAttack = function(subject) {
        subject.deadAttack();
        this.forceAction(subject);
    };

    var __BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction       = function() {
        $gameParty.swapDeadMonsters();
        __BattleManager_endAction.call(this);
    };

    var __BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory       = function() {
        $gameParty.returnMonsters();
        __BattleManager_processVictory.call(this);
    };

    var __BattleManager_processEscape = BattleManager.processEscape;
    BattleManager.processEscape       = function() {
        $gameParty.returnMonsters();
        __BattleManager_processEscape.call(this);
    };

    var __BattleManager_processAbort = BattleManager.processAbort;
    BattleManager.processAbort       = function() {
        $gameParty.returnMonsters();
        __BattleManager_processAbort.call(this);
    };

    var __BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat       = function() {
        $gameParty.returnMonsters();
        __BattleManager_processDefeat.call(this);
    };

    BattleManager.processMonsterDead = function(monster, owner) {
        this._logWindow.displayMonsterDead(monster, owner);
    };

    //---------------------------------------------------------//
    // Window_BattleLog                                        //
    //---------------------------------------------------------//
    Window_BattleLog.prototype.displayMonsterDead = function(monster, owner) {
        if (paramDeadAnimationId) {
            this.push('showNormalAnimation', [owner], paramDeadAnimationId, false);
        }
        this.push('addText', paramDeadMessage.format(monster.name()));
        this.push('waitForMonsterDead');
    };

    Window_BattleLog.prototype.waitForMonsterDead = function() {
        if (paramDeadMessageWait) {
            this._waitCount += paramDeadMessageWait;
        }
    };
}());
