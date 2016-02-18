//=============================================================================
// AutomaticState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/02/14 オートステートの追加時にメッセージを表示する仕様を追加
// 1.0.0 2016/02/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ステート自動付与プラグイン
 * @author トリアコンタン
 *
 * @help 条件を満たしている間、指定したステートを付与します。
 * ステートのメモ欄に以下の書式で条件を入力してください。
 *
 * メモ欄書式（ステートIDには制御文字を利用できます）
 *
 * 1. 自動付与ステートの条件
 * <AS上限HP:（HPの割合[百分率]）>
 *     指定したHP(割合)を上回っている（>=）間、対象ステートを付与する。
 * <AS下限HP:（HPの割合[百分率]）>
 *     指定したHP(割合)を下回っている（<=）間、対象ステートを付与する。
 * <AS上限MP:（MPの割合[百分率]）>
 *     指定したMP(割合)を上回っている（>=）間、対象ステートを付与する。
 * <AS下限MP:（MPの割合[百分率]）>
 *     指定したMP(割合)を下回っている（<=）間、対象ステートを付与する。
 * <AS上限TP:（TPの割合[百分率]）>
 *     指定したMP(割合)を上回っている（>=）間、対象ステートを付与する。
 * <AS下限TP:（TPの割合[百分率]）>
 *     指定したMP(割合)を下回っている（<=）間、対象ステートを付与する。
 * <AS武器装備:（武器ID）>
 *     指定した武器を装備している間、対象ステートを付与する。
 * <AS防具装備:（防具ID）>
 *     指定した武器を装備している間、対象ステートを付与する。
 * <ASスイッチ:（スイッチID）>
 *     指定したスイッチがONになっている間、対象ステートを付与する。
 *
 * 2. 自動付与ステートの対象
 * <ASアクター:（アクターID）>
 *     ステート自動付与の対象を指定したアクターのみに設定する。
 *     IDの指定がない場合、全てのアクターに有効になる。
 * <AS敵キャラ:（敵キャラID）>
 *     ステート自動付与の対象を指定した敵キャラのみに設定する。
 *     IDの指定がない場合、全ての敵キャラに有効になる。
 *
 * スクリプト
 * 自動付与ステートが有効になったときに所定のメッセージを表示する場合
 * $gameSystem.automaticStateAddMessage = true;
 *
 * 自動付与ステートが有効になったときに所定のメッセージを表示しない場合
 * $gameSystem.automaticStateAddMessage = false;
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'AutomaticState';

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer ? SceneManager._scene._windowLayer.children[0] : null;
        return window ? window.convertEscapeCharacters(text) : text;
    };

    if (!Object.prototype.hasOwnProperty('isEmpty')) {
        Object.defineProperty(Object.prototype, 'isEmpty', {
            value : function () {
                return Object.keys(this).length <= 0;
            }
        });
    }

    if (!Object.prototype.hasOwnProperty('iterate')) {
        Object.defineProperty(Object.prototype, 'iterate', {
            value : function (handler) {
                Object.keys(this).forEach(function (key, index) {
                    handler.call(this, key, this[key], index);
                }, this);
            }
        });
    }

    //=============================================================================
    // Game_System
    //  自動付与ステートのメッセージ表示フラグを定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this.automaticStateAddMessage = null;
    };

    //=============================================================================
    // Game_BattlerBase
    //  自動付与ステートの更新処理を定義します。
    //=============================================================================
    Game_BattlerBase.prototype.updateAutomaticState = function() {
        $dataStates.forEach(function(state) {
            if (state == null || state.meta.isEmpty()) return;
            var stateId = state.id, result = this.isAutomaticValid(state);
            if (result == null) return;
            if (result) {
                if (!this.isStateAffected(stateId) && this.isStateAddable(stateId)) {
                    this.addState(stateId);
                    if ($gameSystem.automaticStateAddMessage) this.showAddedStates();
                    this._result.deleteAddedStates(stateId);
                }
            } else {
                if (this.isStateAffected(stateId)) {
                    this.removeState(stateId);
                    this._result.deleteRemovedStates(stateId);
                }
            }
        }.bind(this));
    };

    Game_BattlerBase.prototype.showAddedStates = function() {
    };

    Game_BattlerBase.prototype.isAutomaticValid = function(state) {
        this._automaticTargetState = state;
        var switchId = this.getStateMetaNumber('スイッチ', 1, $dataSystem.switches.length - 1);
        if (switchId !== null) return $gameSwitches.value(switchId);
        var upperLimitHp = this.getStateMetaNumber('上限HP', 0, 100);
        if (upperLimitHp !== null) return this.hpRate() * 100 >= upperLimitHp;
        var lowerLimitHp = this.getStateMetaNumber('下限HP', 0, 100);
        if (lowerLimitHp !== null) return this.hpRate() * 100 <= lowerLimitHp;
        var upperLimitMp = this.getStateMetaNumber('上限MP', 0, 100);
        if (upperLimitMp !== null) return this.mpRate() * 100 >= upperLimitMp;
        var lowerLimitMp = this.getStateMetaNumber('下限MP', 0, 100);
        if (lowerLimitMp !== null) return this.mmp > 0 && this.mpRate() * 100 <= lowerLimitMp;
        var upperLimitTp = this.getStateMetaNumber('上限TP', 0, 100);
        if (upperLimitTp !== null) return this.tpRate() * 100 >= upperLimitTp;
        var lowerLimitTp = this.getStateMetaNumber('下限TP', 0, 100);
        if (lowerLimitTp !== null) return this.tpRate() * 100 <= lowerLimitTp;
        return null;
    };

    Game_BattlerBase.prototype.getStateMetaNumber = function(tagName, min, max) {
        var value = this._automaticTargetState.meta['AS' + tagName];
        return value != null ? getArgNumber(value, min, max) : null;
    };

    Game_BattlerBase.prototype.isStateMetaInfo = function(tagName) {
        return this._automaticTargetState.meta.hasOwnProperty('AS' + tagName);
    };

    var _Game_BattlerBase_setHp = Game_BattlerBase.prototype.setHp;
    Game_BattlerBase.prototype.setHp = function(hp) {
        _Game_BattlerBase_setHp.apply(this, arguments);
        this.updateAutomaticState();
    };

    var _Game_BattlerBase_setMp = Game_BattlerBase.prototype.setMp;
    Game_BattlerBase.prototype.setMp = function(mp) {
        _Game_BattlerBase_setMp.apply(this, arguments);
        this.updateAutomaticState();
    };

    var _Game_BattlerBase_setTp = Game_BattlerBase.prototype.setTp;
    Game_BattlerBase.prototype.setTp = function(tp) {
        _Game_BattlerBase_setTp.apply(this, arguments);
        this.updateAutomaticState();
    };

    //=============================================================================
    // Game_Actor
    //  自動付与ステートの更新処理を定義します。
    //=============================================================================
    var _Game_Actor_isAutomaticValid = Game_Actor.prototype.isAutomaticValid;
    Game_Actor.prototype.isAutomaticValid = function(state) {
        this._automaticTargetState = state;
        var actorId = this.getStateMetaNumber('アクター', 1, $dataActors.length - 1);
        if (this.isStateMetaInfo('敵キャラ') || (actorId !== null && actorId !== this._actorId)) return false;
        var weaponId = this.getStateMetaNumber('武器装備', 1, $dataWeapons.length - 1);
        if (weaponId !== null) return this.hasWeapon($dataWeapons[weaponId]);
        var armorId = this.getStateMetaNumber('防具装備', 1, $dataArmors.length - 1);
        if (armorId !== null) return this.hasArmor($dataArmors[armorId]);
        return _Game_Actor_isAutomaticValid.apply(this, arguments);
    };

    var _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        _Game_Actor_changeEquip.apply(this, arguments);
        this.updateAutomaticState();
    };

    //=============================================================================
    // Game_Enemy
    //  自動付与ステートの更新処理を定義します。
    //=============================================================================
    var _Game_Enemy_isAutomaticValid = Game_Enemy.prototype.isAutomaticValid;
    Game_Enemy.prototype.isAutomaticValid = function(state) {
        this._automaticTargetState = state;
        var enemyId = this.getStateMetaNumber('敵キャラ', 1, $dataEnemies.length - 1);
        if (this.isStateMetaInfo('アクター') || (enemyId !== null && enemyId !== this._enemyId)) return false;
        return _Game_Enemy_isAutomaticValid.apply(this, arguments);
    };

    //=============================================================================
    // Game_Party
    //  全てのアクターの自動付与ステートを更新します。
    //=============================================================================
    Game_Party.prototype.updateAutomaticState = function() {
        this.members().forEach(function(actor) {
            actor.updateAutomaticState();
        });
    };

    //=============================================================================
    // Game_Map
    //  場所移動時に自動付与ステートを更新します。
    //=============================================================================
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.apply(this, arguments);
        $gameParty.updateAutomaticState();
    };

    //=============================================================================
    // Game_Interpreter
    //  イベント終了時に自動付与ステートを更新します。
    //=============================================================================
    var _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this._depth === 0) $gameParty.updateAutomaticState();
    };

    //=============================================================================
    // Game_ActionResult
    //  ステート付与、解除時のメッセージを抑制します。
    //=============================================================================
    Game_ActionResult.prototype.deleteRemovedStates = function(stateId) {
        this.removedStates.iterate(function(key, value, index) {
            if (value === stateId) this.removedStates.splice(index, 1);
        }.bind(this));
    };

    Game_ActionResult.prototype.deleteAddedStates = function(stateId) {
        this.addedStates.iterate(function(key, value, index) {
            if (value === stateId) this.addedStates.splice(index, 1);
        }.bind(this));
    };
})();

