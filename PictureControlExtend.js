/*=============================================================================
 PictureControlExtend.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2022/05/04 DirectivityShake.jsと併用してピクチャをシェイク無効にしたとき、縦方向のシェイクに対しても影響を受けなくなるよう修正
 1.1.1 2021/06/03 ピクチャの変数指定が解除コマンドで正常に解除されない問題を修正
 1.1.0 2021/05/29 ピクチャの原点を詳細指定できるコマンドを追加
 1.0.0 2021/05/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ピクチャの操作拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureControlExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command MULTI_CONTROL
 * @text ピクチャの一括操作
 * @desc ピクチャ関連のイベントコマンドの操作対象を複数にします。
 *
 * @arg all
 * @text 全て
 * @desc 全ての表示ピクチャを操作対象にします。
 * @default false
 * @type boolean
 *
 * @arg startNumber
 * @text 開始番号
 * @desc 操作対象のピクチャの開始番号です。
 * @default 0
 * @type number
 *
 * @arg endNumber
 * @text 終了番号
 * @desc 操作対象のピクチャの開始番号です。
 * @default 0
 * @type number
 *
 * @arg list
 * @text 直接指定リスト
 * @desc 操作対象のピクチャを直接指定する一覧です。
 * @default []
 * @type number[]
 *
 * @arg variable
 * @text 変数
 * @desc 操作対象のピクチャを指定した変数値から取得できます。
 * @default 0
 * @type variable
 *
 * @command MULTI_CONTROL_CLEAR
 * @text ピクチャの一括操作解除
 * @desc ピクチャ関連のイベントコマンドの操作対象を元に戻します。
 *
 * @command PICTURE_SHAKE
 * @text ピクチャのシェイク
 * @desc ピクチャを揺らします。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 操作対象のピクチャ番号です。
 * @default 1
 * @type number
 * @min 1
 *
 * @arg power
 * @text 強さ
 * @desc シェイクの強さ
 * @default 1
 * @type number
 * @max 9
 * @min 1
 *
 * @arg speed
 * @text 速さ
 * @desc シェイクの速さ
 * @default 1
 * @type number
 * @max 9
 * @min 1
 *
 * @arg rotation
 * @text 角度
 * @desc シェイクの角度(0-360)
 * @default 0
 * @type number
 * @max 360
 * @min 0
 *
 * @arg duration
 * @text 時間
 * @desc 処理時間(フレーム単位)です。
 * @default 0
 * @type number
 * @min 0
 *
 * @arg wait
 * @text 完了までウェイト
 * @desc 処理が完了するまでウェイトします。
 * @default false
 * @type boolean
 *
 * @command PICTURE_OUT_OF_SHAKE
 * @text 画面のシェイク対象から外す
 * @desc ピクチャを画面のシェイク対象から外します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 操作対象のピクチャ番号です。
 * @default 1
 * @type number
 * @min 1
 *
 * @arg value
 * @text 設定値
 * @desc 設定値です。有効にした場合ピクチャを画面のシェイク対象から外します。
 * @default true
 * @type boolean
 *
 * @command PICTURE_SPIN
 * @text ピクチャの角度設定
 * @desc 角度を指定してその角度までピクチャを回転させます。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 操作対象のピクチャ番号です。
 * @default 1
 * @type number
 * @min 1
 *
 * @arg rotation
 * @text 角度
 * @desc ピクチャの角度です。
 * @default 0
 * @type number
 * @max 360
 * @min 0
 *
 * @arg relative
 * @text 相対指定
 * @desc 有効にすると、現在のピクチャの角度から指定した角度ぶん回転させます。
 * @default false
 * @type boolean
 *
 * @arg duration
 * @text 時間
 * @desc 処理時間(フレーム単位)です。
 * @default 0
 * @type number
 * @min 0
 *
 * @arg wait
 * @text 完了までウェイト
 * @desc 処理が完了するまでウェイトします。
 * @default false
 * @type boolean
 *
 * @command PICTURE_ORIGIN
 * @text ピクチャの原点設定
 * @desc ピクチャの原点を細かく指定します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 操作対象のピクチャ番号です。
 * @default 1
 * @type number
 * @min 1
 *
 * @arg ox
 * @text 原点X
 * @desc ピクチャのX座標の原点です。百分率で指定します。
 * @default 0
 * @type number
 * @max 100
 * @min 0
 *
 * @arg oy
 * @text 原点Y
 * @desc ピクチャのY座標の原点です。百分率で指定します。
 * @default 0
 * @type number
 * @max 100
 * @min 0
 *
 * @help PictureControlExtend.js
 *
 * ピクチャ関連のイベントコマンドの機能を拡張します。
 * 専用のプラグインコマンドを実行します。
 * 以下のコマンドが提供されます。
 *
 * ・ピクチャの一括操作
 * 複数のピクチャに対して一括で表示や移動ができます。
 * 対象コマンドは表示、移動、消去、色調変更、回転のほか
 * 本プラグインで追加されたコマンドです。
 * 一括操作が有効なとき、イベントで指定したピクチャ番号は無視されます。
 *
 * ・ピクチャのシェイク
 * ピクチャを指定した強さ、速さ、角度で揺らします。
 *
 * ・ピクチャを画面のシェイク対象から外す
 * ピクチャが画面のシェイクの影響を受けなくなります。
 *
 * ・ピクチャの角度設定
 * ピクチャを指定した角度になるまで回転させます。
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

    PluginManagerEx.registerCommand(script, 'MULTI_CONTROL', args => {
        $gameScreen.setupPictureTarget(args);
    });

    PluginManagerEx.registerCommand(script, 'MULTI_CONTROL_CLEAR', args => {
        $gameScreen.clearPictureTarget();
    });

    PluginManagerEx.registerCommand(script, 'PICTURE_SHAKE', function(args) {
        $gameScreen.shakePicture(args.pictureId, args);
        if (args.wait) {
            this.wait(args.duration);
        }
    });

    PluginManagerEx.registerCommand(script, 'PICTURE_SPIN', function(args) {
        if (args.relative) {
            $gameScreen.spinPictureRelative(args.pictureId, args);
        } else {
            $gameScreen.spinPicture(args.pictureId, args);
        }
        if (args.wait) {
            this.wait(args.duration);
        }
    });

    PluginManagerEx.registerCommand(script, 'PICTURE_OUT_OF_SHAKE', function(args) {
        $gameScreen.setOutOfScreenShakePicture(args.pictureId, args);
    });

    PluginManagerEx.registerCommand(script, 'PICTURE_ORIGIN', function(args) {
        $gameScreen.setPictureOrigin(args.pictureId, args);
    });

    /**
     * Game_Screen
     */
    Game_Screen.prototype.setupPictureTarget = function(target) {
        this._pictureTargets = this.findPictureTarget(target);
        this._pictureTragetVariable = target.variable;
    };

    Game_Screen.prototype.clearPictureTarget = function() {
        this._pictureTargets = null;
        this._pictureTragetVariable = 0;
    };

    Game_Screen.prototype.findPictureTarget = function(target) {
        const list = [];
        if (target.all) {
            this.appendPictureNumber(1, this.maxPictures(), list);
        } else {
            if (target.startNumber && target.endNumber) {
                this.appendPictureNumber(target.startNumber, target.endNumber, list);
            }
            if (target.list) {
                return list.concat(target.list);
            }
        }
        return list;
    };


    Game_Screen.prototype.appendPictureNumber = function(start, end, list) {
        for (let i = start; i <= end; i++) {
            list.push(i);
        }
    };

    Game_Screen.prototype.iteratePictures = function(callBack, args) {
        if (this._pictureTargets) {
            this._pictureTargets.forEach(id => {
                args[0] = id;
                callBack.apply(this, args);
            });
        } else {
            callBack.apply(this, args);
        }
        if (this._pictureTragetVariable > 0) {
            args[0] = $gameVariables.value(this._pictureTragetVariable);
            callBack.apply(this, args);
        }
    };

    const _Game_Screen_showPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function() {
        this.iteratePictures(_Game_Screen_showPicture, arguments);
    };

    const _Game_Screen_movePicture = Game_Screen.prototype.movePicture;
    Game_Screen.prototype.movePicture = function() {
        this.iteratePictures(_Game_Screen_movePicture, arguments);
    };

    const _Game_Screen_rotatePicture = Game_Screen.prototype.rotatePicture;
    Game_Screen.prototype.rotatePicture = function() {
        this.iteratePictures(_Game_Screen_rotatePicture, arguments);
    };

    const _Game_Screen_tintPicture = Game_Screen.prototype.tintPicture;
    Game_Screen.prototype.tintPicture = function() {
        this.iteratePictures(_Game_Screen_tintPicture, arguments);
    };

    const _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
    Game_Screen.prototype.erasePicture = function(pictureId) {
        this.iteratePictures(_Game_Screen_erasePicture, arguments);
    };

    Game_Screen.prototype.setOutOfScreenShakePicture = function(pictureId, args) {
        this.iteratePictures((pictureId, args) => {
            const picture = this.picture(pictureId);
            if (picture) {
                picture.setOutOfScreenShake(args.value);
            }
        }, arguments);
    };

    Game_Screen.prototype.shakePicture = function(pictureId, args) {
        this.iteratePictures((pictureId, args) => {
            const picture = this.picture(pictureId);
            if (picture) {
                picture.shake(args.power, args.speed, args.rotation, args.duration);
            }
        }, arguments);
    };

    Game_Screen.prototype.spinPicture = function(pictureId, args) {
        this.iteratePictures((pictureId, args) => {
            const picture = this.picture(pictureId);
            if (picture) {
                picture.spin(args.rotation, args.duration);
            }
        }, arguments);
    };

    Game_Screen.prototype.spinPictureRelative = function(pictureId, args) {
        this.iteratePictures((pictureId, args) => {
            const picture = this.picture(pictureId);
            if (picture) {
                picture.spinRelative(args.rotation, args.duration);
            }
        }, arguments);
    };

    Game_Screen.prototype.setPictureOrigin = function(pictureId, args) {
        this.iteratePictures((pictureId, args) => {
            const picture = this.picture(pictureId);
            if (picture) {
                picture.setCustomOrigin(args.ox, args.oy);
            }
        }, arguments);
    };

    /**
     * Game_Picture
     */
    const _Game_Picture_x      = Game_Picture.prototype.x;
    Game_Picture.prototype.x = function() {
        let x = _Game_Picture_x.apply(this, arguments) + this.getShakeX();
        if (this._outOfScreenShake) {
            // for DirectivityShake.js
            if ($gameScreen.getShakeRotation) {
                const shakeRotation  = $gameScreen.getShakeRotation();
                const shakeDistance = Math.round($gameScreen.shake());
                x -= Math.cos(shakeRotation) * shakeDistance;
            } else {
                x -= Math.round($gameScreen.shake());
            }
        }
        return x;
    };

    const _Game_Picture_y      = Game_Picture.prototype.y;
    Game_Picture.prototype.y = function() {
        let y = _Game_Picture_y.apply(this, arguments) + this.getShakeY();
        if (this._outOfScreenShake) {
            // for DirectivityShake.js
            if ($gameScreen.getShakeRotation) {
                const shakeRotation  = $gameScreen.getShakeRotation();
                const shakeDistance = Math.round($gameScreen.shake());
                y -= Math.sin(shakeRotation) * shakeDistance;
            }
        }
        return y;
    };

    Game_Picture.prototype.setCustomOrigin = function(ox, oy) {
        this._customOrigin = {ox: ox / 100, oy: oy / 100};
    };

    Game_Picture.prototype.customOrigin = function() {
        return this._customOrigin;
    };

    Game_Picture.prototype.setOutOfScreenShake = function(value) {
        this._outOfScreenShake = !!value;
    };

    Game_Picture.prototype.spin = function(targetRotation, duration) {
        this._targetRotation = targetRotation;
        this._angle          = (this._angle % 360);
        if (duration === 0) {
            this._angle = this._targetRotation;
        } else {
            this._spinDuration = duration;
        }
    };

    Game_Picture.prototype.spinRelative = function(targetRelativeRotation, duration) {
        this._angle = (this._angle % 360);
        this.spin(this._angle + targetRelativeRotation, duration);
    };

    Game_Picture.prototype.shake = function(power, speed, rotation, duration) {
        this.stopShake();
        this._shakePower     = power;
        this._shakeSpeed     = speed;
        this._shakeDuration  = duration;
        this._shakeRotation  = rotation * Math.PI / 180;
    };

    Game_Picture.prototype.stopShake = function() {
        this._shakeDirection = 1;
        this._shake          = 0;
    };

    const _Game_Picture_update      = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.apply(this, arguments);
        this.updateSpin();
        this.updateShake();
    };

    Game_Picture.prototype.updateSpin = function() {
        if (this._spinDuration > 0) {
            const d       = this._spinDuration;
            this._angle = (this._angle * (d - 1) + this._targetRotation) / d;
            this._spinDuration--;
        }
    };

    Game_Picture.prototype.updateShake = function() {
        if (this._shakeDuration > 0 || this._shake !== 0) {
            const delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
                this._shake = 0;
            } else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        } else {
            this._shakeDuration = 0;
        }
    };

    Game_Picture.prototype.getShakeX = function() {
        return this._shake ? this._shake * Math.cos(this._shakeRotation) : 0;
    };

    Game_Picture.prototype.getShakeY = function() {
        return this._shake ? this._shake * Math.sin(this._shakeRotation) : 0;
    };

    const _Sprite_Picture_updateOrigin = Sprite_Picture.prototype.updateOrigin;
    Sprite_Picture.prototype.updateOrigin = function() {
        _Sprite_Picture_updateOrigin.apply(this, arguments);
        if (this.picture()) {
            const origin = this.picture().customOrigin();
            if (origin) {
                this.anchor.x = origin.ox;
                this.anchor.y = origin.oy;
            }
        }
    };
})();
