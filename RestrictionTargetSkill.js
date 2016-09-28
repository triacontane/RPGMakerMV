//=============================================================================
// RestrictionTargetSkill.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/09/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc RestrictionTargetSkillPlugin
 * @author triacontane
 *
 * @help 特定のバトラー（敵および味方）に対して使用できない、もしくは
 * 特定のバトラーに対してのみ使用できるスキルを作成できます。
 * 敵がスキルを使う場合や、自動戦闘、混乱、複数対象の場合なども含めて
 * 常に対象スキルのターゲットから外れます。
 *
 * 制約：敵キャラの選択制限については「YEP_BattleEngineCore.js」の
 * 適用環境では使用できません。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * <RTS_有効ID:2,3>   # ID[2][3]のアクターor敵キャラにのみ使用できます。
 * <RTS_ValidID:2,3>  # 同上
 * <RTS_無効ID:5>     # ID[5]のアクターor敵キャラに使用できません。
 * <RTS_InvalidID:5>  # 同上
 * <RTS_スクリプト:s> # スクリプト[s]を実行した結果が[true]だと使用できません。
 * <RTS_Script:s>     # 同上
 *
 * スクリプト中では以下のローカル変数が使用できます。
 * battler : 対象バトラー
 * item    : 対象スキル(アイテム)オブジェクト
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * さらに全てのスキルを受け付けなくなる特徴を作成する機能もあります。
 * 特徴を有するデータベースもメモ欄に以下の通り指定してください。
 * <RTS_無敵>       # この特徴が有効な限り全てのスキルの対象から外れます。
 * <RTS_Invincible> # 同上
 *
 * 主にスキルによる一時的な無敵状態の演出に利用できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 対象限定スキルプラグイン
 * @author トリアコンタン
 *
 * @help 特定のバトラー（敵および味方）に対して使用できない、もしくは
 * 特定のバトラーに対してのみ使用できるスキルを作成できます。
 * 敵がスキルを使う場合や、自動戦闘、混乱、複数対象の場合なども含めて
 * 常に対象スキルのターゲットから外れます。
 *
 * 制約：敵キャラの選択制限については「YEP_BattleEngineCore.js」の
 * 適用環境では使用できません。
 *
 * スキルのメモ欄に以下の通り指定してください。
 * <RTS_有効ID:2,3>   # ID[2][3]のアクターor敵キャラにのみ使用できます。
 * <RTS_ValidID:2,3>  # 同上
 * <RTS_無効ID:5>     # ID[5]のアクターor敵キャラに使用できません。
 * <RTS_InvalidID:5>  # 同上
 * <RTS_スクリプト:s> # スクリプト[s]を実行した結果が[true]だと使用できません。
 * <RTS_Script:s>     # 同上
 *
 * スクリプト中では以下のローカル変数が使用できます。
 * battler : 対象バトラー
 * item    : 対象スキル(アイテム)オブジェクト
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * さらに全てのスキルを受け付けなくなる特徴を作成する機能もあります。
 * 特徴を有するデータベースもメモ欄に以下の通り指定してください。
 * <RTS_無敵>       # この特徴が有効な限り全てのスキルの対象から外れます。
 * <RTS_Invincible> # 同上
 *
 * 主にスキルによる一時的な無敵状態の演出に利用できます。
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
    var metaTagPrefix = 'RTS_';

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
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
        var metaTagDisConvert = {
            '&lt;': '<',
            '&gt;': '>'
        };
        text                  = text.replace(/\&gt\;|\&lt\;/gi, function(value) {
            return metaTagDisConvert[value];
        }.bind(this));
        var windowLayer       = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_BattlerBase
    //  スキルやアイテムの対象として選択可能かどうかを返します。
    //=============================================================================
    Game_BattlerBase.prototype.canSelectTarget = function(item) {
        var validId   = getMetaValues(item, ['有効ID', 'ValidID']);
        var battlerId = this.getBattlerIdForRestrictionTarget();
        var battler   = this;
        if (validId && !getArgArrayNumber(validId).contains(battlerId)) {
            return false;
        }
        var invalidId = getMetaValues(item, ['無効ID', 'InvalidID']);
        if (invalidId && getArgArrayNumber(invalidId).contains(battlerId)) {
            return false;
        }
        var scriptValue = getMetaValues(item, ['スクリプト', 'Script']);
        if (scriptValue && eval(getArgString(scriptValue))) {
            return false;
        }
        return !this.traitObjects().some(function(data) {
            return !!getMetaValues(data, ['無敵', 'Invincible']);
        });
    };

    Game_BattlerBase.prototype.getBattlerIdForRestrictionTarget = function() {
        return 0;
    };

    Game_Actor.prototype.getBattlerIdForRestrictionTarget = function() {
        return this.actorId();
    };

    Game_Enemy.prototype.getBattlerIdForRestrictionTarget = function() {
        return this.enemyId();
    };

    //=============================================================================
    // Game_Action
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    var _Game_Action_makeTargets      = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        BattleManager.setTargetAction(this);
        var targets = _Game_Action_makeTargets.apply(this, arguments);
        BattleManager.setTargetAction(null);
        return targets;
    };

    var _Game_Action_decideRandomTarget      = Game_Action.prototype.decideRandomTarget;
    Game_Action.prototype.decideRandomTarget = function() {
        BattleManager.setTargetAction(this);
        _Game_Action_decideRandomTarget.apply(this, arguments);
        BattleManager.setTargetAction(null);
    };

    //=============================================================================
    // Game_Party
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    var _Game_Party_members      = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        var members = _Game_Party_members.apply(this, arguments);
        var action  = BattleManager.getTargetAction();
        if (action) {
            members = members.filter(function(member) {
                return member.canSelectTarget(action.item());
            });
        }
        return members;
    };

    //=============================================================================
    // Game_Troop
    //  スキルやアイテムの対象として選択不可能な対象に選択しないようにします。
    //=============================================================================
    var _Game_Troop_members      = Game_Troop.prototype.members;
    Game_Troop.prototype.members = function() {
        var members = _Game_Troop_members.apply(this, arguments);
        var action  = BattleManager.getTargetAction();
        if (action) {
            members = members.filter(function(member) {
                return member.canSelectTarget(action.item());
            });
        }
        return members;
    };

    //=============================================================================
    // BattleManager
    //  対象決定中のアクションを設定します。
    //=============================================================================
    BattleManager.setTargetAction = function(action) {
        this._targetAction = action;
    };

    BattleManager.getTargetAction = function() {
        return this._targetAction;
    };

    //=============================================================================
    // Scene_ItemBase
    //  アイテム効果の対象から無効なアクターを除外します。
    //=============================================================================
    var _Scene_ItemBase_itemTargetActors      = Scene_ItemBase.prototype.itemTargetActors;
    Scene_ItemBase.prototype.itemTargetActors = function() {
        var members = _Scene_ItemBase_itemTargetActors.apply(this, arguments);
        return members.filter(function(member) {
            return member.canSelectTarget(this.item());
        }, this);
    };

    //=============================================================================
    // Window_Selectable
    //  対象アクターに対してスキルを使用可能か判定します。
    //=============================================================================
    Window_Selectable.prototype.canSelectSkillTarget = function(item, index) {
        return this.getMember(index).canSelectTarget(item);
    };

    //=============================================================================
    // Window_BattleActor
    //  無効な対象は選択不可能にします。
    //=============================================================================
    Window_BattleActor.prototype.drawItem = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.changePaintOpacity(false);
        }
        Window_BattleStatus.prototype.drawItem.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    Window_BattleActor.prototype.isCurrentItemEnabled = function() {
        return this.canSelectSkillTarget(this.index());
    };

    Window_BattleActor.prototype.canSelectSkillTarget = function(index) {
        var action = BattleManager.inputtingAction();
        return !action || Window_Selectable.prototype.canSelectSkillTarget.call(this, action.item(), index);
    };

    Window_BattleActor.prototype.getMember = function(index) {
        return $gameParty.members()[index];
    };

    //=============================================================================
    // Window_BattleEnemy
    //  無効な対象は選択不可能にします。
    //=============================================================================
    var _Window_BattleEnemy_drawItem      = Window_BattleEnemy.prototype.drawItem;
    Window_BattleEnemy.prototype.drawItem = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.changePaintOpacity(false);
        }
        _Window_BattleEnemy_drawItem.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    Window_BattleEnemy.prototype.isCurrentItemEnabled = Window_BattleActor.prototype.isCurrentItemEnabled;
    Window_BattleEnemy.prototype.canSelectSkillTarget = Window_BattleActor.prototype.canSelectSkillTarget;

    Window_BattleEnemy.prototype.getMember = function(index) {
        return this._enemies[index];
    };

    //=============================================================================
    // Window_MenuActor
    //  無効な対象は選択不可能にします。
    //=============================================================================
    Window_MenuActor.prototype.drawItemStatus = function(index) {
        if (!this.canSelectSkillTarget(index)) {
            this.changePaintOpacity(false);
        }
        Window_MenuStatus.prototype.drawItemStatus.apply(this, arguments);
        this.changePaintOpacity(true);
    };

    var _Window_MenuActor_processOk      = Window_MenuActor.prototype.processOk;
    Window_MenuActor.prototype.processOk = function() {
        if (this.isCurrentItemEnabled() || this.cursorAll()) {
            _Window_MenuActor_processOk.apply(this, arguments);
        } else {
            SoundManager.playBuzzer();
        }
    };

    var _Window_MenuActor_selectForItem      = Window_MenuActor.prototype.selectForItem;
    Window_MenuActor.prototype.selectForItem = function(item) {
        this._targetItem = item;
        _Window_MenuActor_selectForItem.apply(this, arguments);
        this.refresh();
    };

    Window_MenuActor.prototype.canSelectSkillTarget = function(index) {
        var item = this._targetItem;
        return !item || Window_Selectable.prototype.canSelectSkillTarget.call(this, item, index);
    };

    Window_MenuActor.prototype.isCurrentItemEnabled = Window_BattleActor.prototype.isCurrentItemEnabled;
    Window_MenuActor.prototype.getMember            = Window_BattleActor.prototype.getMember;
})();

