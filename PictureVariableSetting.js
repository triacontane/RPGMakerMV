//=============================================================================
// PictureVariableSetting.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2015/11/27 ピクチャのファイル名に変数を組み込むことが出来る機能を追加
// 1.0.0 2015/11/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ピクチャの変数設定プラグイン
 * @author トリアコンタン
 * 
 * @help ピクチャ関連のイベント命令で番号が「指定された変数の値」になるよう
 * 仕様を変更します。
 * 例えば番号に「1」を設定すると、「1」番の変数の値をピクチャ番号として設定します。
 * プラグインコマンドから有効/無効を切り替えてください。（初期状態では無効です）
 *
 * さらに、ピクチャのファイル名に変数を組み込むことが出来るようになります。
 * 連番を含むファイル名などの柔軟な指定に有効です。
 * プラグインコマンド「P_D_FILENAME」を実行してから
 * 「画像」を指定せず「ピクチャの表示」を行ってください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 *  P_VARIABLE_VALID : ピクチャ番号の変数設定が有効になります。
 *  P_VARIABLE_INVALID : ピクチャ番号の変数設定が無効になります。
 *
 *  一度有効に設定したら、無効にするまでずっとそのままです。
 *
 *  P_D_FILENAME [ファイル名] :
 *  次に表示するピクチャのファイル名に変数を含めることができます。
 *  変数は「文章の表示」と同様の書式\V[n]で組み込んでください。
 *  拡張子は指定しないでください。
 *
 *  例 P_D_FILENAME file\V[1]
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */
(function () {
    PluginManager.getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    PluginManager.getArgString = function(index, args) {
        return args[index] || '';
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[P_VARIABLE_VALID]などを追加定義します。
    //  ピクチャ番号を変数で指定するよう変更します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (PluginManager.getCommandName(command)) {
            case 'P_VARIABLE_VALID':
                $gameSystem._pictureNumVariable = true;
                break;
            case 'P_VARIABLE_INVALID':
                $gameSystem._pictureNumVariable = false;
                break;
            case 'P_D_FILENAME':
                $gameScreen._dPictureFileName = PluginManager.getArgString(0, args);
        }
    };

    var _Game_Interpreter_command231 = Game_Interpreter.prototype.command231;
    Game_Interpreter.prototype.command231 = function() {
        return this.transPictureNumber(_Game_Interpreter_command231.bind(this));
    };

    var _Game_Interpreter_command232 = Game_Interpreter.prototype.command232;
    Game_Interpreter.prototype.command232 = function() {
        return this.transPictureNumber(_Game_Interpreter_command232.bind(this));
    };

    var _Game_Interpreter_command233 = Game_Interpreter.prototype.command233;
    Game_Interpreter.prototype.command233 = function() {
        return this.transPictureNumber(_Game_Interpreter_command233.bind(this));
    };

    var _Game_Interpreter_command234 = Game_Interpreter.prototype.command234;
    Game_Interpreter.prototype.command234 = function() {
        return this.transPictureNumber(_Game_Interpreter_command234.bind(this));
    };

    var _Game_Interpreter_command235 = Game_Interpreter.prototype.command235;
    Game_Interpreter.prototype.command235 = function() {
        return this.transPictureNumber(_Game_Interpreter_command235.bind(this));
    };

    Game_Interpreter.prototype.transPictureNumber = function(handler) {
        var oldValue = this._params[0];
        if ($gameSystem._pictureNumVariable)
            this._params[0] = (parseInt($gameVariables.value(this._params[0]), 10) || 1).clamp(1, 100);
        var result = handler();
        this._params[0] = oldValue;
        return result;
    };

    //=============================================================================
    // Game_System
    //  ピクチャ番号の変数指定フラグを追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._pictureNumVariable = false;
    };

    //=============================================================================
    // Game_Screen
    //  動的ファイル名指定用のプロパティを追加定義します。
    //=============================================================================
    var _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this._dPictureFileName = null;
    };

    //=============================================================================
    // Game_Picture
    //  ファイル名の動的生成処理を追加定義します。
    //=============================================================================
    var _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen._dPictureFileName != null) {
            name = $gameScreen._dPictureFileName;
            name = name.replace(/\\/g, '\x1b');
            name = name.replace(/\x1b\x1b/g, '\\');
            name = name.replace(/\x1bV\[(\d+)\]/gi, function() {
                return $gameVariables.value(parseInt(arguments[1]));
            }.bind(this));
            name = name.replace(/\x1bV\[(\d+)\]/gi, function() {
                return $gameVariables.value(parseInt(arguments[1]));
            }.bind(this));
            $gameScreen._dPictureFileName = null;
        }
        _Game_Picture_show.call(this, name, origin, x, y, scaleX,
            scaleY, opacity, blendMode);
    };
})();