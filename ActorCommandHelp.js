/*=============================================================================
 ActorCommandHelp.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アクターコマンドヘルププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActorCommandHelp.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param invalidSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのときヘルプは表示されなくなります。
 * @default 0
 * @type switch
 *
 * @param fightDesc
 * @text 戦うコマンド説明
 * @desc 『戦う』コマンドの説明です。
 * @default
 * @type multiline_string
 *
 * @param escapeDesc
 * @text 逃げるコマンド説明
 * @desc 『逃げる』コマンドの説明です。
 * @default
 * @type multiline_string
 *
 * @param itemDesc
 * @text アイテムコマンド説明
 * @desc 『アイテム』コマンドの説明です。
 * @default
 * @type multiline_string
 *
 * @param skillTypeDescList
 * @text スキルタイプ説明
 * @desc スキルタイプごとの説明です。スキルタイプで定義した順番に配列として定義します。
 * @default []
 * @type multiline_string[]
 *
 * @help ActorCommandHelp.js
 *
 * アクターコマンドやパーティコマンドにコマンドごとに定義した
 * ヘルプを表示します。
 * 攻撃や防御は、それぞれ割り当てられたスキルの説明が表示され
 * それ以外のコマンドはプラグインパラメータから定義します。
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
    const param = PluginManagerEx.createParameter(script);
    if (!param.skillTypeDescList) {
        param.skillTypeDescList = [];
    }

    const _Scene_Battle_createHelpWindow = Scene_Battle.prototype.createHelpWindow;
    Scene_Battle.prototype.createHelpWindow = function() {
        _Scene_Battle_createHelpWindow.apply(this, arguments);
        this._actorCommandWindow.setHelpWindow(this._helpWindow);
        this._partyCommandWindow.setHelpWindow(this._helpWindow);
    };

    const _Window_Selectable_updateHelp = Window_Selectable.prototype.updateHelp;
    Window_Selectable.prototype.updateHelp = function() {
        _Window_Selectable_updateHelp.apply(this, arguments);
        if ((this instanceof Window_ActorCommand) || (this instanceof Window_PartyCommand)) {
            this.updateActorCommandHelp();
        }
    };

    Window_Selectable.prototype.updateActorCommandHelp = function() {
        if ($gameSwitches.value(param.invalidSwitch)) {
            return;
        }
        const text = this.findActorCommandHelpText();
        if (text) {
            this._helpWindow.setText(text);
            this.showHelpWindow();
        }
    };

    Window_Selectable.prototype.findActorCommandHelpText = function() {}

    Window_PartyCommand.prototype.findActorCommandHelpText = function() {
        switch (this.currentSymbol()) {
            case 'fight':
                return param.fightDesc;
            case 'escape':
                return param.escapeDesc;
        }
    };

    Window_ActorCommand.prototype.findActorCommandHelpText = function() {
        switch (this.currentSymbol()) {
            case 'attack':
                return $dataSkills[this._actor.attackSkillId()].description;
            case 'guard':
                return $dataSkills[this._actor.guardSkillId()].description;
            case 'skill':
                return param.skillTypeDescList[this.currentExt() - 1];
            case 'item':
                return param.itemDesc;
            default:
                return null;
        }
    };
})();
