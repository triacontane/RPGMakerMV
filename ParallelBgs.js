//=============================================================================
// ParallelBgs.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2021/03/06 BGMのフェードアウトのイベントコマンドでは現在のラインのBGSのみフェードアウトするよう修正
// 1.1.0 2020/12/14 MZ向けに全面的に修正
// 1.0.3 2020/02/02 ヘルプのプラグインコマンド「PB_BGSライン変更」が間違っていたので「PB_BGS_ライン変更」に修正(コード修正なし)
// 1.0.2 2017/01/05 BGSの演奏状態によっては、セーブ＆ロードした際に一部のBGSが演奏されなくなる現象の修正(byくらむぼん氏)
// 1.0.1 2016/11/16 BGSをプレーしていない状態でセーブ＆ロードするとエラーになる現象の修正
// 1.0.0 2016/11/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc BGS並行演奏プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelBgs.js
 * @base PluginCommonBase
 * @author トリアコンタン
 * 
 * @command CHANGE_LINE
 * @text ライン変更
 * @desc 現在のBGSの演奏ラインを変更します。演奏ラインの異なるBGSは並行して演奏できます。
 *
 * @arg line
 * @text ライン番号
 * @desc 変更するBGSのライン番号です。
 * @default 1
 * @type number
 * 
 * @command ALL_STOP
 * @text 全停止
 * @desc 全ての演奏中のBGSを停止します。
 * 
 * @command FADEOUT_FOR_SE
 * @text SE演奏時フェードアウト
 * @desc SEが演奏されたタイミングでBGSを自動フェードアウトします。
 * 
 * @arg type
 * @text フェードアウト種別
 * @desc フェードアウトのやり方です。
 * @default 1
 * @type select
 * @option 0:フェードアウトせずに通常通りSEを演奏します。
 * @value 0
 * @option 1:SE演奏と同時にフェードアウトを開始します。
 * @value 1
 * @option 2:フェードアウトが完了してからSE演奏します。
 * @value 2
 * 
 * @arg fadeTime
 * @text フェード時間
 * @desc 自動フェードアウトに掛かる時間(フレーム)です。
 * @default 60
 * @type number
 *
 * @help ParallelBgs.js
 * 
 * 複数のBGSを並行して演奏できます。
 * プラグインコマンドからBGSの演奏ラインを変更すると元のBGSを演奏したまま、
 * 新しく別のBGSを演奏することができます。
 * 並行演奏しているBGSはそれぞれ個別に音量やピッチ、左右バランスを調節できます。
 * 演奏ラインのデフォルトは[1]です。
 *
 * ラインの数に制限はありませんが、あまりに大量のBGSを
 * 同時に演奏しようとすると動作に影響がでる恐れがあります。
 *
 * なお、マップで指定するオート演奏のBGSはラインが[1]で固定になります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'CHANGE_LINE', args => {
        $gameSystem.setBgsLine(args.line);
    });

    PluginManagerEx.registerCommand(script, 'ALL_STOP', args => {
        AudioManager.stopAllBgs();
    });

    PluginManagerEx.registerCommand(script, 'FADEOUT_FOR_SE', args => {
        $gameSystem.setBgsFadeForSe(args.type, args.fadeTime);
    });

    const _Game_Interpreter_command246 = Game_Interpreter.prototype.command246;
    Game_Interpreter.prototype.command246 = function(params) {
        AudioManager._bgsFadeOutByLine = true;
        const result = _Game_Interpreter_command246.apply(this, arguments);
        AudioManager._bgsFadeOutByLine = false;
        return result;
    };

    //=============================================================================
    // Game_System
    //  BGS演奏ラインを変更します。
    //=============================================================================
    const _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this.initBgsMember();
    };

    Game_System.prototype.initBgsMember = function() {
        this.setBgsLine(this.getBgsLine());
        this.setBgsFadeForSe(this.getBgsFadeForSe(), this.getBgsFadeTime());
    };

    Game_System.prototype.getBgsLine = function() {
        return this._bgsLine || 1;
    };

    Game_System.prototype.setBgsLine = function(value) {
        this._bgsLine = value;
        AudioManager.setBgsLineIndex(value);
    };

    Game_System.prototype.getBgsFadeForSe = function() {
        return this._bgsFadeForPlayingSe || 0;
    };

    Game_System.prototype.setBgsFadeForSe = function(se, time) {
        this._bgsFadeForPlayingSe = se;
        this._bgsFadeTime = time;
        AudioManager.setBgsFadeForSe(se);
    };

    Game_System.prototype.getBgsFadeTime = function() {
        return this._bgsFadeTime || 1;
    };

    const _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        this.initBgsMember();
    };

    const _Game_Map_autoplay      = Game_Map.prototype.autoplay;
    Game_Map.prototype.autoplay = function() {
        AudioManager.multiLineDisable = true;
        _Game_Map_autoplay.apply(this, arguments);
        AudioManager.multiLineDisable = false;
    };

    //=============================================================================
    // AudioManager
    //  複数のBGS演奏ラインを管理します。
    //=============================================================================
    AudioManager.multiLineDisable = false;
    AudioManager._bgsLineIndex    = 1;
    AudioManager._bgsFadeForSe    = 0;
    AudioManager._bgsFadeTime     = 1;
    AudioManager._allBgsBuffer    = [];
    AudioManager._currentAllBgs   = [];
    AudioManager._delaySeStack    = [];
    AudioManager._allStop         = false;
    AudioManager._stopAllBgs      = true;
    AudioManager._bgsFading       = false;
    AudioManager._bgsFadeCounter  = 0;

    const _AudioManager_bgsVolume = Object.getOwnPropertyDescriptor(AudioManager, 'bgsVolume');
    Object.defineProperty(AudioManager, 'bgsVolume', {
        get: function() {
            return _AudioManager_bgsVolume.get.call(this);
        },
        set: function(value) {
            _AudioManager_bgsVolume.set.call(this, value);
            const nowBgs = this._currentBgs;
            this.iterateAllBgs(function() {
                if (nowBgs !== this._currentBgs) this.updateBgsParameters(this._currentBgs);
            }.bind(this));
        },
        configurable: true
    });

    Object.defineProperty(AudioManager, '_bgsBuffer', {
        get: function() {
            return this._allBgsBuffer[this.getBgsLineIndex()];
        },
        set: function(value) {
            this._allBgsBuffer[this.getBgsLineIndex()] = value;
        }
    });

    Object.defineProperty(AudioManager, '_currentBgs', {
        get: function() {
            return this._currentAllBgs[this.getBgsLineIndex()];
        },
        set: function(value) {
            this._currentAllBgs[this.getBgsLineIndex()] = value;
        }
    });

    AudioManager.getBgsLineIndex = function() {
        return this.multiLineDisable ? 1 : this._bgsLineIndex;
    };

    AudioManager.setBgsLineIndex = function(index) {
        this._bgsLineIndex = index;
    };

    AudioManager.setBgsFadeForSe = function(value) {
        this._bgsFadeForSe = value;
    };

    AudioManager.setBgsFadeTime = function(value) {
        this._bgsFadeTime = value;
    };

    const _AudioManager_playBgs = AudioManager.playBgs;
    AudioManager.playBgs      = function(bgs, pos) {
        if (!bgs) return;
        this._stopAllBgs = false;
        if (Array.isArray(bgs)) {
            this.playAllBgs(bgs);
        } else {
            _AudioManager_playBgs.apply(this, arguments);
        }
        this._stopAllBgs = true;
    };

    AudioManager.playAllBgs = function(bgsArray) {
        this.stopAllBgs();
        const prevIndex      = this._bgsLineIndex;
        this._bgsLineIndex = 1;
        bgsArray.forEach(function(bgs, index) {
            this._bgsLineIndex = index;
            this.playBgs(bgs, null);
        }, this);
        this._bgsLineIndex = prevIndex;
    };

    const _AudioManager_replayBgs = AudioManager.replayBgs;
    AudioManager.replayBgs      = function(bgs) {
        if (!bgs) return;
        if (Array.isArray(bgs)) {
            this.replayAllBgs(bgs);
        } else {
            _AudioManager_replayBgs.apply(this, arguments);
        }
    };

    AudioManager.replayAllBgs = function(bgsArray) {
        this.stopAllBgs();
        const prevIndex      = this._bgsLineIndex;
        this._bgsLineIndex = 1;
        bgsArray.forEach(function(bgs, index) {
            this._bgsLineIndex = index;
            this.replayBgs(bgs);
        }, this);
        this._bgsLineIndex = prevIndex;
    };

    const _AudioManager_saveBgs = AudioManager.saveBgs;
    AudioManager.saveBgs      = function() {
        const bgsArray = [];
        this.iterateAllBgs(function() {
            bgsArray[this._bgsLineIndex] = _AudioManager_saveBgs.apply(this, arguments);
        }.bind(this));
        return bgsArray.length > 1 ? bgsArray : bgsArray[0];
    };

    const _AudioManager_stopBgs = AudioManager.stopBgs;
    AudioManager.stopBgs      = function() {
        if (!this._stopAllBgs) {
            _AudioManager_stopBgs.apply(this, arguments);
        } else {
            this.stopAllBgs();
        }
    };

    AudioManager.stopAllBgs = function() {
        this.iterateAllBgs(function() {
            _AudioManager_stopBgs.apply(this, arguments);
        }.bind(this));
    };

    const _AudioManager_fadeOutBgs = AudioManager.fadeOutBgs;
    AudioManager.fadeOutBgs      = function(time) {
        if (this._bgsFadeOutByLine) {
            _AudioManager_fadeOutBgs.call(this, time);
        } else {
            this.iterateAllBgs(function() {
                _AudioManager_fadeOutBgs.call(this, time);
            }.bind(this));
        }
    };

    const _AudioManager_fadeInBgs = AudioManager.fadeInBgs;
    AudioManager.fadeInBgs      = function(time) {
        this.iterateAllBgs(function() {
            _AudioManager_fadeInBgs.call(this, time);
        }.bind(this));
    };

    AudioManager.iterateAllBgs = function(callBack) {
        const prevIndex = this._bgsLineIndex;
        Object.keys(this._allBgsBuffer).forEach(function(index) {
            this._bgsLineIndex = index;
            callBack(this._bgsBuffer);
        }, this);
        this._bgsLineIndex = prevIndex;
    };

    const _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe      = function(se) {
        if (this.isNeedFadeOut()) {
            this.fadeOutBgsForSe();
        }
        if (this._bgsFadeForSe === 2 && this._currentBgs && this._bgsFadeCounter > 0) {
            this._delaySeStack.push(se);
        } else {
            _AudioManager_playSe.apply(this, arguments);
        }
    };

    AudioManager.updateBgsFade = function() {
        if (this.isNeedFadeIn()) {
            this.fadeInBgsForSe();
        }
        if (this._bgsFadeCounter > 0) {
            this._bgsFadeCounter--;
            if (this._bgsFadeCounter === 0) {
                this.playDelayedSe();
            }
        }
    };

    AudioManager.fadeOutBgsForSe = function() {
        const currentAllBgs = this._currentAllBgs.clone();
        this.fadeOutBgs(this._bgsFadeTime);
        this._currentAllBgs =  currentAllBgs;
        this._bgsFading      = true;
        this._bgsFadeCounter = this._bgsFadeTime * 60;
    };

    AudioManager.isNeedFadeOut = function() {
        return !this._bgsFading && this._bgsFadeForSe !== 0;
    };

    AudioManager.fadeInBgsForSe = function() {
        this.fadeInBgs(this._bgsFadeTime);
        this._bgsFading      = false;
        this._bgsFadeCounter = 0;
    };

    AudioManager.isNeedFadeIn = function() {
        return this._bgsFading && !this.isPlayingAnySe() && this._bgsFadeCounter === 0;
    };

    AudioManager.playDelayedSe = function() {
        while (this._delaySeStack.length > 0) {
            _AudioManager_playSe.call(this, this._delaySeStack.pop());
        }
    };

    AudioManager.isPlayingAnySe = function() {
        return this._seBuffers.some(function(audio) {
            return audio.isExist();
        });
    };

    //=============================================================================
    // WebAudio
    //  演奏が要求済みかどうかを返します。
    //=============================================================================
    WebAudio.prototype.isExist = function() {
        return this._autoPlay;
    };

    //=============================================================================
    // SceneManager
    //  AudioManagerの更新処理を呼び出します。
    //=============================================================================
    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene      = function() {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene) {
            AudioManager.updateBgsFade();
        }
    };
})();

