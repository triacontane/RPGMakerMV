/*=============================================================================
 TimerControl.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/05/12 不要パラメータを削除
 1.0.0 2022/05/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイマー操作プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerCotrol.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command PAUSE
 * @text 一時停止
 * @desc 動作中のタイマーを一時停止します。
 *
 * @command PLAY
 * @text 再開
 * @desc 一時停止したタイマーを再開します。
 *
 * @command ADD
 * @text 加算
 * @desc 指定した秒数だけタイマーを加算します。
 *
 * @arg operand
 * @text オペランド
 * @desc タイマーに加算する秒数です。負の値を指定すると減算します。変数値を指定する場合は制御文字\v[n]を使います。
 * @default 0
 * @type number
 * @min -99999999
 * @max 99999999
 *
 * @help TimerControl.js
 *
 * タイマーの一時停止、再開および秒数の加算、減算を可能にする
 * プラグインコマンドを提供します。
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

    PluginManagerEx.registerCommand(script, 'PAUSE', args => {
        $gameTimer.setPause(true);
    });

    PluginManagerEx.registerCommand(script, 'PLAY', args => {
        $gameTimer.setPause(false);
    });

    PluginManagerEx.registerCommand(script, 'ADD', args => {
        $gameTimer.add(args.operand * 60);
    });

    /**
     * Game_Timer
     */
    const _Game_Timer_initialize = Game_Timer.prototype.initialize;
    Game_Timer.prototype.initialize = function() {
        _Game_Timer_initialize.apply(this, arguments);
        this._pause = false;
    };

    const _Game_Timer_update = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        if (this._pause) {
            return;
        }
        _Game_Timer_update.apply(this, arguments);
    };

    const _Game_Timer_start = Game_Timer.prototype.start;
    Game_Timer.prototype.start = function(count) {
        _Game_Timer_start.apply(this, arguments);
        this._pause = false;
    };

    Game_Timer.prototype.setPause = function(value) {
        this._pause = value;
    };

    Game_Timer.prototype.add = function(frame) {
        if (this._working) {
            this._frames += frame;
        }
    };
})();
