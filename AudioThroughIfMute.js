//=============================================================================
// AudioThroughIfMute.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2018/09/25 ミュート切り替え時に即座に音声が反映されるよう修正
// 1.0.1 2018/09/25 ヘルプ修正
// 1.0.0 2017/09/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AudioThroughIfMutePlugin
 * @author triacontane
 *
 * @param AudioThroughSwitchId
 * @desc 指定した番号のスイッチがONになっている場合、音声ファイルを取得しません。
 * @default 0
 * @type switch
 *
 * @help AudioThroughIfMute.js
 *
 * 設定でボリュームもしくはマスターボリュームが0に設定されている場合もしくは
 * 任意のスイッチがONになっている場合に、BGMなどの音声ファイルを
 * 演奏および読み込みしなくなります。
 *
 * ブラウザ作品をモバイルネットワーク環境でプレーする際に通信量を
 * 抑制することができます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ミュート時の演奏省略プラグイン
 * @author トリアコンタン
 *
 * @param 音声無効スイッチ番号
 * @desc 指定した番号のスイッチがONになっている場合、音声ファイルを取得しません。
 * @default 0
 * @type switch
 *
 * @help AudioThroughIfMute.js
 *
 * 設定でボリュームもしくはマスターボリュームが0に設定されている場合もしくは
 * 任意のスイッチがONになっている場合に、BGMなどの音声ファイルを
 * 演奏および読み込みしなくなります。
 *
 * ブラウザ作品をモバイルネットワーク環境でプレーする際などに
 * 通信量を抑制することができます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'AudioThroughIfMute';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param       = {};
    param.audioThroughSwitchId = getParamNumber(['AudioThroughSwitchId', '音声無効スイッチ番号'], 0);

    //=============================================================================
    // Window_Options
    //  ミュート状態からの復帰処理を追記します。
    //=============================================================================
    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, volume) {
        _Window_Options_setConfigValue.apply(this, arguments);
        AudioManager.restoreMuteIfNeed();
    };

    //=============================================================================
    // Window_Options
    //  ミュート状態の更新処理を追記します。
    //=============================================================================
    var _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.apply(this, arguments);
        if (switchId === param.audioThroughSwitchId) {
            if (value) {
                AudioManager.applyMute();
            } else {
                AudioManager.restoreMuteIfNeed();
            }
        }
    };

    //=============================================================================
    // AudioManager
    //  ミュート時の音声ファイルのロードを行わないよう変更します。
    //=============================================================================
    AudioManager.restoreMuteIfNeed = function() {
        if (!this.isBgmMute() && this._currentBgm) {
            this.replayBgm(this._currentBgm);
        }
        if (!this.isBgsMute() && this._currentBgs) {
            this.replayBgs(this._currentBgs);
        }
    };

    AudioManager.applyMute = function() {
        var prevCurrentBgm = this._currentBgm;
        var prevCurrentBgs = this._currentBgs;
        AudioManager.stopAll();
        this._currentBgm = prevCurrentBgm;
        this._currentBgs = prevCurrentBgs;
    };

    //=============================================================================
    // AudioManager
    //  ミュート時の音声ファイルのロードを行わないよう変更します。
    //=============================================================================
    var _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm = function(bgm, pos) {
        if (this.isBgmMute()) {
            this.stopBgm();
            this.updateCurrentBgm(bgm, pos);
            this._muteBgm = true;
            return;
        } else if (this._muteBgm) {
            this._muteBgm = false;
            this._currentBgm = null;
        }
        _AudioManager_playBgm.apply(this, arguments);
    };

    var _AudioManager_playBgs = AudioManager.playBgs;
    AudioManager.playBgs = function(bgs, pos) {
        if (this.isBgsMute()) {
            this.stopBgs();
            this.updateCurrentBgs(bgs, pos);
            this._muteBgs = true;
            return;
        } else if (this._muteBgs) {
            this._muteBgs = false;
            this._currentBgs = null;
        }
        _AudioManager_playBgs.apply(this, arguments);
    };

    var _AudioManager_playMe = AudioManager.playMe;
    AudioManager.playMe = function(me) {
        if (this.isMeMute()) {
            this.stopMe();
            return;
        }
        _AudioManager_playMe.apply(this, arguments);
    };

    var _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        if (this.isSeMute()) {
            this.stopSe();
            return;
        }
        _AudioManager_playSe.apply(this, arguments);
    };

    AudioManager.isBgmMute = function() {
        return this.isAllAudioMute() || this.bgmVolume === 0;
    };

    AudioManager.isBgsMute = function() {
        return this.isAllAudioMute() || this.bgsVolume === 0;
    };

    AudioManager.isMeMute = function() {
        return this.isAllAudioMute() || this.meVolume === 0;
    };

    AudioManager.isSeMute = function() {
        return this.isAllAudioMute() || this.seVolume === 0;
    };

    AudioManager.isAllAudioMute = function() {
        return this.isMuteSwitchValid() || this.masterVolume === 0;
    };

    AudioManager.isMuteSwitchValid = function() {
        return $gameSwitches.value(param.audioThroughSwitchId);
    };
})();

