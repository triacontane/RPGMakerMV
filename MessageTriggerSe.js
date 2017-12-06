//=============================================================================
// MessageTriggerSe.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/12/06 効果音の音量、ピッチ、左右バランスを後から変更できる機能を追加
// 1.0.0 2017/12/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージ送りSEプラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチID
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効となります。
 * @default 0
 * @type switch
 *
 * @param 効果音
 * @desc ページ送り時に演奏される効果音情報です。
 * @default
 * @type struct<SE>
 *
 * @help MessageTriggerSe.js
 *
 * メッセージ送りの際に指定された効果音を演奏します。
 * 「\!」による待機や「\^」によるスキップ時も演奏されます。
 *
 * ・スクリプト詳細
 * ページ送り効果音を以下の通りに変更します。
 * 指定しなかった項目は変更されません。
 *  名称         : Book2
 *  音量         : 90
 *  ピッチ       : 100
 *  左右バランス : 0
 *
 * $gameSystem.setMessageTriggerSe('Book2', 90, 100, 0);
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~SE:
 * @param name
 * @desc SEのファイル名称です。
 * @default Book1
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @desc SEのボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @desc SEのピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @desc SEの左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

(function() {
    'use strict';
    var pluginName    = 'MessageTriggerSe';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name !== undefined) return name;
        }
        alert('Fail to load plugin parameter of ' + pluginName);
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamJson = function(paramNames, defaultValue) {
        var value = getParamString(paramNames) || null;
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            }
        } catch (e) {
            alert(`!!!Plugin param is wrong.!!!\nPlugin:${pluginName}.js\nName:${paramNames}\nValue:${value}`);
            value = defaultValue;
        }
        return value;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param              = {};
    param.validateSwitchId = getParamNumber(['ValidateSwitchId', '有効スイッチID'], 0);
    param.soundEffect      = getParamJson(['SoundEffect', '効果音'], {});

    //=============================================================================
    // Game_System
    //  メッセージ送りSEを保持します。
    //=============================================================================
    Game_System.prototype.initMessageTriggerSeIfNeed = function() {
        if (!this._messageTriggerSe) {
            this._messageTriggerSe = this.createMessageTriggerSe();
        }
    };

    Game_System.prototype.createMessageTriggerSe = function() {
        var se    = param.soundEffect;
        se.volume = parseInt(se.volume);
        se.pitch  = parseInt(se.pitch);
        se.pan    = parseInt(se.pan);
        return se;
    };

    Game_System.prototype.getMessageTriggerSe = function() {
        this.initMessageTriggerSeIfNeed();
        return this._messageTriggerSe;
    };

    Game_System.prototype.setMessageTriggerSe = function(name, volume, pitch, pan) {
        this.initMessageTriggerSeIfNeed();
        if (name || name === '') {
            this._messageTriggerSe.name = name;
        }
        if (volume || volume === 0) {
            this._messageTriggerSe.volume = volume;
        }
        if (pitch || pitch === 0) {
            this._messageTriggerSe.pitch = pitch;
        }
        if (pan || pan === 0) {
            this._messageTriggerSe.pan = pan;
        }
    };

    //=============================================================================
    // Window_Message
    //  メッセージ送りSEを演奏します。
    //=============================================================================
    var _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        var wasPause = this.pause;
        var input = _Window_Message_updateInput.apply(this, arguments);
        if (wasPause && !this.pause) {
            this.playMessageTriggerSe();
        }
        return input;
    };

    var _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        if (this._pauseSkip) {
            this.playMessageTriggerSe();
        }
        _Window_Message_terminateMessage.apply(this, arguments);
    };

    Window_Message.prototype.playMessageTriggerSe = function() {
        if (!this.isValidMessageTriggerSe()) {
            return;
        }
        AudioManager.playSe($gameSystem.getMessageTriggerSe());
    };

    Window_Message.prototype.isValidMessageTriggerSe = function() {
        return param.validateSwitchId === 0 || $gameSwitches.value(param.validateSwitchId);
    };
})();

