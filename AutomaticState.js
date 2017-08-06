//=============================================================================
// AutomaticState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.1 2017/08/06 メモリ上にロードされていないアクターの自動ステートチェックが実行されるとエラーになる現象を修正
//                  処理の軽量化
// 1.3.0 2017/07/21 パーティの並び順で自動ステートを付与する機能を追加
// 1.2.5 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.4 2017/05/27 全回復の直後に自動ステートが解除されてしまう問題を修正
// 1.2.3 2017/02/16 1.2.0以降、下限MPの設定が無効になっていた問題を修正
// 1.2.2 2017/02/07 端末依存の記述を削除
// 1.2.1 2017/01/17 1.2.0でスイッチの項目が正しく機能しなかった問題を修正
// 1.2.0 2017/01/14 ステート自動付与の条件に計算式を適用できる機能を追加
//                  処理の軽量化
// 1.1.2 2016/06/03 スペルミス修正
// 1.1.1 2016/05/23 条件式で割合を算出する際に端数を切り捨てるよう修正
// 1.1.0 2016/05/22 複数の条件を適用できるよう修正
// 1.0.2 2016/04/30 アクターと敵キャラ限定のオートステートが一部正しく機能していなかった問題を修正
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
 * <AS計算式:（JS計算式）>
 *     指定したJavaScript計算式がtrueの間、対象ステートを付与する。
 * <AS並び順:（インデックス）>
 *     並び順(1～)が指定した値と一致する間、対象ステートを付与する。
 *
 * 計算式中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<AS計算式:\v[2] &gt; 1> // 変数[2]が1より大きい場合
 *
 * 2. 自動付与ステートの対象
 * <ASアクター:（アクターID）>
 *     ステート自動付与の対象を指定したアクターのみに設定する。
 *     IDの指定がない場合、全てのアクターに有効になる。
 * <AS敵キャラ:（敵キャラID）>
 *     ステート自動付与の対象を指定した敵キャラのみに設定する。
 *     IDの指定がない場合、全ての敵キャラに有効になる。
 *
 * 複数の条件が指定された場合は、全ての条件を満たした場合のみ
 * ステートが付与されます。
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
    var metaTagPrefix = 'AS';

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
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
        return text;
    };

    var isEmpty = function(that) {
        return Object.keys(that).length <= 0;
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

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
        DataManager.iterateAutomaticState(function(state) {
            if (!state || isEmpty(state.meta)) return;
            var stateId = state.id;
            var result = this.isAutomaticValid(state);
            if (result === null) return;
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

    Game_BattlerBase.prototype.isAutomaticValid = function(state, result) {
        this._automaticTargetState = state;
        var switchId = this.getStateMetaNumber(0, 1);
        if (switchId !== null) {
            if ($gameSwitches.value(switchId)) {
                result = true;
            } else {
                return false;
            }
        }
        var formula = this.getStateMetaString(1);
        if (formula !== null) {
            if (eval(formula)) {
                result = true;
            } else {
                return false;
            }
        }
        var upperLimitHp = this.getStateMetaNumber(2, 0, 100);
        if (upperLimitHp !== null) {
            if (Math.floor(this.hpRate() * 100) >= upperLimitHp) {
                result = true;
            } else {
                return false;
            }
        }
        var lowerLimitHp = this.getStateMetaNumber(3, 0, 100);
        if (lowerLimitHp !== null) {
            if (Math.floor(this.hpRate() * 100) <= lowerLimitHp) {
                result = true;
            } else {
                return false;
            }
        }
        var upperLimitMp = this.getStateMetaNumber(4, 0, 100);
        if (upperLimitMp !== null) {
            if (Math.floor(this.mpRate() * 100) >= upperLimitMp) {
                result = true;
            } else {
                return false;
            }
        }
        var lowerLimitMp = this.getStateMetaNumber(5, 0, 100);
        if (lowerLimitMp !== null) {
            if (Math.floor(this.mpRate() * 100) <= lowerLimitMp) {
                result = true;
            } else {
                return false;
            }
        }
        var upperLimitTp = this.getStateMetaNumber(6, 0, 100);
        if (upperLimitTp !== null) {
            if (Math.floor(this.tpRate() * 100) >= upperLimitTp) {
                result = true;
            } else {
                return false;
            }
        }
        var lowerLimitTp = this.getStateMetaNumber(7, 0, 100);
        if (lowerLimitTp !== null) {
            if (Math.floor(this.tpRate() * 100) <= lowerLimitTp) {
                result = true;
            } else {
                return false;
            }
        }
        var unitIndex = this.getStateMetaNumber(12, 0);
        if (unitIndex !== null) {
            if (this.index() === unitIndex - 1) {
                result = true;
            } else {
                return false;
            }
        }
        return result;
    };

    Game_BattlerBase.prototype.index = function() {
        return 0;
    };

    Game_BattlerBase.prototype.getStateMetaNumber = function(tagIndex, min, max) {
        var value = this._automaticTargetState.meta[DataManager.getAutomaticTagName(tagIndex)];
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return value !== undefined ? getArgNumber(value, min, max) : null;
    };

    Game_BattlerBase.prototype.getStateMetaString = function(tagIndex) {
        var value = this._automaticTargetState.meta[DataManager.getAutomaticTagName(tagIndex)];
        return value !== undefined ? convertEscapeCharacters(value) : null;
    };

    Game_BattlerBase.prototype.isStateMetaInfo = function(tagIndex) {
        return this._automaticTargetState.meta.hasOwnProperty(DataManager.getAutomaticTagName(tagIndex));
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

    var _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() {
        _Game_BattlerBase_recoverAll.apply(this, arguments);
        this.updateAutomaticState();
    };

    //=============================================================================
    // Game_Actors
    //  データが存在するかどうかを返します。
    //=============================================================================
    Game_Actors.prototype.isExistData = function(actorId) {
        return !!this._data[actorId];
    };

    //=============================================================================
    // Game_Actor
    //  自動付与ステートの更新処理を定義します。
    //=============================================================================
    Game_Actor.prototype.updateAutomaticState = function() {
        if (!$gameActors.isExistData(this._actorId)) return;
        Game_BattlerBase.prototype.updateAutomaticState.call(this);
    };

    Game_Actor.prototype.isAutomaticValid = function(state) {
        this._automaticTargetState = state;
        var result = null;
        var actorId = this.getStateMetaNumber(8, 0);
        if (this.isStateMetaInfo(9) || (actorId > 0 && actorId !== this._actorId)) return false;
        var weaponId = this.getStateMetaNumber(10, 1);
        if (weaponId !== null) {
            if (this.hasWeapon($dataWeapons[weaponId])) {
                result = true;
            } else {
                return false;
            }
        }
        var armorId = this.getStateMetaNumber(11, 1);
        if (armorId !== null) {
            if (this.hasArmor($dataArmors[armorId])) {
                result = true;
            } else {
                return false;
            }
        }
        return Game_BattlerBase.prototype.isAutomaticValid.call(this, state, result);
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
    Game_Enemy.prototype.isAutomaticValid = function(state) {
        this._automaticTargetState = state;
        var enemyId = this.getStateMetaNumber(9, 0);
        if (this.isStateMetaInfo(8) || (enemyId > 0 && enemyId !== this._enemyId)) return false;
        return Game_BattlerBase.prototype.isAutomaticValid.call(this, state, null);
    };

    //=============================================================================
    // Game_Party
    //  全てのアクターの自動付与ステートを更新します。
    //=============================================================================
    Game_Party.prototype.requestUpdateAutomaticState = function() {
        this._requestUpdateAutomaticState = true;
    };

    Game_Party.prototype.updateAutomaticState = function() {
        this.members().forEach(function(actor) {
            actor.updateAutomaticState();
        });
        this._lastUpdateFrameAutomaticState = Graphics.frameCount;
    };

    Game_Party.prototype.updateAutomaticStateIfRequested = function() {
        var coolTime = (this._lastUpdateFrameAutomaticState + 10 > Graphics.frameCount);
        if (this._requestUpdateAutomaticState && !coolTime) {
            this.updateAutomaticState();
            this._requestUpdateAutomaticState = false;
        }
    };

    var _Game_Party_swapOrder = Game_Party.prototype.swapOrder;
    Game_Party.prototype.swapOrder = function(index1, index2) {
        _Game_Party_swapOrder.apply(this, arguments);
        this.updateAutomaticState();
    };

    //=============================================================================
    // Game_Map
    //  場所移動時に自動付与ステートを更新します。
    //=============================================================================
    var _Game_Map_refreshIfNeeded = Game_Map.prototype.refreshIfNeeded;
    Game_Map.prototype.refreshIfNeeded = function() {
        _Game_Map_refreshIfNeeded.apply(this, arguments);
        $gameParty.updateAutomaticStateIfRequested();
    };

    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.apply(this, arguments);
        $gameParty.updateAutomaticState();
    };

    var _Game_Map_refresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.apply(this, arguments);
        $gameParty.requestUpdateAutomaticState();
    };

    //=============================================================================
    // Game_ActionResult
    //  ステート付与、解除時のメッセージを抑制します。
    //=============================================================================
    Game_ActionResult.prototype.deleteRemovedStates = function(stateId) {
        iterate(this.removedStates, function(key, value, index) {
            if (value === stateId) this.removedStates.splice(index, 1);
        }.bind(this));
    };

    Game_ActionResult.prototype.deleteAddedStates = function(stateId) {
        iterate(this.addedStates, function(key, value, index) {
            if (value === stateId) this.addedStates.splice(index, 1);
        }.bind(this));
    };

    //=============================================================================
    // DataManager
    //  データベースのロード時に自動付与ステートのみを抽出します。
    //=============================================================================
    DataManager._automaticTagNames = [
        'スイッチ',
        '計算式',
        '上限HP',
        '下限HP',
        '上限MP',
        '下限MP',
        '上限TP',
        '下限TP',
        'アクター',
        '敵キャラ',
        '武器装備',
        '防具装備',
        '並び順'
    ];

    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (object === $dataStates) {
            this.setupAutomaticState();
        }
    };

    DataManager.setupAutomaticState = function() {
        this._automaticStates = $dataStates.filter(function(state) {
            return this._automaticTagNames.some(function(tagName) {
                return state && !!state.meta[metaTagPrefix + tagName];
            })
        }.bind(this));
    };

    DataManager.iterateAutomaticState = function(callBackFunc) {
        this._automaticStates.forEach(callBackFunc);
    };

    DataManager.getAutomaticTagName = function(index) {
        return metaTagPrefix + this._automaticTagNames[index];
    };
})();