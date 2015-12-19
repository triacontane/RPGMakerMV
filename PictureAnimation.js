//=============================================================================
// PictureAnimation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * アニメーションしたいセルを縦一列に並べた画像を用意の上
 * 以下のコマンドを入力してください。
 *
 * 1. ピクチャのアニメーション準備（プラグインコマンド）
 * 2. ピクチャの表示（通常のイベントコマンド）
 * 3. ピクチャのアニメーション開始（プラグインコマンド）
 * 4. ピクチャのアニメーション終了（プラグインコマンド）
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  PA_INIT or
 *  ピクチャのアニメーション準備 [セル数] [フレーム数] :
 *  　このコマンドの次に実行される「ピクチャの表示」をアニメーション対象にします。
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
 *  ピクチャのアニメーション終了 [ピクチャ番号] [アニメーションタイプ]
 *  　指定したピクチャ番号のピクチャをアニメーションを終了します。
 *  　一番上のセルに戻った時点でアニメーションが止まります。
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
    var pluginName = 'PictureAnimation';

    //=============================================================================
    // PluginManager
    //  多言語とnullに対応したパラメータの取得を行います。
    //  このコードは自動生成され、全てのプラグインで同じものが使用されます。
    //=============================================================================
    PluginManager.getParamString = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return value == null ? '' : value;
    };

    PluginManager.getParamNumber = function (pluginName, paramEngName, paramJpgName, min, max) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        if (arguments.length <= 3) min = -Infinity;
        if (arguments.length <= 4) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    PluginManager.getParamBoolean = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return (value || '').toUpperCase() == 'ON';
    };

    PluginManager.getParamOther = function (pluginName, paramEngName, paramJpgName) {
        var value = this.parameters(pluginName)[paramEngName];
        if (value == null) value = this.parameters(pluginName)[paramJpgName];
        return value;
    };

    PluginManager.getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    PluginManager.getArgString = function (index, args) {
        return PluginManager.convertEscapeCharacters(args[index]);
    };

    PluginManager.getArgNumber = function (index, args, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(PluginManager.convertEscapeCharacters(args[index]), 10) || 0).clamp(min, max);
    };

    PluginManager.convertEscapeCharacters = function(text) {
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
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[XXXXXXXX]などを追加定義します。
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
        var pictureNum, animationType, picture, cellNumber, frameNumber;
        switch (PluginManager.getCommandName(command)) {
            case 'PA_INIT' :
            case 'ピクチャのアニメーション準備':
                cellNumber  = PluginManager.getArgNumber(0, args, 1, 100);
                frameNumber = PluginManager.getArgNumber(1, args, 1, 9999);
                $gameScreen.setPicturesAnimation(cellNumber, frameNumber);
                break;
            case 'PA_START' :
            case 'ピクチャのアニメーション開始':
                pictureNum    = PluginManager.getArgNumber(0, args, 1, 100);
                animationType = PluginManager.getArgNumber(1, args, 1, 2);
                picture = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.startAnimation(animationType, false);
                break;
            case 'PA_START_LOOP' :
            case 'ピクチャのループアニメーション開始':
                pictureNum    = PluginManager.getArgNumber(0, args, 1, 100);
                animationType = PluginManager.getArgNumber(1, args, 1, 2);
                picture = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.startAnimation(animationType, true);
                break;
            case 'PA_STOP' :
            case 'ピクチャのアニメーション終了':
                pictureNum    = PluginManager.getArgNumber(0, args, 1, 100);
                picture = $gameScreen.picture($gameScreen.realPictureId(pictureNum));
                if (picture) picture.stopAnimation(false);
                break;
        }
    };

    //=============================================================================
    // Game_Screen
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    Game_Screen.prototype.setPicturesAnimation = function(cellNumber, frameNumber) {
        this._paCellNumber  = cellNumber;
        this._paFrameNumber = frameNumber;
    };

    Game_Screen.prototype.clearPicturesAnimation = function() {
        this._paCellNumber  = 1;
        this._paFrameNumber = 1;
    };

    var _Game_Screen_showPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                                 scaleX, scaleY, opacity, blendMode) {
        _Game_Screen_showPicture.call(this, pictureId, name, origin, x, y,
            scaleX, scaleY, opacity, blendMode);
        var realPictureId = this.realPictureId(pictureId);
        if (this._paCellNumber > 1) {
            this._pictures[realPictureId].setAnimationInit(this._paCellNumber, this._paFrameNumber);
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
        this._cellNumber  = 1;
        this._frameNumber = 1;
        this._cellCount   = 0;
        this._frameCount  = 0;
        this._animationType = 0;
        this._loopFlg = false;
        this._animation = false;
    };

    Game_Picture.prototype.cellCount = function() {
        return this._animationType === 2 ?
            (this.cellNumber() - 1) - Math.abs(this._cellCount - (this.cellNumber() - 1)) :
            this._cellCount;
    };

    Game_Picture.prototype.cellNumber = function() {
        return this._cellNumber;
    };

    var _Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.call(this);
        this.updateAnimation();
    };

    Game_Picture.prototype.updateAnimation = function() {
        if (!this.isAnimation()) return;
        this._frameCount = (this._frameCount + 1) % this._frameNumber;
        if (this._frameCount === 0) {
            this._cellCount = (this._cellCount + 1) %
                (this._animationType === 2 ? (this.cellNumber() - 1) * 2 : this.cellNumber());
            if (this.cellCount() === 0 && !this._loopFlg) {
                this._animationType = 0;
            }
        }
    };

    Game_Picture.prototype.setAnimationInit = function(cellNumber, frameNumber) {
        this._cellNumber  = cellNumber;
        this._frameNumber = frameNumber;
        this._cellCount   = 0;
        this._frameCount  = 0;
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
        if (this.visible) this.updateAnimation();
    };

    Sprite_Picture.prototype.updateAnimation = function() {
        this._cellType = true;
        if (this._cellType) {
            var height = this.bitmap.height / this.picture().cellNumber();
            var y      = this.picture().cellCount() * height;
            this.setFrame(0, y, this.bitmap.width, height);
        } else {
            var width = this.bitmap.width / this.picture().cellNumber();
            var x      = this.picture().cellCount() * width;
            this.setFrame(x, 0, width, this.bitmap.height);
        }
    };
})();