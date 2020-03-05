//=============================================================================
// MessageTriggerSe.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.1 2020/03/06 ページ送りSEを演奏後すぐに通常のSEを演奏すると、SEの停止で当該SEが停止されない問題を修正
// 1.2.0 2018/06/22 メッセージに続きがある場合のみ効果音を演奏する設定を追加
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
 * @param validateSwitchId
 * @text 有効スイッチID
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効となります。
 * @default 0
 * @type switch
 *
 * @param soundEffect
 * @text 効果音
 * @desc ページ送り時に演奏される効果音情報です。
 * @default
 * @type struct<SE>
 *
 * @param doseContinueOnly
 * @text 続きがある場合のみ
 * @desc メッセージに続きがある場合のみメッセージ送りSEを演奏します。
 * @default false
 * @type boolean
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

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = createPluginParameter('MessageTriggerSe');

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
            if (this.doesContinue()) {
                this.playMessageTriggerSe();
            } else {
                this._needMessageSe = true;
            }
        }
        return input;
    };

    var _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        if (this._pauseSkip) {
            this._needMessageSe = true;
        }
        _Window_Message_terminateMessage.apply(this, arguments);
    };

    var _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        if (this.isClosing() && this.isOpen() && this._needMessageSe) {
            if (this.doesContinue() || !param.doseContinueOnly) {
                this.playMessageTriggerSe();
            }
            this._needMessageSe = false;
        }
        _Window_Message_checkToNotClose.apply(this, arguments);
    };

    Window_Message.prototype.playMessageTriggerSe = function() {
        if (this.isValidMessageTriggerSe()) {
            AudioManager.playStaticSe($gameSystem.getMessageTriggerSe());
        }
    };

    Window_Message.prototype.isValidMessageTriggerSe = function() {
        return param.validateSwitchId === 0 || $gameSwitches.value(param.validateSwitchId);
    };
})();

