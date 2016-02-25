//=============================================================================
// MakeScreenCapture.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 画面キャプチャ管理プラグイン
 * @author トリアコンタン
 *
 * @param キャプチャキー
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * @default F6
 *
 * @param ファイル名
 * @desc 画像のファイル名です。
 * @default image
 *
 * @param 保存形式
 * @desc 画像の保存形式です。(png/jpeg)
 * @default png
 *
 * @param 連番桁数
 * @desc キャプチャファイルの連番桁数です。
 * 0にすると、同一のファイルを上書きします。
 * @default 2
 *
 * @param 署名
 * @desc 保存時に画像の右下に書き込まれる署名です。
 * コピーライト等の表記に使えます。
 * @default
 *
 * @param 実行間隔
 * @desc キャプチャを定期実行する秒数です。
 * 0にすると、定期キャプチャを行いません。
 * @default 0
 *
 * @param 効果音
 * @desc キャプチャ実行時に演奏する効果音のファイル名です。
 * @default
 *
 * @help プレー中のゲーム画面をキャプチャして
 * ファイルに保存したり、ピクチャとして表示したりできます。
 * キャプチャは以下のタイミングで実行されます。
 *
 * ・ファンクションキー押下
 * ・一定時間ごと
 * ・プラグインコマンド実行時
 *
 * 注意！
 * キャプチャピクチャの表示状態はセーブできません。
 * セーブされる前に「ピクチャの消去」で消去してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * MSC_MAKE or 画面キャプチャ作成
 *  実行時点でのキャプチャを作成して保持します。
 *  例：画面キャプチャ作成
 *
 * MSC_PICTURE or 画面キャプチャピクチャ
 *  保持していた画面キャプチャをピクチャに表示します。
 *  このコマンドの直後に「ピクチャの表示」を実行するとキャプチャピクチャが
 *  表示されます。
 *  例：画面キャプチャピクチャ
 *
 * MSC_SAVE [ファイル名] or 画面キャプチャ保存 [ファイル名]
 *  保持していた画面キャプチャをファイルに保存します。ファイル名は自由に指定できます。
 *  拡張子は自動で設定されるので設定不要です。
 *  例：画面キャプチャ保存 image
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'MakeScreenCapture';

    var getParamString = function(paramNames, upperFlg) {
        var value = getParamOther(paramNames);
        return value == null ? '' : upperFlg ? value.toUpperCase() : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var paramFuncKeyCapture = getParamString(['FuncKeyCapture', 'キャプチャキー']);
    var paramFileName       = getParamString(['FileName', 'ファイル名']);
    var paramFileFormat     = getParamString(['FileFormat', '保存形式'], true);
    var paramSignature      = getParamString(['Signature', '署名']);
    var paramNumberDigit    = getParamNumber(['NumberDigit', '連番桁数']);
    var paramInterval       = getParamNumber(['Interval', '実行間隔']);
    var paramSeName         = getParamString(['SeName', '効果音']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandMakeScreenCapture(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandMakeScreenCapture = function (command, args) {
        switch (getCommandName(command)) {
            case 'MSC_MAKE' :
            case '画面キャプチャ作成':
                SceneManager.makeCapture();
                break;
            case 'MSC_PICTURE' :
            case '画面キャプチャピクチャ':
                $gameScreen.captureFlg = true;
                break;
            case 'MSC_SAVE' :
            case '画面キャプチャ保存':
                SceneManager.saveCapture(getArgString(args[0]));
                break;
        }
    };

    //=============================================================================
    // Game_Screen
    //  キャプチャピクチャ用のプロパティを追加定義します。
    //=============================================================================
    var _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearCapturePicture();
    };

    Game_Screen.prototype.clearCapturePicture = function() {
        this.captureFlg = false;
    };

    //=============================================================================
    // Game_Picture
    //  キャプチャピクチャ用のプロパティを追加定義します。
    //=============================================================================
    var _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen.captureFlg) {
            arguments[0] = Date.now().toString();
            this.captureFlg = true;
        } else {
            this.captureFlg = null;
        }
        $gameScreen.clearCapturePicture();
        _Game_Picture_show.apply(this, arguments);
    };


    var _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        if(paramInterval !== 0 && Graphics.frameCount % (paramInterval * 60) === 0) SceneManager.takeCapture();
    };

    //=============================================================================
    // Sprite_Picture
    //  画像の動的生成を追加定義します。
    //=============================================================================
    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture().captureFlg) {
            this.bitmap = SceneManager.getCapture();
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    //=============================================================================
    // Bitmap
    //  対象のビットマップを保存します。現状、ローカル環境下でのみ動作します。
    //=============================================================================
    Bitmap.prototype.save = function(fileName) {
        var data = this._canvas.toDataURL('image/' + (paramFileFormat === 'PNG' ? 'png' : 'jpeg'));
        data = data.replace(/^.*,/, '');
        StorageManager.saveImg(fileName, data);
    };

    Bitmap.prototype.sign = function(text) {
        if (!text) return;
        this.fontSize = 32;
        this.drawText(text, 0, this.height - this.fontSize - 8, this.width - 8, this.fontSize, 'right');
    };

    //=============================================================================
    // Input
    //  ファンクションキーのマップを定義します。
    //=============================================================================
    Input.functionReverseMapper = {
        F1  : 112,
        F2  : 113,
        F3  : 114,
        F4  : 115,
        F5  : 116,
        F6  : 117,
        F7  : 118,
        F8  : 119,
        F9  : 120,
        F10 : 121,
        F11 : 122,
        F12 : 123
    };

    //=============================================================================
    // SceneManager
    //  ファンクションキーが押下されたときにキャプチャを実行します。
    //=============================================================================
    SceneManager.makeCapture = function() {
        if (paramSeName) {
            var se = {name:paramSeName, volume:90, pitch:100, pan:0};
            AudioManager.playSe(se);
        }
        this._captureBitmap = this.snap();
    };

    SceneManager.getCapture = function() {
        return this._captureBitmap || ImageManager.loadEmptyBitmap();
    };

    SceneManager.saveCapture = function(fileName, number) {
        if (this._captureBitmap) {
            this._captureBitmap.sign(paramSignature);
            if (!number) number = SceneManager.captureNumber;
            if (number >= Math.pow(10, paramNumberDigit)) number = 0;
            this._captureBitmap.save(StorageManager.getLocalImgFileName(fileName, number));
            SceneManager.captureNumber = number + 1;
        }
    };

    SceneManager.takeCapture = function() {
        this.makeCapture();
        this.saveCapture(paramFileName);
    };
    SceneManager.captureNumber = 0;

    var _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown = function(event) {
        switch (event.keyCode) {
            case Input.functionReverseMapper[paramFuncKeyCapture] :
                SceneManager.takeCapture();
                break;
            default:
                _SceneManager_onKeyDown.apply(this, arguments);
                break;
        }
    };

    //=============================================================================
    // StorageManager
    //  イメージファイルを保存します。
    //=============================================================================
    StorageManager.saveImg = function(fileName, data) {
        if (this.isLocalMode()) {
            this.saveImgToLocalFile(fileName + (paramFileFormat === 'PNG' ? '.png' : '.jpeg'), data);
        } else {
            this.saveImgToWebStorage(fileName, data);
        }
    };

    StorageManager.saveImgToWebStorage = function(fileName, data) {
        localStorage.setItem(fileName, data);
    };

    StorageManager.saveImgToLocalFile = function(fileName, data) {
        var fs = require('fs');
        var dirPath = this.localImgFileDirectoryPath();
        var filePath = dirPath + fileName;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, new Buffer(data, 'base64'));
    };

    StorageManager.localImgFileDirectoryPath = function() {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/captures/');
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        return decodeURIComponent(path);
    };

    StorageManager.getLocalImgFileName = function(fileName, number) {
        return fileName + (number > 0 ? number.padZero(paramNumberDigit) : '');
    };
})();

