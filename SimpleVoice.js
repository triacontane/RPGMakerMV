//=============================================================================
// SimpleVoice.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.5 2025/02/24 config.rmmzsaveが存在しない状態でゲーム開始したとき、ボイス音量のデフォルト値が反映されない問題を修正
// 2.0.4 2024/11/12 オプションウィンドウの項目数をボイス音量の項目に合わせてひとつ追加
// 2.0.3 2023/07/27 サブフォルダを指定したボイス停止ができていなかった問題を修正
// 2.0.2 2022/02/19 ボイスファイルに制御文字\v[n]が指定できるよう修正
// 2.0.1 2021/05/16 サブフォルダを指定できるよう修正
// 2.0.0 2021/03/17 MZで動作するよう修正し、仕様を見直し
// 1.1.3 2020/04/15 1.1.2の修正で同時再生したボイスの停止が動作しない問題を修正
// 1.1.2 2020/04/08 異なるチャンネルで短い間隔で複数のボイスを再生した場合に、先に再生したボイスが演奏されない問題を修正
// 1.1.1 2019/01/22 イベント高速化で再生したとき、SV_STOP_VOICEが効かなくなる場合がある問題を修正
// 1.1.0 2017/07/16 ボイスのチャンネル指定機能を追加。同一チャンネルのボイスが同時再生されないようになります。
// 1.0.1 2017/06/26 英語表記のプラグインコマンドの指定方法を変更
// 1.0.0 2017/06/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 簡易ボイスプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SimpleVoice.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param optionName
 * @text オプション名称
 * @type string
 * @desc オプション画面に表示されるボイス音量の設定項目名称です。
 * @default ボイス 音量
 *
 * @param optionValue
 * @text オプション初期値
 * @type number
 * @desc ボイス音量の初期値です。
 * @default 100
 *
 * @command PLAY_VOICE
 * @text ボイスの演奏
 * @desc ボイスを演奏します。
 *
 * @arg name
 * @text ファイル名称
 * @desc ボイスファイルの名称です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @desc ボイスファイルの音量
 * @default 90
 * @min 0
 * @max 100
 * @type number
 *
 * @arg pitch
 * @text ピッチ
 * @desc ボイスファイルのピッチ
 * @default 100
 * @type number
 *
 * @arg pan
 * @text 左右バランス
 * @desc ボイスファイルの左右バランス
 * @default 0
 * @min -100
 * @max 100
 * @type number
 *
 * @arg channel
 * @text チャンネル番号
 * @desc チャンネル番号です。同一のチャンネル番号のボイスは重なって演奏されなくなります。
 * @default 0
 * @type number
 *
 * @arg loop
 * @text ループ有無
 * @desc ボイスの再生をループするかどうかです。
 * @default false
 * @type boolean
 *
 * @command STOP_VOICE
 * @text ボイスの停止
 * @desc 演奏中のボイスを停止します。ファイルを直接指定するかチャンネル番号を指定して停止します。
 *
 * @arg name
 * @text ファイル名称
 * @desc 停止するボイスファイルの名称です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @arg channel
 * @text チャンネル番号
 * @desc 停止するボイスのチャンネル番号です。
 * @default 0
 * @type number
 *
 * @help SimpleVoice.js
 *
 * 簡易的なボイス演奏をサポートします。
 * プラグインコマンドから演奏、ループ演奏、停止ができます。
 * 音量は効果音とは区別され、オプション画面から調整できます。
 * チャンネルの概念があり、同一のチャンネル番号のボイスは
 * 重なって演奏されなくなります。
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

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'PLAY_VOICE', args => {
        AudioManager.playVoice(args, args.loop, args.channel);
    });

    PluginManagerEx.registerCommand(script, 'STOP_VOICE', args => {
        if (args.name) {
            AudioManager.stopVoice(args.name, null);
        } else if (args.channel) {
            AudioManager.stopVoice(null, args.channel);
        } else {
            AudioManager.stopVoice(null, null);
        }
    });

    //=============================================================================
    // ConfigManager
    //  ボイスボリュームの設定機能を追加します。
    //=============================================================================
    Object.defineProperty(ConfigManager, 'voiceVolume', {
        get: function() {
            return AudioManager._voiceVolume;
        },
        set: function(value) {
            AudioManager.voiceVolume = value;
        }
    });

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        const config         = _ConfigManager_makeData.apply(this, arguments);
        config.voiceVolume = this.voiceVolume;
        return config;
    };

    const _ConfigManager_load = ConfigManager.load;
    ConfigManager.load = function () {
        this.voiceVolume = param.optionValue;
        _ConfigManager_load.apply(this, arguments);
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        const symbol       = 'voiceVolume';
        if (config.hasOwnProperty(symbol)) {
            this.voiceVolume = this.readVolume(config, symbol);
        }
    };

    //=============================================================================
    // Window_Options
    //  ボイスボリュームの設定項目を追加します。
    //=============================================================================
    const _Window_Options_addVolumeOptions      = Window_Options.prototype.addVolumeOptions;
    Window_Options.prototype.addVolumeOptions = function() {
        _Window_Options_addVolumeOptions.apply(this, arguments);
        this.addCommand(param.optionName, 'voiceVolume');
    };

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        return _Scene_Options_maxCommands.apply(this, arguments) + 1;
    };

    //=============================================================================
    // AudioManager
    //  ボイスの演奏機能を追加定義します。
    //=============================================================================
    Object.defineProperty(AudioManager, 'voiceVolume', {
        get: function() {
            return this._voiceVolume;
        },
        set: function(value) {
            this._voiceVolume = value;
        }
    });

    AudioManager.updateVoiceParameters = function(buffer, voice) {
        this.updateBufferParameters(buffer, this._voiceVolume, voice);
    };

    AudioManager._voiceBuffers = [];
    AudioManager._voiceVolume  = 100;
    AudioManager.playVoice     = function(voice, loop, channel) {
        const voicePath = PluginManagerEx.convertEscapeCharacters(voice.name);
        if (voicePath) {
            const path = ('se/' + voicePath).split('/');
            const name = path.pop();
            const folder = path.join('/') + '/';
            this.stopVoice(voice.name, channel);
            const buffer = this.createBuffer(folder, name);
            this.updateVoiceParameters(buffer, voice);
            buffer.play(loop, 0);
            buffer.path = voicePath;
            buffer.channel = channel;
            this._voiceBuffers.push(buffer);
        }
    };

    AudioManager.stopVoice = function(name, channel) {
        const voicePath = name ? PluginManagerEx.convertEscapeCharacters(name) : null;
        this._voiceBuffers.forEach(function(buffer) {
            if (!name && !channel || buffer.path === voicePath || buffer.channel === channel) {
                buffer.stop();
            }
        });
        this.filterPlayingVoice();
    };

    AudioManager.filterPlayingVoice = function() {
        this._voiceBuffers = this._voiceBuffers.filter(function(buffer) {
            const playing = buffer.isPlaying() || !buffer.isReady();
            if (!playing) {
                buffer.stop();
            }
            return playing;
        });
    };

    const _AudioManager_stopAll = AudioManager.stopAll;
    AudioManager.stopAll = function() {
        _AudioManager_stopAll.apply(this, arguments);
        this.stopVoice();
    };

    //=============================================================================
    // Scene_Base
    //  フェードアウト時にSEの演奏も停止します。
    //=============================================================================
    const _Scene_Base_fadeOutAll = Scene_Base.prototype.fadeOutAll;
    Scene_Base.prototype.fadeOutAll = function() {
        _Scene_Base_fadeOutAll.apply(this, arguments);
        AudioManager.stopVoice();
    };
})();
