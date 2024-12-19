/*=============================================================================
 MenuCommandDisable.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/19 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メニューコマンド禁止制御プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuCommandDisable.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param commands
 * @text コマンド禁止情報リスト
 * @desc コマンドの禁止情報を設定した一覧です。
 * @default []
 * @type struct<Command>[]
 *
 * @help MenuCommandDisable.js
 *
 * メニューコマンドをゲーム中に一時的に禁止や非表示にできます。
 * スイッチ状態やアイテム、スキルを持っているかを条件に指定できます。
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

/*~struct~Command:
 * @param symbol
 * @text コマンドシンボル
 * @desc メニューコマンドのシンボルです。プラグインで追加されたコマンドは原則対応できません。
 * @default
 * @type select
 * @option アイテム
 * @value item
 * @option スキル
 * @value skill
 * @option 装備
 * @value equip
 * @option ステータス
 * @value status
 * @option 並び替え
 * @value formation
 * @option オプション
 * @value options
 * @option セーブ
 * @value save
 * @option ゲーム終了
 * @value gameEnd
 *
 * @param invalidType
 * @text 無効タイプ
 * @desc コマンドを選択禁止にするか非表示にするかを選択します。
 * @default disable
 * @type select
 * @option 選択禁止
 * @value disable
 * @option 非表示
 * @value hidden
 *
 * @param switchId
 * @text 禁止スイッチID
 * @desc 指定したスイッチがONのときにコマンドが禁止されます。
 * @default 0
 * @type switch
 *
 * @param noItem
 * @text アイテムなし
 * @desc アイテムを一切持っていない場合にコマンドが禁止されます。
 * @default false
 * @type boolean
 *
 * @param noSkill
 * @text スキルなし
 * @desc スキルを一切持っていない場合にコマンドが禁止されます。
 * @default false
 * @type boolean
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_MenuCommand_needsCommand = Window_MenuCommand.prototype.needsCommand;
    Window_MenuCommand.prototype.needsCommand = function(name) {
        const needs = _Window_MenuCommand_needsCommand.apply(this, arguments);
        return needs ? this.needsCommandDynamic(name, 'hidden') : needs;
    };

    const _Window_MenuCommand_addGameEndCommand = Window_MenuCommand.prototype.addGameEndCommand;
    Window_MenuCommand.prototype.addGameEndCommand = function() {
        if (!this.needsCommandDynamic('gameEnd', 'hidden')) {
            return;
        }
        _Window_MenuCommand_addGameEndCommand.apply(this, arguments);
    };

    const _Window_MenuCommand_addCommand = Window_MenuCommand.prototype.addCommand;
    Window_MenuCommand.prototype.addCommand = function(name, symbol, enabled = true, ext = null) {
        if (!this.needsCommandDynamic(symbol, 'disable')) {
            arguments[2] = false;
        }
        _Window_MenuCommand_addCommand.apply(this, arguments);
    };

    Window_MenuCommand.prototype.needsCommandDynamic = function(symbol, invalidType) {
        const command = param.commands.find(command => command.symbol === symbol && command.invalidType === invalidType);
        if (!command) {
            return true;
        }
        const conditions = [
            $gameSwitches.value(command.switchId),
            command.noItem && !$gameParty.hasAnyItem(),
            command.noSkill && !$gameParty.hasAnySkill()
        ]
        return !conditions.some(condition => condition);
    };

    Game_Party.prototype.hasAnyItem = function() {
        return this.allItems().length > 0;
    };

    Game_Party.prototype.hasAnySkill = function() {
        return this.members().some(member => member.skills().length > 0);
    };
})();
