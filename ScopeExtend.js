//=============================================================================
// ScopeExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.0 2017/07/09 「敵単体（戦闘不能）」および「敵全体（戦闘不能）」の効果範囲を追加
// 1.5.1 2017/02/21 グループ対象に指定したスキルが「隠れ状態」の敵にも当たってしまう問題を修正
// 1.5.0 2016/12/02 味方に対してN回ランダム選択できる機能を追加
// 1.4.0 2016/12/02 ランダム設定に対象人数を設定できる機能を追加
// 1.3.0 2016/09/15 敵N回ランダムのスキルに対して5回以上の繰り返しを指定できる機能を追加
// 1.2.0 2016/09/06 敵グループ内で同じIDの敵キャラ全員を対象にできるスコープを追加
// 1.1.0 2016/07/20 ターゲットの中から重複を除外できる機能を追加
// 1.0.0 2016/06/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ScopeExtendPlugin
 * @author triacontane
 *
 * @help データベースのスキルの効果範囲を拡張します。
 * スキルのメモ欄に以下の通り入力してください。
 *
 * <SE敵味方> <SEEnemiesAndAllies>
 * 効果範囲が敵味方に拡大されます。詳細は以下の通りです。
 *
 * もともとの効果範囲に合わせて以下の通り拡大されます。
 * ・敵単体：生存している味方単体がランダムで一人追加
 * ・敵全体：生存している味方全体が追加
 * ・敵N体ランダム：敵味方N体ランダムに変更
 * ・味方単体：生存している敵単体がランダムで一人追加
 * ・味方全体：生存している敵全体が追加
 * ・味方単体（戦闘不能）：死亡している敵単体がランダムで一人追加
 * ・味方全体（戦闘不能）：死亡している敵全体が追加
 * ・使用者：生存している敵単体がランダムで一人追加
 *
 * <SE使用者追加> <SEAdditionUser>
 * 元々の選択範囲に使用者が追加されます。
 *
 * <SE使用者除外> <SERemoveUser>
 * 元々の選択範囲から使用者が除外されます。
 *
 * <SE重複除外> <SERemoveDuplication>
 * 元々の選択範囲から重複ターゲットが除外されます。
 *
 * <SEランダム:n> <SERandom:n>
 * 元々の選択範囲の中からランダムでn人だけが選択されます。
 * 狙われ率の影響しない純粋なランダムです。
 * 値を省略するとランダムで一人が選択されます。
 *
 * <SEグループ> <SEGroup>
 * 敵グループ内に、指定した敵単体と同じIDの敵キャラがいる場合、全員選択されます。
 * 味方の場合は味方全員が無条件で選択されます。
 *
 * <SEランダム回数:5> <SERandomNum:5>
 * 「敵N体ランダム」を効果範囲にしたスキルに対して、
 * もともとの設定上限(4回)を超えて、5回以上実行したい場合に指定します。
 * 回数の指定には制御文字\v[n]およびJavaScript計算式が利用できます。
 *
 * さらに「味方全体」を効果範囲にしたスキルに対して設定すると
 * 「味方N体ランダム」を効果範囲にできます。
 *
 * <SE戦闘不能> <SEDead>
 * もともとの効果範囲が「敵単体」「敵全体」のスキルに対して
 * 対象を戦闘不能者に限定します。
 * 敵を蘇生させる等のスキルが作成できますが、「敵単体（戦闘不能）」は
 * 敵キャラ専用のスキルになります。
 * （アクターが使用しても正しく対象を選択できません）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:ja
 * @plugindesc 効果範囲拡張プラグイン
 * @author トリアコンタン
 *
 * @help データベースのスキルの効果範囲を拡張します。
 * スキルのメモ欄に以下の通り入力してください。
 *
 * <SE敵味方> <SEEnemiesAndAllies>
 * 効果範囲が敵味方に拡大されます。詳細は以下の通りです。
 *
 * もともとの効果範囲に合わせて以下の通り拡大されます。
 * ・敵単体：生存している味方単体がランダムで一人追加
 * ・敵全体：生存している味方全体が追加
 * ・敵N体ランダム：敵味方N体ランダムに変更
 * ・味方単体：生存している敵単体がランダムで一人追加
 * ・味方全体：生存している敵全体が追加
 * ・味方単体（戦闘不能）：死亡している敵単体がランダムで一人追加
 * ・味方全体（戦闘不能）：死亡している敵全体が追加
 * ・使用者：生存している敵単体がランダムで一人追加
 *
 * <SE使用者追加> <SEAdditionUser>
 * 元々の選択範囲に使用者が追加されます。
 *
 * <SE使用者除外> <SERemoveUser>
 * 元々の選択範囲から使用者が除外されます。
 *
 * <SE重複除外> <SERemoveDuplication>
 * 元々の選択範囲から重複ターゲットが除外されます。
 *
 * <SEランダム:n> <SERandom:n>
 * 元々の選択範囲の中からランダムでn人だけが選択されます。
 * 狙われ率の影響しない純粋なランダムです。
 * 値を省略するとランダムで一人が選択されます。
 *
 * <SEグループ> <SEGroup>
 * 敵グループ内に、指定した敵単体と同じIDの敵キャラがいる場合、全員選択されます。
 * 味方の場合は味方全員が無条件で選択されます。
 *
 * <SEランダム回数:5> <SERandomNum:5>
 * 「敵N体ランダム」を効果範囲にしたスキルに対して、
 * もともとの設定上限(4回)を超えて、5回以上実行したい場合に指定します。
 * 回数の指定には制御文字\v[n]およびJavaScript計算式が利用できます。
 *
 * さらに「味方全体」を効果範囲にしたスキルに対して設定すると
 * 「味方N体ランダム」を効果範囲にできます。
 *
 * <SE戦闘不能> <SEDead>
 * もともとの効果範囲が「敵単体」「敵全体」のスキルに対して
 * 対象を戦闘不能者に限定します。
 * 敵を蘇生させる等のスキルが作成できますが、「敵単体（戦闘不能）」は
 * 敵キャラ専用のスキルになります。
 * （アクターが使用しても正しく対象を選択できません）
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
    var metaTagPrefix = 'SE';

    var getArgNumberWithEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(eval(convertEscapeCharacters(arg)), 10) || 0).clamp(min, max);
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

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Unit
    //  味方キャラをランダム選択します。
    //=============================================================================
    Game_Unit.prototype.randomFriendTarget = function() {
        var members = this.aliveMembers();
        return members[Math.floor(Math.random() * members.length)];
    };

    //=============================================================================
    // Game_Action
    //  効果範囲をメモ欄の記述に基づいて拡張します。
    //=============================================================================
    var _Game_Action_repeatTargets = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function(targets) {
        if (this.isScopeExtendInfo(['敵味方', 'EnemiesAndAllies'])) {
            if (!this.subject().isConfused() || this._forcing) {
                targets = this.targetsForAll(targets);
            }
        }
        if (this.isScopeExtendInfo(['使用者追加', 'AdditionUser'])) {
            if (!targets.contains(this.subject())) {
                targets.push(this.subject());
            }
        }
        if (this.isScopeExtendInfo(['使用者除外', 'RemoveUser', '使用者削除'])) {
            targets = targets.filter(function(target) {
                return target !== this.subject();
            }.bind(this));
        }
        if (this.isScopeExtendInfo(['重複除外', 'RemoveDuplication', '重複削除'])) {
            targets = targets.filter(function(target, i) {
                return targets.indexOf(target) === i;
            }.bind(this));
        }
        if (this.isScopeExtendInfo(['ランダム', 'Random'])) {
            var number = this.getScopeExtendInfo(['ランダム', 'Random']);
            var targetsForRandom = [];
            while (targetsForRandom.length < number && targets.length > targetsForRandom.length) {
                var index = Math.floor(Math.random() * targets.length);
                if (!targetsForRandom.contains(targets[index])) {
                    targetsForRandom.push(targets[index]);
                }
            }
            targets = targetsForRandom;
        }
        if (this.isScopeExtendInfo(['グループ', 'Group'])) {
            var targetsForGroup, prevTarget = targets[0];
            if (prevTarget.isActor()) {
                targetsForGroup = prevTarget.friendsUnit().aliveMembers();
            } else {
                targetsForGroup = prevTarget.friendsUnit().aliveMembers().filter(function(member) {
                    return prevTarget.enemyId() === member.enemyId();
                });
            }
            targets = targetsForGroup;
        }
        arguments[0] = targets;
        return _Game_Action_repeatTargets.apply(this, arguments);
    };

    var _Game_Action_numTargets = Game_Action.prototype.numTargets;
    Game_Action.prototype.numTargets = function() {
        var metaValue = getMetaValues(this.item(), ['RandomNum', 'ランダム回数']);
        return metaValue ? getArgNumberWithEval(metaValue, 1) : _Game_Action_numTargets.apply(this, arguments);
    };

    var _Game_Action_targetsForOpponents = Game_Action.prototype.targetsForOpponents;
    Game_Action.prototype.targetsForOpponents = function() {
        var targets = _Game_Action_targetsForOpponents.apply(this, arguments);
        if (this.isForDeadOpponent()) {
            var unit = this.opponentsUnit();
            if (this.isForOne()) {
                targets = [unit.smoothDeadTarget(this._targetIndex)];
            } else {
                targets = unit.deadMembers();
            }
        }
        return targets;
    };

    var _Game_Action_targetsForFriends = Game_Action.prototype.targetsForFriends;
    Game_Action.prototype.targetsForFriends = function() {
        var targets = _Game_Action_targetsForFriends.apply(this, arguments);
        var numTargets = this.numTargets();
        if (this.isForAll() && numTargets > 0) {
            var friendUnit = this.friendsUnit();
            targets = [];
            for (var i = 0; i < numTargets; i++) {
                targets.push(friendUnit.randomFriendTarget());
            }
        }
        return targets;
    };

    Game_Action.prototype.targetsForAll = function(targets) {
        var opponentsUnit = this.opponentsUnit();
        var friendsUnit = this.friendsUnit();
        var anotherUnit = this.isForFriend() ? opponentsUnit : friendsUnit;
        if (this.isForUser()) {
            targets.push(opponentsUnit.randomTarget());
        } else if (this.isForRandom()) {
            targets = [];
            for (var i = 0; i < this.numTargets(); i++) {
                var opponentsLength = opponentsUnit.aliveMembers().length;
                var friendLength = friendsUnit.aliveMembers().length;
                if (Math.randomInt(opponentsLength + friendLength) >= opponentsLength) {
                    targets.push(friendsUnit.randomTarget());
                } else {
                    targets.push(opponentsUnit.randomTarget());
                }
            }
        } else if (this.isForDeadFriend()) {
            if (this.isForOne()) {
                targets.push(opponentsUnit.randomDeadTarget());
            } else {
                targets = targets.concat(opponentsUnit.deadMembers());
            }
        } else if (this.isForDeadOpponent()) {
            if (this.isForOne()) {
                targets.push(friendsUnit.randomDeadTarget());
            } else {
                targets = targets.concat(friendsUnit.deadMembers());
            }
        } else if (this.isForOne()) {
            targets.push(anotherUnit.randomTarget());
        } else {
            targets = targets.concat(anotherUnit.aliveMembers());
        }
        return targets;
    };

    var _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        return _Game_Action_testApply.apply(this, arguments) || (this.isForDeadOpponent() && target.isDead());
    };

    Game_Action.prototype.isForDeadOpponent = function() {
        return this.checkItemScope([1, 2]) && getMetaValues(this.item(), ['Dead', '戦闘不能']);
    };

    Game_Action.prototype.isScopeExtendInfo = function(names) {
        return !!getMetaValues(this.item(), names);
    };

    Game_Action.prototype.getScopeExtendInfo = function(names) {
        var result = getArgNumber(getMetaValues(this.item(), names));
        return result === true ? 1 : result;
    };
})();

