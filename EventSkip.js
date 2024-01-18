/*=============================================================================
 EventSkip.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/01/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc イベントスキッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventSkip.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param skipSwitchId
 * @text スキップスイッチID
 * @desc 指定したスイッチがONになったときにイベントをスキップします。スキップが終わると自動でOFFになります。
 * @default 1
 * @type switch
 * @min 1
 *
 * @param skipSpeed
 * @text スキップ速度
 * @desc スキップ時の更新速度です。通常の高速化処理は2倍です。あまりに大きすぎる値を設定すると処理落ちの可能性があります。
 * @default 32
 * @type number
 * @min 2
 *
 * @param fadeFrame
 * @text フェードフレーム
 * @desc スキップ開始時のフェードアウトと終了時のフェードインにかかるフレーム数です。
 * @default 8
 * @type number
 *
 * @help EventSkip.js
 *
 * イベント実行中に指定したスイッチがONになると画面がフェードアウトして
 * 暗転中に通常の32倍(調整可)の速度でイベントを高速実行します。
 * メッセージも自動でスキップされます。並列処理とバトルイベントは対象外です。
 *
 * 以下の条件を満たすとスキップスイッチがOFFになり、高速実行は終了します。
 * ・イベントが最後まで実行されたとき(直後に自動実行イベントがあればスキップ継続)
 * ・戦闘画面など別画面に遷移したとき
 * ・選択肢の表示や数値入力の処理で入力待ちになったとき
 * ・スキップスイッチがOFFになったとき
 *
 * スキップ中、効果音の演奏は無視されます。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    Game_Message.prototype.isAnyChoice = function() {
        return (
            this.isChoice() ||
            this.isNumberInput() ||
            this.isItemChoice()
        );
    };

    Game_Map.prototype.isNeedEventSkip = function() {
        if ($gameMessage.isAnyChoice()) {
            return false;
        } else if (SceneManager.isSceneChanging() && !$gamePlayer.isTransferring()) {
            return false;
        } else {
            return $gameMap.isEventRunning() && $gameSwitches.value(param.skipSwitchId);
        }
    };

    Game_Map.prototype.setEventSkip = function(value) {
        this._eventSkip = value;
    };

    Game_Map.prototype.isEventSkip = function() {
        return this._eventSkip;
    };

    const _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        const result = _Window_Message_isTriggered.apply(this, arguments);
        if ($gameMap.isEventSkip()) {
            return true;
        } else {
            return result;
        }
    };

    const _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        _Scene_Map_initialize.apply(this, arguments);
        this._eventSkip = $gameMap.isNeedEventSkip() || false;
    };

    const _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        if (this.isEventSkip()) {
            return true;
        }
        return _Scene_Map_isFastForward.apply(this, arguments);
    };

    const _Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isEventSkip()) {
            const speed = param.skipSpeed - 2;
            for (let i = 0; i < speed; i++) {
                this.updateMain();
            }
        }
        this.updateEventSkip();
    };

    Scene_Map.prototype.isEventSkip = function() {
        return this._eventSkip && !this.isFading();
    };

    Scene_Map.prototype.updateEventSkip = function() {
        const skip = $gameMap.isNeedEventSkip();
        if (!skip) {
            $gameSwitches.setValue(param.skipSwitchId, false);
        }
        if (this._eventSkip !== skip) {
            this._eventSkip = skip;
            const frame = param.fadeFrame;
            if (skip) {
                this.startFadeOut(frame, false);
            } else {
                this.startFadeIn(frame, false);
            }
        }
        $gameMap.setEventSkip(this.isEventSkip());
    };

    const _Scene_Map_fadeInForTransfer = Scene_Map.prototype.fadeInForTransfer;
    Scene_Map.prototype.fadeInForTransfer = function() {
        if (this.isEventSkip()) {
            this._fadeWhite = false;
            this._fadeOpacity = 255;
            this.updateColorFilter();
            return;
        }
        _Scene_Map_fadeInForTransfer.apply(this, arguments);
    };

    const _Scene_Map_fadeOutForTransfer = Scene_Map.prototype.fadeOutForTransfer;
    Scene_Map.prototype.fadeOutForTransfer = function() {
        if (this.isEventSkip()) {
            return;
        }
        _Scene_Map_fadeOutForTransfer.apply(this, arguments);
    };

    const _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        if ($gameMap.isEventSkip()) {
            return;
        }
        _AudioManager_playSe.apply(this, arguments);
    };
})();
