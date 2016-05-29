//=============================================================================
// SceneBattleCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/03/31 ゲージ画像を指定できる機能を追加
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
 * @help 従来のステータスウィンドウを排除して
 * アクター情報の表示内容や位置を自由に設計できるようになります。
 * 戦闘システムには影響を与えません。
 *
 * 具体的には従来のステータスウィンドウに代わって以下が表示されます。
 * ソースコードのユーザ書き換え領域(settings)で定義している値を調整することで
 * 位置や外観、表示内容をカスタマイズできます。
 *
 * ・ステータス表示領域
 * 戦闘に参加しているアクターの情報を個人ごとに表示する領域です。
 * 戦闘中は常に表示されます。
 *
 * ・選択中のアクター表示領域
 * コマンド選択中のアクターの情報を表示する領域です。
 * コマンド選択中のみ表示されます。
 *
 * また、既存のウィンドウも含めた戦闘中の全てのウィンドウについて
 * 以下の設定ができます。
 *
 * 1.位置やサイズを設定
 * 2.ウィンドウ枠の代わりに背景画像を設定
 * 3.表示最大列や表示最大行を設定
 * 4.フォントを設定
 *
 * 注意！
 * 必要な画像はすべて「/img/pictures/」以下にpng形式で配置してください。
 * なお、ユーザ定義領域で指定するときは拡張子は不要です。
 *
 * 要注意！　追加した画像は、デプロイメント時に
 * 未使用ファイルとして除外される可能性があります。
 * その場合、削除されたファイルを入れ直す等の対応が必要です。
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
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //  各ウィンドウの表示内容を記述しています。値以外の箇所を書き換えないでください。
    //  誤って修正してしまった場合は、最新のソースを再度取得してください。
    // （ここで指定したファイル名は、デプロイメント時に
    // 　未使用ファイルとして除外される可能性があります）
    // ※コピー＆ペーストしやすくするために最後の項目にもカンマを付与しています。
    //=============================================================================
    var settings = {
        /* fonts:ゲーム開始時に読み込むフォント情報です。通常のフォントと異なるフォントを使用する場合は定義
         * 注意！　フォントはゲーム開始時にロードするので大量に指定するとゲームの開始が遅くなります。
         */
        fonts:[
            /* name:任意のフォント名 rul:フォントファイルのパス*/
            /* 例：{name:'XXX', url:'fonts/xxxxx.ttf'}*/
            {name:'', url:''},
        ],
        /* Window_ActorStatus:アクターごとのステータス表示領域 */
        Window_ActorStatus: {
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:[
                {x:186, y:511, width:280, height:128},
                {x:0  , y:0  , width:280, height:128},
                {x:0  , y:0  , width:280, height:128},
                {x:0  , y:0  , width:280, height:128},
            ],
            /*
             * items:要素ごとのステータス表示領域内での座標(左上)です。
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
                 * image:ゲージ用画像ファイル名（任意のサイズで満タンのゲージと空のゲージと縦に並べてください）
                 */
                hp:{
                    label:{visible:false, x:4, y:30},
                    value:{visible:true,  x:36, y:30, digit:3, max:true, zeroPadding:true},
                    gauge:{visible:true, x:168, y:40, width:100, height:8, image:'gauge01'},
                },
                mp:{
                    label:{visible:false, x:4, y:62},
                    value:{visible:true,  x:36, y:62, digit:2, max:true, zeroPadding:true},
                    gauge:{visible:true, x:168, y:72, width:100, height:8, image:'gauge02'},
                },
                tp:{
                    label:{visible:false, x:4, y:94},
                    value:{visible:false, x:36, y:94, digit:4, max:true, zeroPadding:true},
                    gauge:{visible:false, x:168, y:104, width:100, height:8, image:''},
                },
                statesIcon:{visible:true,  x:168,  y:32},
                name      :{visible:false, x:4,   y:0},
                class     :{visible:false, x:160, y:0},
                level     :{visible:false, x:220, y:0},
                face      :{visible:false, x:280, y:38, scales:0.5},
            },
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:false, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:36
            },
        },
        /* Window_SelectedActor:コマンド選択中のアクター情報表示領域*/
        Window_SelectedActor:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:true,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* rect:要素情報です。 */
            items:{
                name:{visible:true, x:0, y:0},
                face:{visible:false, x:0, y:0, scales:1.0},
            },
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.5)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
        },
        /* Window_BattleEnemy:敵キャラ選択ウィンドウ*/
        Window_BattleEnemy:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
            /* 表示する最大列数です */
            maxCols:0,
            /* 表示する最大行数です */
            numVisibleRows:0,
        },
        /* Window_BattleActor:アクター選択ウィンドウ*/
        Window_BattleActor:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
            /* 表示する最大列数です */
            maxCols:0,
            /* 表示する最大行数です */
            numVisibleRows:0,
        },
        /* Window_BattleSkill:スキル選択ウィンドウ*/
        Window_BattleSkill:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
            /* 表示する最大列数です */
            maxCols:0,
            /* 表示する最大行数です */
            numVisibleRows:0,
        },
        /* Window_BattleItem:アイテム選択ウィンドウ*/
        Window_BattleItem:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
            /* 表示する最大列数です */
            maxCols:0,
            /* 表示する最大行数です */
            numVisibleRows:0,
        },
        /* Window_PartyCommand:パーティコマンド選択ウィンドウ*/
        Window_PartyCommand:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
            /* 表示する最大列数です */
            maxCols:0,
            /* 表示する最大行数です */
            numVisibleRows:0,
        },
        /* Window_ActorCommand:アクターコマンド選択ウィンドウ*/
        Window_ActorCommand:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
            /* 表示する最大列数です */
            maxCols:0,
            /* 表示する最大行数です */
            numVisibleRows:0,
        },
        /* Window_Help:ヘルプウィンドウ*/
        Window_Help:{
            /* noUse:使用しない場合はtrueを設定します */
            noUse:false,
            /* rect:表示矩形情報です。 */
            rect:{x:null, y:null, width:null, height:null},
            /* 背景関連情報です */
            backGround:{
                /* 背景画像を設定する場合に指定してください */
                fileName:'',
                /* ウィンドウ枠を表示する場合に設定してください */
                window:{visible:true, padding:null, backOpacity:null},
                /* 背景色を設定する場合に指定してください */
                color:'rgba(0,0,0,0.0)'
            },
            /* フォント関連情報です */
            font:{
                face:'',
                size:0
            },
        },
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

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
    // Scene_Boot
    //  必要なフォントをロードします。
    //=============================================================================
    var _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        settings.fonts.forEach(function(fontInfo) {
            if (fontInfo.name && fontInfo.url) {
                Graphics.loadFont(fontInfo.name, fontInfo.url);
            }
        }.bind(this));
    };

    var _Scene_Boot_isGameFontLoaded = Scene_Boot.prototype.isGameFontLoaded;
    Scene_Boot.prototype.isGameFontLoaded = function() {
        if (!_Scene_Boot_isGameFontLoaded.apply(this)) {
            return false;
        }
        var result = settings.fonts.every(function(fontInfo) {
            return Graphics.isFontLoaded(fontInfo.name) || !fontInfo.name || !fontInfo.url;
        }.bind(this));
        if (result) {
            return true;
        } else {
            var elapsed = Date.now() - this._startDate;
            if (elapsed >= 20000) {
                throw new Error('Failed to load custom font');
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

    Scene_Battle.prototype.addWindow = function(child) {
        Scene_Base.prototype.addWindow.apply(this, arguments);
        child.createForBattle();
    };

    //=============================================================================
    // Window_Base
    //  設定と基本的なウィンドウのプロパティ取得を行います。
    //=============================================================================
    Window_Base.prototype.createForBattle = function() {
        var info = this.getSettingBattle();
        if (info) this.createBasic(info);
    };

    Window_Base.prototype.createBasic = function(info) {
        if (info.rect)       this.createRect(info.rect);
        if (info.backGround) this.createBackGround(info.backGround);
        if (info.noUse)      this.hide();
    };

    Window_Base.prototype.createRect = function(rect) {
        if (rect.x || rect.x === 0) this.x      = rect.x;
        if (rect.y || rect.y === 0) this.y      = rect.y;
        if (rect.width)             this.width  = rect.width;
        if (rect.height)            this.height = rect.height;
        this.createContents();
    };

    var _Window_Base_show = Window_Base.prototype.show;
    Window_Base.prototype.show = function() {
        if (this.getPropertyBattle('noUse')) {
            return;
        }
        _Window_Base_show.apply(this, arguments);
    };

    Window_Base.prototype.getSettingBattle = function() {
        return settings[getClassName(this)];
    };

    Window_Base.prototype.getPropertyBattle = function(name) {
        return this.getSettingBattle() ? this.getSettingBattle()[name] : null;
    };

    Window_Base.prototype.createBackGround = function(bgInfo) {
        this._backGroundSprite = new Sprite();
        if (bgInfo.fileName) {
            this._backGroundSprite.bitmap = ImageManager.loadPicture(bgInfo.fileName, 0);
            this.opacity = 0;
        } else if (!bgInfo.window.visible) {
            this._backGroundSprite.bitmap = new Bitmap(this.width, this.height);
            this._backGroundSprite.bitmap.fillAll(this.getSettingBattle().backGround.color);
            this.opacity = 0;
        } else {
            this._backGroundSprite.visible = false;
        }
        this.addChildToBack(this._backGroundSprite);
    };

    var _Window_Base_standardFontFace = Window_Base.prototype.standardFontFace;
    Window_Base.prototype.standardFontFace = function() {
        var font = this.getPropertyBattle('font');
        if (font && font.face) {
            return font.face;
        } else {
            return _Window_Base_standardFontFace.apply(this, arguments);
        }
    };

    var _Window_Base_standardFontSize = Window_Base.prototype.standardFontSize;
    Window_Base.prototype.standardFontSize = function() {
        var font = this.getPropertyBattle('font');
        if (font && font.size) {
            return font.size;
        } else {
            return _Window_Base_standardFontSize.apply(this, arguments);
        }
    };

    var _Window_Base_lineHeight = Window_Base.prototype.lineHeight;
    Window_Base.prototype.lineHeight = function() {
        var font = this.getPropertyBattle('font');
        if (font && font.size) {
            return font.size;
        } else {
            return _Window_Base_lineHeight.apply(this, arguments);
        }
    };

    var _Window_Base_standardPadding = Window_Base.prototype.standardPadding;
    Window_Base.prototype.standardPadding = function() {
        var bgInfo = this.getPropertyBattle('backGround');
        if (bgInfo && bgInfo.window.padding) {
            return bgInfo.window.padding;
        } else {
            return _Window_Base_standardPadding.apply(this, arguments);
        }
    };

    var _Window_Base_standardBackOpacity = Window_Base.prototype.standardBackOpacity;
    Window_Base.prototype.standardBackOpacity = function() {
        var bgInfo = this.getPropertyBattle('backGround');
        if (bgInfo && bgInfo.window.backOpacity) {
            return bgInfo.window.backOpacity;
        } else {
            return _Window_Base_standardBackOpacity.apply(this, arguments);
        }
    };

    //=============================================================================
    // Window_Selectable
    //  表示列と表示行を読み込む処理を追加定義します。
    //=============================================================================
    Window_Selectable.prototype.maxColsForBattle = function() {
        var result = this.getPropertyBattle('maxCols');
        return result ? result : null;
    };

    Window_Selectable.prototype.numVisibleRowsForBattle = function() {
        var result = this.getPropertyBattle('numVisibleRows');
        return result ? result : null;
    };

    //=============================================================================
    // Window_BattleEnemy
    //=============================================================================
    var _Window_BattleEnemy_numVisibleRows = Window_BattleEnemy.prototype.numVisibleRows;
    Window_BattleEnemy.prototype.numVisibleRows = function() {
        return this.numVisibleRowsForBattle() || _Window_BattleEnemy_numVisibleRows.apply(this, arguments);
    };

    var _Window_BattleEnemy_maxCols = Window_BattleEnemy.prototype.maxCols;
    Window_BattleEnemy.prototype.maxCols = function() {
        return this.maxColsForBattle() || _Window_BattleEnemy_maxCols.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleActor
    //=============================================================================
    var _Window_BattleActor_numVisibleRows = Window_BattleActor.prototype.numVisibleRows;
    Window_BattleActor.prototype.numVisibleRows = function() {
        return this.numVisibleRowsForBattle() || _Window_BattleActor_numVisibleRows.apply(this, arguments);
    };

    var _Window_BattleActor_maxCols = Window_BattleActor.prototype.maxCols;
    Window_BattleActor.prototype.maxCols = function() {
        return this.maxColsForBattle() || _Window_BattleActor_maxCols.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleSkill
    //=============================================================================
    var _Window_BattleSkill_numVisibleRows = Window_BattleSkill.prototype.numVisibleRows;
    Window_BattleSkill.prototype.numVisibleRows = function() {
        return this.numVisibleRowsForBattle() || _Window_BattleSkill_numVisibleRows.apply(this, arguments);
    };

    var _Window_BattleSkill_maxCols = Window_BattleSkill.prototype.maxCols;
    Window_BattleSkill.prototype.maxCols = function() {
        return this.maxColsForBattle() || _Window_BattleSkill_maxCols.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleItem
    //=============================================================================
    var _Window_BattleItem_numVisibleRows = Window_BattleItem.prototype.numVisibleRows;
    Window_BattleItem.prototype.numVisibleRows = function() {
        return this.numVisibleRowsForBattle() || _Window_BattleItem_numVisibleRows.apply(this, arguments);
    };

    var _Window_BattleItem_maxCols = Window_BattleItem.prototype.maxCols;
    Window_BattleItem.prototype.maxCols = function() {
        return this.maxColsForBattle() || _Window_BattleItem_maxCols.apply(this, arguments);
    };

    //=============================================================================
    // Window_PartyCommand
    //=============================================================================
    var _Window_PartyCommand_numVisibleRows = Window_PartyCommand.prototype.numVisibleRows;
    Window_PartyCommand.prototype.numVisibleRows = function() {
        return this.numVisibleRowsForBattle() || _Window_PartyCommand_numVisibleRows.apply(this, arguments);
    };

    var _Window_PartyCommand_maxCols = Window_PartyCommand.prototype.maxCols;
    Window_PartyCommand.prototype.maxCols = function() {
        return this.maxColsForBattle() || _Window_PartyCommand_maxCols.apply(this, arguments);
    };

    //=============================================================================
    // Window_ActorCommand
    //=============================================================================
    var _Window_ActorCommand_numVisibleRows = Window_ActorCommand.prototype.numVisibleRows;
    Window_ActorCommand.prototype.numVisibleRows = function() {
        return this.numVisibleRowsForBattle() || _Window_ActorCommand_numVisibleRows.apply(this, arguments);
    };

    var _Window_ActorCommand_maxCols = Window_ActorCommand.prototype.maxCols;
    Window_ActorCommand.prototype.maxCols = function() {
        return this.maxColsForBattle() || _Window_ActorCommand_maxCols.apply(this, arguments);
    };

    //=============================================================================
    // Sprite_Gauge
    //  ゲージスプライトです。
    //=============================================================================
    function Sprite_Gauge() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Gauge.prototype = Object.create(Sprite.prototype);
    Sprite_Gauge.prototype.constructor = Sprite_Gauge;

    Sprite_Gauge.prototype.initialize = function(fileName) {
        Sprite.prototype.initialize.call(this);
        this._fileName = fileName;
        this.bitmap = ImageManager.loadPicture(this._fileName, 0);
        this.createGaugeSprite();
        this.bitmap.addLoadListener(this.onLoadBitmap.bind(this));
    };

    Sprite_Gauge.prototype.createGaugeSprite = function() {
        this._gaugeSprite = new Sprite();
        this._gaugeSprite.bitmap = this.bitmap;
        this.addChild(this._gaugeSprite);
    };

    Sprite_Gauge.prototype.onLoadBitmap = function() {
        var height = this.bitmap.height / 2;
        this.setFrame(0, height, this.bitmap.width, height);
        this._gaugeSprite.setFrame(0, 0, this.bitmap.width, height);
    };

    Sprite_Gauge.prototype.refresh = function(rate) {
        this.bitmap.addLoadListener(function() {
            this._gaugeSprite.setFrame(0, 0, this.bitmap.width * rate, this.bitmap.height / 2);
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

    Window_BattleSkinCustomize.prototype.refresh = function() {
        this.contents.clear();
    };

    Window_BattleSkinCustomize.prototype.standardPadding = function() {
        var win = this.getSettingBattle().backGround.window;
        return win.visible ? win.padding : 0;
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
        this.drawActorParam(actor, this.getSettingBattle().items.hp, paramList);
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
        this.drawActorParam(actor, this.getSettingBattle().items.mp, paramList);
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
        this.drawActorParam(actor, this.getSettingBattle().items.tp, paramList);
    };

    Window_BattleSkinCustomize.prototype.drawActorLevel = function(actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 18, y, 36, 'right');
    };

    Window_BattleSkinCustomize.prototype.drawActorParam = function(actor, paramItem, paramList) {
        var item = paramItem.gauge;
        if (item.visible) {
            if (item.image) {
                this.drawGaugeImage(item.x, item.y, paramList.rate, item.image, paramList.label);
            } else {
                var color1 = paramList.gaugeColor1;
                var color2 = paramList.gaugeColor2;
                this.drawGauge(item.x, item.y, item.width, paramList.rate, color1, color2, item.height);
            }
        }
        item = paramItem.label;
        if (item.visible) {
            this.changeTextColor(this.systemColor());
            this.drawText(paramList.label, item.x, item.y, 44);
        }
        item = paramItem.value;
        if (item.visible) {
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

    Window_BattleSkinCustomize.prototype.drawGaugeImage = function(x, y, rate, fileName, label) {
        if (!this._gaugeSprites) this._gaugeSprites = {};
        if (!this._gaugeSprites[label]) {
            var sprite = new Sprite_Gauge(fileName);
            sprite.x = x;
            sprite.y = y;
            this.addChild(sprite);
            this._gaugeSprites[label] = sprite;
        }
        this._gaugeSprites[label].refresh(rate);
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

    Window_SelectedActor.prototype.update = function() {
        Window_BattleSkinCustomize.prototype.update.call(this);
        var actor = this.getActor();
        if (actor && this._actorId !== actor.actorId()) {
            this.refresh();
            this._actorId = actor.actorId();
            this.show();
        }
        if (!actor && this._actorId !== 0) {
            this._actorId = 0;
            this.hide();
        }
    };

    Window_SelectedActor.prototype.refresh = function() {
        var actor = this.getActor();
        Window_BattleSkinCustomize.prototype.refresh.call(this);
        var items = this.getSettingBattle().items;
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
        Window_BattleSkinCustomize.prototype.initialize.call(this, 0, 0, 1, 1);
    };

    Window_ActorStatus.prototype.createRect = function(rect) {
        Window_BattleSkinCustomize.prototype.createRect.call(this, rect[this._actorIndex]);
    };

    Window_ActorStatus.prototype.refresh = function() {
        var actor = this.getActor();
        if (!actor) {
            this.visible = false;
            return;
        }
        Window_BattleSkinCustomize.prototype.refresh.call(this);
        var items = this.getSettingBattle().items;
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
})();

