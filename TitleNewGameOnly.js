//=============================================================================
// TitleNewGameOnly.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2017/06/12 型指定機能に対応
// 1.2.0 2016/12/25 専用のスタート効果音を設定できる機能を追加
// 1.1.0 2016/03/10 セーブが存在する場合、通常のウィンドウを開く機能を追加
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/10/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ニューゲームオンリープラグイン
 * @author トリアコンタン
 *
 * @param PressStart
 * @desc スタートを促すための文字列です。
 * @default Press Start
 *
 * @param FontFace
 * @desc スタート文字列のフォント名です。(指定する場合のみ)
 * @default
 *
 * @param ContinueEnable
 * @desc セーブが存在する場合、通常のウィンドウを開きます。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param StartSe
 * @desc スタートしたときの効果音のファイル名称です。指定しない場合はシステム効果音の決定が演奏されます。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @help タイトル画面の選択肢をニューゲームのみにします。
 * 決定ボタンを押すか画面をクリックするとゲームが始まります。
 * 短編などセーブの概念がないゲームでの利用を想定しています。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    var pluginName = 'TitleNewGameOnly';
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //=============================================================================
    var settings = {
        /* Start文字列のフォント情報 */
        font:{size:52, bold:false, italic:true, color:'rgba(255,255,255,1.0)'},
        /* Start SE の情報 */
        startSe:{name:'', volume:90, pitch:100, pan:0}
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // Scene_Title
    //  コマンドウィンドウを無効化し、代わりにゲームスタート文字列を表示させます。
    //=============================================================================
    var _Scene_TitleCreate = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_TitleCreate.apply(this, arguments);
        this._commandWindow.setHandler('cancel', this.onCancelCommand.bind(this));
        this.createGameStartSprite();
        this.onCancelCommand();
    };

    var _Scene_TitleUpdate = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_TitleUpdate.apply(this, arguments);
        this.updateNewGameOnly();
    };

    Scene_Title.prototype.updateNewGameOnly = function() {
        if (this._commandWindowClose) {
            this._commandWindow.openness -= 64;
        }
        if (!this._seledted && this.isTriggered()) {
            this.playStartSe();
            if (this.isContinueEnabled()) {
                this._commandWindow.activate();
                this._gameStartSprite.visible = false;
                this._commandWindowClose = false;
                this._commandWindow.visible = true;
            } else {
                this._gameStartSprite.opacity_shift *= 16;
                this.commandNewGame();
            }
            this._seledted = true;
        }
    };

    Scene_Title.prototype.playStartSe = function() {
        var seName = getParamString(['StartSe', 'スタート効果音']);
        if (seName) {
            settings.startSe.name = seName;
            AudioManager.playSe(settings.startSe);
        } else {
            SoundManager.playOk();
        }
    };

    Scene_Title.prototype.onCancelCommand = function() {
        this._commandWindow.deactivate();
        this._seledted = false;
        this._gameStartSprite.visible = true;
        this._commandWindowClose = true;
        this._commandWindow.visible = false;
    };

    Scene_Title.prototype.isContinueEnabled = function() {
        return getParamBoolean(['ContinueEnable', 'コンティニュー可能']) && DataManager.isAnySavefileExists();
    };

    Scene_Title.prototype.createGameStartSprite = function() {
        this._gameStartSprite = new Sprite_GameStart();
        this._gameStartSprite.draw();
        this.addChild(this._gameStartSprite);
    };

    Scene_Title.prototype.isTriggered = function() {
        return Object.keys(Input.keyMapper).some(function(keyCode) {
                return Input.isTriggered(Input.keyMapper[keyCode]);
            }.bind(this)) ||
            Object.keys(Input.gamepadMapper).some(function(keyCode) {
                return Input.isTriggered(Input.gamepadMapper[keyCode]);
            }.bind(this)) || TouchInput.isTriggered();
    };

    //=============================================================================
    // Sprite_GameStart
    //  ゲームスタート文字列を描画するスプライトを表示します。
    //=============================================================================
    function Sprite_GameStart() {
        this.initialize.apply(this, arguments);
    }

    Sprite_GameStart.prototype = Object.create(Sprite_Base.prototype);
    Sprite_GameStart.prototype.constructor = Sprite_GameStart;

    Sprite_GameStart.prototype.initialize = function() {
        Sprite_Base.prototype.initialize.call(this);
        this.y             = Graphics.height - 160;
        this.opacity_shift = -2;
    };

    Sprite_GameStart.prototype.draw = function() {
        var height = settings.font.size;
        var fontFace = getParamString(['FontFace', 'フォント名']);
        var text     = getParamString(['PressStart', 'ゲーム開始']);
        this.bitmap = new Bitmap(Graphics.width, height);
        if (fontFace) this.bitmap.fontFace = fontFace;
        this.bitmap.fontSize = height;
        this.bitmap.fontItalic = settings.font.italic;
        this.bitmap.fontBold   = settings.font.bold;
        this.bitmap.textColor  = settings.font.color;
        this.bitmap.drawText(text, 0, 0, Graphics.width, height, 'center');
    };

    Sprite_GameStart.prototype.update = function() {
        this.opacity += this.opacity_shift;
        if (this.opacity <= 128 || this.opacity >= 255) this.opacity_shift *= -1;
    };
})();