//=============================================================================
// ScopeExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/06/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 効果範囲拡張プラグイン
 * @author トリアコンタン
 *
 * @help 効果範囲を拡張します。
 * スキルのメモ欄に以下の通り入力してください。
 *
 * 効果範囲が敵味方に拡大されます。詳細は以下の通りです。
 * <SE敵味方>
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
 * 元々の選択範囲に使用者が追加されます。
 * <SE使用者追加>
 *
 * 元々の選択範囲から使用者が除外されます。
 * <SE使用者除外>
 *
 * 元々の選択範囲の中からランダムで一人だけが選択されます。
 * 狙われ率の影響しない純粋なランダムです。
 * <SEランダム>
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
        if (this.isScopeExtendInfo(['使用者除外', 'RemoveUser'])) {
            targets = targets.filter(function(target) {
                return target !== this.subject();
            }.bind(this));
        }
        if (this.isScopeExtendInfo(['ランダム', 'Random'])) {
            targets = [targets[Math.floor(Math.random() * targets.length)]];
        }
        arguments[0] = targets;
        return _Game_Action_repeatTargets.apply(this, arguments);
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
        } else if (this.isForOne()) {
            targets.push(anotherUnit.randomTarget());
        } else {
            targets = targets.concat(anotherUnit.aliveMembers());
        }
        return targets;
    };

    Game_Action.prototype.isScopeExtendInfo = function(names) {
        return !!getMetaValues(this.item(), names);
    };
})();

