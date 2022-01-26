/*=============================================================================
 CommandSkill.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.1 2022/01/26 1.3.0の機能はメモ欄指定に変更
 1.3.0 2022/01/26 コマンドスキルを使用できないときは非表示にする機能を追加
 1.2.0 2021/12/15 コマンドスキルにソート順を指定できる機能を追加
 1.1.1 2021/06/11 コマンドスキルの並び順をスキルID、アイテムIDの昇順になるよう変更
 1.1.0 2021/05/01 アイテムもアクターコマンド化できるよう修正
                  ヘルプウィンドウを表示できる設定を追加
                  メニュー画面のスキルやアイテムリストにはコマンド化したスキルやアイテムを表示できる設定を追加
 1.0.0 2020/12/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc コマンドスキルプラグイン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CommandSkill.js
 * @author トリアコンタン
 *
 * @param index
 * @text コマンド位置
 * @desc スキルコマンドを追加する位置(インデックス)です。0で攻撃の上になります。
 * @default 1
 * @type number
 *
 * @param includeMenu
 * @text メニュー画面に表示
 * @desc メニュー画面にはコマンドスキルを含めます。
 * @default false
 * @type boolean
 *
 * @param showHelp
 * @text ヘルプ表示
 * @desc コマンドスキル選択時にヘルプを表示します。
 * @default false
 * @type boolean
 *
 * @help CommandSkill.js
 *
 * 戦闘中、指定したスキル、アイテムをスキルウィンドウからではなく
 * アクターコマンドウィンドウから直接実行できるようになります。
 * スキル、アイテムのメモ欄に以下の通り指定してください。
 * <CommandSkill>
 * <コマンドスキル>
 *
 * コマンドスキル間でソート順を設定したいときは以下の通りです。
 * 指定が無い場合や同一の値を指定した場合はID順となります。
 * <CommandSkill:2>
 *
 * コマンドスキルを使用できないとき、選択不可ではなく非表示にしたい
 * 場合は、もとのメモ欄に加えて以下を指定してください。
 * <HiddenCommandSkill>
 * <隠しコマンドスキル>
 *
 * アクターが当該スキルを覚えていればコマンドから直接スキルを使用できます。
 * MPが足りなかったり封印されていたりすると選択できません。
 * また、コマンドスキルは戦闘、メニューのスキルウィンドウから除外されます。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    Game_Temp.prototype.isCommandSkill = function(skill) {
        return !!this.findCommandSkill(skill);
    };

    Game_Temp.prototype.findCommandSkill = function(skill) {
        return PluginManagerEx.findMetaValue(skill, ['CommandSkill', 'コマンドスキル'])
    };

    /**
     * Game_Actor
     * コマンドスキルの判定を追加
     */
    Game_Actor.prototype.findCommandSkills = function() {
        const skills = this.skills().filter(skill => $gameTemp.isCommandSkill(skill))
            .concat($gameParty.findCommandItems());
        skills.sort((skillA, skillB) => {
            const sortA = $gameTemp.findCommandSkill(skillA);
            const sortB = $gameTemp.findCommandSkill(skillB);
            if (isFinite(sortA) && isFinite(sortB) && sortB !== sortA) {
                return sortB - sortA;
            } else {
                return skillB.id - skillA.id;
            }
        });
        return skills;
    }

    Game_Party.prototype.findCommandItems = function() {
        return this.items().filter(item => $gameTemp.isCommandSkill(item));
    }

    /**
     * Window_ActorCommand
     * コマンドスキルを追加
     */
    const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._actor) {
            this.addCommandSpecial();
        }
    };

    Window_ActorCommand.prototype.addCommandSpecial = function() {
        this._actor.findCommandSkills().forEach(skill => {
            if (!this._actor.canUse(skill)) {
                const hidden = PluginManagerEx.findMetaValue(skill, ['HiddenCommandSkill', '隠しコマンドスキル']);
                if (hidden) {
                    return;
                }
            }
            this.addCommand(skill.name, `special`, this._actor.canUse(skill), skill);
            this._list.splice(param.index, 0, this._list.pop());
        });
    };

    const _Window_ActorCommand_selectLast = Window_ActorCommand.prototype.selectLast;
    Window_ActorCommand.prototype.selectLast = function() {
        _Window_ActorCommand_selectLast.apply(this, arguments);
        if (this._actor && ConfigManager.commandRemember) {
            const symbol = this._actor.lastCommandSymbol();
            const skill = this._actor.lastBattleSkill();
            if (symbol === 'special' && skill) {
                this.selectLastSpecial(skill.id);
            }
        }
    };

    Window_ActorCommand.prototype.selectLastSpecial = function(id) {
        const item = this._list.filter(item => item.symbol === 'special' && item.ext === id)[0];
        if (item) {
            this.select(this._list.indexOf(item));
        }
    };

    Window_ActorCommand.prototype.updateHelp = function() {
        const skill = this.currentExt();
        if (skill && skill.id > 0) {
            this.setHelpWindowItem(skill);
            this.showHelpWindow();
        } else {
            this.hideHelpWindow();
        }
    };

    /**
     * Scene_Battle
     * コマンドスキル選択時のウィンドウ制御と実行
     */
    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        this._actorCommandWindow.setHandler("special", this.commandSpecial.bind(this));
    };

    const _Scene_Battle_createHelpWindow = Scene_Battle.prototype.createHelpWindow;
    Scene_Battle.prototype.createHelpWindow = function() {
        _Scene_Battle_createHelpWindow.apply(this, arguments);
        if (param.showHelp) {
            this._actorCommandWindow.setHelpWindow(this._helpWindow);
        }
    };

    Scene_Battle.prototype.commandSpecial = function() {
        const skill = this._actorCommandWindow.currentExt();
        const action = BattleManager.inputtingAction();
        if (DataManager.isSkill(skill)) {
            action.setSkill(skill.id);
            BattleManager.actor().setLastBattleSkill(skill);
        } else {
            action.setItem(skill.id);
        }
        this.onSelectAction();
    };

    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        _Scene_Battle_onEnemyCancel.apply(this, arguments);
        this.onCancelSpecial();
    };

    const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    Scene_Battle.prototype.onActorCancel = function() {
        _Scene_Battle_onActorCancel.apply(this, arguments);
        this.onCancelSpecial();
    };

    Scene_Battle.prototype.onCancelSpecial = function() {
        if (this._actorCommandWindow.currentSymbol() === 'special') {
            this._statusWindow.show();
            this._actorCommandWindow.activate();
        }
    };

    /**
     * Window_SkillList
     * コマンドスキルをリストから除外
     */
    const _Window_SkillList_includes = Window_SkillList.prototype.includes;
    Window_SkillList.prototype.includes = function(item) {
        return _Window_SkillList_includes.apply(this, arguments) && isIncludeSkill(item);
    };

    const _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function(item) {
        return _Window_ItemList_includes.apply(this, arguments) && isIncludeSkill(item);
    };

    const _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
    Window_BattleItem.prototype.includes = function(item) {
        return _Window_BattleItem_includes.apply(this, arguments) && isIncludeSkill(item);
    };

    function isIncludeSkill(skill) {
        return !$gameTemp.isCommandSkill(skill) || (param.includeMenu && !$gameParty.inBattle());
    }
})();
