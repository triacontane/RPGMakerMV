//=============================================================================
// HalfMove.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/05/11 タイルの上半分のみ通行不可にできるような地形タグとリージョンIDの指定を追加
//                  歩数の増加およびエンカウント歩数とダメージ床を通常の歩数に合わせて調整できる機能を追加
// 1.1.0 2016/05/08 イベントごとに「すり抜け禁止」の可否を設定できる機能を追加
//                  トリガー関係の機能を拡張
//                  斜め移動時に減速する設定を追加
//                  カウンター属性のタイルに対して上から起動したときの判定が一部機能していなかったのを修正
// 1.0.1 2016/05/08 ループするマップの境界値にいる場合に一部の通行可能判定が誤っていたのを修正
//                  メモ欄にてイベントごとに半歩移動の可否を設定できる機能を追加
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
 * @param DiagonalSlow
 * @desc 斜め移動中の歩行速度が0.8倍になります。
 * @default OFF
 *
 * @param TriggerExpansion
 * @desc プライオリティが「通常キャラと同じ」イベントの起動領域を左右に半マス分だけ拡張します。
 * @default OFF
 *
 * @param AdjustmentRealStep
 * @desc 歩数が増加するタイミングが2歩につき1歩分となります。エンカウント歩数とダメージ床のタイミングも調整されます。
 * @default OFF
 *
 * @param UpperNpTerrainTag
 * @desc 上半分のタイルのみ通行不可となる地形タグです。0を指定すると無効になります。
 * @default 0
 *
 * @param UpperNpRegionId
 * @desc 上半分のタイルのみ通行不可となるリージョンIDです。0を指定すると無効になります。
 * @default 0
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
 * Note(Event Editor)
 * <HMHalfDisable> -> Disable half move.
 * <HMThroughDisable> -> Disable half through.
 * <HMWidth:2> -> Expansion event size(width)
 * <HMHeight:2> -> Expansion event size(height)
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
 * @param 斜め移動中減速
 * @desc 斜め移動中の歩行速度が0.8倍になります。
 * @default OFF
 *
 * @param トリガー拡大
 * @desc プライオリティが「通常キャラと同じ」イベントの起動領域を左右に半マス分だけ拡張します。
 * @default OFF
 *
 * @param 実歩数調整
 * @desc 歩数が増加するタイミングが2歩につき1歩分となります。エンカウント歩数とダメージ床のタイミングも調整されます。
 * @default OFF
 *
 * @param 上半分移動不可地形
 * @desc 上半分のタイルのみ通行不可となる地形タグです。0を指定すると無効になります。
 * @default 0
 *
 * @param 上半分移動不可Region
 * @desc 上半分のタイルのみ通行不可となるリージョンIDです。0を指定すると無効になります。
 * @default 0
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
 * イベントごとの拡張機能を利用するには、
 * イベントのメモ欄に以下の通り記述してください。
 *
 * 対象イベントが半歩移動しなくなります。
 * <HM半歩禁止>
 * <HMHalfDisable>
 *     
 * 対象イベントがすり抜けしなくなります。
 * <HMすり抜け禁止>
 * <HMThroughDisable>
 *
 * 対象イベントの領域が拡大します。半歩移動の場合、場所移動等のイベントを並べると
 * 間に入ったときに起動しないので、このタグで起動領域を拡張してください。
 * この機能はイベントのグラフィックには影響を与えません。
 * <HM横幅:2>   // イベントの横方向のサイズが2マスになります。
 * <HMWidth:2>  // イベントの横方向のサイズが2マスになります。
 * <HM高さ:3>   // イベントの縦方向のサイズが3マスになります。
 * <HMHeight:3> // イベントの縦方向のサイズが3マスになります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'HalfMove';
    var metaTagPrefix = 'HM';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg,  10) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDirection8Move     = getParamBoolean(['Direction8Move', '8方向移動']);
    var paramEventThrough       = getParamBoolean(['EventThrough', 'イベントすり抜け']);
    var paramDisableForcing     = getParamBoolean(['DisableForcing', '強制中無効']);
    var paramAvoidCorner        = getParamBoolean(['AvoidCorner', '角回避']);
    var paramDiagonalSlow       = getParamBoolean(['DiagonalSlow', '斜め移動中減速']);
    var paramTriggerExpansion   = getParamBoolean(['TriggerExpansion', 'トリガー拡大']);
    var paramAdjustmentRealStep = getParamBoolean(['AdjustmentRealStep', '実歩数調整']);
    var paramUpperNpTerrainTag  = getParamNumber(['UpperNpTerrainTag', '上半分移動不可地形'], 0);
    var paramUpperNpRegionId    = getParamNumber(['UpperNpRegionId', '上半分移動不可Region'], 0);

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
    Game_Map.tileUnit = 0.5;

    var _Game_Map_xWithDirection = Game_Map.prototype.xWithDirection;
    Game_Map.prototype.xWithDirection = function(x, d) {
        if (localHalfPositionCount > 0) {
            return x + (d === 6 ? Game_Map.tileUnit : d === 4 ? -Game_Map.tileUnit : 0);
        } else {
            return _Game_Map_xWithDirection.apply(this, arguments);
        }
    };

    var _Game_Map_yWithDirection = Game_Map.prototype.yWithDirection;
    Game_Map.prototype.yWithDirection = function(y, d) {
        if (localHalfPositionCount > 0) {
            return y + (d === 2 ? Game_Map.tileUnit : d === 8 ? -Game_Map.tileUnit : 0);
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
        return this.roundX(x + (d === 6 ? Game_Map.tileUnit : d === 4 ? -Game_Map.tileUnit : 0));
    };

    Game_Map.prototype.roundHalfYWithDirection = function(y, d) {
        return this.roundY(y + (d === 2 ? Game_Map.tileUnit : d === 8 ? -Game_Map.tileUnit : 0));
    };

    Game_Map.prototype.roundNoHalfXWithDirection = function(x, d) {
        return _Game_Map_roundXWithDirection.apply(this, arguments);
    };

    Game_Map.prototype.roundNoHalfYWithDirection = function(x, d) {
        return _Game_Map_roundYWithDirection.apply(this, arguments);
    };

    Game_Map.prototype.isHalfPos = function(value) {
        return value !== Math.floor(value);
    };

    var _Game_Map_tileId = Game_Map.prototype.tileId;
    Game_Map.prototype.tileId = function(x, y, z) {
        arguments[0] = Math.floor(arguments[0] + (1 - Game_Map.tileUnit));
        arguments[1] = Math.floor(arguments[1] + (1 - Game_Map.tileUnit));
        return _Game_Map_tileId.apply(this, arguments);
    };

    Game_Map.prototype.eventsXyUnitNt = function(x, y) {
        return this.events().filter(function(event) {
            return event.posUnitNt(x, y);
        });
    };

    Game_Map.prototype.isUpperNp = function(x, y) {
        return (paramUpperNpTerrainTag > 0 && paramUpperNpTerrainTag === this.terrainTag(x, y)) ||
            (paramUpperNpRegionId > 0 && paramUpperNpRegionId === this.regionId(x, y));
    };

    //=============================================================================
    // Game_CharacterBase
    //  半歩移動の判定処理を追加定義します。
    //=============================================================================
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this._halfDisable    = false;
        this._throughDisable = false;
        this._eventWidth     = null;
        this._eventHeight    = null;
    };

    var _Game_CharacterBase_pos = Game_CharacterBase.prototype.pos;
    Game_CharacterBase.prototype.pos = function(x, y) {
        if (this._eventWidth || this._eventHeight) {
            return this._x <= x && this._x + (this._eventWidth || 1) - 1 >= x &&
                this._y <= y && this._y + (this._eventHeight || 1) -1 >= y;
        } else {
            return _Game_CharacterBase_pos.apply(this, arguments);
        }
    };

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
                var y2      = $gameMap.roundNoHalfYWithDirection(y, d);
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
        result = result && !this.isUpperNp(x, y, d);
        localHalfPositionCount = halfPositionCount;
        return result;
    };

    Game_CharacterBase.prototype.isUpperNp = function(x, y, d) {
        var result = false;
        if (d === 8) {
            if (!this.isHalfPosY(y)) {
                if (this.isHalfPosX(x)) {
                    var xLeft1  = $gameMap.roundHalfXWithDirection(x, 4);
                    var xRight1 = $gameMap.roundHalfXWithDirection(x, 6);
                    result = $gameMap.isUpperNp(xLeft1, y) || $gameMap.isUpperNp(xRight1, y);
                } else {
                    result = $gameMap.isUpperNp(x, y);
                }
            }
        } else if (d === 4 || d === 6) {
            if (!this.isHalfPosY(x) && this.isHalfPosX(y)) {
                var x1  = $gameMap.roundNoHalfXWithDirection(x, d);
                var y1  = $gameMap.roundHalfYWithDirection(y, 2);
                return $gameMap.isUpperNp(x1, y1);
            }
        } else {
            var y2  = $gameMap.roundNoHalfYWithDirection(y, d);
            if (!this.isHalfPosY(y)) {
                if (this.isHalfPosX(x)) {
                    var xLeft2  = $gameMap.roundHalfXWithDirection(x, 4);
                    var xRight2 = $gameMap.roundHalfXWithDirection(x, 6);
                    result = $gameMap.isUpperNp(xLeft2, y2) || $gameMap.isUpperNp(xRight2, y2);
                } else {
                    result = $gameMap.isUpperNp(x, y2);
                }
            }
        }
        return result;
    };

    Game_CharacterBase.prototype.isHalfPosX = function(x) {
        if (x === undefined) x = this._x;
        return $gameMap.isHalfPos(x);
    };

    Game_CharacterBase.prototype.isHalfPosY = function(y) {
        if (y === undefined) y = this._y;
        return $gameMap.isHalfPos(y);
    };

    Game_CharacterBase.prototype.isMovingDiagonal = function() {
        return this._realX !== this._x && this._realY !== this._y;
    };

    var _Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
    Game_CharacterBase.prototype.distancePerFrame = function() {
        return _Game_CharacterBase_distancePerFrame.apply(this, arguments) *
            (paramDiagonalSlow && this.isMovingDiagonal() ? 0.8 : 1);
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

    Game_CharacterBase.prototype.posUnit = function(x, y) {
        var unit = Game_Map.tileUnit;
        return this._x >= x-unit && this._x <= x+unit && this._y >= y-unit && this._y <= y+unit;
    };

    Game_CharacterBase.prototype.posUnitNt = function(x, y) {
        return this.posUnit(x, y) && !this.isThrough();
    };

    Game_CharacterBase.prototype.posUnitHt = function(x, y) {
        return this.posUnit(x, y) && !this.isHalfThrough(y);
    };

    var _Game_CharacterBase_isCollidedWithEvents = Game_CharacterBase.prototype.isCollidedWithEvents;
    Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
        var result = _Game_CharacterBase_isCollidedWithEvents.apply(this, arguments);
        if (result) return true;
        var events = $gameMap.eventsXyUnitNt(x, y);
        return events.some(function(event) {
            return event.isNormalPriority() && !event.isHalfThrough(y);
        });
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

    Game_CharacterBase.prototype.isHalfThrough = function(y) {
        return this.isThroughDisable() && this.y !== y;
    };

    Game_CharacterBase.prototype.isThroughDisable = function() {
        return paramEventThrough && !this._throughDisable;
    };

    var _Game_CharacterBase_checkEventTriggerTouchFront = Game_CharacterBase.prototype.checkEventTriggerTouchFront;
    Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
        if (!this.isHalfMove()) {
            _Game_CharacterBase_checkEventTriggerTouchFront.apply(this, arguments);
            return;
        }
        var x2 = $gameMap.roundNoHalfXWithDirection(this._x, d);
        var y2 = $gameMap.roundHalfYWithDirection(this._y, d);
        this.checkEventTriggerTouch(x2, y2);
    };

    //=============================================================================
    // Game_Player
    //  8方向移動に対応させます。
    //=============================================================================
    var _Game_Player_locate = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function(x, y) {
        _Game_Player_locate.apply(this, arguments);
        this.resetPrevPos();
    };

    var _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function() {
        if (this._realStep === undefined) this._realStep = 0;
        this._realStep += (this.isHalfMove() ? Game_Map.tileUnit : 1);
        if (this.isHalfStep()) {
            Game_Character.prototype.increaseSteps.call(this);
        } else {
            _Game_Player_increaseSteps.apply(this, arguments);
        }
    };

    var _Game_Player_updateEncounterCount = Game_Player.prototype.updateEncounterCount;
    Game_Player.prototype.updateEncounterCount = function() {
        if (!this.isHalfStep()) {
            _Game_Player_updateEncounterCount.apply(this, arguments);
        }
    };

    Game_Player.prototype.isHalfStep = function() {
        return paramAdjustmentRealStep && this._realStep && Math.floor(this._realStep) !== this._realStep;
    };

    var _Game_Player_isOnDamageFloor = Game_Player.prototype.isOnDamageFloor;
    Game_Player.prototype.isOnDamageFloor = function() {
        return !this.isHalfStep() && _Game_Player_isOnDamageFloor.apply(this ,arguments);
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
            this.startMapEventForHalf(x2, y2, y4, triggers);
            if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
                var x3 = $gameMap.roundXWithDirection(x2, direction);
                var y3 = $gameMap.roundYWithDirection(direction === 2 ? y4 : y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    };

    Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
        if (this.canStartLocalEvents()) {
            var yHalf = $gameMap.roundHalfYWithDirection(y, this.direction());
            this.startMapEventForHalf(x, y, yHalf, [1,2]);
        }
    };

    Game_Player.prototype.startMapEventForHalf = function(x, y, yHalf, triggers) {
        var xStart = x - (paramTriggerExpansion ? Game_Map.tileUnit : 0);
        var xEnd   = x + (paramTriggerExpansion ? Game_Map.tileUnit : 0);
        if (!$gameMap.isEventRunning()) {
            $gameMap.events().forEach(function(event) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() &&
                    event.x >= xStart && event.x <= xEnd && event.y === (event.isThroughDisable() ? y : yHalf)) {
                    event.start();
                }
            });
        }
    };

    var _Game_Player_isCollided = Game_Player.prototype.isCollided;
    Game_Player.prototype.isCollided = function(x, y) {
        if (_Game_Player_isCollided.apply(this, arguments)) {
            return true;
        }
        if (this.isThrough()) {
            return false;
        }
        return this.posUnitHt(x, y) || this._followers.isSomeoneUnitCollidedCollided(x, y);
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
            if (!this.isMovementSucceeded() && this.isHalfMove() && paramAvoidCorner &&
                !$gameTemp.isDestinationValid() && !$gameMap.isEventRunning()) {
                this.executeMoveRetry(d);
            }
        }
    };

    var _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
        _Game_Player_startMapEvent.apply(this, arguments);
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
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._halfDisable    = getMetaValues(this.event(), ['HalfDisable', '半歩禁止']);
        this._throughDisable = getMetaValues(this.event(), ['ThroughDisable', 'すり抜け禁止']);
        this._eventWidth     = getArgNumber(getMetaValues(this.event(), ['Width', '横幅']), 0);
        this._eventHeight    = getArgNumber(getMetaValues(this.event(), ['Height', '高さ']), 0);
    };

    var _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        var result = _Game_Event_isCollidedWithEvents.apply(this, arguments);
        if (result) return true;
        var events = $gameMap.eventsXyUnitNt(x, y);
        return events.some(function(event) {
            return event !== this && !event.isHalfThrough(y);
        }.bind(this));
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
    // Game_Followers
    //  追従処理を半歩移動に対応させます。
    //=============================================================================
    Game_Followers.prototype.isSomeoneUnitCollidedCollided = function(x, y) {
        return this.visibleFollowers().some(function(follower) {
            return follower.posUnitHt(x, y);
        }, this);
    };

    //=============================================================================
    // Game_CharacterBase
    //  禁止フラグを確認します。
    //=============================================================================
    Game_CharacterBase.prototype.isHalfMove = function() {
        return !this._halfDisable && $gameSystem.canHalfMove();
    };

    //=============================================================================
    // Game_Character
    //  移動ルート強制中は半歩移動を無効にします。
    //=============================================================================
    Game_Character.prototype.isHalfMove = function() {
        return (Game_CharacterBase.prototype.isHalfMove.call(this) && (!this._moveRouteForcing || !paramDisableForcing)) ||
            this.isHalfPosX() || this.isHalfPosY();
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

