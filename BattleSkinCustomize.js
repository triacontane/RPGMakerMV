//=============================================================================
// BattleSkinCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/27 えのきふさん提供版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 独自バトル画面設計支援プラグイン
 * @author トリアコンタン
 *
 * @param 位置調整を行う
 * @desc 戦闘テストからウィンドウの位置調整を行います。
 * ドラッグ＆ドロップで位置を調整できます。
 * @default ON
 *
 * @param ウィンドウ透過
 * @desc ウィンドウが重なったときに透過表示します。
 * 他のプラグインで同機能を実現している場合は無効にしてください。
 * @default OFF
 *
 * @param グリッドサイズ
 * @desc ウィンドウ調整中に指定サイズでグリッドを表示します。
 * 0を指定すると非表示になります。
 * @default 48
 *
 * @help 従来のステータスウィンドウを排除して
 * アクター情報の表示内容や位置を自由に設計できるようになります。
 * 戦闘システムには影響を与えません。
 *
 * 具体的には従来のステータスウィンドウに代わって以下が表示されます。
 * ソースコードのユーザ定義領域(settings)で定義している値を調整することで
 * 位置や外観、表示内容をカスタマイズできます。
 *
 * ・ステータス表示領域
 * 戦闘に参加しているアクターの情報を個人ごとに表示する領域です。
 * 戦闘中は常に表示されます。
 * ※この領域に関する設定は[settings.actorStatus]に定義されます。
 *
 * ・選択中のアクター表示領域
 * コマンド選択中のアクターの情報を表示する領域です。
 * コマンド選択中のみ表示されます。
 * ※この領域に関する設定は[settings.selectedActor]に定義されます。
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

var $dataWindowPositions = null;

(function () {
    'use strict';
    var settings = {
        /* fonts:ゲーム開始時に読み込むフォント情報です。通常のフォントと異なるフォントを使用する場合は定義
         * 注意！　フォントはゲーム開始時にロードするので大量に指定するとゲームの開始が遅くなります。
         */
        fonts:[
            /* name:任意のフォント名 rul:フォントファイルのパス*/
            /* 例：{name:'XXX', url:'fonts/xxxxx.ttf'}*/
            {name:'Minamoji', url:'fonts/minamoji.ttf'},
        ],
        /* actorStatus:ステータス表示領域 */
        actorStatus: {
            /* positions:ステータス表示領域の座標(左上)です。 */
            rect:[
                {x:40, y:350, width:360, height:128},
                {x:420, y:350, width:360, height:128},
                {x:40, y:490, width:360, height:128},
                {x:420, y:490, width:360, height:128},
            ],
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
            /* ステータス表示領域の背景関連情報です */
            backGround:{
                /* ステータス表示領域をウィンドウにする場合に設定してください */
                window:{visible:true, padding:4},
                /* ステータス表示領域を背景画像を設定する場合に指定してください */
                fileName:'',
                /* ステータス表示領域に背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.5)'
            },
            /* ステータス表示領域のフォント関連情報です */
            font:{
                face:'GameFont',
                size:28
            },
        },
        /* selectedActor:選択中のアクター表示領域*/
        selectedActor:{
            rect:{x:600, y:88, width:192, height:56},
            items:{
                name:{visible:true, x:0, y:0},
                face:{visible:false, x:0, y:0, scales:1.0},
            },
            /* ステータス表示領域の背景関連情報です */
            backGround:{
                /* ステータス表示領域をウィンドウにする場合に設定してください */
                window:{visible:true, padding:12},
                /* ステータス表示領域を背景画像を設定する場合に指定してください */
                fileName:'',
                /* ステータス表示領域に背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.5)'
            },
            /* ステータス表示領域のフォント関連情報です */
            font:{
                face:'GameFont',
                size:28
            },
        }
    };
    var pluginName = 'BattleSkinCustomize';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (value == null) return null;
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var checkTypeFunction = function(value) {
        return checkType(value, 'Function');
    };

    var checkType = function(value, typeName) {
        return Object.prototype.toString.call(value).slice(8, -1) === typeName;
    };

    var paramAdjustGraphical = getParamBoolean(['AdjustGraphical', '位置調整を行う'], 0);
    var paramThroughWindow   = getParamBoolean(['ThroughWindow', 'ウィンドウ透過'], 0);
    var paramGridSize        = getParamNumber(['GridSize', 'グリッドサイズ'], 0) || 0;

    //=============================================================================
    // BattleManager
    //  ステータス表示領域を更新します。
    //=============================================================================
    var _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.apply(this, arguments);
        this._actorWindows = null;
    };

    BattleManager.setActorWindows = function(actorWindows) {
        this._actorWindows = actorWindows;
    };

    var _BattleManager_refreshStatus = BattleManager.refreshStatus;
    BattleManager.refreshStatus = function() {
        _BattleManager_refreshStatus.apply(this, arguments);
        this._actorWindows.forEach(function(actorWindow) {
            actorWindow.refresh();
        }.bind(this));
    };

    //=============================================================================
    // DataManager
    //  WindowPositions.jsonの読み込み処理を追記します。
    //=============================================================================
    DataManager._databaseFileWp = { name: '$dataWindowPositions', src: 'WindowPositions.json'};
    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        _DataManager_loadDatabase.apply(this, arguments);
        var errorMessage = this._databaseFileWp.src + 'が見付かりませんでした。';
        this.loadDataFileAllowError(this._databaseFileWp.name, this._databaseFileWp.src, errorMessage);
    };

    DataManager.loadDataFileAllowError = function(name, src, errorMessage) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
        xhr.onerror = function() {
            window[name] = {};
            console.warn(errorMessage);
        };
        window[name] = null;
        xhr.send();
    };

    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        return _DataManager_isDatabaseLoaded.apply(this, arguments) && window[this._databaseFileWp.name];
    };

    //=============================================================================
    // Scene_Boot
    //  必要なフォントをロードします。
    //=============================================================================
    var _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        settings.fonts.forEach(function(fontInfo) {
            Graphics.loadFont(fontInfo.name, fontInfo.url);
        }.bind(this));
    };

    var _Scene_Boot_isGameFontLoaded = Scene_Boot.prototype.isGameFontLoaded;
    Scene_Boot.prototype.isGameFontLoaded = function() {
        if (!_Scene_Boot_isGameFontLoaded.apply(this)) {
            return false;
        }
        var result = settings.fonts.every(function(fontInfo) {
            return Graphics.isFontLoaded(fontInfo.name);
        }.bind(this));
        if (result) {
            return true;
        } else {
            var elapsed = Date.now() - this._startDate;
            if (elapsed >= 20000) {
                throw new Error('Failed to load GameFont');
            }
        }
    };

    //=============================================================================
    // Scene_Battle
    //  ステータス表示領域を作成、更新します。
    //=============================================================================
    var _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function() {
        _Scene_Battle_createDisplayObjects.apply(this, arguments);
        BattleManager.setActorWindows(this._actorWindows);
    };

    var _Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.apply(this, arguments);
        this._statusWindow.hide();
        this.createActorWindows();
        this.createSelectedActorWindow();
    };

    Scene_Battle.prototype.createActorWindows = function() {
        this._actorWindows = [];
        for (var i = 0, n = $gameParty.maxBattleMembers(); i < n; i++) {
            var actorWindow = new Window_ActorStatus(i);
            this._actorWindows.push(actorWindow);
            this.addWindow(actorWindow);
        }
    };

    Scene_Battle.prototype.createSelectedActorWindow = function() {
        this._serectedActorWindow = new Window_SelectedActor();
        this.addWindow(this._serectedActorWindow);
    };

    var _Scene_Battle_refreshStatus = Scene_Battle.prototype.refreshStatus;
    Scene_Battle.prototype.refreshStatus = function() {
        _Scene_Battle_refreshStatus.apply(this, arguments);
        this._actorWindows.forEach(function(actorWindow) {
            actorWindow.refresh();
        }.bind(this));
    };

    //=============================================================================
    // Window_BattleSkinCustomize
    //  表示領域ウィンドウのスーパークラスです。
    //=============================================================================
    function Window_BattleSkinCustomize() {
        this.initialize.apply(this, arguments);
    }
    Window_BattleSkinCustomize.prototype = Object.create(Window_Base.prototype);
    Window_BattleSkinCustomize.prototype.constructor = Window_BattleSkinCustomize;

    Window_BattleSkinCustomize.prototype.initialize = function() {
        var rect = this.getRect();
        if (!rect) return;
        Window_Base.prototype.initialize.call(this, rect.x, rect.y, rect.width, rect.height);
        this.create();
    };

    Window_BattleSkinCustomize.prototype.create = function() {
        this.createBackGround();
        this.createContents();
    };

    Window_BattleSkinCustomize.prototype.createBackGround = function() {
        this._backGroundSprite = new Sprite();
        this._backGroundSprite.bitmap = new Bitmap(this.width, this.height);
        this._backGroundSprite.bitmap.fillAll(this.getSetting().backGround.color);
        this.addChildAt(this._backGroundSprite, 0);
        if (!this.getSetting().backGround.window.visible) {
            this.opacity = 0;
        } else {
            this._backGroundSprite.visible = false;
        }
    };

    Window_BattleSkinCustomize.prototype.createContents = function() {
        this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
    };

    Window_BattleSkinCustomize.prototype.refresh = function() {
        var setting = this.getSetting();
        this.contents.clear();
        this.contents.fontSize = setting.font.size;
        this.contents.fontFace = setting.font.face;
    };

    Window_BattleSkinCustomize.prototype.standardPadding = function() {
        return this.getSetting().backGround.window.visible ? this.getSetting().backGround.window.padding : 0;
    };

    Window_BattleSkinCustomize.prototype.drawActorHp = function(actor) {
        var paramList = {
            gaugeColor1 : this.hpGaugeColor1(),
            gaugeColor2 : this.hpGaugeColor2(),
            rate        : actor.hpRate(),
            current     : actor.hp,
            max         : actor.mhp,
            valueColor  : this.hpColor(actor),
            label       : TextManager.hpA
        };
        this.drawActorParam(actor, this.getSetting().items.hp, paramList);
    };

    Window_BattleSkinCustomize.prototype.drawActorMp = function(actor) {
        var paramList = {
            gaugeColor1 : this.mpGaugeColor1(),
            gaugeColor2 : this.mpGaugeColor2(),
            rate        : actor.mpRate(),
            current     : actor.mp,
            max         : actor.mmp,
            valueColor  : this.mpColor(actor),
            label       : TextManager.mpA
        };
        this.drawActorParam(actor, this.getSetting().items.mp, paramList);
    };

    Window_BattleSkinCustomize.prototype.drawActorTp = function(actor) {
        var paramList = {
            gaugeColor1 : this.tpGaugeColor1(),
            gaugeColor2 : this.tpGaugeColor2(),
            rate        : actor.tpRate(),
            current     : actor.tp,
            max         : actor.maxTp(),
            valueColor  : this.tpColor(actor),
            label       : TextManager.tpA
        };
        this.drawActorParam(actor, this.getSetting().items.tp, paramList);
    };

    Window_BattleSkinCustomize.prototype.drawActorLevel = function(actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 18, y, 36, 'right');
    };

    Window_BattleSkinCustomize.prototype.drawActorParam = function(actor, paramItem, paramList) {
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

    Window_BattleSkinCustomize.prototype.drawActorFace = function(actor, x, y, width, height, scale) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height, scale);
    };

    Window_BattleSkinCustomize.prototype.drawCurrentAndMax = function(current, max, item, color1, color2) {
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

    Window_BattleSkinCustomize.prototype.drawGauge = function(x, y, width, rate, color1, color2, height) {
        var fillW = Math.floor(width * rate);
        this.contents.fillRect(x, y, width, height, this.gaugeBackColor());
        this.contents.gradientFillRect(x, y, fillW, height, color1, color2, false);
    };

    Window_BattleSkinCustomize.prototype.drawFace = function(faceName, faceIndex, x, y, scale) {
        var bitmap = ImageManager.loadFace(faceName);
        bitmap.addLoadListener(function() {
            var width  = Window_Base._faceWidth  * scale;
            var height = Window_Base._faceHeight * scale;
            var sw = Window_Base._faceWidth;
            var sh = Window_Base._faceHeight;
            var sx = faceIndex % 4 * sw;
            var sy = Math.floor(faceIndex / 4) * sh;
            this.contents.blt(bitmap, sx, sy, sw, sh, x, y, width, height);
        }.bind(this));
    };

    Window_BattleSkinCustomize.prototype.contentsWidth = function() {
        return this.width - this.standardPadding() * 2;
    };

    Window_BattleSkinCustomize.prototype.contentsHeight = function() {
        return this.height - this.standardPadding() * 2;
    };

    Window_BattleSkinCustomize.prototype.lineHeight = function() {
        return this.contents.fontSize;
    };

    Window_BattleSkinCustomize.prototype.textPadding = function() {
        return 0;
    };

    //=============================================================================
    // Window_SelectedActor
    //  選択中のアクターに関する表示領域です。
    //=============================================================================
    function Window_SelectedActor() {
        this.initialize.apply(this, arguments);
    }

    Window_SelectedActor.prototype = Object.create(Window_BattleSkinCustomize.prototype);
    Window_SelectedActor.prototype.constructor = Window_SelectedActor;

    Window_SelectedActor.prototype.initialize = function() {
        Window_BattleSkinCustomize.prototype.initialize.call(this);
        this.hide();
        this._actorId = 0;
    };

    Window_SelectedActor.prototype.getSetting = function() {
        return settings.selectedActor;
    };

    Window_SelectedActor.prototype.getRect = function() {
        return this.getSetting().rect;
    };

    Window_SelectedActor.prototype.update = function() {
        Window_BattleSkinCustomize.prototype.update.call(this);
        var actor = this.getActor();
        if (actor && this._actorId !== actor.actorId()) {
            this.refresh();
            this._actorId = actor.actorId();
            this.show();
        }
        if (actor == null && this._actorId !== 0) {
            this._actorId = 0;
            this.hide();
        }
    };

    Window_SelectedActor.prototype.refresh = function() {
        var actor = this.getActor();
        Window_BattleSkinCustomize.prototype.refresh.call(this);
        var items = this.getSetting().items;
        var face = items.face;
        if (face.visible) this.drawActorFace(actor, face.x, face.y, face.scales);
        var name = items.name;
        if (name.visible) this.drawActorName(actor, name.x, name.y);
    };

    Window_SelectedActor.prototype.getActor = function() {
        return BattleManager.actor();
    };

    //=============================================================================
    // Window_ActorStatus
    //  ステータス表示領域です。
    //=============================================================================
    function Window_ActorStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_ActorStatus.prototype = Object.create(Window_BattleSkinCustomize.prototype);
    Window_ActorStatus.prototype.constructor = Window_ActorStatus;

    Window_ActorStatus.prototype.initialize = function(actorIndex) {
        this._actorIndex = actorIndex;
        Window_BattleSkinCustomize.prototype.initialize.call(this);
        this.refresh();
    };

    Window_ActorStatus.prototype.getSetting = function() {
        return settings.actorStatus;
    };

    Window_ActorStatus.prototype.getRect = function() {
        return this.getSetting().rect[this._actorIndex];
    };

    Window_ActorStatus.prototype.refresh = function() {
        var actor = this.getActor();
        if (!actor) {
            this.visible = false;
            return;
        }
        Window_BattleSkinCustomize.prototype.refresh.call(this);
        var items = this.getSetting().items;
        var face = items.face;
        if (face.visible) this.drawActorFace(actor, face.x, face.y, face.scales);
        this.drawActorHp(actor);
        this.drawActorMp(actor);
        this.drawActorTp(actor);
        var name = items.name;
        if (name.visible) this.drawActorName(actor, name.x, name.y);
        var clazz = items.class;
        if (clazz.visible) this.drawActorClass(actor, clazz.x, clazz.y);
        var level = items.level;
        if (level.visible) this.drawActorLevel(actor, level.x, level.y);
        var statesIcon = items.statesIcon;
        if (statesIcon.visible) this.drawActorIcons(actor, statesIcon.x, statesIcon.y);
    };

    Window_ActorStatus.prototype.getActor = function() {
        return $gameParty.battleMembers()[this._actorIndex];
    };

    //=============================================================================
    // Window_Base
    //  セーブした表示位置を復元します。
    //=============================================================================
    var _Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function() {
        _Window_Base_initialize.apply(this, arguments);
        this.loadPosition();
    };

    Window_Base.prototype.loadPosition = function(windowName) {
        if (!windowName || !$dataWindowPositions[windowName]) return;
        this.x = $dataWindowPositions[windowName].x;
        this.y = $dataWindowPositions[windowName].y;
    };

    //=============================================================================
    // Window_PartyCommand
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    Window_PartyCommand.prototype.loadPosition = function() {
        Window_Base.prototype.loadPosition.call(this, 'PartyCommand');
    };

    //=============================================================================
    // Window_ActorCommand
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    Window_ActorCommand.prototype.loadPosition = function() {
        Window_Base.prototype.loadPosition.call(this, 'ActorCommand');
    };

    //=============================================================================
    // Window_BattleActor
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    Window_BattleActor.prototype.loadPosition = function() {
        Window_Base.prototype.loadPosition.call(this, 'BattleActor');
    };

    //=============================================================================
    // Window_BattleEnemy
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    Window_BattleEnemy.prototype.loadPosition = function() {
        Window_Base.prototype.loadPosition.call(this, 'BattleEnemy');
    };

    //=============================================================================
    // Window_BattleSkill
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    Window_BattleSkill.prototype.loadPosition = function() {
        Window_Base.prototype.loadPosition.call(this, 'BattleSkill');
    };

    //=============================================================================
    // Window_BattleItem
    //  コマンドの位置をカスタマイズします。
    //=============================================================================
    Window_BattleItem.prototype.loadPosition = function() {
        Window_Base.prototype.loadPosition.call(this, 'BattleItem');
    };

    //=============================================================================
    // 戦闘テスト時にウィンドウ位置をドラッグ＆ドロップで調整します。
    //=============================================================================
    if (Utils.isOptionValid('btest') && Utils.isNwjs()) {
        //=============================================================================
        // Input
        //  [c]を追加定義します。
        //=============================================================================
        Input.keyMapper[67] = 'copy';
        Input.keyMapper[83] = 'save';

        //=============================================================================
        // Game_Screen
        //  最後に選択したウィンドウの座標を保存します。
        //=============================================================================
        var _Game_Screen_initialize = Game_Screen.prototype.initialize;
        Game_Screen.prototype.initialize = function() {
            _Game_Screen_initialize.call(this);
            this.lastWindowX    = null;
            this.lastWindowY    = null;
            this.infoWindow     = '';
            this.infoExtend     = '';
            this._copyCount     = 0;
            this._infoHelp      = 'Ctrl+マウス:グリッドにスナップ Ctrl+S:ウィンドウ位置を保存 Ctrl+C:座標コピー ';
            this._documentTitle = '';
        };

        var _Game_Screen_update = Game_Screen.prototype.update;
        Game_Screen.prototype.update = function() {
            _Game_Screen_update.apply(this, arguments);
            this.updateDragInfo();
        };

        Game_Screen.prototype.updateDragInfo = function() {
            if (Input.isPressed('control') && Input.isTriggered('copy')) {
                if (this.lastWindowX == null || this.lastWindowY == null) return;
                var clipboard = require('nw.gui').Clipboard.get();
                var copyValue = '';
                if (this._copyCount % 2 === 0) {
                    copyValue = this.lastWindowX.toString();
                    this.infoExtend = ' X座標[' + copyValue + ']をコピーしました。';
                } else {
                    copyValue = this.lastWindowY.toString();
                    this.infoExtend = ' Y座標[' + copyValue + ']をコピーしました。';
                }
                console.log(this.infoExtend);
                clipboard.set(copyValue, 'text');
                this._copyCount++;
            }
            if (Input.isPressed('control') && Input.isTriggered('save')) {
                DataManager.saveDataFileWp();
                this.infoExtend = ' 現在のウィンドウ位置を保存しました。';
                console.log(this.infoExtend);
            }
            var docTitle = this._infoHelp + this.infoWindow + this.infoExtend;
            if (docTitle !== this._documentTitle) {
                document.title = docTitle;
                this._documentTitle = docTitle;
            }
        };

        //=============================================================================
        // Scene_Battle
        //  ウィンドウをドラッグ＆ドロップします。
        //=============================================================================
        var _Scene_Battle_update = Scene_Battle.prototype.update;
        Scene_Battle.prototype.update = function() {
            _Scene_Battle_update.apply(this, arguments);
            this.updateBattleTest();
        };

        Scene_Battle.prototype.updateBattleTest = function() {
            if (!Graphics.isWebGL()) this._windowLayer.children.reverse();
            this._windowLayer.children.some(function(windowObj) {
                return checkTypeFunction(windowObj.checkDrag) && windowObj.checkDrag();
            }, this);
            if (!Graphics.isWebGL()) this._windowLayer.children.reverse();

            if (Input.isTriggered('shift')) {
                if (!this._messageWindow.isOpen()) {
                    this._messageWindow.open();
                } else {
                    this._messageWindow.close();
                }
            }
        };

        var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
        Scene_Battle.prototype.createAllWindows = function() {
            _Scene_Battle_createAllWindows.apply(this, arguments);
            if (Graphics.isWebGL()) this._windowLayer.children.reverse();
        };

        var _Spriteset_Base_createLowerLayer = Spriteset_Base.prototype.createLowerLayer;
        Spriteset_Base.prototype.createLowerLayer = function() {
            _Spriteset_Base_createLowerLayer.call(this);
            this.createGridSprite();
        };

        Spriteset_Base.prototype.createGridSprite = function() {
            var size = paramGridSize;
            if (size === 0) return;
            this._gridSprite = new Sprite();
            this._gridSprite.setFrame(0, 0, this.width, this.height);
            var bitmap = new Bitmap(this.width, this.height);
            for (var x = 0; x < this.width; x += size) {
                bitmap.fillRect(x, 0, 1, this.height, 'rgba(255,255,255,1.0)');
            }
            for (var y = 0; y < this.height; y += size) {
                bitmap.fillRect(0, y, this.width, 1, 'rgba(255,255,255,1.0)');
            }
            this._gridSprite.bitmap = bitmap;
            this.addChild(this._gridSprite);
        };

        //=============================================================================
        // Window_Base
        //  ウィンドウをドラッグ＆ドロップします。
        //=============================================================================
        var _Window_Base_initialize2 = Window_Base.prototype.initialize;
        Window_Base.prototype.initialize = function(x, y, width, height) {
            _Window_Base_initialize2.apply(this, arguments);
            this._holding = false;
            this._dx      = 0;
            this._dy      = 0;
        };

        Window_Base.prototype.checkDrag = function() {
            if (this.updateDragMove()) {
                var result = 'X:[' + this.x + '] Y:[' + this.y + ']';
                $gameScreen.lastWindowX = this.x;
                $gameScreen.lastWindowY = this.y;
                $gameScreen.infoWindow  = result;
                $gameScreen.infoCopy   = '';
                if (!this._holding) console.log(result);
                return true;
            }
            return false;
        };

        Window_Base.prototype.hold = function() {
            this._holding = true;
            this._dx      = TouchInput.x - this.x;
            this._dy      = TouchInput.y - this.y;
            this._windowBackSprite.setBlendColor([255,255,255,192]);
        };

        Window_Base.prototype.release = function() {
            this._holding = false;
            this._windowBackSprite.setBlendColor([0,0,0,0]);
            this.savePosition();
        };

        Window_Base.prototype.updateDragMove = function() {
            if (this.isTouchEvent(TouchInput.isTriggered) || (this._holding && TouchInput.isPressed())) {
                if (!this._holding) this.hold();
                var x = TouchInput.x - this._dx;
                var y = TouchInput.y - this._dy;
                if (Input.isPressed('control')) {
                    var size = paramGridSize;
                    if (size !== 0) {
                        x % size > size / 2 ? x += size - x % size : x -= x % size;
                        y % size > size / 2 ? y += size - y % size : y -= y % size;
                    }
                }
                this.move(x, y, this.width, this.height);
                return true;
            } else if (this._holding) {
                this.release();
                return true;
            }
            return false;
        };

        Window_Base.prototype.isTouchPosInRect = function() {
            var endX = this.x + this.width;
            var endY = this.y + this.height;
            var tx = TouchInput.x;
            var ty = TouchInput.y;
            return (tx >= this.x && tx <= endX &&
            ty >= this.y && ty <= endY);
        };

        Window_Base.prototype.isTouchable = function() {
            return this.isOpen() && this.visible && this.opacity > 0;
        };

        Window_Base.prototype.isTouchEvent = function(triggerFunc) {
            return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
        };

        Window_Base.prototype.savePosition = function(windowName) {
            if (!windowName) return;
            if (!$dataWindowPositions[windowName]) $dataWindowPositions[windowName] = {};
            $dataWindowPositions[windowName].x = this.x;
            $dataWindowPositions[windowName].y = this.y;
        };

        Window_PartyCommand.prototype.savePosition = function() {
            Window_Base.prototype.savePosition.call(this, 'PartyCommand');
        };

        Window_ActorCommand.prototype.savePosition = function() {
            Window_Base.prototype.savePosition.call(this, 'ActorCommand');
        };

        Window_BattleActor.prototype.savePosition = function() {
            Window_Base.prototype.savePosition.call(this, 'BattleActor');
        };

        Window_BattleEnemy.prototype.savePosition = function() {
            Window_Base.prototype.savePosition.call(this, 'BattleEnemy');
        };

        Window_BattleSkill.prototype.savePosition = function() {
            Window_Base.prototype.savePosition.call(this, 'BattleSkill');
        };

        Window_BattleItem.prototype.savePosition = function() {
            Window_Base.prototype.savePosition.call(this, 'BattleItem');
        };

        //=============================================================================
        // TouchInput
        //  ポインタ位置を常に記憶します。
        //=============================================================================
        TouchInput._onMouseMove = function(event) {
            var x = Graphics.pageToCanvasX(event.pageX);
            var y = Graphics.pageToCanvasY(event.pageY);
            this._onMove(x, y);
        };

        DataManager.saveDataFileWp = function() {
            StorageManager.saveToLocalDataFile(this._databaseFileWp.src, window[this._databaseFileWp.name]);
        };

        StorageManager.saveToLocalDataFile = function(fileName, json) {
            var data = JSON.stringify(json);
            var fs = require('fs');
            var dirPath = this.localDataFileDirectoryPath();
            var filePath = dirPath + fileName;
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, data);
        };

        StorageManager.localDataFileDirectoryPath = function() {
            var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
            if (path.match(/^\/([A-Z]\:)/)) {
                path = path.slice(1);
            }
            return decodeURIComponent(path);
        };

        //=============================================================================
        //  不要な処理を破棄します。
        //=============================================================================
        Window_Selectable.prototype.processTouch = function() {};
        WindowLayer.prototype._webglMaskWindow = function(renderSession, window) {};
        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }
})();

