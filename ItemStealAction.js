/*=============================================================================
 ItemStealAction.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/11/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アイテム強奪プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemStealAction.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param stealList
 * @text アイテム獲得設定リスト
 * @desc アイテム獲得設定の一覧です。
 * @default []
 * @type struct<STEAL>[]
 *
 * @help ItemStealAction.js
 *
 * 対象からアイテムを奪い取る行動を作成できます。
 * スキルかアイテムのメモ欄に以下の通り記述してください。
 *
 * <ItemSteal:id> # 識別子[id]の設定でアイテムを獲得します。
 *
 * この行動は「アクター」から「敵キャラ」に対してのみ使用できます。
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

/*~struct~STEAL:
 * @param id
 * @desc メモタグで指定する識別子です。
 * @default id
 * @type string
 *
 * @param dropItemIndex
 * @text アイテムインデックス
 * @desc 獲得枠として使われるドロップアイテムのインデックス(0-2)です。指定枠はドロップアイテムとして機能しなくなります。
 * @default 2
 * @type select
 * @option 0
 * @option 1
 * @option 2
 *
 * @param lifeSteal
 * @text ライフスティール
 * @desc 有効にするとアイテム獲得行動をうけた敵キャラは消滅します。アイテム変化などの表現に使います。
 * @default false
 * @type boolean
 *
 * @param rateFormula
 * @text 計算式
 * @desc アイテム獲得確率の計算式です。結果にさらにドロップアイテムの確率が乗算されます。指定しない場合は1.0(100%)です。
 * @default
 * @type string
 *
 * @param message
 * @text メッセージ
 * @desc アイテム獲得時に表示されるメッセージです。%1はアイテム名です。
 * @default %1を盗んだ！
 * @type string
 *
 * @param failureMessage
 * @text 失敗メッセージ
 * @desc アイテム獲得に失敗した場合に表示されるメッセージです。
 * @default 盗めなかった……
 * @type string
 *
 * @param noItemMessage
 * @text アイテムなしメッセージ
 * @desc アイテムがなかった場合に表示されるメッセージです。
 * @default 何も持っていない……
 *
 * @param noLimitation
 * @text 制限なし
 * @desc 有効にすると同じ敵キャラから何度でもアイテムを獲得できます。
 * @default false
 * @type boolean
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stealList) {
        param.stealList = [];
    }

    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        if (this.subject().isActor() && target.isEnemy()) {
            this.applyItemSteal(target);
        }
    };

    Game_Action.prototype.applyItemSteal = function(target) {
        const stealId = this.item().meta.ItemSteal;
        if (!stealId) {
            return;
        }
        const stealData = param.stealList.find(data => data.id === stealId);
        if (!stealData) {
            return;
        }
        const rate = this.findStealRate(target, stealData);
        target.stealItems(stealData, rate);
        this.makeSuccess(target);
    };

    Game_Action.prototype.findStealRate = function(target, stealData) {
        const a = this.subject();
        const b = target;
        const v = $gameVariables._data;
        return stealData.rateFormula ? eval(stealData.rateFormula) : 1.0;
    };

    Game_Enemy.prototype.stealItems = function(stealData, rate) {
        if (this._stealSuccess && !stealData.noLimitation) {
            this.setStealMessage(stealData.noItemMessage);
            return;
        }
        const isStealSuccess = (di, i) => i === stealData.dropItemIndex && Math.random() * di.denominator < rate;
        const stealItem = this.enemy().dropItems.find(isStealSuccess);
        if (stealItem) {
            this.applyStealItems(stealItem, stealData);
        } else {
            this.setStealMessage(stealData.failureMessage);
        }
    };

    Game_Enemy.prototype.applyStealItems = function(stealItem, stealData) {
        const itemObject = this.itemObject(stealItem.kind, stealItem.dataId);
        $gameParty.gainItem(itemObject, 1);
        this.setStealMessage(stealData.message.format(itemObject.name));
        if (stealData.lifeSteal) {
            this.addState(this.deathStateId());
        }
        this._stealSuccess = true;
    };

    Game_Enemy.prototype.setStealMessage = function(message) {
        this.result().stealMessage = message;
    };

    const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function() {
        const realDropItems = this.enemy().dropItems;
        const stealIndexList = param.stealList.map(data => data.dropItemIndex);
        this.enemy().dropItems = realDropItems.filter((item, i) => !stealIndexList.includes(i));
        const result = _Game_Enemy_makeDropItems.apply(this, arguments);
        this.enemy().dropItems = realDropItems;
        return result;
    };

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.stealMessage = '';
    };

    const _Window_BattleLog_displayAffectedStatus = Window_BattleLog.prototype.displayAffectedStatus;
    Window_BattleLog.prototype.displayAffectedStatus = function(target) {
        _Window_BattleLog_displayAffectedStatus.apply(this, arguments);
        if (target.result().stealMessage) {
            this.push('addText', target.result().stealMessage);
        }
    };
})();
