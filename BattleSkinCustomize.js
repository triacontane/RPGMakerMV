//=============================================================================
// BattleSkinCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc バトル画面独自設計支援プラグイン
 * @author トリアコンタン
 *
 * @param PコマンドX座標
 * @desc パーティコマンドのウィンドウX座標
 * 指定しない場合はデフォルト位置になります。
 * @default
 *
 * @param PコマンドY座標
 * @desc パーティコマンドのウィンドウX座標
 * 指定しない場合はデフォルト位置になります。
 * @default
 *
 * @param AコマンドX座標
 * @desc アクターコマンドのウィンドウX座標
 * 指定しない場合はデフォルト位置になります。
 * @default
 *
 * @param AコマンドY座標
 * @desc アクターコマンドのウィンドウY座標
 * 指定しない場合はデフォルト位置になります。
 * @default
 *
 * @help 従来のステータスウィンドウを排除して
 * アクター情報の表示内容や位置を自由に設計できるようになります。
 * 戦闘システムには影響を与えません。
 *
 * 具体的には戦闘画面のステータスウィンドウに代わって
 * アクターごとに個別の「ステータス表示領域」という領域が用意されます。
 * ソースコードのユーザ定義領域で定義している値を調整することで
 * 「ステータス表示領域」の位置や外観、表示内容をカスタマイズできます。
 *
 * 従来のフロントビュー、サイドビューという概念にとらわれず
 * 好きな場所に好きなパーツを配置して独自の戦闘画面が設計できます。
 *
 * 注意！
 * 必要な画像はすべて「/img/pictures/」以下にpng形式で配置してください。
 * なお、ユーザ定義領域で指定するときは拡張子は不要です。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var settings = {
        /* party:パーティメンバーごとのステータス表示領域の座標(左上)です。 */
        party:[
            {x:40, y:350},
            {x:420, y:350},
            {x:40, y:490},
            {x:420, y:490},
        ],
        /* size:ステータス表示領域の横幅と高さです。 */
        size:{width:360, height:128},
        /*
         * 要素ごとのステータス表示領域内での座標(左上)です。
         * 座標に負の値を設定すると描画されなくなります。
         *
         * hp:HP
         * mp:MP
         * tp:TP
         * statesIcon:ステートアイコン
         * name:アクター名称
         * face:アクター顔グラフィック
         * class:アクターの職業名称
         * level:アクターのレベル
         */
        items:{
            /*
             * visible:表示フラグ
             * x:X座標
             * y:Y座標
             * digit:有効桁数
             * max:最大値表示フラグ(true:000/000 false:000)
             * zeroPadding:ゼロ埋めフラグ
             * width:横幅
             * height:高さ
             */
            hp:{
                label:{visible:true, x:4, y:30},
                value:{visible:true, x:36, y:30, digit:4, max:true, zeroPadding:true},
                gauge:{visible:true, x:168, y:40, width:100, height:8},
            },
            mp:{
                label:{visible:true, x:4, y:62},
                value:{visible:true, x:36, y:62, digit:4, max:true, zeroPadding:true},
                gauge:{visible:true, x:168, y:72, width:100, height:8},
            },
            tp:{
                label:{visible:true, x:4, y:94},
                value:{visible:true, x:36, y:94, digit:4, max:true, zeroPadding:true},
                gauge:{visible:true, x:168, y:104, width:100, height:8},
            },
            statesIcon:{visible:true, x:288, y:0},
            name:{visible:true, x:4, y:0},
            class:{visible:true, x:160, y:0},
            level:{visible:true, x:220, y:0},
            face:{visible:true, x:280, y:38, scales:0.5},
        },
        /* visual:表示情報です。*/
        visual:{
            backGround:{
                /* ステータス表示領域の背景画像ファイル名です。 */
                fileName:'',
                /* ステータス表示領域に画像を使わない場合の背景色です */
                color:'rgba(0,0,0,0.5)'
            },
            font:{
                face:'GameFont',
                size:28
            }
        }
        /* values:表示内容です。 */
    };
    var pluginName = 'BattleSkinCustomize';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (value == null) return null;
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var paramPCommandX = getParamNumber(['PCommandX', 'PコマンドX座標'], 0);
    var paramPCommandY = getParamNumber(['PCommandY', 'PコマンドY座標'], 0);
    var paramACommandX = getParamNumber(['ACommandX', 'AコマンドX座標'], 0);
    var paramACommandY = getParamNumber(['ACommandY', 'AコマンドY座標'], 0);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandBattleSkinCustomize(command, args);
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
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandBattleSkinCustomize = function (command, args) {
        switch (getCommandName(command)) {
            case 'XXXXX' :
                break;
        }
    };

    //=============================================================================
    // BattleManager
    //  ステータス表示領域を更新します。
    //=============================================================================
    var _BattleManager_refreshStatus = BattleManager.refreshStatus;
    BattleManager.refreshStatus = function() {
        _BattleManager_refreshStatus.apply(this, arguments);
        this._spriteset.refreshStatus();
    };

    //=============================================================================
    // Scene_Battle
    //  ステータス表示領域を作成、更新します。
    //=============================================================================
    var _Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.apply(this, arguments);
        this._statusWindow.hide();
    };

    var _Scene_Battle_refreshStatus = Scene_Battle.prototype.refreshStatus;
    Scene_Battle.prototype.refreshStatus = function() {
        _Scene_Battle_refreshStatus.apply(this, arguments);
        this._spriteset.refreshStatus();
    };

    if (Utils.isOptionValid('test') || Utils.isOptionValid('btest')) {
        var _Scene_Base_update = Scene_Base.prototype.update;
        var originalTitle = null;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update.apply(this, arguments);
            if (!originalTitle) originalTitle = document.title;
            document.title  = originalTitle +
                    ' 現在のポインタ座標(テストプレーのみ表示されます) ' +
                    'X:[' + TouchInput.x.padZero(3) + '] ' +
                    'Y:[' + TouchInput.y.padZero(3) + ']';
        };

        TouchInput._onMouseMove = function(event) {
            var x = Graphics.pageToCanvasX(event.pageX);
            var y = Graphics.pageToCanvasY(event.pageY);
            this._onMove(x, y);
        };
    }

    //=============================================================================
    // Window_PartyCommand
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    var _Window_PartyCommand_initialize = Window_PartyCommand.prototype.initialize;
    Window_PartyCommand.prototype.initialize = function() {
        _Window_PartyCommand_initialize.apply(this, arguments);
        if (paramPCommandX !== null) this.x = paramPCommandX;
        if (paramPCommandY !== null) this.y = paramPCommandY;
    };

    //=============================================================================
    // Window_ActorCommand
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    var _Window_ActorCommand_initialize = Window_ActorCommand.prototype.initialize;
    Window_ActorCommand.prototype.initialize = function() {
        _Window_ActorCommand_initialize.apply(this, arguments);
        if (paramACommandX !== null) this.x = paramACommandX;
        if (paramACommandY !== null) this.y = paramACommandY;
    };

    //=============================================================================
    // Spriteset_Battle
    //  ステータス表示領域を追加定義します。
    //=============================================================================
    Spriteset_Battle.prototype.createUpperLayer = function() {
        Spriteset_Base.prototype.createUpperLayer.apply(this, arguments);
        this.createIndividualStatus();
    };

    Spriteset_Battle.prototype.createIndividualStatus = function() {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        this._individualStatusContainer = new Sprite();
        this._individualStatusContainer.setFrame(x, y, width, height);
        for (var i = 0, n = $gameParty.maxBattleMembers(); i < n; i++) {
            this._individualStatusContainer.addChild(new Sprite_IndividualStatus(i));
        }
        this.addChild(this._individualStatusContainer);
    };

    Spriteset_Battle.prototype.refreshStatus = function() {
        this._individualStatusContainer.children.forEach(function(statusSprite) {
            statusSprite.refresh();
        });
    };

    //=============================================================================
    // Sprite_IndividualStatus
    //  ステータス表示領域です。
    //=============================================================================
    function Sprite_IndividualStatus() {
        this.initialize.apply(this, arguments);
    }

    Sprite_IndividualStatus.prototype = Object.create(Sprite_Base.prototype);
    Sprite_IndividualStatus.prototype.constructor = Sprite_IndividualStatus;

    //=============================================================================
    // 描画関係の関数をWindow_Baseから継承
    //=============================================================================
    var inheritFunctions = [
        'textColor',
        'normalColor',
        'crisisColor',
        'systemColor',
        'deathColor',
        'gaugeBackColor',
        'hpGaugeColor1',
        'hpGaugeColor2',
        'mpGaugeColor1',
        'mpGaugeColor2',
        'tpGaugeColor1',
        'tpGaugeColor2',
        'hpColor',
        'mpColor',
        'tpColor',
        'partyMemberName',
        'drawFace',
        'drawActorFace',
        'drawText',
        'drawActorHp',
        'drawActorMp',
        'drawActorTp',
        'drawActorSimpleStatus',
        'drawActorName',
        'drawActorLevel',
        'drawActorIcons',
        'drawActorClass',
        'changeTextColor',
        'resetTextColor',
        'drawGauge',
        'drawCurrentAndMax',
        'textWidth',
        'drawIcon',
    ];
    inheritFunctions.forEach(function(functionName) {
        Sprite_IndividualStatus.prototype[functionName] = Window_Base.prototype[functionName];
    });

    /**
     * @property contents
     * @type Bitmap
     */
    Object.defineProperty(Sprite_IndividualStatus.prototype, 'contents', {
        get: function() {
            return this._contentsSprite.bitmap;
        },
        set: function(value) {
            this._contentsSprite.bitmap = value;
        },
        configurable: true
    });

    Sprite_IndividualStatus.prototype.initialize = function(actorIndex) {
        Sprite_Base.prototype.initialize.call(this);
        this._actorIndex = actorIndex;
        this.windowskin = ImageManager.loadSystem('Window');
        this.create();
        this.refresh();
    };

    Sprite_IndividualStatus.prototype.create = function() {
        this.createMain();
        this.createContents();
    };

    Sprite_IndividualStatus.prototype.createMain = function() {
        this.bitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this.bitmap.fillAll(settings.visual.backGround.color);
        this.x = settings.party[this._actorIndex].x;
        this.y = settings.party[this._actorIndex].y;
    };

    Sprite_IndividualStatus.prototype.createContents = function() {
        this._contentsSprite = new Sprite();
        this.addChild(this._contentsSprite);
        this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
    };

    Sprite_IndividualStatus.prototype.refresh = function() {
        var actor = this.getActor();
        if (!actor) {
            this.visible = false;
            return;
        }
        this.contents.clear();
        this.contents.fontSize = settings.visual.font.size;
        this.drawActorHp(actor);
        this.drawActorMp(actor);
        this.drawActorTp(actor);
        var name = settings.items.name;
        if (name.visible) this.drawActorName(actor, name.x, name.y, settings.size.width);
        var clazz = settings.items.class;
        if (clazz.visible) this.drawActorClass(actor, clazz.x, clazz.y, settings.size.width);
        var level = settings.items.level;
        if (level.visible) this.drawActorLevel(actor, level.x, level.y, settings.size.width);
        var statesIcon = settings.items.statesIcon;
        if (statesIcon.visible) this.drawActorIcons(actor, statesIcon.x, statesIcon.y, settings.size.width);
        var face = settings.items.face;
        if (face.visible) this.drawActorFace(actor, face.x, face.y);
    };

    Sprite_IndividualStatus.prototype.drawActorHp = function(actor) {
        var paramList = {
            gaugeColor1 : this.hpGaugeColor1(),
            gaugeColor2 : this.hpGaugeColor2(),
            rate        : actor.hpRate(),
            current     : actor.hp,
            max         : actor.mhp,
            valueColor  : this.hpColor(actor),
            label       : TextManager.hpA
        };
        this.drawActorParam(actor, settings.items.hp, paramList);
    };

    Sprite_IndividualStatus.prototype.drawActorMp = function(actor) {
        var paramList = {
            gaugeColor1 : this.mpGaugeColor1(),
            gaugeColor2 : this.mpGaugeColor2(),
            rate        : actor.mpRate(),
            current     : actor.mp,
            max         : actor.mmp,
            valueColor  : this.mpColor(actor),
            label       : TextManager.mpA
        };
        this.drawActorParam(actor, settings.items.mp, paramList);
    };

    Sprite_IndividualStatus.prototype.drawActorTp = function(actor) {
        var paramList = {
            gaugeColor1 : this.tpGaugeColor1(),
            gaugeColor2 : this.tpGaugeColor2(),
            rate        : actor.tpRate(),
            current     : actor.tp,
            max         : actor.maxTp(),
            valueColor  : this.tpColor(actor),
            label       : TextManager.tpA
        };
        this.drawActorParam(actor, settings.items.tp, paramList);
    };

    Sprite_IndividualStatus.prototype.drawActorLevel = function(actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 18, y, 36, 'right');
    };

    Sprite_IndividualStatus.prototype.drawActorParam = function(actor, paramItem, paramList) {
        var item = paramItem.gauge;
        if (item.x >= 0 && item.y >= 0) {
            var color1 = paramList.gaugeColor1;
            var color2 = paramList.gaugeColor2;
            this.drawGauge(item.x, item.y, item.width, paramList.rate, color1, color2, item.height);
        }
        item = paramItem.label;
        if (item.x >= 0 && item.y >= 0) {
            this.changeTextColor(this.systemColor());
            this.drawText(paramList.label, item.x, item.y, 44);
        }
        item = paramItem.value;
        if (item.x >= 0 && item.y >= 0) {
            this.drawCurrentAndMax(paramList.current, paramList.max, item, paramList.valueColor, this.normalColor());
        }
    };

    Sprite_IndividualStatus.prototype.drawCurrentAndMax = function(current, max, item, color1, color2) {
        var valueWidth = this.textWidth('0') * item.digit;
        var slashWidth = this.textWidth('/');
        var x = item.x;
        var x1 = x + valueWidth;
        var x2 = x1 + slashWidth;
        var y = item.y;
        this.changeTextColor(color1);
        this.drawText(item.zeroPadding ? current.padZero(item.digit) : current, x, y, valueWidth, 'right');
        if (item.max) {
            this.changeTextColor(color2);
            this.drawText('/', x1, y, slashWidth, 'right');
            this.drawText(item.zeroPadding ? max.padZero(item.digit) : max, x2, y, valueWidth, 'right');
        }
    };

    Sprite_IndividualStatus.prototype.drawGauge = function(x, y, width, rate, color1, color2, height) {
        var fillW = Math.floor(width * rate);
        this.contents.fillRect(x, y, width, height, this.gaugeBackColor());
        this.contents.gradientFillRect(x, y, fillW, height, color1, color2, false);
    };

    Sprite_IndividualStatus.prototype.drawFace = function(faceName, faceIndex, x, y) {
        var width  = Window_Base._faceWidth  * settings.items.face.scales;
        var height = Window_Base._faceHeight * settings.items.face.scales;
        var bitmap = ImageManager.loadFace(faceName);
        var sw = Window_Base._faceWidth;
        var sh = Window_Base._faceHeight;
        var sx = faceIndex % 4 * sw;
        var sy = Math.floor(faceIndex / 4) * sh;
        this.contents.blt(bitmap, sx, sy, sw, sh, x, y, width, height);
    };

    Sprite_IndividualStatus.prototype.getActor = function() {
        return $gameParty.battleMembers()[this._actorIndex];
    };

    Sprite_IndividualStatus.prototype.contentsWidth = function() {
        return settings.size.width;
    };

    Sprite_IndividualStatus.prototype.contentsHeight = function() {
        return settings.size.height;
    };

    Sprite_IndividualStatus.prototype.lineHeight = function() {
        return this.contents.fontSize;
    };

    Sprite_IndividualStatus.prototype.textPadding = function() {
        return 0;
    };
})();

