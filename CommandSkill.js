/*=============================================================================
 CommandSkill.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
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
 * @help CommandSkill.js
 *
 * 戦闘中、指定したスキルをスキルウィンドウからではなく
 * アクターコマンドウィンドウから直接実行できるようになります。
 * スキルのメモ欄に以下の通り指定してください。
 * <CommandSkill>
 * <コマンドスキル>
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

    /**
     * Game_Actor
     * コマンドスキルの判定を追加
     */
    Game_Actor.prototype.isCommandSkill = function(skill) {
        return !!PluginManagerEx.findMetaValue(skill, ['CommandSkill', 'コマンドスキル'])
    };

    Game_Actor.prototype.findCommandSkills = function() {
        return this.skills().filter(skill => this.isCommandSkill(skill));
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
            this.addCommand(skill.name, `special`, this._actor.canUse(skill), skill.id);
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

    /**
     * Scene_Battle
     * コマンドスキル選択時のウィンドウ制御と実行
     */
    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        this._actorCommandWindow.setHandler("special", this.commandSpecial.bind(this));
    };

    Scene_Battle.prototype.commandSpecial = function() {
        const skill = $dataSkills[this._actorCommandWindow.currentExt()];
        const action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        BattleManager.actor().setLastBattleSkill(skill);
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
        return _Window_SkillList_includes.apply(this, arguments) && !this.isCommandSkill(item);
    };

    Window_SkillList.prototype.isCommandSkill = function(item) {
        return this._actor && this._actor.isCommandSkill(item);
    };
})();
