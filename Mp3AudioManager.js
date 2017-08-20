//=============================================================================
// Mp3AudioManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Mp3AudioManagerPlugin
 * @author triacontane
 *
 * @param UseOnExe
 * @desc Game.exe(NW.js)でmp3ファイルを使用します。
 * @default true
 * @type boolean
 *
 * @param UseOnPc
 * @desc PC版のWebブラウザでmp3ファイルを使用します。
 * @default true
 * @type boolean
 *
 * @param UseOnMobile
 * @desc モバイル版のWebブラウザでmp3ファイルを使用します。
 * @default true
 * @type boolean
 *
 * @param CheckFileSuffix
 * @desc ファイル名の末尾にmp3という文字があった場合のみmp3ファイルを使用します。
 * @default false
 * @type boolean
 *
 * @param LoopTagInfo
 * @desc ループタグ情報です。単位はすべてミリ秒となります。BGMファイルか、BGSファイルのいずれか一つを設定してください。
 * @type struct<LoopTag>[]
 *
 * @param LoopTagUnit
 * @desc ループタグの単位です。現時点ではミリ秒のみ指定可能です。
 * @default ms
 * @type select
 * @option ms
 *
 * @help AudioFormatMp3.js
 *
 * ツクールMVでmp3ファイルを使用可能にします。
 * mp3は、ほぼ全ての環境で再生可能なことと、既存の素材が多いことがメリットです。
 * 特定のファイル（末尾にmp3と付いたファイル）のみmp3で再生することも可能です。
 *
 * デスクトップ環境(Game.exe)でmp3ファイルを再生させるにはNW.jsを最新にする
 * 必要があります。
 *
 * さらに、プラグイン側で独自にループタグを設定することが可能です。
 * この設定はファイルにあらかじめ設定されていたループタグより優先されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc MP3オーディオ管理プラグイン
 * @author トリアコンタン
 *
 * @param EXE実行で使用
 * @desc Game.exe(NW.js)でmp3ファイルを使用します。
 * @default true
 * @type boolean
 *
 * @param PCブラウザで使用
 * @desc PC版のWebブラウザでmp3ファイルを使用します。
 * @default true
 * @type boolean
 *
 * @param モバイルブラウザで使用
 * @desc モバイル版のWebブラウザでmp3ファイルを使用します。
 * @default true
 * @type boolean
 *
 * @param ファイル末尾で判断
 * @desc ファイル名の末尾にmp3という文字があった場合のみmp3ファイルを使用します。
 * @default false
 * @type boolean
 *
 * @param ループタグ情報
 * @desc ループタグ情報です。単位はすべてミリ秒となります。BGMファイルか、BGSファイルのいずれか一つを設定してください。
 * @type struct<LoopTag>[]
 *
 * @param ループタグ単位
 * @desc ループタグの単位です。現時点ではミリ秒のみ指定可能です。
 * @default ms
 * @type select
 * @option ms
 *
 * @help AudioFormatMp3.js
 *
 * ツクールMVでmp3ファイルを使用可能にします。
 * mp3は、ほぼ全ての環境で再生可能なことと、既存の素材が多いことがメリットです。
 * 特定のファイル（末尾にmp3と付いたファイル）のみmp3で再生することも可能です。
 *
 * デスクトップ環境(Game.exe)でmp3ファイルを再生させるにはNW.jsを最新にする
 * 必要があります。
 *
 * さらに、プラグイン側で独自にループタグを設定することが可能です。
 * この設定はファイルにあらかじめ設定されていたループタグより優先されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~LoopTag:
 * @param BGM_NAME
 * @desc BGMファイル名です。BGSといずれかを指定してください。
 * @type file
 * @dir audio/bgm
 * @default
 *
 * @param BGS_NAME
 * @desc BGSファイル名です。BGMといずれかを指定してください。
 * @type file
 * @dir audio/bgm
 * @default
 *
 * @param LOOP_START
 * @desc ループ開始位置です。
 * @type number
 * @default 1
 *
 * @param LOOP_LENGTH
 * @desc ループ長さです。
 * @type number
 * @default 1
 */
/*~struct~LoopTag:ja
 * @param BGM_NAME
 * @desc BGMファイル名です。BGSといずれかを指定してください。
 * @type file
 * @dir audio/bgm
 * @default
 *
 * @param BGS_NAME
 * @desc BGSファイル名です。BGMといずれかを指定してください。
 * @type file
 * @dir audio/bgm
 * @default
 *
 * @param LOOP_START
 * @desc ループ開始位置です。
 * @type number
 * @default 1
 *
 * @param LOOP_LENGTH
 * @desc ループ長さです。
 * @type number
 * @default 1
 */

(function() {
    'use strict';
    var pluginName    = 'Mp3AudioManager';

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
        return '';
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    var getParamArrayJson = function(paramNames, defaultValue) {
        var value = getParamString(paramNames) || null;
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            } else {
                value = value.map(function(valueData) {
                    return JSON.parse(valueData);
                });
            }
            console.log(value);
        } catch (e) {
            alert(`!!!Plugin param is wrong.!!!\nPlugin:${pluginName}.js\nName:[${paramNames}]\nValue:${value}`);
        }
        return value;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param             = {};
    param.useOnExe        = getParamBoolean(['UseOnExe', 'EXE実行で使用']);
    param.useOnPc         = getParamBoolean(['UseOnPc', 'PCブラウザで使用']);
    param.useOnMobile     = getParamBoolean(['UseOnMobile', 'モバイルブラウザで使用']);
    param.checkFileSuffix = getParamBoolean(['CheckFileSuffix', 'ファイル末尾で判断']);
    param.loopTagInfo     = getParamArrayJson(['LoopTagInfo', 'ループタグ情報'], []);

    //=============================================================================
    // AudioManager
    //  mp3ファイルを取り扱いできるようにします。
    //=============================================================================
    var _AudioManager_audioFileExt = AudioManager.audioFileExt;
    AudioManager.audioFileExt      = function() {
        if (this._isUseMp3()) {
            this._useMp3 = false;
            return '.mp3';
        } else {
            return _AudioManager_audioFileExt.apply(this, arguments);
        }
    };

    var _AudioManager_playEncryptedBgm = AudioManager.playEncryptedBgm;
    AudioManager.playEncryptedBgm      = function(bgm, pos) {
        if (bgm) {
            this._checkUseMp3(bgm.name);
        }
        _AudioManager_playEncryptedBgm.apply(this, arguments);
    };

    var _AudioManager_createBuffer = AudioManager.createBuffer;
    AudioManager.createBuffer      = function(folder, name) {
        this._checkUseMp3(name);
        return _AudioManager_createBuffer.apply(this, arguments);
    };

    AudioManager._checkUseMp3 = function(fileName) {
        this._useMp3 = fileName.match(/mp3$/);
    };

    AudioManager._isUseMp3 = function() {
        var useMp3;
        if (Utils.isNwjs()) {
            useMp3 = param.useOnExe;
        } else if (Utils.isMobileDevice()) {
            useMp3 = param.useOnMobile;
        } else {
            useMp3 = param.useOnPc;
        }
        return useMp3 && (!param.checkFileSuffix || this._useMp3);
    };

    //=============================================================================
    // WebAudio
    //  カスタムループコメントを設定します。
    //=============================================================================
    var _WebAudio__readLoopComments      = WebAudio.prototype._readLoopComments;
    WebAudio.prototype._readLoopComments = function(array) {
        _WebAudio__readLoopComments.apply(this, arguments);
        this._readCustomLoopComments();
    };

    WebAudio.prototype._readCustomLoopComments = function() {
        param.loopTagInfo.forEach(function(tagInfo) {
            if (this._isExistCustomLoopTag(tagInfo)) {
                this._loopStart  = parseInt(tagInfo.LOOP_START) / 1000;
                this._loopLength = parseInt(tagInfo.LOOP_LENGTH) / 1000;
                // I don't understand method to read sampling rate from mp3 file.
                this._sampleRate = 1;
            }
        }, this);
    };

    WebAudio.prototype._isExistCustomLoopTag = function(tagInfo) {
        var path = this._url.replace(/\.\w+?$/, '');
        return path === 'audio/bgm/' + tagInfo.BGM_NAME || path === 'audio/bgs/' + tagInfo.BGS_NAME
    };
})();

