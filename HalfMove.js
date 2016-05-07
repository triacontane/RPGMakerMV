//=============================================================================
// HalfMove.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Half Move Plugin
 * @author triacontane
 *
 * @param Direction8Move
 * @desc 斜め移動を含めた8方向移動を許可します。
 * @default ON
 *
 * @param EventThrough
 * @desc イベントに横から接触したときに半歩ぶんならすり抜けます。
 * @default ON
 *
 * @param DisableForcing
 * @desc 移動ルートの強制中は半歩移動を無効にします。
 * @default OFF
 *
 * @param AvoidCorner
 * @desc 直進中にマップの角に引っ掛かった場合、斜め移動に切り替えて再試行します。
 * @default ON
 *
 * @help Moving distance in half.
 *
 * Plugin command
 * ・HalfMoveDisable
 * Disable half move.
 *
 * ・HalfMoveEnable
 * Enable half move.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 半歩移動プラグイン
 * @author トリアコンタン
 *
 * @param 8方向移動
 * @desc 斜め移動を含めた8方向移動を許可します。
 * @default ON
 *
 * @param イベントすり抜け
 * @desc イベントに横から接触したときに半歩ぶんならすり抜けます。
 * @default ON
 *
 * @param 強制中無効
 * @desc 移動ルートの強制中は半歩移動を無効にします。
 * @default OFF
 *
 * @param 角回避
 * @desc 直進中にマップの角に引っ掛かった場合、斜め移動に切り替えて再試行します。
 * @default ON
 *
 * @help キャラクターの移動単位が1タイルの半分になります。
 * 半歩移動が有効なら、乗り物以外は全て半歩移動になります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・半歩移動禁止
 * ・HalfMoveDisable
 * 半歩移動を一時的に禁止します。この情報はセーブデータに含まれます。
 * 特定のイベント等で禁止したい場合等に使用します。
 *
 * ・半歩移動許可
 * ・HalfMoveEnable
 * 禁止していた半歩移動をもとに戻します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'HalfMove';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDirection8Move = getParamBoolean(['Direction8Move', '8方向移動']);
    var paramEventThrough   = getParamBoolean(['EventThrough', 'イベントすり抜け']);
    var paramDisableForcing = getParamBoolean(['DisableForcing', '強制中無効']);
    var paramAvoidCorner    = getParamBoolean(['AvoidCorner', '角回避']);

    //=============================================================================
    // ローカル変数
    //=============================================================================
    var localHalfPositionCount = 0;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandHalfMove(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandHalfMove = function (command, args) {
        switch (getCommandName(command)) {
            case '半歩移動禁止' :
            case 'HalfMoveDisable':
                $gameSystem.setEnableHalfMove(false);
                break;
            case '半歩移動許可' :
            case 'HalfMoveEnable':
                $gameSystem.setEnableHalfMove(true);
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  半歩移動全体の禁止フラグを追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._disableHalfMove = false;
    };

    Game_System.prototype.canHalfMove = function() {
        return !this._disableHalfMove;
    };

    Game_System.prototype.setEnableHalfMove = function(value) {
        this._disableHalfMove = !value;
        $gamePlayer.locate($gamePlayer.x, $gamePlayer.y);
        $gameMap.events().forEach(function (event) {
            event.locate(event.x, event.y);
        }.bind(this));
    };

    //=============================================================================
    // Game_Map
    //  座標計算を半分にします。
    //=============================================================================
    var _Game_Map_xWithDirection = Game_Map.prototype.xWithDirection;
    Game_Map.prototype.xWithDirection = function(x, d) {
        if (localHalfPositionCount > 0) {
            return x + (d === 6 ? 0.5 : d === 4 ? -0.5 : 0);
        } else {
            return _Game_Map_xWithDirection.apply(this, arguments);
        }
    };

    var _Game_Map_yWithDirection = Game_Map.prototype.yWithDirection;
    Game_Map.prototype.yWithDirection = function(y, d) {
        if (localHalfPositionCount > 0) {
            return y + (d === 2 ? 0.5 : d === 8 ? -0.5 : 0);
        } else {
            return _Game_Map_yWithDirection.apply(this, arguments);
        }
    };

    var _Game_Map_roundXWithDirection = Game_Map.prototype.roundXWithDirection;
    Game_Map.prototype.roundXWithDirection = function(x, d) {
        if (localHalfPositionCount > 0) {
            return this.roundHalfXWithDirection(x, d);
        } else {
            return _Game_Map_roundXWithDirection.apply(this, arguments);
        }
    };

    var _Game_Map_roundYWithDirection = Game_Map.prototype.roundYWithDirection;
    Game_Map.prototype.roundYWithDirection = function(y, d) {
        if (localHalfPositionCount > 0) {
            return this.roundHalfYWithDirection(y, d);
        } else {
            return _Game_Map_roundYWithDirection.apply(this, arguments);
        }
    };

    Game_Map.prototype.roundHalfXWithDirection = function(x, d) {
        return this.roundX(x + (d === 6 ? 0.5 : d === 4 ? -0.5 : 0));
    };

    Game_Map.prototype.roundHalfYWithDirection = function(y, d) {
        return this.roundY(y + (d === 2 ? 0.5 : d === 8 ? -0.5 : 0));
    };

    Game_Map.prototype.isHalfPos = function(value) {
        return value !== Math.floor(value);
    };

    var _Game_Map_tileId = Game_Map.prototype.tileId;
    Game_Map.prototype.tileId = function(x, y, z) {
        arguments[0] = Math.floor(arguments[0] + 0.5);
        arguments[1] = Math.floor(arguments[1] + 0.5);
        return _Game_Map_tileId.apply(this, arguments);
    };

    //=============================================================================
    // Game_CharacterBase
    //  半歩移動の判定処理を追加定義します。
    //=============================================================================
    var _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        var alias = _Game_CharacterBase_isMapPassable.bind(this);
        var result = true;
        var halfPositionCount = localHalfPositionCount;
        localHalfPositionCount = 0;
        if (!this.isHalfMove()) {
            result = alias(x, y, d);
        } else if (this.isHalfPosX(x) && this.isHalfPosY(y)) {
            if (d === 8) {
                var y1      = $gameMap.roundHalfYWithDirection(y, d);
                var xLeft1  = $gameMap.roundHalfXWithDirection(x, 4);
                var xRight1 = $gameMap.roundHalfXWithDirection(x, 6);
                var y3      = $gameMap.roundHalfYWithDirection(y, 2);
                if (alias(xLeft1, y1, 10-d) && alias(xRight1, y1, 10-d)) {
                    result = alias(xLeft1, y1, 6) || alias(xRight1, y1, 4);
                }
                result = result && alias(xLeft1, y3, d) && alias(xRight1, y3, d);
            }
        } else if (this.isHalfPosX(x)) {
            if (d === 2) {
                var y2      = $gameMap.roundYWithDirection(y, d);
                var xLeft2  = $gameMap.roundHalfXWithDirection(x, 4);
                var xRight2 = $gameMap.roundHalfXWithDirection(x, 6);
                if (alias(xLeft2, y2, 10-d) && alias(xRight2, y2, 10-d)) {
                    result = alias(xLeft2, y2, 6) || alias(xRight2, y2, 4);
                }
                result = result && alias(xLeft2, y, d) && alias(xRight2, y, d);
            }
        } else if (this.isHalfPosY(y)) {
            if (d !== 2) {
                var y4 = $gameMap.roundHalfYWithDirection(y, 2);
                result = alias(x, y4, d);
            }
        } else {
            if (d !== 8) {
                result = alias(x, y, d);
            }
        }
        localHalfPositionCount = halfPositionCount;
        return result;
    };

    Game_CharacterBase.prototype.isHalfPosX = function(x) {
        if (!x) x = this._x;
        return $gameMap.isHalfPos(x);
    };

    Game_CharacterBase.prototype.isHalfPosY = function(y) {
        if (!y) y = this._y;
        return $gameMap.isHalfPos(y);
    };

    var _Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
    Game_CharacterBase.prototype.moveStraight = function(d) {
        if (this.isHalfMove()) {
            var prevX = this._x;
            var prevY = this._y;
            localHalfPositionCount++;
            _Game_CharacterBase_moveStraight.apply(this, arguments);
            localHalfPositionCount--;
            if (this.isMovementSucceeded()) {
                this._prevX = prevX;
                this._prevY = prevY;
            }
        } else {
            _Game_CharacterBase_moveStraight.apply(this, arguments);
        }
    };

    Game_CharacterBase.prototype.moveDiagonallyForRetry = function(horizon, vertical) {
        if (this.isMovementSucceeded()) return;
        this.moveDiagonally(horizon, vertical);
    };

    var _Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
    Game_CharacterBase.prototype.moveDiagonally = function(horizon, vertical) {
        if (this.isHalfMove()) {
            var prevX = this._x;
            var prevY = this._y;
            localHalfPositionCount++;
            _Game_CharacterBase_moveDiagonally.apply(this, arguments);
            localHalfPositionCount--;
            if (this.isMovementSucceeded()) {
                this._prevX = prevX;
                this._prevY = prevY;
            }
        } else {
            _Game_CharacterBase_moveDiagonally.apply(this, arguments);
        }
    };

    var _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        if (this.isHalfMove()) {
            localHalfPositionCount++;
            var result = _Game_CharacterBase_canPass.apply(this, arguments);
            localHalfPositionCount--;
            return result;
        } else {
            return _Game_CharacterBase_canPass.apply(this, arguments);
        }
    };

    var _Game_CharacterBase_canPassDiagonally = Game_CharacterBase.prototype.canPassDiagonally;
    Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horizon, vertical) {
        if (this.isHalfMove()) {
            localHalfPositionCount++;
            var result = _Game_CharacterBase_canPassDiagonally.apply(this, arguments);
            localHalfPositionCount--;
            return result;
        } else {
            return _Game_CharacterBase_canPassDiagonally.apply(this, arguments);
        }
    };

    var _Game_CharacterBase_isCollidedWithCharacters = Game_CharacterBase.prototype.isCollidedWithCharacters;
    Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
        var alias = _Game_CharacterBase_isCollidedWithCharacters.bind(this);
        return this.isCollidedForHalfMove(x, y, alias);
    };

    Game_CharacterBase.prototype.isCollidedForHalfMove = function(x, y, alias) {
        if (alias(x-0.5, y) ||
            alias(x    , y) ||
            alias(x+0.5, y)) {
            return true;
        }
        if (!paramEventThrough) {
            if (alias(x-0.5, y-0.5) ||
                alias(x    , y-0.5) ||
                alias(x+0.5, y-0.5) ||
                alias(x-0.5, y+0.5) ||
                alias(x    , y+0.5) ||
                alias(x+0.5, y+0.5)) {
                return true;
            }
        }
        return false;
    };

    Game_CharacterBase.prototype.getPrevX = function() {
        return this._prevX !== undefined ? this._prevX : this._x;
    };

    Game_CharacterBase.prototype.getPrevY = function() {
        return this._prevY !== undefined ? this._prevY : this._y;
    };

    Game_CharacterBase.prototype.resetPrevPos = function() {
        this._prevX = undefined;
        this._prevY = undefined;
    };

    Game_CharacterBase.prototype.isHalfMove = function() {
        return null;
    };

    var _Game_CharacterBase_checkEventTriggerTouchFront = Game_CharacterBase.prototype.checkEventTriggerTouchFront;
    if (paramEventThrough) {
        Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
            if (!this.isHalfMove()) {
                _Game_CharacterBase_checkEventTriggerTouchFront.apply(this, arguments);
                return;
            }
            var halfPositionCount = localHalfPositionCount;
            localHalfPositionCount = 0;
            var x2 = $gameMap.roundXWithDirection(this._x, d);
            var y2 = $gameMap.roundHalfYWithDirection(this._y, d);
            this.checkEventTriggerTouch(x2, y2);
            localHalfPositionCount = halfPositionCount;
        };
    } else {
        Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
            var halfPositionCount = localHalfPositionCount;
            localHalfPositionCount = 0;
            _Game_CharacterBase_checkEventTriggerTouchFront.apply(this, arguments);
            localHalfPositionCount = halfPositionCount;
        };
    }

    //=============================================================================
    // Game_Player
    //  8方向移動に対応させます。
    //=============================================================================
    var _Game_Player_locate = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.apply(this, arguments);
        this.resetPrevPos();
    };

    var _Game_Player_checkEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;
    Game_Player.prototype.checkEventTriggerThere = function(triggers) {
        if (!this.isHalfMove()) {
            _Game_Player_checkEventTriggerThere.apply(this, arguments);
            return;
        }
        if (this.canStartLocalEvents()) {
            var direction = this.direction();
            var x1 = this.x;
            var y1 = this.y;
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            var y2 = $gameMap.roundHalfYWithDirection(y1, direction);
            var y4 = $gameMap.roundYWithDirection(y1, direction);
            this.startMapEvent(x2, paramEventThrough ? y2 : y4, triggers, true);
            if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
                var x3 = $gameMap.roundXWithDirection(x2, direction);
                var y3 = $gameMap.roundYWithDirection(y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    };

    var _Game_Player_getInputDirection = Game_Player.prototype.getInputDirection;
    Game_Player.prototype.getInputDirection = function() {
        return paramDirection8Move ? Input.dir8 : _Game_Player_getInputDirection.apply(this, arguments);
    };

    var _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(d) {
        if (d % 2 !== 0 && d !== 5) {
            this.executeDiagonalMove(d);
        } else {
            _Game_Player_executeMove.apply(this, arguments);
            if (!this.isMovementSucceeded() && this.isHalfMove() && paramAvoidCorner && !$gameTemp.isDestinationValid()) {
                this.executeMoveRetry(d);
            }
        }
    };

    Game_Player.prototype.executeMoveRetry = function(d) {
        var x2 = $gameMap.roundXWithDirection(this.x, d);
        var y2 = $gameMap.roundYWithDirection(this.y, d);
        if (!this.isCollidedWithCharacters(x2, y2)) {
            if (d === 2 || d === 8) {
                this.moveDiagonallyForRetry(4, d);
                this.moveDiagonallyForRetry(6, d);
            }
            if (d === 4 || d === 6) {
                this.moveDiagonallyForRetry(d, 2);
                this.moveDiagonallyForRetry(d, 8);
            }
        }
    };

    Game_Player.prototype.executeDiagonalMove = function(d) {
        var horizon  = d / 3 <=  1 ? d + 3 : d - 3;
        var vertical = d % 3 === 0 ? d - 1 : d + 1;
        var x2 = $gameMap.roundXWithDirection(this.x, horizon);
        var y2 = $gameMap.roundYWithDirection(this.y, vertical);
        if (this.isCollidedWithCharacters(x2, this.y) || this.isCollidedWithCharacters(this.x, y2)) {
            return;
        }
        this.moveDiagonally(horizon, vertical);
        if (!this.isMovementSucceeded()) {
            this.moveStraight(horizon);
        }
        if (!this.isMovementSucceeded()) {
            this.moveStraight(vertical);
        }
    };

    Game_Player.prototype.resetPrevPos = function() {
        Game_CharacterBase.prototype.resetPrevPos.call(this);
        this.followers().forEach(function (follower) {
            follower.resetPrevPos();
        }.bind(this));
    };

    //=============================================================================
    // Game_Event
    //  半歩移動用の接触処理を定義します。
    //=============================================================================
    var _Game_Event_isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
    Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
        var alias = _Game_Event_isCollidedWithPlayerCharacters.bind(this);
        return this.isCollidedForHalfMove(x, y, alias);
    };

    var _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        var result = _Game_Event_isCollidedWithEvents.apply(this, arguments);
        if (result) {
            var events = $gameMap.eventsXyNt(x, y);
            return !(events.length === 1 && events[0] === this);
        }
        return result;
    };

    //=============================================================================
    // Game_Follower
    //  追従処理を半歩移動に対応させます。
    //=============================================================================
    var _Game_Follower_chaseCharacter = Game_Follower.prototype.chaseCharacter;
    Game_Follower.prototype.chaseCharacter = function(character) {
        if ($gamePlayer.followers().areGathering() || $gamePlayer.isInVehicle()) {
            character.resetPrevPos();
            _Game_Follower_chaseCharacter.apply(this, arguments);
        } else {
            var sx = this.deltaXFrom(character.getPrevX());
            var sy = this.deltaYFrom(character.getPrevY());
            if (sx !== 0 && sy !== 0) {
                this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
            } else if (sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            } else if (sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
            this.setMoveSpeed($gamePlayer.realMoveSpeed());
        }
    };

    //=============================================================================
    // Game_Character
    //  移動ルート強制中は半歩移動を無効にします。
    //=============================================================================
    Game_Character.prototype.isHalfMove = function() {
        return ($gameSystem.canHalfMove() && (!this._moveRouteForcing || !paramDisableForcing)) || this.isHalfPosX() || this.isHalfPosY();
    };

    //=============================================================================
    // Game_Player
    //  乗り物搭乗中は半歩移動を無効にします。
    //=============================================================================
    Game_Player.prototype.isHalfMove = function() {
        return Game_Character.prototype.isHalfMove.call(this) && !this.isInVehicle();
    };

    //=============================================================================
    // Game_Vehicle
    //  乗り物の半歩移動は無効
    //=============================================================================
    Game_Vehicle.prototype.isHalfMove = function() {
        return false;
    };

    //=============================================================================
    // Game_Follower
    //  フォロワーの半歩移動はプレイヤーに依存します。
    //=============================================================================
    Game_Follower.prototype.isHalfMove = function() {
        return $gamePlayer.isHalfMove() || this.isHalfPosX() || this.isHalfPosY();
    };
})();

