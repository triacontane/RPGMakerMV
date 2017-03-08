//=============================================================================
// SealActorCommand.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/03/08 アイテム使用をスキルのひとつとして作成できる機能を追加
// 1.1.0 2017/02/23 封印対象にスキルを追加
// 1.0.0 2017/02/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SealActorCommandPlugin
 * @author triacontane
 *
 * @help アクターコマンド「攻撃」「防御」「アイテム」「スキル」を封印できます。
 * 封印されたコマンドはウィンドウから消失します。
 * 特定のコマンドが使用できないアクター、職業、装備品、ステートが作成できます。
 * さらに、スイッチやJavaScript計算式により、細かい条件が指定できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記入してください。
 *
 * <SAC攻撃封印スイッチ:4>   # ID[4]のスイッチがONのとき攻撃を封印
 * <SACAttackSwitch:4>       # 同上
 * <SAC防御封印スイッチ:5>   # ID[5]のスイッチがONのとき防御を封印
 * <SACGuardSwitch:5>        # 同上
 * <SAC道具封印スイッチ:6>   # ID[6]のスイッチがONのときアイテムを封印
 * <SACItemSwitch:6>         # 同上
 * <SACスキル封印スイッチ:7> # ID[7]のスイッチがONのときスキルを封印
 * <SACSkillSwitch:7>        # 同上
 * <SAC攻撃封印計算式:f>     # 計算式[f]の結果がtrueのとき攻撃を封印
 * <SACAttackFormula:f>      # 同上
 * <SAC防御封印計算式:f>     # 計算式[f]の結果がtrueのとき防御を封印
 * <SACGuardFormula:f>       # 同上
 * <SAC道具封印計算式:f>     # 計算式[f]の結果がtrueのときアイテムを封印
 * <SACItemFormula:f>        # 同上
 * <SACスキル封印計算式:f>   # 計算式[f]の結果がtrueのときスキルを封印
 * <SACSkillFormula:f>       # 同上
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例
 * <SACAttackFormula:\v[1] &gt;= 5> # 変数[1]が5以下の場合攻撃封印
 * <SACGuardFormula:true>           # 常に防御封印
 *
 * 注意！
 * 全てのコマンドを封印するとゲームが続行不可になります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アクターコマンド封印プラグイン
 * @author トリアコンタン
 *
 * @help アクターコマンド「攻撃」「防御」「アイテム」「スキル」を封印できます。
 * 封印されたコマンドはウィンドウから消失します。
 * 特定のコマンドが使用できないアクター、職業、装備品、ステートが作成できます。
 * さらに、スイッチやJavaScript計算式により、細かい条件が指定できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記入してください。
 *
 * <SAC攻撃封印スイッチ:4>   # ID[4]のスイッチがONのとき攻撃を封印
 * <SACAttackSwitch:4>       # 同上
 * <SAC防御封印スイッチ:5>   # ID[5]のスイッチがONのとき防御を封印
 * <SACGuardSwitch:5>        # 同上
 * <SAC道具封印スイッチ:6>   # ID[6]のスイッチがONのときアイテムを封印
 * <SACItemSwitch:6>         # 同上
 * <SACスキル封印スイッチ:7> # ID[7]のスイッチがONのときスキルを封印
 * <SACSkillSwitch:7>        # 同上
 * <SAC攻撃封印計算式:f>     # 計算式[f]の結果がtrueのとき攻撃を封印
 * <SACAttackFormula:f>      # 同上
 * <SAC防御封印計算式:f>     # 計算式[f]の結果がtrueのとき防御を封印
 * <SACGuardFormula:f>       # 同上
 * <SAC道具封印計算式:f>     # 計算式[f]の結果がtrueのときアイテムを封印
 * <SACItemFormula:f>        # 同上
 * <SACスキル封印計算式:f>   # 計算式[f]の結果がtrueのときスキルを封印
 * <SACSkillFormula:f>       # 同上
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例
 * <SACAttackFormula:\v[1] &gt;= 5> # 変数[1]が5以下の場合攻撃封印
 * <SACGuardFormula:true>           # 常に防御封印
 *
 * 注意！
 * 全てのコマンドを封印するとゲームが続行不可になります。
 *
 * アイテム使用をスキル化したい場合は、スキルのメモ欄に以下の通り
 * 入力してください。対象スキルを選択後、アイテムウィンドウが開きます。
 * <SACアイテムスキル> # アイテム使用スキル化
 * <SACItemSkill>      # 同上
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
    var metaTagPrefix = 'SAC';

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text === true) return text;
        if (text == null) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Actor
    //  コマンド封印が有効かどうかを判定します。
    //=============================================================================
    Game_Actor.prototype.getSealMetaInfo = function(names) {
        var metaValue = null;
        this.traitObjects().some(function(traitObject) {
            metaValue = getMetaValues(traitObject, names);
            return metaValue;
        });
        return metaValue;
    };

    Game_Actor.prototype.isSealCommand = function(commandNames) {
        var switchId = this.getSealMetaInfo([commandNames[0] + 'Switch', commandNames[1] + '封印スイッチ']);
        if (switchId && $gameSwitches.value(getArgNumber(switchId))) {
            return true;
        }
        var formula = this.getSealMetaInfo([commandNames[0] + 'Formula', commandNames[1] + '封印計算式']);
        return formula && eval(formula);
    };

    Game_Actor.prototype.isSealCommandAttack = function() {
        return this.isSealCommand(['Attack', '攻撃']);
    };

    Game_Actor.prototype.isSealCommandGuard = function() {
        return this.isSealCommand(['Guard', '防御']);
    };

    Game_Actor.prototype.isSealCommandItem = function() {
        return this.isSealCommand(['Item', '道具']);
    };

    Game_Actor.prototype.isSealCommandSkill = function() {
        return this.isSealCommand(['Skill', 'スキル']);
    };

    //=============================================================================
    // Window_ActorCommand
    //  コマンドが封印されていた場合、処理を終了します。
    //=============================================================================
    var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (this._actor.isSealCommandAttack()) return;
        _Window_ActorCommand_addAttackCommand.apply(this, arguments);
    };

    var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        if (this._actor.isSealCommandGuard()) return;
        _Window_ActorCommand_addGuardCommand.apply(this, arguments);
    };

    var _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
    Window_ActorCommand.prototype.addItemCommand = function() {
        if (this._actor.isSealCommandItem()) return;
        _Window_ActorCommand_addItemCommand.apply(this, arguments);
    };

    var _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function() {
        if (this._actor.isSealCommandSkill()) return;
        _Window_ActorCommand_addSkillCommands.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Battle
    //  アイテムスキルを作成します。
    //=============================================================================
    var _Scene_Battle_onItemCancel = Scene_Battle.prototype.onItemCancel;
    Scene_Battle.prototype.onItemCancel = function() {
        if (this._selectItemSkill) {
            this._itemWindow.hide();
            this._skillWindow.show();
            this._skillWindow.activate();
            this._selectItemSkill = false;
        } else {
            _Scene_Battle_onItemCancel.apply(this, arguments);
        }
    };

    var _Scene_Battle_onSkillOk =Scene_Battle.prototype.onSkillOk;
    Scene_Battle.prototype.onSkillOk = function() {
        var skill = this._skillWindow.item();
        if (getMetaValues(skill, ['アイテムスキル', 'ItemSkill'])) {
            var action = BattleManager.inputtingAction();
            action.setSkill(skill.id);
            BattleManager.actor().setLastBattleSkill(skill);
            this._skillWindow.hide();
            this.commandItem();
            this._selectItemSkill = true;
        } else {
            _Scene_Battle_onSkillOk.apply(this, arguments);
        }
    };

    var _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    Scene_Battle.prototype.onActorCancel = function() {
        if (this._selectItemSkill) {
            this._actorWindow.hide();
            this._itemWindow.show();
            this._itemWindow.activate();
        } else {
            _Scene_Battle_onActorCancel.apply(this, arguments);
        }
    };

    var _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        if (this._selectItemSkill) {
            this._enemyWindow.hide();
            this._itemWindow.show();
            this._itemWindow.activate();
        } else {
            _Scene_Battle_onEnemyCancel.apply(this, arguments);
        }
    };

    var _Scene_Battle_selectNextCommand = Scene_Battle.prototype.selectNextCommand;
    Scene_Battle.prototype.selectNextCommand = function() {
        _Scene_Battle_selectNextCommand.apply(this, arguments);
        this._selectItemSkill = false;
    };
})();

