//=============================================================================
// KeepDestination.js
// ----------------------------------------------------------------------------
// (C)2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2025/09/07 移動ルート強制を行うとタッチ移動を中断する機能を追加
// 1.1.0 2025/03/11 MZ版としてリファクタリング
// 1.0.0 2018/01/06 初版
// ----------------------------------------------------------------------------
// [X]      : https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc タッチ移動先の保持プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/KeepDestination.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param abortByRouteForce
 * @text 移動ルート強制で中断
 * @desc タッチ移動中に移動ルート強制が実行された場合、タッチ移動を中断します。
 * @default false
 * @type boolean
 *
 * @help KeepDestination.js
 *
 * タッチ移動中にイベントが実行された場合でもタッチ移動が
 * 中断されなくなります。
 * ただし、進行方向が通行不可だった場合は停止します。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Scene_Map
    //=============================================================================
    const _Scene_Map_updateDestination = Scene_Map.prototype.updateDestination;
    Scene_Map.prototype.updateDestination = function() {
        if ($gamePlayer.canPassStraight() && !$gamePlayer.isTransferring() && !$gamePlayer.isDestinationAbortByRouteForce()) {
            $gameTemp.keepDestination();
            this._prevTouchCount = this._touchCount;
        }
        _Scene_Map_updateDestination.apply(this, arguments);
        if (this._prevTouchCount && !this.isMapTouchOk()) {
            this._touchCount = this._prevTouchCount;
        }
        this._prevTouchCount = 0;
        $gameTemp.clearKeepDestination();
    };

    Game_Player.prototype.isDestinationAbortByRouteForce = function() {
        return this._moveRouteForcing && param.abortByRouteForce;
    };

    //=============================================================================
    // Game_Temp
    //=============================================================================
    Game_Temp.prototype.keepDestination = function() {
        this._keepDestination = true;
    };

    Game_Temp.prototype.clearKeepDestination = function() {
        this._keepDestination = false;
    };

    const _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
    Game_Temp.prototype.clearDestination = function() {
        if (this._keepDestination) {
            return;
        }
        _Game_Temp_clearDestination.apply(this, arguments);
    };

    //=============================================================================
    // Game_CharacterBase
    //=============================================================================
    Game_CharacterBase.prototype.canPassStraight = function() {
        return this.canPass(this.x, this.y, this.direction());
    };
})();
