//=============================================================================
// DTextPicture.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2015/11/07 描画文字列に半角スペースが含まれていた場合も問題なく実行できるよう修正
// 1.1.0 2015/11/07 制御文字\C[n] \I[n] \{ \} に対応（\$と表示スピード制御系以外全部）
// 1.0.1 2015/11/07 RPGツクールMV（日本語版）に合わせてコメントの表記を変更
// 1.0.0 2015/11/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 動的文字列ピクチャ生成プラグイン
 * @author トリアコンタン
 * 
 * @help 指定した文字列でピクチャを動的に生成するコマンドを提供します。
 * 以下の手順で表示します。
 *  1 : プラグインコマンド[D_TEXT]で描画したい文字列と引数を指定（下記の例参照）
 *  2 : イベントコマンド「ピクチャの表示」で「画像」を未選択に指定。
 * ※ 1の時点ではピクチャは表示されないので必ずセットで呼び出してください。
 *
 * プラグインコマンド詳細
 *   イベントコマンド「プラグインコマンド」から実行。
 *   （引数の間は半角スペースで区切る）
 *
 *  D_TEXT [描画文字列] [文字サイズ] : 動的文字列ピクチャ生成の準備
 *  例：D_TEXT テスト文字列 32
 *
 * 表示後は通常のピクチャと同様に移動や回転、消去ができます。
 * また、変数やアクターの表示など制御文字にも対応しています。
 *
 * 対応制御文字一覧（イベントコマンド「文章の表示」と同一です）
 * \V[n]
 * \N[n]
 * \P[n]
 * \G
 * \C[n]
 * \I[n]
 * \{
 * \}
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */
(function () {

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[D_TEXT]を追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command && command.toUpperCase() === "D_TEXT") {
            if (isNaN(args[args.length - 1])) args.push(28);
            var text = "";
            var fontSize = parseInt(args.pop(), 10);
            while (args[0] !== undefined) {
                text += args.shift();
                if (args[0] !== undefined) text += " ";
            }
            $gameScreen.setDTextPicture(text, fontSize);
        }
    };

    //=============================================================================
    // Game_Screen
    //  動的ピクチャ用のプロパティを追加定義します。
    //=============================================================================
    var _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this.clearDTextPicture();
    };

    Game_Screen.prototype.clearDTextPicture = function() {
        this._dTextFlg = false;
        this._dTextValue = "";
        this._dTextSize = 0;
    };

    Game_Screen.prototype.setDTextPicture = function(value, size) {
        this._dTextFlg = true;
        this._dTextValue = value;
        this._dTextSize = size;
    };

    //=============================================================================
    // Game_Picture
    //  動的ピクチャ用のプロパティを追加定義し、表示処理を動的ピクチャ対応に変更します。
    //=============================================================================
    var _Game_Picture_initBasic = Game_Picture.prototype.initBasic;
    Game_Picture.prototype.initBasic = function() {
        _Game_Picture_initBasic.call(this);
        this._dTextFlg   = false;
        this._dTextValue = "";
        this._dTextSize  = 0;
    };

    var _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen._dTextFlg) {
            name = "dummy"; // 参照されません
            this._dTextFlg   = true;
            this._dTextValue = $gameScreen._dTextValue;
            this._dTextSize  = $gameScreen._dTextSize;
            $gameScreen.clearDTextPicture();
        } else {
            this._dTextFlg   = false;
            this._dTextValue = "";
            this._dTextSize  = 0;
        }
        _Game_Picture_show.call(this, name, origin, x, y, scaleX,
            scaleY, opacity, blendMode);
    };

    //=============================================================================
    // Sprite_Picture
    //  画像の動的生成を追加定義します。
    //=============================================================================
    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture()._dTextFlg) {
            this.makeDynamicBitmap();
        } else {
            _Sprite_Picture_loadBitmap.call(this);
        }
    };

    Sprite_Picture.prototype.makeDynamicBitmap = function() {
        var window = SceneManager._scene._hiddenWindow; // 制御文字の使用とサイズ計算のための隠しウィンドウ
        if (this.picture()._dTextSize > 0) window.contents.fontSize = this.picture()._dTextSize;
        var textState = {index: 0, x: 0, y: 0, text: this.picture()._dTextValue};
        textState.text = window.convertEscapeCharacters(textState.text);
        var bitmap = new Bitmap(window.textWidth(textState.text) * 1.5, window.calcTextHeight(textState, false));
        while (textState.text[textState.index]) {
            this.processCharacter(textState, bitmap);
        }
        this.bitmap = bitmap;
    };

    Sprite_Picture.prototype.processCharacter = function(textState, bitmap) {
        var window = SceneManager._scene._hiddenWindow;
        if (textState.text[textState.index] == '\x1b') {
            var code = window.obtainEscapeCode(textState);
            switch (code) {
                case 'C':
                    bitmap.textColor = window.textColor(window.obtainEscapeParam(textState));
                    break;
                case 'I':
                    this.processDrawIcon(window.obtainEscapeParam(textState), textState, bitmap);
                    break;
                case '{':
                    window.makeFontBigger();
                    break;
                case '}':
                    window.makeFontSmaller();
                    break;
            }
        } else {
            var c = textState.text[textState.index++];
            var w = window.textWidth(c);
            bitmap.fontSize = window.contents.fontSize;
            bitmap.drawText(c, textState.x, textState.y, w * 2, bitmap.height, "left");
            textState.x += w;
        }
    };

    Sprite_Picture.prototype.processDrawIcon = function(iconIndex, textState, bitmap) {
        var iconBitmap = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        bitmap.blt(iconBitmap, sx, sy, pw, ph, textState.x + 2, (bitmap.height - ph) / 2);
        textState.x += Window_Base._iconWidth + 4;
    };

    //=============================================================================
    // Scene_Map
    //  動的ピクチャ作成用の隠しウィンドウを追加定義します。
    //=============================================================================
    var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        this._hiddenWindow = new Window_Base(1,1,1,1);
        this._hiddenWindow.hide();
        this._hiddenWindow.deactivate();
        _Scene_Map_createDisplayObjects.call(this);
        this.addChild(this._hiddenWindow);
    };
})();