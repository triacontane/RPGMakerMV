//=============================================================================
// CursedAction.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/06/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CursedActionPlugin
 * @author triacontane
 *
 * @param priority
 * @desc 自動戦闘および混乱の設定との優先度を選択します。
 * @default 2
 * @type select
 * @option 優先度低
 * @value 0
 * @option 自動戦闘より優先
 * @value 1
 * @option 自動戦闘、混乱より優先
 * @value 2
 *
 * @param message
 * @desc 呪いによって行動が変化した場合に表示するメッセージです。%1でバトラー名に変換されます。
 * @default
 *
 * @param commandPrefix
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help CursedAction.js
 * 戦闘中、指定した行動とは異なる行動を取らせることができます。
 * 行動が変化する条件や確率も設定できます。
 * 特徴を有するデータベース(※1)のメモ欄に以下の通り入力してください。
 *
 * <呪いスキル1:20> # 選択した行動にかかわらずID[20]のスキルを使用
 * <CurseSkill1:20> # 同上
 * <呪い確率1:50>   # スキル1で指定したスキルの使用確率が50%になる
 * <CurseRate1:50>  # 同上
 * <呪い条件1:s>    # スキル1の使用条件がスクリプト[s]の評価結果になる
 * <CurseCond1:s>   # 同上
 * ※1 アクター、職業、武器防具、ステート、敵キャラが該当します。
 *
 * 複数の行動を同時指定したい場合は以下のように指定します。
 * <呪いスキル2:21>
 * <呪い確率2:50>
 * <呪い条件2:s>
 * 複数の行動の条件を満たした場合はランダムで行動が決まります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 呪いのプラグイン
 * @author トリアコンタン
 *
 * @param priority
 * @text 優先度
 * @desc 自動戦闘および混乱の設定との優先度を選択します。
 * @default 2
 * @type select
 * @option 優先度低
 * @value 0
 * @option 自動戦闘より優先
 * @value 1
 * @option 自動戦闘、混乱より優先
 * @value 2
 *
 * @param message
 * @text 呪いのメッセージ
 * @desc 呪いによって行動が変化した場合に表示するメッセージです。%1でバトラー名に変換されます。
 * @default
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help CursedAction.js
 * 戦闘中、指定した行動とは異なる行動を取らせることができます。
 * 行動が変化する条件や確率も設定できます。
 * 特徴を有するデータベース(※1)のメモ欄に以下の通り入力してください。
 *
 * <呪いスキル1:20> # 選択した行動にかかわらずID[20]のスキルを使用
 * <CurseSkill1:20> # 同上
 * <呪い確率1:50>   # スキル1で指定したスキルの使用確率が50%になる
 * <CurseRate1:50>  # 同上
 * <呪い条件1:s>    # スキル1の使用条件がスクリプト[s]の評価結果になる
 * <CurseCond1:s>   # 同上
 * ※1 アクター、職業、武器防具、ステート、敵キャラが該当します。
 *
 * 複数の行動を同時指定したい場合は以下のように指定します。
 * <呪いスキル2:21>
 * <呪い確率2:50>
 * <呪い条件2:s>
 * 複数の行動の条件を満たした場合はランダムで行動が決まります。
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

    /**
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function(object, name) {
        var tagName = param.commandPrefix + name;
        return object.meta.hasOwnProperty(tagName) ? convertEscapeCharacters(object.meta[tagName]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function(object, names) {
        var metaValue;
        names.some(function(name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('CursedAction');

    /**
     * Game_Action:呪い行動を実行します。
     */
    var _Game_Action_prepare = Game_Action.prototype.prepare;
    Game_Action.prototype.prepare = function() {
        _Game_Action_prepare.apply(this, arguments);
        var skillId = this.subject().getCursedSkillIdIfExist();
        if (skillId) {
            this.setSkill(skillId);
        }
    };

    /**
     * Game_Battler:呪い行動の作成処理を追加します。
     */
    Game_Battler.prototype.getCursedSkillIdIfExist = function() {
        this._cursedActionList = [];
        if (!this.canCurse()) {
            return null;
        }
        this.createCursedActionList();
        if (this.isCursed()) {
            return this._cursedActionList[Math.randomInt(this._cursedActionList.length)];
        } else {
            return null;
        }
    };

    Game_Battler.prototype.createCursedActionList = function() {
        var index   = 1;
        while (this.addCursedAction(index)) {
            index++;
        }
    };

    Game_Battler.prototype.addCursedAction = function(index) {
        var skillIdText = this.getMetaInfoCursedAction(['呪いスキル', 'CurseSkill'], index);
        if (skillIdText) {
            var rate = this.getMetaInfoCursedAction(['呪い確率', 'CurseCond'], index);
            if (rate && parseInt(rate) < Math.randomInt(100)) {
                return true;
            }
            var cond = this.getMetaInfoCursedAction(['呪い条件', 'CurseCond'], index);
            if (cond && !eval(cond)) {
                return true;
            }
            this._cursedActionList.push(parseInt(skillIdText));
        }
        return skillIdText;
    };

    Game_Battler.prototype.getMetaInfoCursedAction = function(names, index) {
        var value = null;
        this.traitObjects().some(function(traitObject) {
            var meta = getMetaValues(traitObject, [names[0] + index, names[1] + index]);
            if (meta) {
                value = meta;
            }
            return meta;
        });
        return value;
    };

    Game_Battler.prototype.isCursed = function() {
        return this._cursedActionList.length > 0;
    };

    Game_Battler.prototype.canCurse = function() {
        return !(param.priority < 2 && this.isConfused()) && !this._forcing;
    };

    /**
     * Game_Actor:呪い行動の作成処理を追加します。
     */
    Game_Actor.prototype.canCurse = function() {
        return Game_Battler.prototype.canCurse.call(this) && !(param.priority < 1 && this.isAutoBattle());
    };

    var _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        if (subject.isCursed() && param.message) {
            this.push('addText', param.message.format(subject.name()));
        }
        _Window_BattleLog_startAction.apply(this, arguments);
    };
})();
