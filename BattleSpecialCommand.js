//=============================================================================
// BattleSpecialCommand.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/21 えのきふさん提供版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Battle special command plugin
 * @author triacontane
 *
 * @param AdditionalPosition
 * @desc 特殊コマンドの挿入位置です。指定対象の下に挿入されます。
 * top or attack or skill or guard or item
 * @default attack
 *
 * @param CommandNumber
 * @desc アクターコマンドの表示行数です。(通常4行)
 * @default
 *
 * @param CommandFlexible
 * @desc アクターコマンドの表示行数を可変にします。(ON/OFF)
 * 可変にすると使用可能コマンドがスクロールなしで表示されます。
 * @default OFF
 *
 * @param ThroughWindow
 * @desc ウィンドウが重なったときに透過表示します。(ON/OFF)
 * 他のプラグインですでに透過表示している場合はOFF
 * @default OFF
 *
 * @help Addition special command for Actor command in battle.
 *
 * description skill's note
 * <SPSkillSpecial>
 *
 * Skill's visible condition
 * description skill's note
 *
 * <SPSkillCondStateValid:1>   // State ID[1] Affected
 * <SPSkillCondStateInvalid:1> // State ID[1] Not affected
 * <SPSkillCondSwitchOn:1>     // Switch ID[1] ON
 * <SPSkillCondSwitchOff:1>    // Switch ID[1] OFF
 * <SPSkillCondScript:value>   // JavaScript[value] is returned true
 *
 * No plugin command
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 特殊戦闘コマンド追加プラグイン
 * @author トリアコンタン
 *
 * @param 追加位置
 * @desc 特殊コマンドの挿入位置です。指定対象の下に挿入されます。
 * 先頭 or 攻撃 or スキル or 防御 or アイテム
 * @default 攻撃
 *
 * @param コマンド表示行数
 * @desc アクターコマンドの表示行数です。(通常4行)
 * @default
 *
 * @param コマンド表示行数可変
 * @desc アクターコマンドの表示行数を可変にします。(ON/OFF)
 * 可変にすると使用可能コマンドがスクロールなしで表示されます。
 * @default OFF
 *
 * @param ウィンドウ透過
 * @desc ウィンドウが重なったときに透過表示します。(ON/OFF)
 * 他のプラグインですでに透過表示している場合はOFF
 * @default OFF
 *
 * @help 戦闘画面のアクターコマンドに特殊コマンドを追加します。
 * 特殊コマンドとは、スキルウィンドウを介さずに直接実行できるスキルで
 * 通常のスキルとは異なる特別なスキル等の演出に利用できます。
 *
 * スキルのメモ欄に以下の通り記述してください。
 * <SPSkillSpecial>
 *
 * 特殊コマンドに設定したスキルを通常のスキルウィンドウに
 * 表示させないようにするには、スキルタイプを「なし」に設定してください。
 *
 * また、特殊スキルを含めたすべてのスキルの表示条件を設定することができます。
 * 攻撃と防御にも適用されます。
 *
 * スキルのメモ欄に以下の通り記述してください。
 * 値には制御文字\v[n]もしくはJavaScript計算式が利用できます。
 *
 * <SPSkillCondStateValid:1>   // ステートID[1]が有効な場合に表示されます。
 * <SPSkillCondStateInvalid:1> // ステートID[1]が無効な場合に表示されます。
 * <SPSkillCondSwitchOn:1>     // スイッチ[1]がONの場合に表示されます。
 * <SPSkillCondSwitchOff:1>    // スイッチ[1]がOFFな場合に表示されます。
 * <SPSkillCondScript:value>   // valueのJS評価結果がtrueの場合に表示されます。
 * 例：<SPSkillCondScript:\v[1] > 100> // 変数[1]が100より大きい場合に表示されます。
 *
 * 注意！
 * すべての行動が選択不可になると戦闘の進行が止まりますのでご注意ください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'BattleSpecialCommand';
    var metaTagPrefix = 'SPSkill';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };
    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text) {
        if (text === null || text === undefined) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        return eval(text);
    };

    //=============================================================================
    // パラメータの取得とバリデーション
    //=============================================================================
    var paramAdditionalPosition = getParamString(['AdditionalPosition', '追加位置']).toLowerCase();
    var paramCommandNumber      = getParamNumber(['CommandNumber', 'コマンド表示行数']);
    var paramCommandFlexible    = getParamBoolean(['CommandFlexible', 'コマンド表示行数可変']);
    var paramThroughWindow      = getParamBoolean(['ThroughWindow', 'ウィンドウ透過']);

    //=============================================================================
    // Window_ActorCommand
    //  スペシャルコマンドを追加します。
    //=============================================================================
    var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._list.length > 0 && paramCommandFlexible) {
            this.height = this.fittingHeight(this._list.length);
            this.y = Graphics.boxHeight - this.height;
        }
    };

    Window_ActorCommand.prototype.addSpecialCommand = function() {
        this._actor.specialSkills().forEach(function(skill) {
            this.addCommand(skill.name, 'special', this._actor.canUse(skill), skill.id);
        }.bind(this));
    };

    var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (['top', '先頭'].contains(paramAdditionalPosition)) this.addSpecialCommand();
        if (this._actor.isVisibleAttack()) {
            _Window_ActorCommand_addAttackCommand.apply(this, arguments);
        }
        if (['attack', '攻撃'].contains(paramAdditionalPosition)) this.addSpecialCommand();
    };

    var _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function() {
        _Window_ActorCommand_addSkillCommands.apply(this, arguments);
        if (['skill', 'スキル'].contains(paramAdditionalPosition)) this.addSpecialCommand();
    };

    var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        if (this._actor.isVisibleGuard()) {
            _Window_ActorCommand_addGuardCommand.apply(this, arguments);
        }
        if (['guard', '防御'].contains(paramAdditionalPosition)) this.addSpecialCommand();
    };

    var _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
    Window_ActorCommand.prototype.addItemCommand = function() {
        _Window_ActorCommand_addItemCommand.apply(this, arguments);
        if (['item', 'アイテム'].contains(paramAdditionalPosition)) this.addSpecialCommand();
    };

    var _Window_ActorCommand_numVisibleRows = Window_ActorCommand.prototype.numVisibleRows;
    Window_ActorCommand.prototype.numVisibleRows = function() {
        return paramCommandNumber ? paramCommandNumber : _Window_ActorCommand_numVisibleRows.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Battle
    //  スペシャルコマンドを選択したときの処理を追加します。
    //=============================================================================
    var _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        this._actorCommandWindow.setHandler('special', this.commandSpecial.bind(this));
    };

    Scene_Battle.prototype.commandSpecial = function() {
        var skill = $dataSkills[this._actorCommandWindow.currentExt()];
        var action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        BattleManager.actor().setLastBattleSkill(skill);
        this.onSelectAction();
    };

    //=============================================================================
    // Game_Actor
    //  特殊スキル判定を追加定義します。
    //=============================================================================
    Game_Actor.prototype.specialSkills = function() {
        return this.skills().filter(function(skill) {
            return !!getMetaValue(skill, 'Special');
        }, this);
    };

    var _Game_Actor_skills = Game_Actor.prototype.skills;
    Game_Actor.prototype.skills = function() {
        return _Game_Actor_skills.apply(this, arguments).filter(function(skill) {
            return this.isVisibleSkill(skill);
        }, this);
    };

    Game_Actor.prototype.isVisibleSkill = function(skill) {
        var validStateId = getMetaValue(skill, 'CondStateValid');
        if (validStateId) return this.isStateAffected(getArgNumber(validStateId, 1, $dataStates.length - 1));
        var invalidStateId = getMetaValue(skill, 'CondStateInvalid');
        if (invalidStateId) return !this.isStateAffected(getArgNumber(invalidStateId, 1, $dataStates.length - 1));
        var switchOn = getMetaValue(skill, 'CondSwitchOn');
        if (switchOn) return $gameSwitches(getArgNumber(switchOn, 1, $dataSystem.switches.length - 1));
        var switchOff = getMetaValue(skill, 'CondSwitchOff');
        if (switchOff) return !$gameSwitches(getArgNumber(switchOff, 1, $dataSystem.switches.length - 1));
        var scriptValue = getMetaValue(skill, 'CondScript');
        if (scriptValue) return !!getArgString(scriptValue);
        return true;
    };

    Game_Actor.prototype.isVisibleAttack = function() {
        return this.isVisibleSkill($dataSkills[this.attackSkillId()]);
    };

    Game_Actor.prototype.isVisibleGuard = function() {
        return this.isVisibleSkill($dataSkills[this.guardSkillId()]);
    };

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (paramThroughWindow && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   描画前に配列を逆転させます。
        //=============================================================================
        var _WindowLayer__renderWebGL = WindowLayer.prototype._renderWebGL;
        WindowLayer.prototype._renderWebGL = function(renderSession) {
            this.children.reverse();
            _WindowLayer__renderWebGL.apply(this, arguments);
            this.children.reverse();
        };

        WindowLayer.prototype._webglMaskWindow = function(renderSession, window) {};
        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }
})();

