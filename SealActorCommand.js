//=============================================================================
// SealActorCommand.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.0 2022/01/17 特定のスキルタイプのみ非表示にできる機能を追加
// 2.1.0 2021/06/29 特定のスキルタイプのみ使用禁止にできる機能を追加
// 2.0.0 2021/04/14 MZで動作するよう修正し、メモ欄の記法を変更
// 1.4.0 2018/12/22 禁止コマンドの上に文字を被せられる機能を追加
// 1.3.0 2018/12/17 封印したコマンドを非表示ではなく使用禁止にできる機能を追加
// 1.2.0 2017/03/08 アイテム使用をスキルのひとつとして作成できる機能を追加
// 1.1.0 2017/02/23 封印対象にスキルを追加
// 1.0.0 2017/02/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アクターコマンド封印プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SealActorCommand.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param commandDisable
 * @text コマンド使用禁止
 * @desc 封印したコマンドを非表示ではなく使用禁止にします。
 * @default false
 * @type boolean
 *
 * @param disableSign
 * @text 使用禁止サイン
 * @desc 使用禁止にしたコマンドのうえに被せる文字列です。(コマンド使用禁止が有効な場合のみ機能します)
 * @default \c[2]\i[1]禁止\i[1]
 *
 * @help アクターコマンド「攻撃」「防御」「アイテム」「スキル」を封印できます。
 * 封印されたコマンドはウィンドウから消失します。
 * 特定のコマンドが使用できないアクター、職業、装備品、ステートが作成できます。
 * さらに、スイッチやJavaScript計算式により、細かい条件が指定できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記入してください。
 *
 * <攻撃封印スイッチ:4>   # ID[4]のスイッチがONのとき攻撃を封印
 * <AttackSealSwitch:4>   # 同上
 * <防御封印スイッチ:5>   # ID[5]のスイッチがONのとき防御を封印
 * <GuardSealSwitch:5>    # 同上
 * <道具封印スイッチ:6>   # ID[6]のスイッチがONのときアイテムを封印
 * <ItemSealSwitch:6>     # 同上
 * <スキル封印スイッチ:7> # ID[7]のスイッチがONのときスキルを封印
 * <SkillSealSwitch:7>    # 同上
 * <攻撃封印計算式:f>     # 計算式[f]の結果がtrueのとき攻撃を封印
 * <AttackSealFormula:f>  # 同上
 * <防御封印計算式:f>     # 計算式[f]の結果がtrueのとき防御を封印
 * <GuardSealFormula:f>   # 同上
 * <道具封印計算式:f>     # 計算式[f]の結果がtrueのときアイテムを封印
 * <ItemSealFormula:f>    # 同上
 * <スキル封印計算式:f>   # 計算式[f]の結果がtrueのときスキルを封印
 * <SkillSealFormula:f>   # 同上
 *
 * 特定のスキルタイプのみを封印する場合、以下のタグを指定してください。
 * <スキルタイプ1封印スイッチ:8> # スイッチ[8]がONならスキルタイプ[1]を封印
 * <SkillType1SealSwitch:8> # 同上
 *
 * スイッチを指定しなかった場合、常に封印されます。
 * <攻撃封印スイッチ>
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 例
 * <AttackSealFormula:\v[1] &gt;= 5> # 変数[1]が5以下の場合攻撃封印
 * <GuardSealSwitch>                 # 常に防御封印
 *
 * 注意！
 * 全てのコマンドを封印するとゲームが続行不可になります。
 *
 * アイテム使用をスキル化したい場合は、スキルのメモ欄に以下の通り
 * 入力してください。対象スキルを選択後、アイテムウィンドウが開きます。
 * <アイテムスキル> # アイテム使用スキル化
 * <ItemSkill>      # 同上
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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Actor
    //  コマンド封印が有効かどうかを判定します。
    //=============================================================================
    Game_Actor.prototype.getSealMetaInfo = function(names) {
        let metaValue = null;
        this.traitObjects().some(function(traitObject) {
            metaValue = PluginManagerEx.findMetaValue(traitObject, names);
            return metaValue;
        });
        return metaValue;
    };

    Game_Actor.prototype.isSealCommand = function(commandNames) {
        const switchId = this.getSealMetaInfo([commandNames[0] + 'SealSwitch', commandNames[1] + '封印スイッチ']);
        if (switchId && (switchId === true || $gameSwitches.value(switchId))) {
            return true;
        }
        const formula = this.getSealMetaInfo([commandNames[0] + 'SealFormula', commandNames[1] + '封印計算式']);
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

    Game_Actor.prototype.isSealCommandSkillType = function(type) {
        return this.isSealCommand([`SkillType${type}`, `スキルタイプ${type}`]);
    };

    Game_Actor.prototype.findSealSkillTypes = function() {
        return this.skillTypes().filter(type => this.isSealCommandSkillType(type));
    };

    //=============================================================================
    // Window_ActorCommand
    //  コマンドが封印されていた場合、処理を終了します。
    //=============================================================================
    const _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (this._actor.isSealCommandAttack()) {
            if (param.commandDisable) {
                _Window_ActorCommand_addAttackCommand.apply(this, arguments);
                this.disableCommand('attack');
            }
            return;
        }
        _Window_ActorCommand_addAttackCommand.apply(this, arguments);
    };

    const _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        if (this._actor.isSealCommandGuard()) {
            if (param.commandDisable) {
                _Window_ActorCommand_addGuardCommand.apply(this, arguments);
                this.disableCommand('guard');
            }
            return;
        }
        _Window_ActorCommand_addGuardCommand.apply(this, arguments);
    };

    const _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
    Window_ActorCommand.prototype.addItemCommand = function() {
        if (this._actor.isSealCommandItem()) {
            if (param.commandDisable) {
                _Window_ActorCommand_addItemCommand.apply(this, arguments);
                this.disableCommand('item');
            }
            return;
        }
        _Window_ActorCommand_addItemCommand.apply(this, arguments);
    };

    const _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function() {
        if (this._actor.isSealCommandSkill()) {
            if (param.commandDisable) {
                _Window_ActorCommand_addSkillCommands.apply(this, arguments);
                this.disableCommand('skill');
            }
            return;
        }
        _Window_ActorCommand_addSkillCommands.apply(this, arguments);
        this._actor.findSealSkillTypes().forEach(type => {
            if (param.commandDisable) {
                this.disableCommand('skill', type);
            } else {
                this.eraseCommand('skill', type);
            }
        });
    };

    Window_ActorCommand.prototype.disableCommand = function(symbol, ext = null) {
        this._list.forEach(function(command) {
            if (command.symbol === symbol && (ext === null || ext === command.ext)) {
                command.enabled = false;
            }
        });
    };

    Window_ActorCommand.prototype.eraseCommand = function(symbol, ext) {
        const index = this._list.findIndex(command => command.symbol === symbol && ext === command.ext);
        if (index >= 0) {
            this._list.splice(index, 1);
        }
    };

    const _Window_ActorCommand_drawItem = Window_ActorCommand.prototype.drawItem;
    Window_ActorCommand.prototype.drawItem = function(index) {
        _Window_ActorCommand_drawItem.apply(this, arguments);
        const sign = param.disableSign;
        if (!this.isCommandEnabled(index) && sign) {
            const rect = this.itemRectWithPadding(index);
            const width = this.drawTextEx(sign, this.width, 0);
            const height = this.calcTextHeight({text:sign}, false);
            this.resetFontSettings();
            this.resetTextColor();
            this.changePaintOpacity(true);
            this.drawTextEx(sign, rect.x + rect.width / 2 - width / 2, rect.y + rect.height / 2 - height / 2);
            this.resetFontSettings();
            this.resetTextColor();
            this.changePaintOpacity(false);
        }
    };

    //=============================================================================
    // Scene_Battle
    //  アイテムスキルを作成します。
    //=============================================================================
    const _Scene_Battle_onItemCancel = Scene_Battle.prototype.onItemCancel;
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

    const _Scene_Battle_onSkillOk =Scene_Battle.prototype.onSkillOk;
    Scene_Battle.prototype.onSkillOk = function() {
        const skill = this._skillWindow.item();
        if (PluginManagerEx.findMetaValue(skill, ['アイテムスキル', 'ItemSkill'])) {
            const action = BattleManager.inputtingAction();
            action.setSkill(skill.id);
            BattleManager.actor().setLastBattleSkill(skill);
            this._skillWindow.hide();
            this.commandItem();
            this._selectItemSkill = true;
        } else {
            _Scene_Battle_onSkillOk.apply(this, arguments);
        }
    };

    const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    Scene_Battle.prototype.onActorCancel = function() {
        if (this._selectItemSkill) {
            this._actorWindow.hide();
            this._itemWindow.show();
            this._itemWindow.activate();
        } else {
            _Scene_Battle_onActorCancel.apply(this, arguments);
        }
    };

    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        if (this._selectItemSkill) {
            this._enemyWindow.hide();
            this._itemWindow.show();
            this._itemWindow.activate();
        } else {
            _Scene_Battle_onEnemyCancel.apply(this, arguments);
        }
    };

    const _Scene_Battle_selectNextCommand = Scene_Battle.prototype.selectNextCommand;
    Scene_Battle.prototype.selectNextCommand = function() {
        _Scene_Battle_selectNextCommand.apply(this, arguments);
        this._selectItemSkill = false;
    };
})();

