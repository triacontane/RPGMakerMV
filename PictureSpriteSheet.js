//=============================================================================
// PictureSpriteSheet.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2016/12/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc PictureSpriteSheetPlugin
 * @author triacontane
 *
 * @help ピクチャを戦闘アニメーション画像のように横N * 縦Nのスプライトシートにします。
 * セル画像を切り替えてアニメーションを行う場合に、パフォーマンスを改善して
 * かつ非同期によるチラつきが発生しなくなります。
 *
 * ピクチャのアニメーションプラグインと類似していますが、
 * こちらはパフォーマンスを重視しています。連結した画像があまりに
 * 大きい(5000ピクセル以上)場合は正常に表示されない可能性があります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * PSS_セルサイズ設定 4 3 # 次の表示するピクチャのセルを横[4] 縦[3]にします。
 * PSS_SET_CELL_SIZE 4 3  # 同上(※1)
 *
 * ※1 必ず「ピクチャの表示」直前に実行してください。
 * また、ピクチャ番号の指定は不要です。
 *
 * PSS_セル指定 1 4 # ピクチャ番号[1]のピクチャのセル番号を[4]にします。
 * PSS_SET_CELL 1 4 # 同上(※2)
 *
 * ※2 セル番号は[0]から開始で以下の凡例に従って指定してください。
 * [0] [1] [2]
 * [3] [4] [5]
 * [6] [7] [8]
 *
 * PSS_セル加算 1 # ピクチャ番号[1]のピクチャのセル番号を1加算します。
 * PSS_ADD_CELL 1 # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ピクチャのスプライトシート化プラグイン
 * @author トリアコンタン
 *
 * @help ピクチャを戦闘アニメーション画像のように横N * 縦Nのスプライトシートにします。
 * セル画像を切り替えてアニメーションを行う場合に、パフォーマンスを改善して
 * かつ非同期によるチラつきが発生しなくなります。
 *
 * ピクチャのアニメーションプラグインと類似していますが、
 * こちらはパフォーマンスを重視しています。連結した画像があまりに
 * 大きい(5000ピクセル以上)場合は正常に表示されない可能性があります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * PSS_セルサイズ設定 4 3 # 次の表示するピクチャのセルを横[4] 縦[3]にします。
 * PSS_SET_CELL_SIZE 4 3  # 同上(※1)
 *
 * ※1 必ず「ピクチャの表示」直前に実行してください。
 * また、ピクチャ番号の指定は不要です。
 *
 * PSS_セル指定 1 4 # ピクチャ番号[1]のピクチャのセル番号を[4]にします。
 * PSS_SET_CELL 1 4 # 同上(※2)
 *
 * ※2 セル番号は[0]から開始で以下の凡例に従って指定してください。
 * [0] [1] [2]
 * [3] [4] [5]
 * [6] [7] [8]
 *
 * PSS_セル加算 1 # ピクチャ番号[1]のピクチャのセル番号を1加算します。
 * PSS_ADD_CELL 1 # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var pluginCommandMap = new Map([
        ['PSS_セルサイズ設定', 'setCellSizeForPss'],
        ['PSS_SET_CELL_SIZE', 'setCellSizeForPss'],
        ['PSS_セル指定', 'setCellForPss'],
        ['PSS_SET_CELL', 'setCellForPss'],
        ['PSS_セル加算', 'addCellForPss'],
        ['PSS_ADD_CELL', 'addCellForPss']
    ]);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommand = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommand) {
            this[pluginCommand](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.setCellSizeForPss = function(args) {
        $gameScreen.setPictureSpriteSheetSize(getArgNumber(args[0], 1), getArgNumber(args[1], 1));
    };

    Game_Interpreter.prototype.setCellForPss = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0], 1));
        if (picture) {
            picture.setSheetCellIndex(getArgNumber(args[1], 0));
        }
    };

    Game_Interpreter.prototype.addCellForPss = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0], 1));
        if (picture) {
            picture.addSheetCellIndex();
        }
    };

    //=============================================================================
    // Game_Screen
    //  セル数を保持します。
    //=============================================================================
    Game_Screen.prototype.setPictureSpriteSheetSize = function(col, row) {
        this._pictureSpriteSheetSize = [col, row];
    };

    Game_Screen.prototype.getPictureSpriteSheetSize = function() {
        var result = this._pictureSpriteSheetSize;
        if (result) {
            this._pictureSpriteSheetSize = undefined;
        }
        return result;
    };

    //=============================================================================
    // Game_Picture
    //  セルサイズを取得して、スプライトシート化します。
    //=============================================================================
    var _Game_Picture_show    = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        _Game_Picture_show.apply(this, arguments);
        var spriteSheetSize = $gameScreen.getPictureSpriteSheetSize();
        if (spriteSheetSize) {
            this._sheetCol = spriteSheetSize[0];
            this._sheetRow = spriteSheetSize[1];
        } else {
            this._sheetCol = null;
            this._sheetRow = null;
        }
    };

    Game_Picture.prototype.isUsingSpriteSheet = function() {
        return this._sheetCol && this._sheetRow
    };

    Game_Picture.prototype.getSheetCol = function() {
        return this._sheetCol;
    };

    Game_Picture.prototype.getSheetRow = function() {
        return this._sheetRow;
    };

    Game_Picture.prototype.getSheetMaxIndex = function() {
        return this._sheetCol * this._sheetRow;
    };

    Game_Picture.prototype.setSheetCellIndex = function(value) {
        this._sheetCellIndex = value % this.getSheetMaxIndex();
    };

    Game_Picture.prototype.getSheetCellIndex = function() {
        return this._sheetCellIndex || 0;
    };

    Game_Picture.prototype.addSheetCellIndex = function() {
        this.setSheetCellIndex(this.getSheetCellIndex() + 1);
    };

    Game_Picture.prototype.getSheetCellPosition = function() {
        var index = this.getSheetCellIndex();
        var colIndex = index % this._sheetCol;
        var rowIndex = Math.floor(index / this._sheetCol);
        return [colIndex, rowIndex];
    };

    //=============================================================================
    // Sprite_Picture
    //  スプライトシート化を実装します。
    //=============================================================================
    var _Sprite_Picture_update    = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.apply(this, arguments);
        if (this.visible && this.picture().isUsingSpriteSheet()) {
            this.updateFrameForPss();
        }
    };

    Sprite_Picture.prototype.updateFrameForPss = function() {
        var position = this.picture().getSheetCellPosition();
        var width    = this.getCellWidth();
        var height   = this.getCellHeight();
        this.setFrame(position[0] * width, position[1] * height, width, height);
    };

    Sprite_Picture.prototype.getCellWidth = function() {
        return this.bitmap.width / this.picture().getSheetCol();
    };

    Sprite_Picture.prototype.getCellHeight = function() {
        return this.bitmap.height / this.picture().getSheetRow();
    };
})();

