//=============================================================================
// ScrollForceCenter.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0/4 2022/08/10 2.0.3の修正を近景プラグインにも正しく適用
// 2.0.3 2021/08/24 遠景を設定してスクロールしたときに画面端に近づくと遠景が高速でスクロールしてしまう問題を修正
// 2.0.2 2021/04/19 マップがループしているとき画面シフトが機能しない問題を修正
// 2.0.1 2020/11/26 イベントテストでエラーになる問題を修正
// 2.0.0 2020/11/18 MZ向けに全面的にリファクタリング
// 1.1.0 2019/04/28 中心座標を指定したぶんだけずらせる機能を追加
// 1.0.0 2016/09/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ScrollForceCenterPlugin
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ScrollForceCenter.js
 * @author triacontane
 *
 * @param adjustX
 * @desc The specified number of tiles are displayed with the center shifted in the X direction.
 * @default 0
 * @type number
 * @min -500
 * @max 500
 *
 * @param adjustY
 * @desc The specified number of tiles are displayed with the center shifted in the Y direction.
 * @default 0
 * @type number
 * @min -500
 * @max 500
 *
 * @command DISABLE_RESERVE
 * @text DISABLE RESERVE
 * @desc Forced center-scrolling is prohibited and normal scrolling is used.
 *
 * @command ENABLE_RESERVE
 * @text ENABLE RESERVE
 * @desc Again, forced center scrolling will be allowed.
 *
 * @help In the map screen the player will always be centered on the screen,
 * regardless of the map size.
 * If the outside of the map goes into the screen,
 * it will be displayed in pitch black.
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 * The "PluginCommonBase.js" is here.
 * (MZ install path)dlc/BasicResources/plugins/official/PluginCommonBase.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 強制中央スクロールプラグイン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ScrollForceCenter.js
 * @author トリアコンタン
 *
 * @param adjustX
 * @text X補正
 * @desc 指定したタイル数だけ中心がX方向にずれて表示されます。
 * @default 0
 * @type number
 * @min -500
 * @max 500
 *
 * @param adjustY
 * @text Y補正
 * @desc 指定したタイル数だけ中心がY方向にずれて表示されます。
 * @default 0
 * @type number
 * @min -500
 * @max 500
 *
 * @command DISABLE_RESERVE
 * @text 強制中央スクロール禁止予約
 * @desc 強制中央スクロールが禁止され通常スクロールになります。次回場所移動後から有効になります。
 *
 * @command ENABLE_RESERVE
 * @text 強制中央スクロール許可予約
 * @desc 再度、強制中央スクロールが許可されます。次回場所移動後から有効になります。
 *
 * @help マップ画面でマップサイズにかかわらずプレイヤーが常に画面中央に
 * 配置されるようになります。
 * マップの外側が画面内に入る場合、真っ黒の状態で表示されます。
 *
 * マップ設定のメモ欄に以下の通り記述すると、マップ単位で強制中央スクロールの
 * 禁止/許可を制御できます。この設定はプラグインコマンドより優先されます。
 * <SFC禁止>     # 対象マップで強制中央スクロールが禁止されます。
 * <SFC_Disable> # 同上
 * <SFC許可>     # 対象マップで強制中央スクロールが許可されます。
 * <SFC_Enable>  # 同上
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

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'DISABLE_RESERVE', args => {
        $gameMap.setDisableForceCenterReserve(true);
    });

    PluginManagerEx.registerCommand(script, 'ENABLE_RESERVE', args => {
        $gameMap.setDisableForceCenterReserve(false);
    });

    const _Game_Player_updateScroll      = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        _Game_Player_updateScroll.apply(this, arguments);
        if ($gameMap.isForceCenter()) {
            const x1 = lastScrolledX;
            const y1 = lastScrolledY;
            const x2 = this.scrolledX();
            const y2 = this.scrolledY();
            if (y2 > y1 && y2 <= this.centerY()) {
                $gameMap.scrollDown(y2 - y1);
            }
            if (x2 < x1 && x2 >= this.centerX()) {
                $gameMap.scrollLeft(x1 - x2);
            }
            if (x2 > x1 && x2 <= this.centerX()) {
                $gameMap.scrollRight(x2 - x1);
            }
            if (y2 < y1 && y2 >= this.centerY()) {
                $gameMap.scrollUp(y1 - y2);
            }
        }
    };

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.apply(this, arguments);
        this._disableForceCenter        = false;
        this._disableForceCenterReserve = false;
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        if (mapId > 0) {
            this.refreshDisableForceCenter();
        }
        _Game_Map_setup.apply(this, arguments);
    };

    Game_Map.prototype.isForceCenter = function() {
        return !this._disableForceCenter;
    };

    Game_Map.prototype.setDisableForceCenterReserve = function(value) {
        this._disableForceCenterReserve = !!value;
    };

    Game_Map.prototype.refreshDisableForceCenter = function() {
        let disableForceCenter;
        if (PluginManagerEx.findMetaValue($dataMap, ['SFC禁止', 'SFC_Disable'])) {
            disableForceCenter = true;
        } else if (PluginManagerEx.findMetaValue($dataMap, ['SFC許可', 'SFC_Enable'])) {
            disableForceCenter = false;
        } else {
            disableForceCenter = this._disableForceCenterReserve;
        }
        this._disableForceCenter = disableForceCenter;
    };


    const _Game_Map_setDisplayPos = Game_Map.prototype.setDisplayPos;
    Game_Map.prototype.setDisplayPos = function(x, y) {
        _Game_Map_setDisplayPos.apply(this, arguments);
        if (this.isForceCenterHorizontal()) {
            this._displayX = x + (param.adjustX || 0);
            this._parallaxX = this._displayX;
        } else if (this.isLoopHorizontal()) {
            this._displayX += param.adjustX || 0;
        }
        if (this.isForceCenterVertical()) {
            this._displayY = y + (param.adjustY || 0);
            this._parallaxY = this._displayY;
        }else if (this.isLoopVertical()) {
            this._displayY += param.adjustY || 0;
        }
    };

    Game_Map.prototype.isForceCenterVertical = function() {
        return !this.isLoopVertical() && this.isForceCenter();
    };

    Game_Map.prototype.isForceCenterHorizontal = function() {
        return !this.isLoopHorizontal() && this.isForceCenter();
    };

    const _Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        const forceCenterDisplayY = this._displayY + distance;
        const lastY = this._displayY;
        const lastPy = this._parallaxY;
        const lastFy = this._foregroundY;
        _Game_Map_scrollDown.apply(this, arguments);
        if (this.isForceCenterVertical()) {
            this._displayY = forceCenterDisplayY;
            this._parallaxY = lastPy + this._displayY - lastY;
            this._foregroundY = lastFy + this._displayY - lastY;
        }
    };

    const _Game_Map_scrollLeft      = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        const forceCenterDisplayX = this._displayX - distance;
        const lastX = this._displayX;
        const lastPx = this._parallaxX;
        const lastFx = this._foregroundX;
        _Game_Map_scrollLeft.apply(this, arguments);
        if (this.isForceCenterHorizontal()) {
            this._displayX = forceCenterDisplayX;
            this._parallaxX = lastPx + this._displayX - lastX;
            this._foregroundX = lastFx + this._displayX - lastX;
        }
    };

    const _Game_Map_scrollRight      = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        const forceCenterDisplayX = this._displayX + distance;
        const lastX = this._displayX;
        const lastPx = this._parallaxX;
        const lastFx = this._foregroundX;
        _Game_Map_scrollRight.apply(this, arguments);
        if (this.isForceCenterHorizontal()) {
            this._displayX = forceCenterDisplayX;
            this._parallaxX = lastPx + this._displayX - lastX;
            this._foregroundX = lastFx + this._displayX - lastX;
        }
    };

    const _Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        const forceCenterDisplayY = this._displayY - distance;
        const lastY = this._displayY;
        const lastPy = this._parallaxY;
        const lastFy = this._foregroundY;
        _Game_Map_scrollUp.apply(this, arguments);
        if (this.isForceCenterVertical()) {
            this._displayY = forceCenterDisplayY;
            this._parallaxY = lastPy + this._displayY - lastY;
            this._foregroundY = lastFy + this._displayY - lastY;
        }
    };
})();

