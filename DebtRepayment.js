//=============================================================================
// DebtRepayment.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2025/02/08 MZで動作するよう修正
// 1.2.0 2017/05/25 借金時のウィンドウ文字色を変更できる機能を追加
// 1.1.0 2017/05/25 一定金額までは借金してお店で商品を購入できる機能を追加
// 1.0.0 2016/06/01 初版
// ----------------------------------------------------------------------------
// [X]: https://x.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 所持金マイナスプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DebtRepayment.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param underLimitCanBuying
 * @text 購入可能下限金額
 * @desc お店で購入可能な下限の金額です。マイナス値を指定してください。
 * @default 0
 * @min -99999999
 * @max 0
 * @type number
 *
 * @param debtTextColor
 * @text 借金文字色
 * @desc 所持金ウィンドウで借金時の文字色を変更します。
 * @default 0
 * @type color
 * 
 * @param disableSwitchId
 * @text 禁止スイッチID
 * @desc 指定したスイッチがONのとき、所持金をマイナスにできなくなります。指定がない場合、常にマイナスにできます。
 * @default 0
 * @type switch
 * 
 * @command REPAY_GOLD
 * @text 借金返済
 * @desc 所持金がマイナスの場合、ゼロに戻します。
 *
 * @help DebtRepayment.js
 * 
 * 所持金にマイナス値が設定可能になります。
 * 借金状態を表現したり、お店で商品の前借りやツケが表現できます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'REPAY_GOLD', args => {
        $gameParty.repayGold();
    });

    //=============================================================================
    // Game_Party
    //  所持金を調整します。
    //=============================================================================
    const _Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function(amount) {
        if (!this.isDebtEnable()) {
            _Game_Party_gainGold.apply(this, arguments);
        } else {
            this._gold = (this._gold + amount).clamp(-this.maxGold(), this.maxGold());
        }
    };

    Game_Party.prototype.repayGold = function() {
        if (this._gold < 0) this._gold = 0;
    };

    Game_Party.prototype.isDebtEnable = function() {
        return !$gameSwitches.value(param.disableSwitchId);
    };

    Game_Party.prototype.getCanBuyingUnderLimit = function() {
        return this.isDebtEnable() ? Math.min(param.underLimitCanBuying, this.maxGold()) : 0;
    };

    //=============================================================================
    // Scene_Shop
    //  購入可能下限金額を調整します。
    //=============================================================================
    const _Scene_Shop_money = Scene_Shop.prototype.money;
    Scene_Shop.prototype.money = function() {
        return _Scene_Shop_money.apply(this, arguments) - $gameParty.getCanBuyingUnderLimit();
    };

    //=============================================================================
    // Window_Gold
    //  借金時の文字色を変更します。
    //=============================================================================
    const _Window_Gold_resetTextColor = Window_Gold.prototype.resetTextColor;
    Window_Gold.prototype.resetTextColor = function() {
        if (param.debtTextColor > 0 && $gameParty.gold() < 0) {
            this.changeTextColor(ColorManager.textColor(param.debtTextColor));
        } else {
            _Window_Gold_resetTextColor.apply(this, arguments);
        }
    };
})();

