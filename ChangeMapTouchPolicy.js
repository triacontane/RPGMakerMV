//=============================================================================
// ChangeMapTouchPolicy.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.2 2024/02/19 仕様レベルが2のときに乗り物の乗降ができない問題を修正
// 1.2.1 2023/08/27 メニューボタンを押したタイミングではタッチ移動しないよう修正
// 1.2.0 2022/10/14 MZで動作するよう修正
// 1.1.0 2018/03/01 パラメータの型指定機能に対応。マップタッチ移動時の強制ダッシュを無効にする機能を追加。
// 1.0.1 2016/09/11 レベル「簡易」の時の押し続け判定を変更
// 1.0.0 2015/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップタッチ仕様変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChangeMapTouchPolicy.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param initPolicyLevel
 * @text 仕様レベル初期値
 * @desc 初期状態でのマップタッチの仕様レベル
 * @default 3
 * @type select
 * @option 1 : 無効
 * @value 1
 * @option 2 : 簡易
 * @value 2
 * @option 3 : 通常
 * @value 3
 * @option 4 : 過剰
 * @value 4
 *
 * @param invalidForceDash
 * @text 強制ダッシュ無効
 * @desc マップタッチ移動時の強制ダッシュを無効にしてShiftキーを押している間のみダッシュします。スマホ版は除く。
 * @default false
 * @type boolean
 *
 * @help ChangeMapTouchPolicy.js
 *
 * マップをタッチした際の移動の仕方を4種類から変更できます。
 * パラメータの「仕様レベル初期値」を設定してください。
 * 1 : 無効「マップをタッチしてもプレイヤーは動きません」
 * 2 : 簡易「マップをタッチするとプレイヤーが一マスだけ動きます」
 * 　　（指定位置へは移動しません。タッチし続けると移動を続けます）
 * 3 : 通常「マップをタッチするとその位置へプレイヤーが動きます」
 * 　　（もともとの仕様です）
 * 4 : 過剰「一度でもマップタッチすると以後、プレイヤーがポインタを追跡します」
 * 　　（もう一度タッチすると移動を止めます）
 *
 * 仕様レベルを後から変更したい場合は、パラメータに制御文字\v[n]を
 * 指定してください。
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
    // Game_Temp
    //  移動開始フラグを追加定義します。
    //=============================================================================
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._moveStart = false;
    };

    Game_Temp.prototype.getMoveStart = function() {
        return this._moveStart;
    };

    Game_Temp.prototype.setMoveStart = function(value) {
        this._moveStart = value;
    };

    Game_Temp.prototype.toggleMoveStart = function() {
        this._moveStart = !this._moveStart;
    };

    const _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
    Game_Player.prototype.updateDashing = function() {
        _Game_Player_updateDashing.apply(this, arguments);
        if (!param.invalidForceDash || Utils.isMobileDevice() || this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
            this._dashing = this.isDashButtonPressed();
        }
    };

    //=============================================================================
    // Scene_Map
    //  仕様レベルによってマップタッチの挙動を変更します。
    //=============================================================================
    const _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        const result = param.initPolicyLevel !== 1 && _Scene_Map_isMapTouchOk.call(this);
        if (!result) {
            $gameTemp.setMoveStart(false);
        }
        return result;
    };

    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        switch (param.initPolicyLevel) {
            case 2:
                this.processMapTouchLevel2();
                break;
            case 3:
                _Scene_Map_processMapTouch.call(this);
                break;
            case 4:
                this.processMapTouchLevel4();
                break;
        }
    };

    Scene_Map.prototype.processMapTouchLevel2 = function() {
        if (this.isAnyButtonPressed()) {
            return;
        }
        if (TouchInput.isTriggered() || TouchInput.isLongPressed()) {
            let px = $gamePlayer.x;
            let py = $gamePlayer.y;
            const deltaX = $gameMap.deltaX($gameMap.canvasToMapX(TouchInput.x), px);
            const deltaY = $gameMap.deltaY($gameMap.canvasToMapY(TouchInput.y), py);
            let d = 0;
            if (Math.abs(deltaX) < Math.abs(deltaY)) {
                if (deltaY > 0) d = 2;
                if (deltaY < 0) d = 8;
            } else {
                if (deltaX > 0) d = 6;
                if (deltaX < 0) d = 4;
            }
            if (d === 0) {
                $gamePlayer.getOnOffVehicle();
                return;
            }
            if (!$gamePlayer.isMapPassable(px, py, d)) {
                if (Math.abs(deltaX) < Math.abs(deltaY)) {
                    if (deltaX > 0) d = 6;
                    if (deltaX < 0) d = 4;
                } else {
                    if (deltaY > 0) d = 2;
                    if (deltaY < 0) d = 8;
                }
            }
            if (d === 0) {
                $gamePlayer.getOnOffVehicle();
                return;
            }
            if ($gamePlayer.isMapPassable(px, py, d)) {
                switch (d) {
                    case 2:
                        py++;
                        break;
                    case 4:
                        px--;
                        break;
                    case 6:
                        px++;
                        break;
                    case 8:
                        py--;
                        break;
                }
                $gameTemp.setDestination(px, py);
                $gameTemp.setMoveStart(true);
            } else {
                $gamePlayer.setDirection(d);
            }
            if (!$gameTemp.isDestinationValid()) {
                $gamePlayer.getOnOffVehicle();
            }
        }
    };

    Scene_Map.prototype.processMapTouchLevel4 = function() {
        if (this.isAnyButtonPressed()) {
            return;
        }
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        if (TouchInput.isTriggered()) {
            $gameTemp.toggleMoveStart();
        }
        if ($gameTemp.getMoveStart()) {
            $gameTemp.setDestination(x, y);
        } else {
            $gameTemp.clearDestination();
        }
    };
})();
