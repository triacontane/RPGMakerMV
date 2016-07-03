//=============================================================================
// CustomizeAttackGuard.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/07/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Attack And Guard Customize Plugin
 * @author triacontane
 *
 * @help Change skill ID for attack and guard
 *
 * Note for Actor, Weapon, Armor and others.(has Trait)
 *
 * Change attack skill ID
 * <CAGAttack:n> n:Skill ID
 *
 * Change guard skill ID
 * <CAGGuard:n> n:Skill ID
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 攻撃防御カスタマイズプラグイン
 * @author トリアコンタン
 *
 * @help 通常攻撃と防御を任意のスキルに差し替えることができます。
 * 特定の武器を装備すると通常攻撃が別のスキルに変化したり、
 * 強力な防御が実行できるアクターや職業を表現できます。
 *
 * アクターや武器、防具など「特徴」を有するデータベースのメモ欄に以下の通り入力してください。
 *
 * 通常攻撃のスキル(通常は1)を指定したスキルIDに差し替えます。
 * <CAG攻撃:n> n:スキルID
 *
 * 防御のスキル(通常は2)を指定したスキルIDに差し替えます。
 * <CAG防御:n> n:スキルID
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
    var metaTagPrefix = 'CAG';

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
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
    // Game_BattlerBase
    //  特徴から情報を取得します。
    //=============================================================================
    var _Game_BattlerBase_attackSkillId      = Game_BattlerBase.prototype.attackSkillId;
    Game_BattlerBase.prototype.attackSkillId = function() {
        var id = this.getCustomizeSkillId(['攻撃', 'Attack']);
        return id ? id : _Game_BattlerBase_attackSkillId.apply(this, arguments);
    };

    Game_BattlerBase.prototype.getDefaultAttackSkillId = function() {
        return _Game_BattlerBase_attackSkillId.apply(this, arguments);
    };

    var _Game_BattlerBase_guardSkillId      = Game_BattlerBase.prototype.guardSkillId;
    Game_BattlerBase.prototype.guardSkillId = function() {
        var id = this.getCustomizeSkillId(['防御', 'Guard']);
        return id ? id : _Game_BattlerBase_guardSkillId.apply(this, arguments);
    };

    Game_BattlerBase.prototype.getDefaultGuardSkillId = function() {
        return _Game_BattlerBase_guardSkillId.apply(this, arguments);
    };

    Game_BattlerBase.prototype.getCustomizeSkillId = function(tagNames) {
        var skillId = null;
        this.traitObjects().some(function(data) {
            var value = getMetaValues(data, tagNames);
            if (value) skillId = getArgNumber(value, 1, $dataSkills.length - 1);
            return !!value;
        });
        return skillId;
    };

    //=============================================================================
    // Scene_Battle
    //  攻撃と防御コマンド選択時の挙動を変更します。
    //=============================================================================
    var _Scene_Battle_commandAttack      = Scene_Battle.prototype.commandAttack;
    Scene_Battle.prototype.commandAttack = function() {
        var actor = BattleManager.actor();
        var id    = actor.attackSkillId();
        if (id !== actor.getDefaultAttackSkillId()) {
            BattleManager.inputtingAction().setAttack();
            this.onSelectAction();
        } else {
            _Scene_Battle_commandAttack.apply(this, arguments);
        }
    };

    var _Scene_Battle_commandGuard      = Scene_Battle.prototype.commandGuard;
    Scene_Battle.prototype.commandGuard = function() {
        var actor = BattleManager.actor();
        var id    = actor.guardSkillId();
        if (id !== actor.getDefaultGuardSkillId()) {
            BattleManager.inputtingAction().setGuard();
            this.onSelectAction();
        } else {
            _Scene_Battle_commandGuard.apply(this, arguments);
        }
    };

    //=============================================================================
    // Window_ActorCommand
    //  攻撃と防御の表示名を変更します。
    //=============================================================================
    var _Window_ActorCommand_addAttackCommand      = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        var id = this._actor.attackSkillId();
        if (id !== this._actor.getDefaultAttackSkillId()) {
            this.addCommand($dataSkills[id].name, 'attack', this._actor.canAttack());
        } else {
            _Window_ActorCommand_addAttackCommand.apply(this, arguments);
        }
    };

    var _Window_ActorCommand_addGuardCommand      = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        var id = this._actor.guardSkillId();
        if (id !== this._actor.getDefaultGuardSkillId()) {
            this.addCommand($dataSkills[id].name, 'guard', this._actor.canGuard());
        } else {
            _Window_ActorCommand_addGuardCommand.apply(this, arguments);
        }
    };
})();

