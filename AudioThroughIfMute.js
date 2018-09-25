//=============================================================================
// AudioThroughIfMute.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * 任意のスイッチがONになっている場合に、音声ファイルを演奏および読み込みしなくなります。
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
 * 任意のスイッチがONになっている場合に、音声ファイルを演奏および読み込みしなくなります。
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
    // AudioManager
    //  ミュート時の音声ファイルのロードを行わないよう変更します。
    //=============================================================================
    var _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm = function(bgm, pos) {
        if (this.isBgmMute()) {
            return;
        }
        _AudioManager_playBgm.apply(this, arguments);
    };

    var _AudioManager_playBgs = AudioManager.playBgs;
    AudioManager.playBgs = function(bgs, pos) {
        if (this.isBgsMute()) {
            return;
        }
        _AudioManager_playBgs.apply(this, arguments);
    };

    var _AudioManager_playMe = AudioManager.playMe;
    AudioManager.playMe = function(me) {
        if (this.isMeMute()) {
            return;
        }
        _AudioManager_playMe.apply(this, arguments);
    };

    var _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        if (this.isSeMute()) {
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

