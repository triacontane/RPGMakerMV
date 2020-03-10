//=============================================================================
// KillBonus.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2020/03/10 撃破ボーナス発生時にボーナス対象にアニメーションを再生できる機能を追加
// 1.3.0 2019/11/09 条件に指定ターン以内撃破、クリティカル撃破を追加。ボーナスに最初のドロップアイテムの確率変更追加
// 1.2.0 2019/06/11 撃破ボーナスとして任意の変数を増減させる機能を追加
// 1.1.0 2017/06/08 ボーナス取得条件としてノーダメージ、ノーデス、ノースキルおよびスイッチを追加
// 1.0.0 2016/08/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 撃破ボーナスプラグイン
 * @author トリアコンタン
 *
 * @help 敵を撃破した際に何らかの報酬を得ることができます。
 * 撃破するとHPやMPを回復するステートや装備品等が作成できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記述してください。
 * <KB_HP:20>          # 自身のHPを20回復します。
 * <KB_HPRate:5>       # 自身のHPを5%回復します。
 * <KB_MP:20>          # 自身のMPを20回復します。
 * <KB_MPRate:5>       # 自身のMPを5%回復します。
 * <KB_TP:20>          # 自身のTPを20回復します。
 * <KB_TPRate:5>       # 自身のTPを5%回復します。
 * <KB_Gold:5>         # お金が5G増加します。
 * <KB_お金:5>         # 同上
 * <KB_State:5>        # 自身にステートID[5]を付与します。
 * <KB_ステート:5>     # 同上
 * <KB_StateAll:5>     # 味方全体にステートID[5]を付与します。
 * <KB_ステート全体:5> # 同上
 * <KB_StateEnemy:5>   # 敵全体にステートID[5]を付与します。
 * <KB_ステート敵:5>   # 同上
 * <KB_Variable:1, 20> # 変数[1]が20増加します。
 * <KB_変数:1, 20>     # 同上
 * <KB_Script:script>  # 任意のJavaScriptを実行します。
 * <KB_ドロップ率:2>    # 最初のドロップアイテムのドロップ率を2倍にします。
 * <KB_DropRate:2>     # 同上
 *
 * 撃破ボーナス条件をひとつだけ付けることができます。
 * <KB_条件:ノーダメージ> # ダメージを受けずに撃破で報酬
 * <KB_Cond:NoDamage>     # 同上
 * <KB_条件:ノースキル>   # スキルを使わずに撃破で報酬
 * <KB_Cond:NoSkill>      # 同上
 * <KB_条件:ノーデス>     # 戦闘不能者を出さずに撃破で報酬
 * <KB_Cond:NoDeath>      # 同上
 * <KB_条件:1>            # スイッチ[1]がONのときに撃破で報酬
 * <KB_Cond:1>            # 同上
 * <KB_条件:turn[1]>     # [1]ターン以内に撃破で報酬
 * <KB_Cond:turn[1]>     # 同上
 * <KB_条件:クリティカル> # クリティカル撃破で報酬
 * <KB_Cond:Critical>    # 同上
 *
 * 撃破ボーナスの発動時にアニメーションを再生できます。
 * 対象は撃破した側のバトラーですが、ステートの場合は付与された対象になります。
 * <KB_アニメーション:1>   # ボーナス発生時アニメーション[1]を再生
 * <KB_Animation:1>       # 同上
 * <KB_アニメ遅延:64>      # ボーナス発生時アニメーションの遅延を64フレームに設定
 * <KB_AnimationDelay:64> # 同上
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
    var metaTagPrefix = 'KB_';

    var getArgNumberWithEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(eval(convertEscapeCharacters(arg)), 10) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
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

    //=============================================================================
    // BattleManager
    //  スキルやダメージの状況を保持します。
    //=============================================================================
    var _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.members().forEach(function(member) {
            member.initKillBonusCondition();
        });
    };

    //=============================================================================
    // Game_BattlerBase
    //  スキルやダメージの状況を保持します。
    //=============================================================================
    Game_BattlerBase._condNoDamages = ['NoDamage', 'ノーダメージ'];
    Game_BattlerBase._condNoSkill   = ['NoSkill', 'ノースキル'];
    Game_BattlerBase._condNoDeath   = ['NoDeath', 'ノーデス'];
    Game_BattlerBase._condCritial   = ['Critical', 'クリティカル'];

    Game_BattlerBase.prototype.initKillBonusCondition = function() {
        this._noSkill  = true;
        this._noDamage = true;
        this._noDeath  = true;
    };

    Game_BattlerBase.prototype.breakNoSkill = function() {
        this._noSkill  = false;
    };

    Game_BattlerBase.prototype.breakNoDamage = function() {
        this._noDamage  = false;
    };

    Game_BattlerBase.prototype.breakNoDeath = function() {
        this._noDeath  = false;
    };

    Game_BattlerBase.prototype.canAcceptKillBonus = function(critical) {
        return this.traitObjects().every(function(data) {
            return this.checkDataForKillBonus(data, critical);
        }.bind(this));
    };

    Game_BattlerBase.prototype.checkDataForKillBonus = function(data, critical) {
        var condition = getMetaValues(data, ['Cond', '条件']);
        if (!condition) return true;
        if (Game_BattlerBase._condNoDamages.contains(condition) && !this._noDamage) {
            return false;
        }
        if (Game_BattlerBase._condNoSkill.contains(condition) && !this._noSkill) {
            return false;
        }
        if (Game_BattlerBase._condNoDeath.contains(condition) && !this._noDeath) {
            return false;
        }
        if (Game_BattlerBase._condCritial.contains(condition) && !critical) {
            return false;
        }
        var regResult = /turn\[(\d+)]/gi.exec(condition);
        if (regResult && $gameTroop.turnCount() > parseInt(regResult[1])) {
            return false;
        }
        var switchId = parseInt(convertEscapeCharacters(condition));
        if (switchId > 0 && !$gameSwitches.value(switchId)) {
            return false;
        }
        return true;
    };

    var _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        _Game_BattlerBase_die.apply(this, arguments);
        this.breakNoDeath();
    };

    //=============================================================================
    // Game_Battler
    //  ダメージ時にノーダメージフラグを解除します。
    //=============================================================================
    var _Game_Battler_performDamage = Game_Battler.prototype.performDamage;
    Game_Battler.prototype.performDamage = function() {
        _Game_Battler_performDamage.apply(this, arguments);
        this.breakNoDamage();
    };

    //=============================================================================
    // Game_Action
    //  撃破ボーナスを適用します。
    //=============================================================================
    var _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        this._criticalForKillBonus = false;
        var result = _Game_Action_testApply.apply(this, arguments);
        if (result && !this.isAttack() && !this.isGuard()) {
            this.subject().breakNoSkill();
        }
        return result;
    };

    var _Game_Action_applyCritical = Game_Action.prototype.applyCritical;
    Game_Action.prototype.applyCritical = function(damage) {
        this._criticalForKillBonus = true;
        return _Game_Action_applyCritical.apply(this, arguments);
    };

    var _Game_Action_executeHpDamage      = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (target.hp === 0) {
            this.executeKillBonus(target);
        }
    };

    Game_Action.prototype.executeKillBonus = function(target) {
        var subject = this.subject();
        if (!subject || !subject.canAcceptKillBonus(this._criticalForKillBonus)) return;
        this._gainHp = 0;
        this._gainMp = 0;
        this._gainTp = 0;
        this._bonusTarget = subject;
        subject.traitObjects().forEach(function(data) {
            this.executeKillBonusRecoverHp(data, subject);
            this.executeKillBonusRecoverMp(data, subject);
            this.executeKillBonusRecoverTp(data, subject);
            this.executeKillBonusGold(data, subject);
            this.executeKillBonusState(data, subject);
            this.executeKillBonusStateAll(data, subject);
            this.executeKillBonusStateEnemy(data, subject);
            this.executeKillBonusVariable(data, subject);
            this.executeKillBonusScript(data, subject);
            this.executeKillBonusDropRate(data, target);
        }.bind(this));
        this._bonusTarget = null;
        if (this._gainHp !== 0) subject.gainHp(this._gainHp);
        if (this._gainMp !== 0) subject.gainMp(this._gainMp);
        if (this._gainTp !== 0) subject.gainTp(this._gainTp);
    };

    Game_Action.prototype.findMetaForKillBonus = function(data, name) {
        var value = getMetaValues(data, name);
        if (!!value) {
            console.log(name);
            this.executeKillBonusAnimation(data);
        }
        return value;
    };

    Game_Action.prototype.executeKillBonusAnimation = function(data) {
        var id = parseInt(getMetaValues(data, ['アニメーション', 'Animation']));
        if (id > 0) {
            var delay = parseInt(getMetaValues(data, ['アニメ遅延', 'AnimationDelay']));
            if (this._bonusTarget instanceof Game_Unit) {
                this._bonusTarget.members().forEach(function(target) {
                    target.startAnimation(id, false, delay || 0);
                });
            } else {
                this._bonusTarget.startAnimation(id, false, delay || 0);
            }
        }
    };

    Game_Action.prototype.executeKillBonusRecoverHp = function(data, subject) {
        var value = this.findMetaForKillBonus(data, 'HP');
        if (value) this._gainHp += getArgNumberWithEval(value);
        var value2 = this.findMetaForKillBonus(data, 'HPRate');
        if (value2) this._gainHp += Math.floor(subject.mhp * getArgNumberWithEval(value2) / 100);
    };

    Game_Action.prototype.executeKillBonusRecoverMp = function(data, subject) {
        var value = this.findMetaForKillBonus(data, 'MP');
        if (value) this._gainMp += getArgNumberWithEval(value);
        var value2 = this.findMetaForKillBonus(data, 'MPRate');
        if (value2) this._gainMp += Math.floor(subject.mmp * getArgNumberWithEval(value2) / 100);
    };

    Game_Action.prototype.executeKillBonusRecoverTp = function(data, subject) {
        var value = this.findMetaForKillBonus(data, 'TP');
        if (value) this._gainTp += getArgNumberWithEval(value);
        var value2 = this.findMetaForKillBonus(data, 'TPRate');
        if (value2) this._gainTp += Math.floor(subject.maxTp() * getArgNumberWithEval(value2) / 100);
    };

    Game_Action.prototype.executeKillBonusGold = function(data, subject) {
        var value = this.findMetaForKillBonus(data, ['Gold', 'お金']);
        if (value) {
            $gameParty.gainGold(getArgNumberWithEval(value));
        }
    };

    Game_Action.prototype.executeKillBonusVariable = function(data, subject) {
        var value = this.findMetaForKillBonus(data, ['Variable', '変数']);
        if (value) {
            var args = getArgString(value).split(',');
            var id = parseInt(args[0]);
            $gameVariables.setValue(id, $gameVariables.value(id) + parseInt(args[1]) || 0);
        }
    };

    Game_Action.prototype.executeKillBonusState = function(data, subject) {
        var value = this.findMetaForKillBonus(data, ['State', 'ステート']);
        if (value) {
            subject.addState(getArgNumberWithEval(value));
        }
    };

    Game_Action.prototype.executeKillBonusStateAll = function(data, subject) {
        this._bonusTarget = subject.friendsUnit();
        var value = this.findMetaForKillBonus(data, ['StateAll', 'ステート全体']);
        if (value) {
            subject.friendsUnit().members().forEach(function(member) {
                member.addState(getArgNumberWithEval(value));
            });
        }
        this._bonusTarget = subject;
    };

    Game_Action.prototype.executeKillBonusStateEnemy = function(data, subject) {
        this._bonusTarget = subject.opponentsUnit();
        var value = this.findMetaForKillBonus(data, ['StateEnemy', 'ステート敵']);
        if (value) {
            subject.opponentsUnit().members().forEach(function(member) {
                member.addState(getArgNumberWithEval(value));
            });
        }
        this._bonusTarget = subject;
    };

    Game_Action.prototype.executeKillBonusScript = function(data, subject) {
        var value = this.findMetaForKillBonus(data, ['Script', 'スクリプト']);
        if (value) {
            try {
                eval(getArgString(value));
            } catch (e) {
                console.log(e.stack);
            }
        }
    };

    Game_Action.prototype.executeKillBonusDropRate = function(data, target) {
        var value = this.findMetaForKillBonus(data, ['DropRate', 'ドロップ率']);
        if (value) {
            target.setCustomDropRate(getArgNumberWithEval(value));
        }
    };

    /**
     * Game_Enemy
     * ドロップ率変更を実装します。
     */
    Game_Enemy.prototype.setCustomDropRate = function(value) {
        this._customDropRate = value;
    };

    var _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function() {
        this._firstDrop = true;
        return _Game_Enemy_makeDropItems.apply(this, arguments);
    };

    var _Game_Enemy_dropItemRate = Game_Enemy.prototype.dropItemRate;
    Game_Enemy.prototype.dropItemRate = function() {
        var result = _Game_Enemy_dropItemRate.apply(this, arguments);
        if (this._firstDrop && this._customDropRate !== undefined) {
            result *= this._customDropRate;
            this._customDropRate = undefined;
        }
        this._firstDrop = false;
        return result;
    };
})();

