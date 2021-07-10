//=============================================================================
// DirectivityShake.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2021/07/10 SINカーブで始点が0でなくなる問題を修正
// 1.1.0 2021/01/10 MZで動作するよう修正
// 1.0.0 2016/11/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 指向性シェイクプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DirectivityShake.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SHAKE_SETTING
 * @text シェイク指向設定
 * @desc 「画面のシェイク」コマンドに方向やSINカーブを設定します。
 *
 * @arg rotation
 * @text 角度
 * @desc 指定した角度でシェイクします。(0-360)
 * @default 0
 * @type number
 * @min 0
 * @max 360
 *
 * @arg sinWave
 * @text SINカーブ
 * @desc 有効にすると振動がSINカーブを描くようになります。
 * @default false
 * @type boolean
 *
 * @help イベントコマンド「画面のシェイク」に指向性を持たせることができます。
 * 角度を指定して縦や斜めに振動させることが可能です。
 *
 * また振動方法を通常の方法以外にsinカーブに設定できます。独特の抑揚がつきます。
 *
 * 「画面のシェイク」を行う直前に、プラグインコマンドを実行してください。
 * シェイクが終了すると設定は自動でリセットされます。
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

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'SHAKE_SETTING', args => {
        $gameScreen.setShakeRotation(args.rotation, args.sinWave);
    });

    //=============================================================================
    // Game_Screen
    //  シェイクの方向を保持します。
    //=============================================================================
    Game_Screen.prototype.getShakeRotation = function() {
        return this._shakeRotation;
    };

    Game_Screen.prototype.setShakeRotation = function(value, sin) {
        this._shakeRotation = value * Math.PI / 180;
        this._shakeSinWave = sin;
    };

    const _Game_Screen_clearShake = Game_Screen.prototype.clearShake;
    Game_Screen.prototype.clearShake = function() {
        _Game_Screen_clearShake.apply(this, arguments);
        this.clearDirectivityShake();
    };

    Game_Screen.prototype.clearDirectivityShake = function() {
        this._shakeRotation = 0;
        this._shakeSinWave  = false;
    };

    const _Game_Screen_updateShake = Game_Screen.prototype.updateShake;
    Game_Screen.prototype.updateShake = function() {
        const wasShake = this.isNeedShakeUpdate();
        if (this._shakeSinWave && wasShake) {
            this.updateSinShake();
        } else {
            _Game_Screen_updateShake.apply(this, arguments);
        }
        if (wasShake && !this.isNeedShakeUpdate()) {
            this.clearDirectivityShake();
        }
    };

    const _Game_Screen_startShake = Game_Screen.prototype.startShake;
    Game_Screen.prototype.startShake = function(power, speed, duration) {
        _Game_Screen_startShake.apply(this, arguments);
        this._shakeDurationTarget = duration;
    };

    Game_Screen.prototype.updateSinShake = function() {
        const pos = this._shakeDurationTarget - this._shakeDuration;
        this._shake = Math.sin(3 * pos * this._shakeSpeed * Math.PI / 180) * this._shakePower * 3;
        this._shakeDuration--;
        if (this._shakeDuration === 0) {
            this._lastShake = this._shake;
        }
        if (this._lastShake * this._shake < 0) {
            this._shake = 0;
            this._lastShake = 0;
        }
    };

    Game_Screen.prototype.isNeedShakeUpdate = function() {
        return this._shakeDuration > 0 || this._shake !== 0;
    };

    //=============================================================================
    // Spriteset_Base
    //  シェイクの方向を反映します。
    //=============================================================================
    const _Spriteset_Base_updatePosition = Spriteset_Base.prototype.updatePosition;
    Spriteset_Base.prototype.updatePosition = function() {
        _Spriteset_Base_updatePosition.apply(this, arguments);
        const shakeRotation  = $gameScreen.getShakeRotation();
        if (shakeRotation) {
            const shakeDistance = Math.round($gameScreen.shake());
            this.x -= shakeDistance;
            this.x += Math.cos(shakeRotation) * shakeDistance;
            this.y += Math.sin(shakeRotation) * shakeDistance;
        }
    };
})();

