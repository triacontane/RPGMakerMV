//=============================================================================
// MoviePicture.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MovieInScreenPlugin
 * @author triacontane
 *
 * @help
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 動画のピクチャ表示プラグイン
 * @author トリアコンタン
 *
 * @help ピクチャの表示枠を使って動画表示できます。
 * 通常のムービー表示とは区別されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * MP_SET_MOVIE [動画ファイル名]
 * MP_動画設定 [動画ファイル名]
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'MP_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var pluginCommandMap = new Map();
    setPluginCommand('SET_MOVIE', 'execSetMoviePicture');
    setPluginCommand('動画設定', 'execSetMoviePicture');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execSetMoviePicture = function(args) {
        $gameScreen.setMoviePicture(args[0]);
    };

    //=============================================================================
    // Game_Screen
    //  ムービーピクチャのファイル名を追加定義します。
    //=============================================================================
    Game_Screen.prototype.setMoviePicture = function(movieName) {
        this._moviePictureName = movieName
    };

    Game_Screen.prototype.getMoviePicture = function() {
        return this._moviePictureName;
    };

    Game_Screen.prototype.clearMoviePicture = function() {
        this._moviePictureName = null;
    };

    //=============================================================================
    // Game_Picture
    //  ムービーピクチャのファイル名を追加定義します。
    //=============================================================================
    var _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        _Game_Picture_show.apply(this, arguments);
        var movieName = $gameScreen.getMoviePicture();
        if (movieName && !name) {
            $gameScreen.clearMoviePicture();
            this._name = movieName;
            this._movie = true;
        } else {
            this._movie = false;
        }
    };

    Game_Picture.prototype.isMovie = function() {
        return this._movie;
    };

    //=============================================================================
    // Sprite_Picture
    //  ムービーピクチャのファイル名を追加定義します。
    //=============================================================================
    var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        var picture = this.picture();
        if (picture && picture.isMovie()) {
            this.bitmap._setDirty();
        }
    };

    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        var picture = this.picture();
        if (picture.isMovie()) {
            this.bitmap = ImageManager.loadVideo(this._pictureName);
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    //=============================================================================
    // ImageManager
    //  動画の読み込みを追加定義します。
    //=============================================================================
    ImageManager.loadVideo = function(filename, smooth) {
        if (filename) {
            var path = 'movies/' + encodeURIComponent(filename) + this.getVideoFileExt();
            var bitmap = new Bitmap_Video(path);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };

    ImageManager.getVideoFileExt = function() {
        if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
            return '.webm';
        } else {
            return '.mp4';
        }
    };

    //=============================================================================
    // Bitmap_Video
    //  動画ビットマップクラスです。
    //=============================================================================
    function Bitmap_Video() {
        this.initialize.apply(this, arguments);
    }

    Bitmap_Video.prototype = Object.create(Bitmap.prototype);
    Bitmap_Video.prototype.constructor = Bitmap_Video;

    Bitmap_Video.prototype.initialize = function(url) {
        Bitmap.prototype.initialize.call(this);
        this._loadingBaseTexture = PIXI.VideoBaseTexture.fromUrl(url);
        this._loadingBaseTexture.source.onloadeddata = this.onLoadVideo.bind(this);
    };

    Bitmap_Video.prototype.onLoadVideo = function() {
        this.resize(this._loadingBaseTexture.source.width, this._loadingBaseTexture.source.height);
        this.__baseTexture = this._loadingBaseTexture;
    };
})();

