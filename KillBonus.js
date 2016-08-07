//=============================================================================
// KillBonus.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/08/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
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
 * <KB_Script:script>  # 任意のJavaScriptを実行します。
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

    var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (target.isDead()) this.executeKillBonus();
    };

    Game_Action.prototype.executeKillBonus = function() {
        var subject = this.subject();
        if (!subject) return;
        this._gainHp = 0;
        this._gainMp = 0;
        this._gainTp = 0;
        subject.traitObjects().forEach(function(data) {
            this.executeKillBonusRecoverHp(data, subject);
            this.executeKillBonusRecoverMp(data, subject);
            this.executeKillBonusRecoverTp(data, subject);
            this.executeKillBonusGold(data, subject);
            this.executeKillBonusState(data, subject);
            this.executeKillBonusStateAll(data, subject);
            this.executeKillBonusStateEnemy(data, subject);
            this.executeKillBonusScript(data, subject);
        }.bind(this));
        if (this._gainHp !== 0) subject.gainHp(this._gainHp);
        if (this._gainMp !== 0) subject.gainMp(this._gainMp);
        if (this._gainTp !== 0) subject.gainTp(this._gainTp);
    };

    Game_Action.prototype.executeKillBonusRecoverHp = function(data, subject) {
        var value = getMetaValue(data, 'HP');
        if (value) this._gainHp += getArgNumberWithEval(value);
        var value2 = getMetaValue(data, 'HPRate');
        if (value2) this._gainHp += Math.floor(subject.mhp * getArgNumberWithEval(value2) / 100);
    };

    Game_Action.prototype.executeKillBonusRecoverMp = function(data, subject) {
        var value = getMetaValue(data, 'MP');
        if (value) this._gainMp += getArgNumberWithEval(value);
        var value2 = getMetaValue(data, 'MPRate');
        if (value2) this._gainMp += Math.floor(subject.mmp * getArgNumberWithEval(value2) / 100);
    };

    Game_Action.prototype.executeKillBonusRecoverTp = function(data, subject) {
        var value = getMetaValue(data, 'TP');
        if (value) this._gainTp += getArgNumberWithEval(value);
        var value2 = getMetaValue(data, 'TPRate');
        if (value2) this._gainTp += Math.floor(subject.maxTp() * getArgNumberWithEval(value2) / 100);
    };

    Game_Action.prototype.executeKillBonusGold = function(data, subject) {
        var value = getMetaValues(data, ['Gold', 'お金']);
        if (value) {
            $gameParty.gainGold(getArgNumberWithEval(value));
        }
    };

    Game_Action.prototype.executeKillBonusState = function(data, subject) {
        var value = getMetaValues(data, ['State', 'ステート']);
        if (value) {
            subject.addState(getArgNumberWithEval(value));
        }
    };

    Game_Action.prototype.executeKillBonusStateAll = function(data, subject) {
        var value = getMetaValues(data, ['StateAll', 'ステート全体']);
        if (value) {
            subject.friendsUnit().members().forEach(function(member) {
                member.addState(getArgNumberWithEval(value));
            });
        }
    };

    Game_Action.prototype.executeKillBonusStateEnemy = function(data, subject) {
        var value = getMetaValues(data, ['StateEnemy', 'ステート敵']);
        if (value) {
            subject.opponentsUnit().members().forEach(function(member) {
                member.addState(getArgNumberWithEval(value));
            });
        }
    };

    Game_Action.prototype.executeKillBonusScript = function(data, subject) {
        var value = getMetaValues(data, ['Script', 'スクリプト']);
        if (value) {
            try {
                eval(getArgString(value));
            } catch (e) {
                console.log(e.stack);
            }
        }
    };
})();

