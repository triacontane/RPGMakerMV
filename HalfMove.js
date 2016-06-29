//=============================================================================
// HalfMove.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.3 2016/06/30 タッチ操作によるマップ移動でイベント起動できない場合がある問題を修正
// 1.4.2 2016/06/08 PD_8DirDash.jsと組み合わせて斜め移動グラフィックを反映するよう修正
// 1.4.1 2016/05/20 ダメージ床や茂みで上半分のみ接している場合は無効にするよう変更
// 1.4.0 2016/05/20 トリガー領域を上下左右で細かく指定できる機能を追加
//                  英名のプラグインコマンドが正しく機能していなかった問題を修正
// 1.3.0 2016/05/16 タイルの下半分のみ通行不可にできるような地形タグとリージョンIDの指定を追加
//                  イベントごとにトリガー拡大を設定できる機能を追加
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
 * @param LowerNpTerrainTag
 * @desc 下半分のタイルのみ通行不可となる地形タグです。0を指定すると無効になります。
 * @default 0
 *
 * @param LowerNpRegionId
 * @desc 下半分のタイルのみ通行不可となるリージョンIDです。0を指定すると無効になります。
 * @default 0
 *
 * @help Moving distance in half.
 *
 * Plugin command
 * ・HALF_MOVE_DISABLE
 * Disable half move.
 *
 * ・HALF_MOVE_ENABLE
 * Enable half move.
 *
 * Note(Event Editor)
 * <HMHalfDisable> -> Disable half move.
 * <HMThroughDisable> -> Disable half through.
 * <HMTriggerExpansion:ON> -> Expansion trigger area ON
 * <HMTriggerExpansion:OFF> -> Expansion trigger area OFF
 * <HMExpansionArea:1,1.1,1> -> Expansion trigger area(down,left,right,up)
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
 * @desc 直進中にマップの角に引っ掛かった場合、斜め移動に切り替えて再試行します。進行方向に起動可能なイベントがある場合は無効です。
 * @default ON
 *
 * @param 斜め移動中減速
 * @desc 斜め移動中の歩行速度が0.8倍になります。
 * @default OFF
 *
 * @param トリガー拡大
 * @desc イベントの起動領域を拡張します。プライオリティによって拡張領域が異なります。
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
 * @param 下半分移動不可地形
 * @desc 下半分のタイルのみ通行不可となる地形タグです。0を指定すると無効になります。
 * @default 0
 *
 * @param 下半分移動不可Region
 * @desc 下半分のタイルのみ通行不可となるリージョンIDです。0を指定すると無効になります。
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
 * ・HALF_MOVE_DISABLE
 * 半歩移動を一時的に禁止します。この情報はセーブデータに含まれます。
 * 特定のイベント等で禁止したい場合等に使用します。
 *
 * ・半歩移動許可
 * ・HALF_MOVE_ENABLE
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
 * 対象イベントのトリガー拡大の有無を個別に設定します。
 * 設定がない場合は、パラメータ「トリガー拡大」の値が適用されます。
 * <HMトリガー拡大:ON>
 * <HMトリガー拡大:OFF>
 *
 * ・トリガー拡大をONにした場合の仕様
 * プライオリティが「通常キャラと同じ」かつイベントすり抜けが有効な場合
 * 　左右に半マスずつ起動可能領域が拡張されます。
 *
 * 上記以外の場合、個別にトリガー領域を設定することができます。
 * 以下のとおり記述してください。
 * // 下、左、右、上方向にそれぞれ1マス、2マス、3マス、4マス拡大したい場合
 * <HM拡大領域:1,2.3,4>
 *
 * // 下、左、右、上方向にそれぞれ0.5マス、1マス、1マス、0.5マス拡大したい場合
 * <HM拡大領域:0.5,1.1,0.5>
 *
 * 何も記述しないと、上下左右に半マスずつトリガー領域が拡張されます。
 *
 * 注意！
 * 対象イベントの領域が拡大する以下のタグは廃止になりました。
 * <HM横幅:2>
 * <HMWidth:2>
 * <HM高さ:3>
 * <HMHeight:3>
 *
 * PD_8DirDash.jsと組み合わせると、半歩移動に
 * グラフィック変更を伴う8方向移動機能が反映されます。
 *
 * 配布元：http://pixeldog.x.fc2.com/material_script.html
 *
 * 当該プラグインを使用する場合は、配布元の規約をご確認ください。
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

    var getArgArrayFloat = function (args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseFloat(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgArrayString = function (args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharacters(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharacters = function(text) {
        if (text === null || text === undefined) {
            text = '';
        }
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
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
    var paramLowerCpTerrainTag  = getParamNumber(['LowerNpTerrainTag', '下半分移動不可地形'], 0);
    var paramLowerCpRegionId    = getParamNumber(['LowerNpRegionId', '下半分移動不可Region'], 0);

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
            case 'HALF_MOVE_DISABLE':
                $gameSystem.setEnableHalfMove(false);
                break;
            case '半歩移動許可' :
            case 'HALF_MOVE_ENABLE':
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

    Game_Map.prototype.eventsXyUnitNt = function(x, y) {
        return this.events().filter(function(event) {
            return event.posUnitNt(x, y);
        });
    };

    Game_Map.prototype.isUpperNp = function(x, y) {
        return (paramUpperNpTerrainTag > 0 && paramUpperNpTerrainTag === this.terrainTag(x, y)) ||
            (paramUpperNpRegionId > 0 && paramUpperNpRegionId === this.regionId(x, y));
    };

    Game_Map.prototype.isLowerNp = function(x, y) {
        return (paramLowerCpTerrainTag > 0 && paramLowerCpTerrainTag === this.terrainTag(x, y)) ||
            (paramLowerCpRegionId > 0 && paramLowerCpRegionId === this.regionId(x, y));
    };

    var _Game_Map_checkLayeredTilesFlags = Game_Map.prototype.checkLayeredTilesFlags;
    Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
        var result = false;
        if (this.isHalfPos(x)) {
            result = this.checkLayeredTilesFlags(x + Game_Map.tileUnit, y, bit);
            result = result || this.checkLayeredTilesFlags(x - Game_Map.tileUnit, y, bit);
        } else if (this.isHalfPos(y)) {
            result = this.checkLayeredTilesFlags(x, y + Game_Map.tileUnit, bit);
        } else {
            result = _Game_Map_checkLayeredTilesFlags.apply(this, arguments);
        }
        return result;
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
            var x5  = $gameMap.roundXWithDirection(x, d);
            var y5  = $gameMap.roundYWithDirection(y, d);
            result = alias(x, y, d) && !$gameMap.isLowerNp(x5, y5);
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
        if (this.isHalfMove()) {
            result = result && !this.isUpperNoPassable(x, y, d) && !this.isLowerNoPassable(x, y, d);
        }
        localHalfPositionCount = halfPositionCount;
        return result;
    };

    Game_CharacterBase.prototype.isUpperNoPassable = function(x, y, d) {
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

    Game_CharacterBase.prototype.isLowerNoPassable = function(x, y, d) {
        var result = false;
        if (d === 8) {
            if (!this.isHalfPosY(y)) {
                if (this.isHalfPosX(x)) {
                    var xLeft1  = $gameMap.roundHalfXWithDirection(x, 4);
                    var xRight1 = $gameMap.roundHalfXWithDirection(x, 6);
                    result = $gameMap.isLowerNp(xLeft1, y) || $gameMap.isLowerNp(xRight1, y);
                } else {
                    result = $gameMap.isLowerNp(x, y);
                }
            }
        } else if (d === 4 || d === 6) {
            if (!this.isHalfPosY(x) && !this.isHalfPosX(y)) {
                var x1  = $gameMap.roundNoHalfXWithDirection(x, d);
                return $gameMap.isLowerNp(x1, y);
            }
        } else {
            if (this.isHalfPosY(y)) {
                var y2  = $gameMap.roundHalfYWithDirection(y, d);
                if (this.isHalfPosX(x)) {
                    var xLeft2  = $gameMap.roundHalfXWithDirection(x, 4);
                    var xRight2 = $gameMap.roundHalfXWithDirection(x, 6);
                    result = $gameMap.isLowerNp(xLeft2, y2) || $gameMap.isLowerNp(xRight2, y2);
                } else {
                    result = $gameMap.isLowerNp(x, y2);
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
        var prevDirection = this.direction();
        this.moveDiagonally(horizon, vertical);
        if (!this.isMovementSucceeded()) this.setDirection(prevDirection);
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
        return result ? true : this.isCollidedWithEventsForHalfMove(x, y);
    };

    Game_CharacterBase.prototype.isCollidedWithEventsForHalfMove = function(x, y) {
        var events = $gameMap.eventsXyUnitNt(x, y);
        var result = false;
        events.forEach(function(event) {
            if (event.isNormalPriority() && !event.isHalfThrough(y)) {
                this.collideToEvent(event);
                result = true;
            }
        }.bind(this));
        return result;
    };

    Game_CharacterBase.prototype.collideToEvent = function(target) {};

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
        var halfPositionCount = localHalfPositionCount;
        localHalfPositionCount = 0;
        _Game_CharacterBase_checkEventTriggerTouchFront.apply(this, arguments);
        localHalfPositionCount = halfPositionCount;
    };

    Game_CharacterBase.prototype.getDistanceForHalfMove = function(character) {
        return $gameMap.distance(this.x, this.y, character.x, character.y);
    };

    //=============================================================================
    // Game_Character
    //  タッチ移動の動作を調整します。
    //=============================================================================
    var _Game_Character_findDirectionTo = Game_Character.prototype.findDirectionTo;
    Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
        var halfPositionCount = localHalfPositionCount;
        localHalfPositionCount = 0;
        var result = _Game_Character_findDirectionTo.apply(this, arguments);
        localHalfPositionCount = halfPositionCount;
        return result;
    };

    //=============================================================================
    // Game_Player
    //  8方向移動に対応させます。
    //=============================================================================
    var _Game_Player_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.apply(this, arguments);
        this._testEventStart = false;
    };

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
        if (!$gameMap.isEventRunning()) {
            $gameMap.events().forEach(function(event) {
                if (event.isTriggerExpansion(x, y) && event.isTriggerIn(triggers) &&
                    event.isNormalPriority() === normal && (event.isCollidedFromPlayer() || !event.isNormalPriority())) {
                    event.start();
                }
            });
        }
    };

    var _Game_Player_startMapEvent2 = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
        if (normal && this.isHalfMove()) {
            var d = this.direction();
            if (!this.canPass(this.x, this.y, d)) {
                _Game_Player_startMapEvent2.apply(this, arguments);
                arguments[0] = $gameMap.roundHalfXWithDirection(x, 10 - d);
                arguments[1] = $gameMap.roundHalfYWithDirection(y, 10 - d);
                _Game_Player_startMapEvent2.apply(this, arguments);
            }
        } else {
            _Game_Player_startMapEvent2.apply(this, arguments);
        }
    };

    var _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        var result = _Game_Player_triggerTouchAction.apply(this, arguments);
        if (!result && $gameTemp.isDestinationValid()) {
            var direction = this.direction();
            var x1 = this.x;
            var y1 = this.y;
            var x2 = $gameMap.roundHalfXWithDirection(x1, direction);
            var y2 = $gameMap.roundHalfYWithDirection(y1, direction);
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            var destX = $gameTemp.destinationX();
            var destY = $gameTemp.destinationY();
            if (Math.abs(destX - x2) <= Game_Map.tileUnit && Math.abs(destY - y2) <= Game_Map.tileUnit) {
                return this.triggerTouchActionD2(x2, y2);
            } else if (Math.abs(destX - x3) <= Game_Map.tileUnit && Math.abs(destY - y3) <= Game_Map.tileUnit) {
                return this.triggerTouchActionD3(x2, y2);
            }
        }
        return result;
    };

    Game_Player.prototype.isStartingPreparedMapEvent = function(x, y) {
        $gameMap.events().forEach(function (event) {
            event.resetStartingPrepared();
        });
        this._testEventStart = true;
        this.startMapEvent(x, y, [0, 1, 2], true);
        if ($gameMap.isCounter(x, y)) {
            var x1 = $gameMap.roundXWithDirection(x, this.direction());
            var y1 = $gameMap.roundYWithDirection(y, this.direction());
            this.startMapEvent(x1, y1, [0], true);
        }
        this._testEventStart = false;
        return $gameMap.events().some(function (event) {
            return event.isStartingPrepared();
        });
    };

    Game_Player.prototype.isTestEventStart = function() {
        return !!this._testEventStart;
    };

    Game_Player.prototype.executeMoveRetry = function(d) {
        var x2 = $gameMap.roundXWithDirection(this.x, d);
        var y2 = $gameMap.roundYWithDirection(this.y, d);
        if (!this.isStartingPreparedMapEvent(x2, y2)) {
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

    Game_Player.prototype.isCollidedWithEventsForHalfMove = function(x, y) {
        $gameMap.events().forEach(function (event) {
            event.setCollidedFromPlayer(false);
        });
        return Game_CharacterBase.prototype.isCollidedWithEventsForHalfMove.call(this, x, y);
    };

    Game_Player.prototype.collideToEvent = function(target) {
        target.setCollidedFromPlayer(true);
    };

    //=============================================================================
    // Game_Event
    //  半歩移動用の接触処理を定義します。
    //=============================================================================
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._halfDisable      = getMetaValues(this.event(), ['HalfDisable', '半歩禁止']);
        this._throughDisable   = getMetaValues(this.event(), ['ThroughDisable', 'すり抜け禁止']);
        this._eventWidth       = getArgNumber(getMetaValues(this.event(), ['Width', '横幅']), 0);
        this._eventHeight      = getArgNumber(getMetaValues(this.event(), ['Height', '高さ']), 0);
        var metaValue = getMetaValues(this.event(), ['TriggerExpansion', 'トリガー拡大']);
        this._triggerExpansion = metaValue ? getArgBoolean(metaValue) : paramTriggerExpansion;
    };

    var _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.apply(this, arguments);
        this._expansionArea = this.getExpansionArea();
    };

    Game_Event.prototype.getExpansionArea = function() {
        var metaValue = getMetaValues(this.event(), ['ExpansionArea', '拡大領域']);
        if(this.isNormalPriority() && !this.isThroughDisable()) {
            return [0, 0.5, 0.5, 0];
        } else if (metaValue) {
            return getArgArrayFloat(metaValue, 0);
        } else {
            return [0.5, 0.5, 0.5, 0.5];
        }
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

    var _Game_Event_checkEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;
    Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
        _Game_Event_checkEventTriggerTouch.apply(this, arguments);
        if ($gameMap.isEventRunning()) return;
        if (this._trigger === 2 && $gamePlayer.posUnit(x, y)) {
            if (this.isTriggerExpansion(x, y) && !this.isJumping() && this.isNormalPriority() &&
                this.getDistanceForHalfMove($gamePlayer) <= 1) {
                this.start();
            }
        }
    };

    var _Game_Event_checkEventTriggerTouch2 = Game_Event.prototype.checkEventTriggerTouch;
    Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
        var d = this.direction();
        _Game_Event_checkEventTriggerTouch2.apply(this, arguments);
        arguments[0] = $gameMap.roundHalfXWithDirection(x, 10 - d);
        arguments[1] = $gameMap.roundHalfYWithDirection(y, 10 - d);
        _Game_Event_checkEventTriggerTouch2.apply(this, arguments);
    };

    var _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        if (!$gamePlayer.isTestEventStart()) {
            _Game_Event_start.apply(this, arguments);
        } else {
            var list = this.list();
            if (list && list.length > 1) {
                this._startingPrepared = true;
            }
        }
    };

    Game_Event.prototype.isStartingPrepared = function() {
        return this._startingPrepared;
    };

    Game_Event.prototype.resetStartingPrepared = function() {
        this._startingPrepared = false;
    };

    Game_Event.prototype.isTriggerExpansion = function(x, y) {
        return this._triggerExpansion && this.isInExpansionArea(x, y);
    };

    Game_Event.prototype.isInExpansionArea = function(x, y) {
        if (this.y + this._expansionArea[0] < y) {
            return false;
        } else if (this.x - this._expansionArea[1] > x) {
            return false;
        } else if (this.x + this._expansionArea[2] < x) {
            return false;
        } else if (this.y - this._expansionArea[3] > y) {
            return false;
        }
        return true;
    };

    Game_Event.prototype.isCollidedFromPlayer = function() {
        return this._collidedFromPlayer;
    };

    Game_Event.prototype.setCollidedFromPlayer = function(value) {
        this._collidedFromPlayer = value;
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

