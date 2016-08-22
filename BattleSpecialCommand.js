//=============================================================================
// BattleSpecialCommand.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2016/08/22 本体v1.3.0によりウィンドウ透過の実装が変更されたので対応
// 1.0.1 2016/04/01 コマンド追加位置を細かく指定できる機能を追加
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
 * description skill note
 * <BSCSpecialCommand>
 *     
 * if additional position...
 * description skill note
 * <BSCAddPosition:top>    // Add special command under top
 * <BSCAddPosition:attack> // Add special command under attack
 * <BSCAddPosition:skill>  // Add special command under skill
 * <BSCAddPosition:guard>  // Add special command under guard
 * <BSCAddPosition:item>   // Add special command under item
 *
 * Skill visible condition
 * description skill note
 *
 * <BSCCondStateValid:1>   // State ID[1] Affected
 * <BSCCondStateInvalid:1> // State ID[1] Not affected
 * <BSCCondSwitchOn:1>     // Switch ID[1] ON
 * <BSCCondSwitchOff:1>    // Switch ID[1] OFF
 * <BSCCondScript:value>   // JavaScript[value] is returned true
 *
 * SkillType and items visible condition
 * description class note
 * <BSCSkillType1CondStateValid:1> // State ID[1] Affected
 * <BSCSkillType2CondStateValid:1> // State ID[1] Affected
 * <BSCItemCondStateValid:1>       // State ID[1] Affected
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
 * スキルごとに追加位置を指定していない場合のみ有効です。
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
 * @help 機能1:
 * 戦闘画面のアクターコマンドに特殊コマンドを追加します。
 * 特殊コマンドとは、スキルウィンドウを介さずに直接実行できるスキルで
 * 通常のスキルとは異なる特別なスキル等の演出に利用できます。
 *
 * [スキル]のメモ欄に以下の通り記述してください。
 * <BSC特殊コマンド>
 *
 * ※ 特殊コマンドに設定したスキルを通常のスキルウィンドウに
 * 表示させないようにするには、スキルタイプを「なし」に設定してください。
 *
 * 特殊コマンドが追加される位置を細かく指定したい場合は
 * [スキル]のメモ欄に以下の通り記述してください。
 * <BSC追加位置:先頭>     // 先頭に追加されます。
 * <BSC追加位置:攻撃>     // 攻撃の下に追加されます。
 * <BSC追加位置:スキル>   // スキルの下に追加されます。
 * <BSC追加位置:防御>     // 防御の下に追加されます。
 * <BSC追加位置:アイテム> // アイテムの下に追加されます。
 * 
 * 機能2:
 * 特殊コマンドを含めたすべてのコマンドの表示条件を設定することができます。
 * 非表示に設定されたコマンドは、たとえ使用条件を満たしていても
 * 使用できなくなります。
 * 攻撃、防御、アイテム等の基本コマンドにも適用できます。
 *
 * [スキル]のメモ欄に以下の通り記述してください。
 * 値には制御文字\v[n]もしくはJavaScript計算式が利用できます。
 *
 * <BSC条件ステート有効:1>   // ステートID[1]が有効な場合に表示されます。
 * <BSC条件ステート無効:1>   // ステートID[1]が無効な場合に表示されます。
 * <BSC条件スイッチON:1>     // スイッチ[1]がONの場合に表示されます。
 * <BSC条件スイッチOFF:1>    // スイッチ[1]がOFFな場合に表示されます。
 * <BSC条件スクリプト:value> // valueのJS評価結果がtrueの場合に表示されます。
 * 
 * 例：<BSC条件スクリプト:\v[1] > 100> // 変数[1]が100より大きければ表示
 *
 * スキルタイプ(魔法等)やアイテムコマンドの表示を制御する場合は、
 * [職業]のメモ欄に以下の通り記述してください。
 * スキル用の記述と同等の条件パターンが使用できます。
 *
 * <BSCスキルタイプ1条件ステート有効:1>
 *     // ステートID[1]が有効な場合にスキルタイプ1が表示されます。
 * <BSCスキルタイプ2条件ステート有効:1>
 *     // ステートID[1]が有効な場合にスキルタイプ2が表示されます。
 * <BSCアイテム条件ステート有効:1>
 *     // ステートID[1]が有効な場合にアイテムが表示されます。
 * 
 * 注意！
 * すべての行動が選択不可になると戦闘の進行が止まりますのでご注意ください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  ・[BSC_コマンド入れ替え]通常の4コマンドの表示順を任意で入れ替えます。
 *   BSC_コマンド入れ替え 攻撃 アイテム 防御 スキル
 *   BSC_REPLACEMENT_COMMAND item guard skill attack
 *
 *  ・[BSC_コマンドリセット]通常の4コマンドの表示順をデフォルトに戻します。
 *   BSC_コマンドリセット
 *   BSC_RESET_COMMAND
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'BattleSpecialCommand';
    var metaTagPrefix = 'BSC';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
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

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return evalFlg ? eval(text) : text;
    };

    //=============================================================================
    // パラメータの取得とバリデーション
    //=============================================================================
    var paramAdditionalPosition = getParamString(['AdditionalPosition', '追加位置']).toLowerCase();
    var paramCommandNumber      = getParamNumber(['CommandNumber', 'コマンド表示行数']);
    var paramCommandFlexible    = getParamBoolean(['CommandFlexible', 'コマンド表示行数可変']);
    var paramThroughWindow      = getParamBoolean(['ThroughWindow', 'ウィンドウ透過']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandBattleSpecialCommand(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                var devTool = window.showDevTools();
                devTool.moveTo(0, 0);
                devTool.resizeTo(Graphics.width, Graphics.height);
                window.focus();
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandBattleSpecialCommand = function (command, args) {
        switch (getCommandName(command)) {
            case 'BSC_コマンド入れ替え' :
            case 'BSC_REPLACEMENT_COMMAND' :
                var actorCommands = [];
                args.forEach(function (arg) {
                    if (arg) actorCommands.push(getArgString(arg).toLowerCase());
                }.bind(this));
                $gameSystem.setReplacementCommands(actorCommands);
                break;
            case 'BSC_コマンドリセット' :
            case 'BSC_RESET_COMMAND' :
                $gameSystem.setReplacementCommands(null);
                break;
        }
    };

    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._replacementCommands = null;
    };

    Game_System.prototype.setReplacementCommands = function(value) {
        if (Array.isArray(value) || value === null) this._replacementCommands = value;
    };

    Game_System.prototype.getReplacementCommands = function() {
        return this._replacementCommands;
    };
    
    //=============================================================================
    // Game_Actor
    //  特殊コマンドの追加と、行動の表示判定を追加定義します。
    //=============================================================================
    Game_Actor.prototype.specialSkills = function() {
        return this.skills().filter(function(skill) {
            return !!getMetaValues(skill, ['特殊コマンド', 'SpecialCommand']);
        }, this);
    };

    var _Game_Actor_skills = Game_Actor.prototype.skills;
    Game_Actor.prototype.skills = function() {
        return _Game_Actor_skills.apply(this, arguments).filter(function(skill) {
            return this.isVisibleAction(skill);
        }, this);
    };

    Game_Actor.prototype.isVisibleAttack = function() {
        return this.isVisibleAction($dataSkills[this.attackSkillId()]);
    };

    Game_Actor.prototype.isVisibleGuard = function() {
        return this.isVisibleAction($dataSkills[this.guardSkillId()]);
    };

    Game_Actor.prototype.isVisibleItem = function() {
        return this.isVisibleAction(this.currentClass(), ['アイテム', 'Item']);
    };

    Game_Actor.prototype.isVisibleSkillType = function(skillTypeId) {
        var stringId = skillTypeId.toString();
        return this.isVisibleAction(this.currentClass(), ['スキルタイプ' + stringId, 'SkillType' + stringId]);
    };

    Game_Actor.prototype.isVisibleAction = function(data, prefix) {
        if (arguments.length < 2) prefix = ['', ''];
        var validStateId    = getMetaValues(data, [prefix[0] + '条件ステート有効', prefix[1] + 'CondStateValid']);
        if (validStateId)   return this.isStateAffected(getArgNumber(validStateId, 1, $dataStates.length - 1));
        var invalidStateId  = getMetaValues(data, [prefix[0] + '条件ステート無効', prefix[1] + 'CondStateInvalid']);
        if (invalidStateId) return !this.isStateAffected(getArgNumber(invalidStateId, 1, $dataStates.length - 1));
        var switchOn        = getMetaValues(data, [prefix[0] + '条件スイッチON', prefix[1] + 'CondSwitchOn']);
        if (switchOn)       return $gameSwitches(getArgNumber(switchOn, 1, $dataSystem.switches.length - 1));
        var switchOff       = getMetaValues(data, [prefix[0] + '条件スイッチOFF', prefix[1] + 'CondSwitchOff']);
        if (switchOff)      return !$gameSwitches(getArgNumber(switchOff, 1, $dataSystem.switches.length - 1));
        var scriptValue     = getMetaValues(data, [prefix[0] + '条件スクリプト', prefix[1] + 'CondScript']);
        if (scriptValue)    return !!getArgString(scriptValue);
        return true;
    };

    //=============================================================================
    // Window_ActorCommand
    //  特殊コマンドの追加と、行動の表示判定を追加定義します。
    //=============================================================================
    Window_ActorCommand._commandNameTop    = ['top', '先頭'];
    Window_ActorCommand._commandNameAttack = ['attack', '攻撃'];
    Window_ActorCommand._commandNameSkill  = ['skill', 'スキル'];
    Window_ActorCommand._commandNameGuard  = ['guard', '防御'];
    Window_ActorCommand._commandNameItem   = ['item', 'アイテム'];

    var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        if (this._actor) {
            this.addSpecialCommand(Window_ActorCommand._commandNameTop);
        }
        var commands = $gameSystem.getReplacementCommands();
        if (commands) {
            if (this._actor) {
                commands.forEach(function (command) {
                    if (Window_ActorCommand._commandNameAttack.contains(command)) {
                        this.addAttackCommand();
                    }
                    if (Window_ActorCommand._commandNameSkill.contains(command)) {
                        this.addSkillCommands();
                    }
                    if (Window_ActorCommand._commandNameGuard.contains(command)) {
                        this.addGuardCommand();
                    }
                    if (Window_ActorCommand._commandNameItem.contains(command)) {
                        this.addItemCommand();
                    }
                }.bind(this));
            }
        } else {
            _Window_ActorCommand_makeCommandList.apply(this, arguments);
        }
        if (this._list.length > 0 && paramCommandFlexible) {
            this.height = this.fittingHeight(this._list.length);
            this.y = Graphics.boxHeight - this.height;
        }
    };

    Window_ActorCommand.prototype.addSpecialCommand = function(positionNames) {
        if (positionNames.contains(paramAdditionalPosition)) this.addSpecialCommandSub();
        this.addSpecialCommandSub(positionNames);
    };

    Window_ActorCommand.prototype.addSpecialCommandSub = function(positionNames) {
        if (!positionNames) positionNames = [''];
        this._actor.specialSkills().forEach(function(skill) {
            var addPosition = (getMetaValues(skill, ['追加位置', 'AddPosition']) || '').toLowerCase();
            if (positionNames.contains(addPosition)) {
                this.addCommand(skill.name, 'special', this._actor.canUse(skill), skill.id);
            }
        }.bind(this));
    };

    var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (this._actor.isVisibleAttack()) {
            _Window_ActorCommand_addAttackCommand.apply(this, arguments);
        }
        this.addSpecialCommand(Window_ActorCommand._commandNameAttack);
    };

    var _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function() {
        _Window_ActorCommand_addSkillCommands.apply(this, arguments);
        this.addSpecialCommand(Window_ActorCommand._commandNameSkill);
    };

    var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        if (this._actor.isVisibleGuard()) {
            _Window_ActorCommand_addGuardCommand.apply(this, arguments);
        }
        this.addSpecialCommand(Window_ActorCommand._commandNameGuard);
    };

    var _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
    Window_ActorCommand.prototype.addItemCommand = function() {
        if (this._actor.isVisibleItem()) {
            _Window_ActorCommand_addItemCommand.apply(this, arguments);
        }
        this.addSpecialCommand(Window_ActorCommand._commandNameItem);
    };

    var _Window_ActorCommand_numVisibleRows = Window_ActorCommand.prototype.numVisibleRows;
    Window_ActorCommand.prototype.numVisibleRows = function() {
        return paramCommandNumber ? paramCommandNumber : _Window_ActorCommand_numVisibleRows.apply(this, arguments);
    };

    Window_ActorCommand.prototype.addCommand = function(name, symbol, enabled, ext) {
        if (symbol !== 'skill' || this._actor.isVisibleSkillType(ext)) {
            Window_Command.prototype.addCommand.apply(this, arguments);
        }
    };

    var _Window_ActorCommand_selectLast = Window_ActorCommand.prototype.selectLast;
    Window_ActorCommand.prototype.selectLast = function() {
        _Window_ActorCommand_selectLast.apply(this, arguments);
        if (this._actor && ConfigManager.commandRemember) {
            var symbol = this._actor.lastCommandSymbol();
            var skill = this._actor.lastBattleSkill();
            if (skill) {
                if (symbol === 'skill') this.selectSymbolAndExt(symbol, skill.stypeId);
                if (symbol === 'special') this.selectSymbolAndExt(symbol, skill.id);
            }
        }
    };

    Window_ActorCommand.prototype.findSymbolAndExt = function(symbol, ext) {
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === symbol && this._list[i].ext === ext) {
                return i;
            }
        }
        return -1;
    };

    Window_ActorCommand.prototype.selectSymbolAndExt = function(symbol, ext) {
        var index = this.findSymbolAndExt(symbol, ext);
        if (index >= 0) {
            this.select(index);
        } else {
            this.select(0);
        }
    };

    //=============================================================================
    // Scene_Battle
    //  特殊コマンドを選択したときの処理を追加します。
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
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (paramThroughWindow && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow = function(window) {};

        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }
})();

