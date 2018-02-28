//=============================================================================
// ChangeMapTouchPolicy.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2018/03/01 パラメータの型指定機能に対応。マップタッチ移動時の強制ダッシュを無効にする機能を追加。
// 1.0.1 2016/09/11 レベル「簡易」の時の押し続け判定を変更
// 1.0.0 2015/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin that change policy of 'map touch'
 * @author triacontane
 *
 * @param initPolicyLevel
 * @desc Initial value of policy level
 * @option 1 : invalid
 * @value 1
 * @option 2 : simple
 * @value 2
 * @option 3 : normal
 * @value 3
 * @option 4 : excessive
 * @value 4
 *
 * @param invalidForceDash
 * @desc マップタッチ移動時の強制ダッシュを無効にしてShiftキーを押している間のみダッシュします。スマホ版は除く。
 * @default false
 * @type boolean
 *
 * @help Plugin that change policy of 'map touch'
 * There are four stages
 *
 *  1 : 'map touch' become invalid
 *  2 : 'map touch' become simple(move one step)
 *  3 : 'map touch' become normal(default policy)
 *  4 : 'map touch' become excessive(auto track to pointer)
 *
 * Plugin Command
 *  CHANGE_MTP [policy level] : change policy of 'map touch'
 *  ex：CHANGE_MTP 3
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マップタッチ仕様変更プラグイン
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
 * @help マップをタッチした際の移動の仕方を4種類から変更できます。
 * パラメータの「仕様レベル初期値」を設定してください。
 * 1 : 無効「マップをタッチしてもプレイヤーは動きません」
 * 2 : 簡易「マップをタッチするとプレイヤーが一マスだけ動きます」
 * 　　（指定位置へは移動しません。タッチし続けると移動を続けます）
 * 3 : 通常「マップをタッチするとその位置へプレイヤーが動きます」
 * 　　（もともとの仕様です）
 * 4 : 過剰「一度でもマップクリックすると以後、プレイヤーがポインタを追跡します」
 * 　　（もう一度クリックすると移動を止めます）
 *
 * プラグインコマンド詳細
 *   イベントコマンド「プラグインコマンド」から実行。
 *   （引数の間は半角スペースで区切る）
 *
 *  CHANGE_MTP [仕様レベル] : マップタッチの仕様レベルを変更します。
 *  例：CHANGE_MTP 3
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
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

    var param = createPluginParameter('ChangeMapTouchPolicy');


    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[CHANGE_MTP]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command.toUpperCase() === 'CHANGE_MTP') {
            $gameSystem._mapTouchPolicy = getArgNumber(args[0], 1, 4);
        }
    };

    //=============================================================================
    // Game_Temp
    //  移動開始フラグを追加定義します。
    //=============================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._moveStart = false;
    };

    //=============================================================================
    // Game_System
    //  仕様レベルの初期値を追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._mapTouchPolicy = param.initPolicyLevel;
    };

    var _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
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
    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        var result = $gameSystem._mapTouchPolicy !== 1 && _Scene_Map_isMapTouchOk.call(this);
        if (!result) $gameTemp._moveStart = false;
        return result;
    };

    var _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        switch ($gameSystem._mapTouchPolicy) {
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
        if (TouchInput.isTriggered() || TouchInput.isLongPressed()) {
            var px = $gamePlayer.x;
            var py = $gamePlayer.y;
            var deltaX = $gameMap.deltaX($gameMap.canvasToMapX(TouchInput.x), px);
            var deltaY = $gameMap.deltaY($gameMap.canvasToMapY(TouchInput.y), py);
            var d = 0;
            if (Math.abs(deltaX) < Math.abs(deltaY)) {
                if (deltaY > 0) d = 2;
                if (deltaY < 0) d = 8;
            } else {
                if (deltaX > 0) d = 6;
                if (deltaX < 0) d = 4;
            }
            if (d === 0) return;
            if (!$gamePlayer.isMapPassable(px, py, d)) {
                if (Math.abs(deltaX) < Math.abs(deltaY)) {
                    if (deltaX > 0) d = 6;
                    if (deltaX < 0) d = 4;
                } else {
                    if (deltaY > 0) d = 2;
                    if (deltaY < 0) d = 8;
                }
            }
            if (d === 0) return;
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
                $gameTemp._moveStart = true;
            }
        }
    };

    Scene_Map.prototype.processMapTouchLevel4 = function() {
        var x = $gameMap.canvasToMapX(TouchInput.x);
        var y = $gameMap.canvasToMapY(TouchInput.y);
        if (TouchInput.isTriggered()) $gameTemp._moveStart = !$gameTemp._moveStart;
        if ($gameTemp._moveStart) {
            $gameTemp.setDestination(x, y);
        } else {
            $gameTemp.clearDestination();
        }
    };

    //=============================================================================
    // TouchInput
    //  ポインタ移動時にマウス位置の記録を常に行うように元の処理を上書き
    //=============================================================================
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
})();
