/*=============================================================================
 ItemTradeCommon.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/03/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アイテム売買コモン呼び出しプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemTradeCommon.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param tradeItemCommon
 * @text コモンイベントID
 * @desc アイテムを売買したときに呼び出されるコモンイベントです。
 * @default 0
 * @type common_event
 *
 * @param kindVariable
 * @text 売買種別変数
 * @desc コモン呼び出し時に、売買したアイテムの種別(アイテム:1, 武器:2, 防具:3)が格納される変数です。
 * @default 0
 * @type variable
 *
 * @param itemIdVariable
 * @text 売買アイテムID変数
 * @desc コモン呼び出し時に、売買したアイテム、武器、防具のIDが格納される変数です。
 * @default 0
 * @type variable
 *
 * @param amountVariable
 * @text 売買アイテム個数変数
 * @desc コモン呼び出し時に、売買したアイテム、武器、防具の個数が格納される変数です。売却の場合は負の値が設定されます。
 * @default 0
 * @type variable
 *
 * @param priceVariable
 * @text 売買アイテム価格変数
 * @desc コモン呼び出し時に、売買したアイテム、武器、防具の価格(単価)が格納される変数です。売却の場合は負の値が設定されます。
 * @default 0
 * @type variable
 *
 * @help ItemTradeCommon.js
 *
 * ショップでアイテムを売買してマップに戻ったとき、アイテムIDや個数を
 * 指定した変数に格納したうえでコモンイベントを呼び出します。
 * 複数回の売買が行われた場合は、その回数分コモンイベントが呼ばれます。
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
    if (!param.tradeItemCommon) {
        return;
    }

    const _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function(number) {
        _Scene_Shop_doBuy.apply(this, arguments);
        $gameMap.reserveTradeCommon(this._item, number, this.buyingPrice());
    };

    const _Scene_Shop_doSell = Scene_Shop.prototype.doSell;
    Scene_Shop.prototype.doSell = function(number) {
        _Scene_Shop_doSell.apply(this, arguments);
        $gameMap.reserveTradeCommon(this._item, -number, -this.sellingPrice());
    };

    Game_Map.prototype.reserveTradeCommon = function(item, amount, price) {
        if (!this._tradeCommonQueue) {
            this._tradeCommonQueue = [];
        }
        const args = {
            kind: DataManager.findItemKind(item),
            id: item.id,
            amount: amount,
            price: price
        }
        this._tradeCommonQueue.push(args);
    };

    const _Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
    Game_Map.prototype.updateInterpreter = function() {
        _Game_Map_updateInterpreter.apply(this, arguments);
        if (this._tradeCommonQueue?.length > 0 && !this.isExistValidDynamicEvents()) {
            this.setupTradeCommon();
        }
    };

    Game_Map.prototype.setupTradeCommon = function() {
        const args = this._tradeCommonQueue.shift();
        $gameVariables.setValue(param.kindVariable, args.kind);
        $gameVariables.setValue(param.itemIdVariable, args.id);
        $gameVariables.setValue(param.amountVariable, args.amount);
        $gameVariables.setValue(param.priceVariable, args.price);
        this.setupDynamicCommon(param.tradeItemCommon);
    };

    Game_Map.prototype.isExistValidDynamicEvents = function() {
        return this._dynamicEvents?.find(item => item.isRunning());
    };

    DataManager.findItemKind = function(item) {
        if (this.isItem(item)) {
            return 1;
        } else if (this.isWeapon(item)) {
            return 2;
        } else if (this.isArmor(item)) {
            return 3;
        } else {
            return 0;
        }
    };
})();
