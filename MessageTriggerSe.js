//=============================================================================
// MessageTriggerSe.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2022/12/13 MZ版として仕様を再検討
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageTriggerSe.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
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
 * @desc ページ送り時に演奏される効果音です。
 * @default
 * @type struct<SE>
 *
 * @param endSoundEffect
 * @text 終了時効果音
 * @desc 続くメッセージがない場合のページ送り時に演奏される効果音です。
 * @default
 * @type struct<SE>
 *
 * @help MessageTriggerSe.js
 *
 * メッセージ送りの際に指定された効果音を演奏します。
 * 「\!」による待機や「\^」によるスキップ時も演奏されます。
 * 続くメッセージがある場合とない場合とで異なる効果音を
 * 演奏できます。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Window_Message
    //  メッセージ送りSEを演奏します。
    //=============================================================================
    const _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        const wasPause = this.pause;
        const input = _Window_Message_updateInput.apply(this, arguments);
        if (wasPause && !this.pause) {
            if (this.doesContinue()) {
                this.playMessageTriggerSe();
            } else {
                this._needMessageSe = true;
            }
        }
        return input;
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        if (this._pauseSkip) {
            this._needMessageSe = true;
        }
        _Window_Message_terminateMessage.apply(this, arguments);
    };

    const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        if (this.isClosing() && this.isOpen() && this._needMessageSe) {
            if (this.doesContinue()) {
                this.playMessageTriggerSe(param.soundEffect);
            } else {
                this.playMessageTriggerSe(param.endSoundEffect);
            }
            this._needMessageSe = false;
        }
        _Window_Message_checkToNotClose.apply(this, arguments);
    };

    Window_Message.prototype.playMessageTriggerSe = function(se) {
        if (se && se.name && this.isValidMessageTriggerSe()) {
            AudioManager.playStaticSe(se);
        }
    };

    Window_Message.prototype.isValidMessageTriggerSe = function() {
        return param.validateSwitchId === 0 || $gameSwitches.value(param.validateSwitchId);
    };
})();

