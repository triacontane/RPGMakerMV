//=============================================================================
// PictureAnimation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2015/12/21 ピクチャのファイル名を連番方式で指定できる機能を追加
//                  アニメーションの強制終了の機能を追加
// 1.0.0 2015/12/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ピクチャのアニメーションプラグイン
 * @author トリアコンタン
 * 
 * @help 指定したフレーム間隔でピクチャをアニメーションします。
 * アニメーションしたいセル画像（※）を用意の上
 * 以下のコマンドを入力してください。
 *
 * 1. ピクチャのアニメーション準備（プラグインコマンド）
 * 2. ピクチャの表示（通常のイベントコマンド）
 * 3. ピクチャのアニメーション開始（プラグインコマンド）
 * 4. ピクチャのアニメーション終了（プラグインコマンド）
 *
 * ※配置方法は以下の3通りがあります。
 *  縦　：セルを縦に並べて全体を一つのファイルにします。
 *  横　：セルを横に並べて全体を一つのファイルにします。
 *  連番：連番のセル画像を複数用意します。(original部分は任意の文字列)
 *   original00.png(ピクチャの表示で指定するオリジナルファイル)
 *   original01.png
 *   original02.png...
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  PA_INIT or
 *  ピクチャのアニメーション準備 [セル数] [フレーム数] [セル配置方法] :
 *  　このコマンドの次に実行される「ピクチャの表示」をアニメーション対象にします。
 *  　セル数　　　：アニメーションするセル画の数
 *  　フレーム数　：アニメーションする間隔のフレーム数
 *  　セル配置方向：セルの配置（縦 or 横 or 連番）※省略すると縦になります。
 *  　例：PA_INIT 4 10 連番
 *
 *  PA_START or
 *  ピクチャのアニメーション開始 [ピクチャ番号] [アニメーションタイプ]
 *  　指定したピクチャ番号のピクチャをアニメーションを開始します。
 *  　一周するとアニメーションは自動で止まります。
 *
 *  　アニメーションのタイプは以下の2パターンがあります。
 *  　　例：セル数が 4 の場合
 *  　　　タイプ1: 1→2→3→4→1→2→3→4...
 *  　　　タイプ2: 1→2→3→4→3→2→1→2...
 *
 *  PA_START_LOOP or
 *  ピクチャのループアニメーション開始 [ピクチャ番号] [アニメーションタイプ]
 *  　指定したピクチャ番号のピクチャをアニメーションを開始します。
 *  　終了するまでアニメーションが続きます。
 *
 *  PA_STOP or
 *  ピクチャのアニメーション終了 [ピクチャ番号]
 *  　指定したピクチャ番号のピクチャをアニメーションを終了します。
 *  　一番上のセルに戻った時点でアニメーションが止まります。
 *
 *  PA_STOP_FORCE or
 *  ピクチャのアニメーション強制終了 [ピクチャ番号]
 *  　指定したピクチャ番号のピクチャをアニメーションを終了します。
 *  　現在表示しているセルでアニメーションが止まります。
 *
 *  PA_SET_CELL or
 *  ピクチャのアニメーションセル設定 [ピクチャ番号] [セル番号]
 *  　アニメーションのセルを直接設定します。（開始位置は 1 です）
 *  　任意のタイミングでアニメーションしたい場合に有効です。
 *  　セル番号を指定しなかった場合は、アニメーションを一つ先に進めます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */
(function () {
    'use strict';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getArgString = function (args, upperFlg) {
        args = convertEscapeCharacters(args);
        return upperFlg ? args.toUpperCase() : args;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        try {
            this.pluginCommandPictureAnimation.call(this, command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                var devTool = window.showDevTools();
                devTool.moveTo(0, 0);
                devTool.resizeTo(Graphics.width, Graphics.height);
                window.focus();
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandPictureAnimation = function (command, args) {
        var pictureNum, animationType, picture, cellNumber, frameNumber, direction;
        switch (getCommandName(command)) {
            case 'PA_INIT' :
            case 'ピクチャのアニメーション準備':
                cellNumber  = getArgNumber(args[0], 1, 99);
                frameNumber = getArgNumber(args[1], 1, 9999);
                direction   = getArgString(args[2], true) || '縦';
                $gameScreen.setPicturesAnimation(cellNumber, frameNumber, direction);
                break;
            case 'PA_START' :
            case 'ピクチャのアニメーション開始':
                pictureNum    = getArgNumber(args[0], 1, 100);
                animationType = getArgNumber(args[1], 1, 2);
                picture       = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.startAnimation(animationType, false);
                break;
            case 'PA_START_LOOP' :
            case 'ピクチャのループアニメーション開始':
                pictureNum    = getArgNumber(args[0], 1, 100);
                animationType = getArgNumber(args[1], 1, 2);
                picture = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.startAnimation(animationType, true);
                break;
            case 'PA_STOP' :
            case 'ピクチャのアニメーション終了':
                pictureNum    = getArgNumber(args[0], 1, 100);
                picture       = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.stopAnimation(false);
                break;
            case 'PA_STOP_FORCE' :
            case 'ピクチャのアニメーション強制終了':
                pictureNum    = getArgNumber(args[0], 1, 100);
                picture       = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.stopAnimation(true);
                break;
            case 'PA_SET_CELL' :
            case 'ピクチャのアニメーションセル設定':
                pictureNum    = getArgNumber(args[0], 1, 100);
                cellNumber    = getArgNumber(args[1], 0, 100) - 1;
                picture       = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) cellNumber === -1 ? picture.addCellCount() : picture.cell = cellNumber;
                break;
        }
    };

    //=============================================================================
    // Game_Screen
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    Game_Screen.prototype.setPicturesAnimation = function(cellNumber, frameNumber, direction) {
        this._paCellNumber  = cellNumber;
        this._paFrameNumber = frameNumber;
        this._paDirection   = direction;
    };

    Game_Screen.prototype.clearPicturesAnimation = function() {
        this._paCellNumber  = 1;
        this._paFrameNumber = 1;
        this._paDirection   = '';
    };

    var _Game_Screen_showPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                                 scaleX, scaleY, opacity, blendMode) {
        _Game_Screen_showPicture.apply(this, arguments);
        var realPictureId = this.realPictureId(pictureId);
        if (this._paCellNumber > 1) {
            this._pictures[realPictureId].setAnimationInit(
                this._paCellNumber, this._paFrameNumber, this._paDirection);
            this.clearPicturesAnimation();
        }
    };

    //=============================================================================
    // Game_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    var _Game_Picture_initialize = Game_Picture.prototype.initialize;
    Game_Picture.prototype.initialize = function() {
        _Game_Picture_initialize.call(this);
        this.initAnimation();
    };

    Game_Picture.prototype.initAnimation = function() {
        this._cellNumber    = 1;
        this._frameNumber   = 1;
        this._cellCount     = 0;
        this._frameCount    = 0;
        this._animationType = 0;
        this._loopFlg       = false;
        this._direction     = '';
    };

    /**
     * The cellCount of the Game_Picture (0 to cellNumber).
     *
     * @property cellCount
     * @type Number
     */
    Object.defineProperty(Game_Picture.prototype, 'cell', {
        get: function() {
            if (this._animationType === 2) {
                return this._cellNumber - 1 - Math.abs(this._cellCount - (this._cellNumber - 1));
            }
            return this._cellCount;
        },
        set: function(value) {
            this._cellCount = value.clamp(0, this._cellNumber - 1);
        },
        configurable: true
    });

    var _Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.call(this);
        this.updateAnimation();
    };

    Game_Picture.prototype.updateAnimation = function() {
        if (!this.isAnimation()) return;
        this._frameCount = (this._frameCount + 1) % this._frameNumber;
        if (this._frameCount === 0) {
            this.addCellCount();
            if (this.cell === 0 && !this._loopFlg) {
                this._animationType = 0;
            }
        }
    };

    Game_Picture.prototype.addCellCount = function() {
        this._cellCount = (this._cellCount + 1) %
            (this._animationType === 2 ? (this._cellNumber - 1) * 2 : this._cellNumber);
    };

    Game_Picture.prototype.setAnimationInit = function(cellNumber, frameNumber, direction) {
        this._cellNumber  = cellNumber;
        this._frameNumber = frameNumber;
        this._frameCount  = 0;
        this._cellCount   = 0;
        this._direction   = direction;
    };

    Game_Picture.prototype.startAnimation = function(animationType, loopFlg) {
        this._animationType = animationType;
        this._loopFlg = loopFlg;
    };

    Game_Picture.prototype.stopAnimation = function(forceFlg) {
        this._loopFlg = false;
        if (forceFlg) this._animationType = 0;
    };

    Game_Picture.prototype.isAnimation = function() {
        return this._animationType !== 0;
    };

    //=============================================================================
    // Sprite_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    var _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.call(this);
        if (this.visible && this.isBitmapReady()) this.updateAnimation();
    };

    var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.call(this);
        var picture = this.picture();
        if (!picture) this._bitmap = null;
    };

    Sprite_Picture.prototype.updateAnimation = function() {
        switch (this.picture()._direction) {
            case '連番':
            case 'N':
                this.bitmap = this._bitmaps[this.picture().cell];
                this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
                break;
            case '縦':
            case 'V':
                var height = this.bitmap.height / this.picture()._cellNumber;
                var y      = this.picture().cell * height;
                this.setFrame(0, y, this.bitmap.width, height);
                break;
            case '横':
            case 'H':
                var width = this.bitmap.width / this.picture()._cellNumber;
                var x     = this.picture().cell * width;
                this.setFrame(x, 0, width, this.bitmap.height);
                break;
        }
    };

    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        _Sprite_Picture_loadBitmap.call(this);
        var cellNumber = this.picture()._cellNumber;
        var dir = this.picture()._direction;
        if (cellNumber > 1 && (dir === '連番' || dir === 'N')) {
            this._bitmaps = [this.bitmap];
            for (var i = 1; i < cellNumber; i++) {
                var filename = this._pictureName.substr(0, this._pictureName.length - 2) + i.padZero(2);
                this._bitmaps[i] = ImageManager.loadPicture(filename);
            }
        }
        this._bitmapReady = false;
    };

    Sprite_Picture.prototype.isBitmapReady = function() {
        if (this._bitmapReady) return true;
        var dir = this.picture()._direction;
        var result;
        if (dir === '連番' || dir === 'N') {
            result = this._bitmaps.every(function(bitmap) {
                return bitmap.isReady();
            })
        } else {
            result = this.bitmap.isReady();
        }
        if (result) this._bitmapReady = true;
        return result;
    };
})();