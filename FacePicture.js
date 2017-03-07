//=============================================================================
// FacePicture.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/03/08 ピクチャのファイル名に制御文字を使っていた場合にリフレッシュで再表示できる機能を追加
// 1.1.3 2017/03/03 引数に制御文字を使ってピクチャを表示してからメニューを開閉するとエラーになる不具合を修正
// 1.1.2 2017/02/07 端末依存の記述を削除
// 1.1.0 2017/02/05 任意のアクターの顔グラフィックをピクチャとして表示する機能を追加
// 1.0.1 2017/02/05 顔グラフィックのインデックスが4以上の場合に正しく表示されない問題を修正
// 1.0.0 2017/02/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FacePicturePlugin
 * @author triacontane
 *
 * @help 顔グラフィックをピクチャとして表示できます。
 * ピクチャの表示だけでなく、プラグイン等でピクチャから
 * ファイルを参照する場合でも有効です。
 *
 * ピクチャのファイル名を指定する際に以下の通り指定してください。
 * $FACE[ファイル名, インデックス]
 * 例 : $FACE[Actor1, 2]
 *
 * また、任意のIDのアクターの顔グラフィックを表示させることもできます。
 * ピクチャのファイル名を指定する際に以下の通り指定してください。
 * $ACTOR_FACE[アクターID]
 * 例 : $ACTOR_FACE[2]
 *
 * ただし、ピクチャの表示の場合は、エディタ上に存在しないファイルを
 * 選択することができないので、以下のプラグインコマンドを実行してから、
 * ファイル名を空で指定して「ピクチャの表示」を実行してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * FP_PREPARE_PICT_NAME ファイル名
 * FP_ピクチャ名の事前設定 ファイル名
 *
 * ピクチャのファイル名を事前に指定します。指定後に
 * ファイル名を空で指定して「ピクチャの表示」を実行すると
 * 事前に指定したファイル名でピクチャを表示することができます。
 *
 * 指定例：FP_PREPARE_PICT_NAME $FACE[Actor1, 2]
 *
 * FP_SET_PICTURE_REFRESH
 * FP_ピクチャのリフレッシュ
 *
 * 表示しているピクチャをリフレッシュします。
 * もしピクチャのファイル名に変数を使用していてピクチャ表示後に
 * 変数が変わった場合、そのままではピクチャの表示は切り替わらないので
 * このコマンドで切り替えてください。
 *
 * 指定例：FP_SET_PICTURE_REFRESH
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 顔グラのピクチャ表示プラグイン
 * @author トリアコンタン
 *
 * @help 顔グラフィックをピクチャとして表示できます。
 * ピクチャの表示だけでなく、プラグイン等でピクチャから
 * ファイルを参照する場合でも有効です。
 *
 * ピクチャのファイル名を指定する際に以下の通り指定してください。
 * $FACE[ファイル名, インデックス]
 * 例 : $FACE[Actor1, 2]
 *
 * また、任意のIDのアクターの顔グラフィックを表示させることもできます。
 * ピクチャのファイル名を指定する際に以下の通り指定してください。
 * $ACTOR_FACE[アクターID]
 * 例 : $ACTOR_FACE[2]
 *
 * ただし、ピクチャの表示の場合は、エディタ上に存在しないファイルを
 * 選択することができないので、以下のプラグインコマンドを実行してから、
 * ファイル名を空で指定して「ピクチャの表示」を実行してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * FP_PREPARE_PICT_NAME ファイル名
 * FP_ピクチャ名の事前設定 ファイル名
 *
 * ピクチャのファイル名を事前に指定します。指定後に
 * ファイル名を空で指定して「ピクチャの表示」を実行すると
 * 事前に指定したファイル名でピクチャを表示することができます。
 *
 * 指定例：FP_PREPARE_PICT_NAME $FACE[Actor1, 2]
 *
 * FP_SET_PICTURE_REFRESH
 * FP_ピクチャのリフレッシュ
 *
 * 表示しているピクチャをリフレッシュします。
 * もしピクチャのファイル名に変数を使用していてピクチャ表示後に
 * 変数が変わった場合、そのままではピクチャの表示は切り替わらないので
 * このコマンドで切り替えてください。
 *
 * 指定例：FP_SET_PICTURE_REFRESH
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'FP_';

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
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
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    var concatAllArguments = function(args) {
        return args.reduce(function(prevValue, arg) {
            return prevValue + ' ' + arg;
        }, '');
    };

    var pluginCommandMap = new Map();
    setPluginCommand('ピクチャ名の事前設定', 'preparePictureName');
    setPluginCommand('PREPARE_PICT_NAME', 'preparePictureName');
    setPluginCommand('ピクチャのリフレッシュ', 'setPictureRefresh');
    setPluginCommand('SET_PICTURE_REFRESH', 'setPictureRefresh');

    var localNeedPictureRefresh = false;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](args);
        }
    };

    Game_Interpreter.prototype.preparePictureName = function(args) {
        $gameScreen.setPreparePictureName(concatAllArguments(args));
    };

    Game_Interpreter.prototype.setPictureRefresh = function() {
        localNeedPictureRefresh = true;
    };

    //=============================================================================
    // Game_Screen
    //  事前設定ピクチャ名を保持します。
    //=============================================================================
    Game_Screen.prototype.setPreparePictureName = function(name) {
        this._preparePictureName = name;
    };

    Game_Screen.prototype.getPreparePictureName = function() {
        return this._preparePictureName;
    };

    Game_Screen.prototype.clearPreparePictureName = function() {
        this._preparePictureName = null;
    };

    //=============================================================================
    // Game_Picture
    //  事前設定ピクチャ名を取得します。
    //=============================================================================
    var _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if (!name) {
            var prepareName = $gameScreen.getPreparePictureName();
            if (prepareName) {
                arguments[0] = prepareName;
                $gameScreen.clearPreparePictureName();
            }
        }
        _Game_Picture_show.apply(this, arguments);
    };

    //=============================================================================
    // Spriteset_Base
    //  ピクチャを再読み込みします。
    //=============================================================================
    var _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        _Spriteset_Base_update.apply(this, arguments);
        if (localNeedPictureRefresh) {
            this.refreshPictures();
            localNeedPictureRefresh = false;
        }
    };

    Spriteset_Base.prototype.refreshPictures = function() {
        this._pictureContainer.children.forEach(function(picture) {
            if (picture instanceof Sprite_Picture && picture.picture()) {
                picture.loadBitmap();
            }
        });
    };

    //=============================================================================
    // ImageManager
    //  指定された名前に一致する場合に顔グラフィックをピクチャとしてロードします。
    //=============================================================================
    var _ImageManager_loadPicture = ImageManager.loadPicture;
    ImageManager.loadPicture      = function(filename, hue) {
        var faceInfo = this.getPictureFaceInfo(filename);
        if (faceInfo) {
            return this.loadPictureFace(faceInfo);
        } else {
            return _ImageManager_loadPicture.apply(this, arguments);
        }
    };

    ImageManager.getPictureFaceInfo = function(filename) {
        var faceInfo = null;
        filename.replace(/\$FACE\[(.+)\s*,\s*(.+)\]/gi, function() {
            faceInfo           = {};
            faceInfo.faceName  = getArgString(arguments[1] || '');
            faceInfo.faceIndex = getArgNumber(arguments[2] || 0);
        }.bind(this));
        filename.replace(/\$ACTOR_FACE\[(.+)\]/gi, function() {
            var actor = $gameActors.actor(getArgNumber(arguments[1] || 1));
            if (!actor) return;
            faceInfo           = {};
            faceInfo.faceName  = actor.faceName();
            faceInfo.faceIndex = actor.faceIndex();
        }.bind(this));
        return faceInfo;
    };

    ImageManager.loadPictureFace = function(faceInfo) {
        var face   = this.loadFace(faceInfo.faceName, 0);
        var sw     = Window_Base._faceWidth;
        var sh     = Window_Base._faceHeight;
        var sx     = faceInfo.faceIndex % 4 * sw;
        var sy     = Math.floor(faceInfo.faceIndex / 4) * sh;
        var bitmap = new Bitmap(sw, sh);
        bitmap.setForceLoading();
        face.addLoadListener(function() {
            bitmap.blt(face, sx, sy, sw, sh, 0, 0);
            bitmap.forceOnLoad();
        });
        return bitmap;
    };

    //=============================================================================
    // Bitmap
    //  blt処理された場合に正しく表示できるようにします。
    //=============================================================================
    Bitmap.prototype.setForceLoading = function() {
        this._isLoading = true;
    };

    Bitmap.prototype.forceOnLoad = function() {
        this._isLoading = false;
        this._callLoadListeners();
    };
})();
