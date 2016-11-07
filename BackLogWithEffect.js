//=============================================================================
// BackLogWithEffect.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.5.0 2016/11/08 バックログ再生時に無視する制御文字を指定できる機能を追加
// 0.4.0 2016/11/03 ループ再生機能を追加
// 0.3.0 2016/10/30 リピート再生機能を追加
// 0.2.0 2016/10/22 文章の表示設定をバックログに反映する仕様を追加
// 0.1.0 2016/10/21 作成途中
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 演出つきバックログプラグイン
 * @author トリアコンタン
 *
 * @param バックログ文字色
 * @desc バックログのテキストカラーです。
 * @default 2
 *
 * @param リピートアイコン
 * @desc 音声のリピート再生用のアイコンインデックスです。
 * @default 74
 *
 * @param リピートX座標
 * @desc リピート再生用のアイコンのX座標です。メッセージウィンドウに対する相対位置です。pw:メッセージウィンドウの横幅
 * @default pw - 64
 *
 * @param リピートY座標
 * @desc リピート再生用のアイコンのY座標です。メッセージウィンドウに対する相対位置です。ph:メッセージウィンドウの高さ
 * @default ph - 32
 *
 * @param リピートキーコード
 * @desc リピート再生用のキーコードです。
 * @default 82
 *
 * @param ループアイコンON
 * @desc 音声のループ再生が有効な状態のアイコンインデックスです。
 * @default 75
 *
 * @param ループアイコンOFF
 * @desc 音声のループ再生が無効な状態のアイコンインデックスです。
 * @default 16
 *
 * @param ループアイコンX座標
 * @desc ループ再生用のアイコンのX座標です。メッセージウィンドウに対する相対位置です。pw:メッセージウィンドウの横幅
 * @default pw - 32
 *
 * @param ループアイコンY座標
 * @desc ループ再生用のアイコンのY座標です。メッセージウィンドウに対する相対位置です。ph:メッセージウィンドウの高さ
 * @default ph - 32
 *
 * @param ループキーコード
 * @desc ループ再生用のキーコードです。
 * @default 76
 *
 * @param 無効制御文字
 * @desc バックログが有効な場合に無視する制御文字です。複数ある場合は半角スペースで区切ってください。
 * @default . !
 *
 * @help メッセージにバックログを実行します。
 * 音声再生機能およびピクチャの復元機能を同時に備えます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 */

function Game_BackLog() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName    = 'BackLogWithEffect';
    var metaTagPrefix = 'BackLogWithEffect';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(' ');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamOther = function(paramNames) {
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
    var paramBackLogColor      = getParamNumber(['BackLogColor', 'バックログ文字色'], 0);
    var paramRepeatIcon        = getParamNumber(['RepeatIcon', 'リピートアイコン'], 0);
    var paramRepeatIconX       = getParamString(['RepeatIconX', 'リピートX座標']);
    var paramRepeatIconY       = getParamString(['RepeatIconY', 'リピートY座標']);
    var paramRepeatKeyCode     = getParamNumber(['RepeatKeyCode', 'リピートキーコード'], 0);
    var paramLoopIconOff       = getParamNumber(['LoopIconOFF', 'ループアイコンOFF'], 0);
    var paramLoopIconOn        = getParamNumber(['LoopIconON', 'ループアイコンON'], 0);
    var paramLoopIconX         = getParamString(['LoopIconX', 'ループアイコンX座標']);
    var paramLoopIconY         = getParamString(['LoopIconX', 'ループアイコンY座標']);
    var paramLoopKeyCode       = getParamNumber(['LoopKeyCode', 'ループキーコード'], 0);
    var paramInvalidEscapeCode = getParamArrayString(['InvalidEscapeCode', '無効制御文字']);

    var _Input_initialize = Input.initialize;
    Input.initialize      = function() {
        _Input_initialize.apply(this, arguments);
        if (paramRepeatKeyCode) this.keyMapper[paramRepeatKeyCode] = 'sound_repeat';
        if (paramLoopKeyCode) this.keyMapper[paramLoopKeyCode] = 'sound_loop';
    };

    //=============================================================================
    // Game_Interpreter
    //  バックログ効果音を初期化します。
    //=============================================================================
    var _Game_Interpreter_setup      = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        $gameSystem.clearBackLogs();
    };

    var _Game_Interpreter_updateWaitCount      = Game_Interpreter.prototype.updateWaitCount;
    Game_Interpreter.prototype.updateWaitCount = function() {
        var result = _Game_Interpreter_updateWaitCount.apply(this, arguments);
        if (result) {
            $gameSystem.clearBackLogSound();
        }
        return result;
    };

    //=============================================================================
    // Game_System
    //  バックログ情報を追加定義します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._backLogs = [];
        this._sounds   = null;
    };

    Game_System.prototype.getBackLogs = function() {
        return this._backLogs || [];
    };

    Game_System.prototype.getBackLog = function(index) {
        return index === -1 ? this._latestLog : this.getBackLogs()[index];
    };

    Game_System.prototype.clearBackLogs = function() {
        this._backLogs = [];
    };

    Game_System.prototype.createBackLog = function(text) {
        var backLog = new Game_BackLog(text);
        backLog.setPictures($gameScreen.getPicturesCopy());
        backLog.setSounds(this._sounds);
        this.getBackLogs().unshift(backLog);
        this._latestLog = backLog;
        this.clearBackLogSound();
    };

    Game_System.prototype.addBackLogSound = function(soundData) {
        if (!this._sounds) this.clearBackLogSound();
        this._sounds.push(soundData);
    };

    Game_System.prototype.clearBackLogSound = function() {
        this._sounds = [];
    };

    //=============================================================================
    // Game_Screen
    //  ピクチャ情報のコピーと復元を追加定義します。
    //=============================================================================
    Game_Screen.prototype.getPicturesCopy = function() {
        return this._pictures.map(function(picture) {
            return JsonEx.makeDeepCopy(picture);
        });
    };

    Game_Screen.prototype.setBackLogPictures = function(pictures) {
        if (!this._prevPictures) {
            this._prevPictures = this._pictures;
        }
        this._pictures = pictures;
    };

    Game_Screen.prototype.restorePictures = function() {
        if (this._prevPictures) {
            this._pictures = this._prevPictures;
        }
        this._prevPictures = null;
    };

    //=============================================================================
    // Game_Message
    //  バックログ表示中フラグを管理します。
    //=============================================================================
    var _Game_Message_initialize      = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.apply(this, arguments);
        this._backLogViewing   = false;
        this._backLogSoundLoop = false;
    };

    Game_Message.prototype.setBackLogViewing = function(value) {
        this._backLogViewing = !!value;
    };

    Game_Message.prototype.isBackLogViewing = function() {
        return this._backLogViewing;
    };

    Game_Message.prototype.clearBackLogSoundLoop = function() {
        this._backLogSoundLoop = false;
    };

    Game_Message.prototype.toggleBackLogSoundLoop = function() {
        this._backLogSoundLoop = !this._backLogSoundLoop;
    };

    Game_Message.prototype.isBackLogSoundLoop = function() {
        return this._backLogSoundLoop;
    };

    Game_Message.prototype.startBackLog = function(backLog) {
        this.clear();
        this.clearBackLogSoundLoop();
        this.add(backLog.getText());
        this.setBackLogViewing(true);
        var setting = backLog.getSetting();
        this.setBackground(setting.background());
        this.setPositionType(setting.positionType());
        this.setFaceImage(setting.faceName(), setting.faceIndex());
    };

    //=============================================================================
    // AudioManager
    //  演奏した効果音を記録します。
    //=============================================================================
    var _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe      = function(se) {
        if ($gameMap.isEventRunning() && !$gameMessage.isBackLogViewing()) {
            $gameSystem.addBackLogSound(se);
        }
        _AudioManager_playSe.apply(this, arguments);
    };

    AudioManager.isPlayingAnySe = function() {
        return this._seBuffers.some(function(audio) {
            return audio.isPlaying();
        });
    };

    //=============================================================================
    // Window_Message
    //  バックログを実装します。
    //=============================================================================
    var _Window_Message_initialize      = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        _Window_Message_initialize.apply(this, arguments);
        this.createSubSprites();
    };

    Window_Message.prototype.createSubSprites = function() {
        this._repeatIcon = new Sprite_RepeatIcon();
        this._loopIcon   = new Sprite_LoopIcon();
        this.addChild(this._repeatIcon);
        this.addChild(this._loopIcon);
        this._repeatIcon.setPosition();
        this._loopIcon.setPosition();
    };

    var _Window_Message_initMembers      = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function() {
        _Window_Message_initMembers.apply(this, arguments);
        this._backLogDepth = -1;
    };

    var _Window_Message_onEndOfText      = Window_Message.prototype.onEndOfText;
    Window_Message.prototype.onEndOfText = function() {
        if (!$gameMessage.isBackLogViewing()) {
            $gameSystem.createBackLog(this._textState.text);
        }
        _Window_Message_onEndOfText.apply(this, arguments);
    };

    var _Window_Message_terminateMessage      = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.apply(this, arguments);
        if (!this.isBackLogActive() && $gameMessage.isBackLogViewing()) {
            $gameMessage.setBackLogViewing(false);
            this._backLogDepth = -1;
            $gameScreen.restorePictures();
        }
    };

    Window_Message.prototype.isBackLogActive = function() {
        return this._backLogDepth >= 0;
    };

    var _Window_Message_updateShowFast      = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function() {
        _Window_Message_updateShowFast.apply(this, arguments);
        if ($gameMessage.isBackLogViewing()) {
            this._showFast = true;
        }
    };

    var _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        var result = this.pause;
        if (!this.isBackLogActive()) {
            result = _Window_Message_updateInput.apply(this, arguments);
        }
        if (!this.isAnySubWindowActive() && this.pause) {
            this.updateBackLogInput();
        }
        return result;
    };

    Window_Message.prototype.updateBackLogInput = function() {
        if ($gameMessage.isBackLogViewing()) {
            if ($gameMessage.isBackLogSoundLoop()) this.updateLoopSound();
            if (this.updateBackLogSoundIcon()) return;
        }
        if (this.isTriggeredBackLogForward()) {
            this.startBackLog(this._backLogDepth === -1 ? 1 : this._backLogDepth + 1);
        }
        if (this.isTriggeredBackLogReturn()) {
            this.startBackLog(this._backLogDepth - 1);
        }
        if (this.isTriggeredBackLogAbort() && this.isBackLogActive()) {
            this.startBackLog(-1);
        }
    };

    Window_Message.prototype.updateLoopSound = function() {
        if (!AudioManager.isPlayingAnySe()) {
            this.playBackLogLatestSound();
        }
    };

    Window_Message.prototype.updateBackLogSoundIcon = function() {
        var localX = this.canvasToLocalX(TouchInput.x);
        var localY = this.canvasToLocalY(TouchInput.y);
        if (this._repeatIcon.isTriggered(localX, localY)) {
            this.playBackLogLatestSound();
            return true;
        }
        if (this._loopIcon.isTriggered(localX, localY)) {
            $gameMessage.toggleBackLogSoundLoop();
            return true;
        }
        return false;
    };

    Window_Message.prototype.playBackLogLatestSound = function() {
        var backLog = $gameSystem.getBackLog(this._backLogDepth);
        this.playBackLogSounds(backLog.getSounds());
    };

    Window_Message.prototype.processNormalCharacter = function(textState) {
        if (paramBackLogColor && this.isBackLogActive()) {
            this.changeTextColor(this.textColor(paramBackLogColor));
        }
        Window_Base.prototype.processNormalCharacter.apply(this, arguments);
    };

    Window_Message.prototype.startBackLog = function(index) {
        var backLog = $gameSystem.getBackLog(index);
        if (backLog) {
            this.pause = false;
            $gameMessage.startBackLog(backLog);
            this._backLogDepth = index;
            $gameScreen.setBackLogPictures(backLog.getPictures());
            if (index >= 0) {
                this.playBackLogSounds(backLog.getSounds());
            }
            return true;
        }
        return false;
    };

    Window_Message.prototype.playBackLogSounds = function(sounds) {
        AudioManager.stopSe();
        if (!sounds) return;
        sounds.forEach(function(sound) {
            AudioManager.playSe(sound);
        });
    };

    Window_Message.prototype.isTriggeredBackLogForward = function() {
        return TouchInput.wheelY < 0 || Input.isTriggered('up');
    };

    Window_Message.prototype.isTriggeredBackLogReturn = function() {
        return TouchInput.wheelY > 0 || Input.isTriggered('down') || this.isTriggered();
    };

    Window_Message.prototype.isTriggeredBackLogAbort = function() {
        return Input.isTriggered('left') || Input.isTriggered('cancel') || TouchInput.isCancelled();
    };

    var _Window_Message_isTriggered      = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        var result = _Window_Message_isTriggered.apply(this, arguments);
        if (Input.isRepeated('cancel') && (!Input.isRepeated('ok') && !TouchInput.isRepeated())) {
            return false;
        }
        return result;
    };

    var _Window_Message_processEscapeCharacter      = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (this.isBackLogActive() && paramInvalidEscapeCode.contains(code)) return;
        _Window_Message_processEscapeCharacter.apply(this, arguments);
    };

    //=============================================================================
    // Game_BackLog
    //  バックログを扱うクラスです。このクラスはGame_Systemクラスで生成されます。
    //  セーブデータの保存対象のためグローバル領域に定義します。
    //=============================================================================
    Game_BackLog.prototype.initialize = function(text) {
        this._text     = text;
        this._pictures = [];
        this._sounds   = [];
        this._setting  = JsonEx.makeDeepCopy($gameMessage);
    };

    Game_BackLog.prototype.setPictures = function(pictures) {
        this._pictures = pictures;
    };

    Game_BackLog.prototype.setSounds = function(sounds) {
        this._sounds = sounds;
    };

    Game_BackLog.prototype.getText = function() {
        return this._text;
    };

    Game_BackLog.prototype.getPictures = function() {
        return this._pictures;
    };

    Game_BackLog.prototype.getSounds = function() {
        return this._sounds;
    };

    Game_BackLog.prototype.getSetting = function() {
        return this._setting;
    };

    //=============================================================================
    // Sprite_SoundIcon
    //  サウンドアイコンを扱うクラスです。
    //=============================================================================
    function Sprite_SoundIcon() {
        this.initialize.apply(this, arguments);
    }

    Sprite_SoundIcon.prototype             = Object.create(Sprite_StateIcon.prototype);
    Sprite_SoundIcon.prototype.constructor = Sprite_SoundIcon;

    Sprite_SoundIcon.prototype.initialize = function() {
        Sprite_StateIcon.prototype.initialize.apply(this, arguments);
        this.visible = false;
    };

    Sprite_SoundIcon.prototype.setPosition = function() {
        var pw = this.parent.width, ph = this.parent.height;
        var x  = Number(eval(this.getXFormula()));
        var y  = Number(eval(this.getYFormula()));
        this.move(x, y);
    };

    Sprite_SoundIcon.prototype.getXFormula = function() {
        return 0;
    };

    Sprite_SoundIcon.prototype.getYFormula = function() {
        return 0;
    };

    Sprite_SoundIcon.prototype.getIconIndex = function() {
        return 0;
    };

    Sprite_SoundIcon.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateIndex();
        this.updateVisible();
        this.updateFrame();
    };

    Sprite_SoundIcon.prototype.updateIndex = function() {
        this._iconIndex = this.getIconIndex();
    };

    Sprite_SoundIcon.prototype.updateVisible = function() {
        this.visible = this.parent.isBackLogActive();
    };

    Sprite_SoundIcon.prototype.isTriggered = function(targetX, targetY) {
        var realX = targetX + this._frame.width * this.anchor.x;
        var realY = targetY + this._frame.height * this.anchor.y;
        if (TouchInput.isTriggered() && this.isInSprite(realX, realY)) {
            return true;
        }
        if (this.isTriggeredAnyKey()) {
            return true;
        }
        return false;
    };

    Sprite_SoundIcon.prototype.isInSprite = function(targetX, targetY) {
        return this.x <= targetX && this.x + this._frame.width >= targetX &&
            this.y <= targetY && this.y + this._frame.height >= targetY;
    };

    Sprite_SoundIcon.prototype.isTriggeredAnyKey = function() {
        return this.getKeyTriggers().some(function(keyName) {
            return Input.isTriggered(keyName);
        });
    };

    //=============================================================================
    // Sprite_RepeatIcon
    //  リピートアイコンを扱うクラスです。
    //=============================================================================
    function Sprite_RepeatIcon() {
        this.initialize.apply(this, arguments);
    }

    Sprite_RepeatIcon.prototype             = Object.create(Sprite_SoundIcon.prototype);
    Sprite_RepeatIcon.prototype.constructor = Sprite_RepeatIcon;

    Sprite_RepeatIcon.prototype.getXFormula = function() {
        return paramRepeatIconX;
    };

    Sprite_RepeatIcon.prototype.getYFormula = function() {
        return paramRepeatIconY;
    };

    Sprite_RepeatIcon.prototype.getIconIndex = function() {
        return paramRepeatIcon;
    };

    Sprite_RepeatIcon.prototype.getKeyTriggers = function() {
        return ['right', 'sound_repeat'];
    };

    //=============================================================================
    // Sprite_LoopIcon
    //  ループアイコンを扱うクラスです。
    //=============================================================================
    function Sprite_LoopIcon() {
        this.initialize.apply(this, arguments);
    }

    Sprite_LoopIcon.prototype             = Object.create(Sprite_SoundIcon.prototype);
    Sprite_LoopIcon.prototype.constructor = Sprite_LoopIcon;

    Sprite_LoopIcon.prototype.getXFormula = function() {
        return paramLoopIconX;
    };

    Sprite_LoopIcon.prototype.getYFormula = function() {
        return paramLoopIconY;
    };

    Sprite_LoopIcon.prototype.getIconIndex = function() {
        return $gameMessage.isBackLogSoundLoop() ? paramLoopIconOn : paramLoopIconOff;
    };

    Sprite_LoopIcon.prototype.getKeyTriggers = function() {
        return ['pageup', 'sound_loop'];
    };
})();

