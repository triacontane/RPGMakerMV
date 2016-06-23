//=============================================================================
// MakeScreenCapture.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2016/06/24 WEBP形式のショートカットキーを追加
// 1.2.3 2016/06/23 著名に画像とテキストを両方使えるよう修正
// 1.2.2 2016/05/13 プラグインコマンドから出力したときに拡張子の表示がおかしくなる問題を修正
// 1.2.1 2016/05/11 定期実行キャプチャを行ったときに拡張子の表示がおかしくなる問題を修正
// 1.2.0 2016/04/23 署名に任意の画像ファイルを利用できるようになりました。
//                  細部のリファクタリング
// 1.1.5 2016/04/10 画像の出力先を管理画面のパラメータとして設定できるよう修正
// 1.1.4 2016/03/31 画像の出力先を絶対パスで指定できるよう修正
// 1.1.3 2016/03/15 文章のスクロール表示が正しくキャプチャできない問題を修正
// 1.1.2 2016/03/01 pngとjpegの形式ごとのファンクションキーを割り当てるよう修正
// 1.1.1 2016/02/26 PrintScreenでもキャプチャできるように修正
// 1.1.0 2016/02/25 複数のウィンドウを含む画面で正しくキャプチャできない不具合を修正
//                  高度な設定項目の追加
// 1.0.0 2016/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Screen Capture Plugin
 * @author triacontane
 *
 * @param FuncKeyPngCapture
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * 保存形式の設定にかかわらずpng形式で出力します。
 * @default F6
 *
 * @param FuncKeyJpegCapture
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * 保存形式の設定にかかわらずjpeg形式で出力します。
 * @default F7
 *
 * @param FuncKeyWebpCapture
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * 保存形式の設定にかかわらずwebp形式で出力します。
 * @default
 *
 * @param FileName
 * @desc 画像のファイル名です。
 * プラグインコマンドから実行した場合は参照されません。
 * @default image
 *
 * @param Location
 * @desc ファイルの出力パスです。相対パス、絶対パスが利用できます。
 * 区切り文字は「/」もしくは「\」で指定してください。
 * @default /captures
 *
 * @param FileFormat
 * @desc 画像のデフォルト保存形式です。(png/jpeg/webp)
 * @default png
 *
 * @param NumberDigit
 * @desc キャプチャファイルの連番桁数です。
 * @default 2
 *
 * @param TimeStamp
 * @desc ONにすると連番の代わりにタイムスタンプを付与します。(ON/OFF)
 * @default OFF
 *
 * @param Signature
 * @desc 保存時に画像の右下に書き込まれる署名です。
 * @default
 *
 * @param SignatureSize
 * @desc 署名のフォントサイズです。
 * @default 22
 *
 * @param SignatureImage
 * @desc 保存時に画像の右下に書き込まれる著名画像ファイル名です。「img/pictures」に配置。拡張子不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param Interval
 * @desc キャプチャを定期実行する間隔（秒単位）です。
 * 0にすると、定期キャプチャを行いません。
 * @default 0
 *
 * @param SeName
 * @desc キャプチャ実行時に演奏する効果音のファイル名です。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @help プレー中のゲーム画面をキャプチャして
 * ファイルに保存したり、ピクチャとして表示したりできます。
 * キャプチャは以下のタイミングで実行されます。
 *
 * ・ファンクションキー or PrintScreen押下
 * ・一定時間ごと
 * ・プラグインコマンド実行時
 *
 * プラグインコマンド以外は、テストプレー時のみ有効になります。
 *
 * キャプチャの際に著名を自動で埋め込むことができます。
 * 著名は文字列で指定できるほか、任意の画像も指定可能です。
 * （両方指定すると画像が優先されます）
 *
 * 注意！
 * キャプチャピクチャの表示状態はセーブできません。
 * セーブされる前に「ピクチャの消去」で消去してください。
 *
 * 注意！
 * キャプチャを出力する機能はローカル環境でのみ有効です。
 * ブラウザやスマホ上では動作しません。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * MSC_MAKE
 *  実行時点でのキャプチャを作成して保持します。
 *  ex：MSC_MAKE
 *
 * MSC_PICTURE
 *  保持していた画面キャプチャをピクチャに表示します。
 *  このコマンドの直後に「ピクチャの表示」を実行するとキャプチャピクチャが
 *  表示されます。
 *  ex：MSC_PICTURE
 *
 * MSC_SAVE [ファイル名]
 *  保持していた画面キャプチャをファイルに保存します。
 *  ファイル名は自由に指定できます。
 *  拡張子は自動で設定されるので設定不要です。
 *  ex：MSC_SAVE image
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 画面キャプチャ管理プラグイン
 * @author トリアコンタン
 *
 * @param PNGキャプチャキー
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * 保存形式の設定にかかわらずpng形式で出力します。
 * @default F6
 *
 * @param JPEGキャプチャキー
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * 保存形式の設定にかかわらずjpeg形式で出力します。
 * @default F7
 *
 * @param WEBPキャプチャキー
 * @desc キャプチャとファイル保存を行うファンクションキーです。
 * 保存形式の設定にかかわらずwebp形式で出力します。
 * @default F9
 *
 * @param ファイル名
 * @desc 画像のファイル名です。
 * プラグインコマンドから実行した場合は参照されません。
 * @default image
 *
 * @param 出力場所
 * @desc ファイルの出力パスです。相対パス、絶対パスが利用できます。
 * 区切り文字は「/」もしくは「\」で指定してください。
 * @default /captures
 *
 * @param 保存形式
 * @desc 画像のデフォルト保存形式です。(png/jpeg/webp)
 * @default png
 *
 * @param 連番桁数
 * @desc キャプチャファイルの連番桁数です。
 * @default 2
 *
 * @param タイムスタンプ
 * @desc ONにすると連番の代わりにタイムスタンプを付与します。(ON/OFF)
 * @default OFF
 *
 * @param 署名
 * @desc 保存時に画像の右下に書き込まれる署名です。
 * @default
 *
 * @param 署名サイズ
 * @desc 署名のフォントサイズです。
 * @default 22
 *
 * @param 署名画像
 * @desc 保存時に画像の右下に書き込まれる著名画像ファイル名です。「img/pictures」に配置。拡張子不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 実行間隔
 * @desc キャプチャを定期実行する間隔（秒単位）です。
 * 0にすると、定期キャプチャを行いません。
 * @default 0
 *
 * @param 効果音
 * @desc キャプチャ実行時に演奏する効果音のファイル名です。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @help プレー中のゲーム画面をキャプチャして
 * ファイルに保存したり、ピクチャとして表示したりできます。
 * キャプチャは以下のタイミングで実行されます。
 *
 * ・ファンクションキー or PrintScreen押下
 * ・一定時間ごと
 * ・プラグインコマンド実行時
 *
 * プラグインコマンド以外は、テストプレー時のみ有効になります。
 *
 * キャプチャの際に著名を自動で埋め込むことができます。
 * 著名は文字列で指定できるほか、任意の画像も指定可能です。
 * （両方指定すると画像が優先されます）
 *
 * 注意！
 * キャプチャピクチャの表示状態はセーブできません。
 * セーブされる前に「ピクチャの消去」で消去してください。
 *
 * 注意！
 * キャプチャを出力する機能はローカル環境でのみ有効です。
 * ブラウザやスマホ上では動作しません。
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
 *  保持していた画面キャプチャをファイルに保存します。
 *  ファイル名は自由に指定できます。
 *  拡張子は自動で設定されるので設定不要です。
 *  例：画面キャプチャ保存 image
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //  高度な設定を記述しています。必要な場合は書き換えてください。
    //=============================================================================
    var settings = {
        /* 署名のフォント情報です。faceはあらかじめフォントをロードしておかなければ使えません */
        signature  : {face: 'GameFont', color: 'rgba(255,255,255,1.0)', align: 'right'},
        /* 効果音情報です。ファイル名はプラグイン管理画面から取得します */
        se         : {volume: 90, pitch: 100, pan: 0},
        /* jpeg形式で出力したときの品質です(0.1...1.0) */
        jpegQuality: 0.9,
        /* テストプレー以外での動作を無効にするフラグです */
        testOnly   : true
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var pluginName = 'MakeScreenCapture';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramFuncKeyPngCapture  = getParamString(['FuncKeyPngCapture', 'PNGキャプチャキー']);
    var paramFuncKeyJpegCapture = getParamString(['FuncKeyJpegCapture', 'JPEGキャプチャキー']);
    var paramFuncKeyWebpCapture = getParamString(['FuncKeyWebpCapture', 'WEBPキャプチャキー']);
    var paramFileName           = getParamString(['FileName', 'ファイル名']);
    var paramLocation           = getParamString(['Location', '出力場所']);
    var paramFileFormat         = getParamString(['FileFormat', '保存形式']).toLowerCase();
    var paramSignature          = getParamString(['Signature', '署名']);
    var paramSignatureImage     = getParamString(['SignatureImage', '署名画像']);
    var paramSignatureSize      = getParamNumber(['SignatureSize', '署名サイズ']);
    var paramNumberDigit        = getParamNumber(['NumberDigit', '連番桁数']);
    var paramInterval           = getParamNumber(['Interval', '実行間隔']);
    var paramSeName             = getParamString(['SeName', '効果音']);
    var paramTimeStamp          = getParamBoolean(['TimeStamp', 'タイムスタンプ']);
    var localCaptureExecute     = false;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
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

    Game_Interpreter.prototype.pluginCommandMakeScreenCapture = function(command, args) {
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
                SceneManager.saveCapture(getArgString(args[0]) || paramFileName, paramFileFormat);
                break;
        }
    };

    //=============================================================================
    // Game_Screen
    //  キャプチャピクチャ用のプロパティを追加定義します。
    //=============================================================================
    var _Game_Screen_clear      = Game_Screen.prototype.clear;
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
    var _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen.captureFlg) {
            arguments[0]    = Date.now().toString();
            this.captureFlg = true;
        } else {
            this.captureFlg = null;
        }
        $gameScreen.clearCapturePicture();
        _Game_Picture_show.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Base
    //  定期実行キャプチャを定義します。
    //=============================================================================
    var _Scene_Base_update      = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        var count = Graphics.frameCount;
        if (paramInterval !== 0 && Utils.isTestCapture() &&
            (count + 1) % (paramInterval * 60) === 0) SceneManager.takeCapture(paramFileFormat);
    };

    //=============================================================================
    // Sprite_Picture
    //  画像の動的生成を追加定義します。
    //=============================================================================
    var _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture().captureFlg) {
            this.bitmap = SceneManager.getCapture();
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    //=============================================================================
    // Utils
    //  テスト用のキャプチャを許可するかどうかを返します。
    //=============================================================================
    Utils.isTestCapture = function() {
        return !settings.testOnly || Utils.isOptionValid('test');
    };

    //=============================================================================
    // WindowLayer
    //  キャプチャ実行時、マスク処理のY座標を修正します。
    //=============================================================================
    var _WindowLayer__webglMaskRect      = WindowLayer.prototype._webglMaskRect;
    WindowLayer.prototype._webglMaskRect = function(renderSession, x, y, w, h) {
        if (localCaptureExecute) arguments[2] = Graphics.boxHeight - (y + h);
        _WindowLayer__webglMaskRect.apply(this, arguments);
    };

    //=============================================================================
    // Sprite
    //  キャプチャ実行時、_offset.yの値を逆方向に補正します。
    //=============================================================================
    var _Sprite__renderWebGL      = Sprite.prototype._renderWebGL;
    Sprite.prototype._renderWebGL = function(renderSession) {
        if (localCaptureExecute) this.worldTransform.ty -= this._offset.y * 2;
        _Sprite__renderWebGL.apply(this, arguments);
    };

    //=============================================================================
    // Bitmap
    //  対象のビットマップを保存します。現状、ローカル環境下でのみ動作します。
    //=============================================================================
    Bitmap.prototype.save = function(fileName, format, extend) {
        var data = this._canvas.toDataURL('image/' + format, extend);
        data     = data.replace(/^.*,/, '');
        if (data) StorageManager.saveImg(fileName, format, data);
    };

    Bitmap.prototype.sign = function(text, fontInfo) {
        this.fontFace  = fontInfo.face;
        this.fontSize  = fontInfo.size;
        this.textColor = fontInfo.color;
        this.drawText(text, 8, this.height - this.fontSize - 8, this.width - 8 * 2, this.fontSize, fontInfo.align);
    };

    Bitmap.prototype.signImage = function(signBitmap, fontInfo) {
        var dx = 0, dy = this.height - signBitmap.height;
        switch (fontInfo.align) {
            case 'center':
                dx = this.width / 2 - signBitmap.width / 2;
                break;
            case 'right':
                dx = this.width - signBitmap.width;
                break;
        }
        this.blt(signBitmap, 0, 0, signBitmap.width, signBitmap.height, dx, dy);
    };

    //=============================================================================
    // Input
    //  ファンクションキーのマップを定義します。
    //=============================================================================
    Input.functionReverseMapper = {
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        F10: 121,
        F11: 122,
        F12: 123
    };

    //=============================================================================
    // SceneManager
    //  ファンクションキーが押下されたときにキャプチャを実行します。
    //=============================================================================
    SceneManager.captureNumber = 0;
    SceneManager.makeCapture   = function() {
        if (paramSeName) {
            var se  = settings.se;
            se.name = paramSeName;
            AudioManager.playSe(se);
        }
        localCaptureExecute = true;
        this._captureBitmap = this.snap();
        localCaptureExecute = false;
    };

    SceneManager.getCapture = function() {
        return this._captureBitmap || ImageManager.loadEmptyBitmap();
    };

    SceneManager.saveCapture = function(fileName, format) {
        var signature = settings.signature;
        if (this._captureBitmap) {
            signature.size   = paramSignatureSize;
            var fileFullName = StorageManager.getLocalImgFileName(fileName);
            if (paramSignatureImage) {
                var image = ImageManager.loadPicture(paramSignatureImage, 0);
                image.addLoadListener(function() {
                    this._captureBitmap.signImage(image, signature);
                    this._captureBitmap.sign(paramSignature, signature);
                    this._captureBitmap.save(fileFullName, format, settings.jpegQuality);
                }.bind(this));
            } else {
                this._captureBitmap.sign(paramSignature, signature);
                this._captureBitmap.save(fileFullName, format, settings.jpegQuality);
            }
        }
    };

    SceneManager.takeCapture = function(format) {
        this.makeCapture();
        this.saveCapture(paramFileName, format);
    };

    var _SceneManager_setupErrorHandlers = SceneManager.setupErrorHandlers;
    SceneManager.setupErrorHandlers      = function() {
        _SceneManager_setupErrorHandlers.apply(this, arguments);
        if (Utils.isTestCapture()) {
            document.addEventListener('keyup', this.onKeyUpForCapture.bind(this));
        }
    };

    var _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown      = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        if (Utils.isTestCapture()) {
            this.onKeyDownForCapture(event);
        }
    };

    SceneManager.onKeyDownForCapture = function(event) {
        switch (event.keyCode) {
            case Input.functionReverseMapper[paramFuncKeyPngCapture] :
                SceneManager.takeCapture('png');
                break;
            case Input.functionReverseMapper[paramFuncKeyJpegCapture] :
                SceneManager.takeCapture('jpeg');
                break;
            case Input.functionReverseMapper[paramFuncKeyWebpCapture] :
                SceneManager.takeCapture('webp');
                break;
        }
    };

    SceneManager.onKeyUpForCapture = function(event) {
        // PrintScreen
        if (event.keyCode === 44) SceneManager.takeCapture(paramFileFormat);
    };

    //=============================================================================
    // StorageManager
    //  イメージファイルを保存します。
    //=============================================================================
    StorageManager.saveImg = function(fileName, format, data) {
        if (this.isLocalMode()) {
            this.saveImgToLocalFile(fileName + '.' + format, data);
        } else {
            this.saveImgToWebStorage(fileName, data);
        }
    };

    StorageManager.saveImgToWebStorage = function(fileName, data) {
        localStorage.setItem(fileName, data);
    };

    StorageManager.saveImgToLocalFile = function(fileName, data) {
        var fs       = require('fs');
        var dirPath  = this.localImgFileDirectoryPath();
        var filePath = dirPath + fileName;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, new Buffer(data, 'base64'));
    };

    StorageManager.localImgFileDirectoryPath = function() {
        var path = paramLocation;
        if (!path.match(/^[A-Z]:/)) {
            path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, path);
            if (path.match(/^\/([A-Z]:)/)) {
                path = path.slice(1);
            }
        }
        if (!path.match(/\/$/)) path += '/';
        return decodeURIComponent(path);
    };

    StorageManager.getLocalImgFileName = function(fileName) {
        if (paramTimeStamp) {
            var date = new Date();
            return fileName + '_' + date.getFullYear() + (date.getMonth() + 1).padZero(2) + date.getDate().padZero(2) +
                '_' + date.getHours().padZero(2) + date.getMinutes().padZero(2) + date.getSeconds().padZero(2);
        } else {
            var number = SceneManager.captureNumber;
            if (number >= Math.pow(10, paramNumberDigit)) number = 0;
            SceneManager.captureNumber = number + 1;
            return fileName + (number > 0 ? number.padZero(paramNumberDigit) : '');
        }
    };
})();
