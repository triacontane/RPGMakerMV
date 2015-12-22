//=============================================================================
// TitleNewGameOnly.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
    var parameters = PluginManager.parameters('TitleNewGameOnly');

    //=============================================================================
    // Scene_Title
    //  コマンドウィンドウを無効化し、代わりにゲームスタート文字列を表示させます。
    //=============================================================================
    var _Scene_TitleCreate = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_TitleCreate.call(this);
        this._commandWindow.hide();
        this._commandWindow.deactivate();
        this._seledted = false;
        this.createGameStartSprite();
    };

    var _Scene_TitleUpdate = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_TitleUpdate.call(this);
        if (!this._seledted && this.isTriggered()) {
            SoundManager.playOk();
            this._gameStartSprite._opacity_shift *= 16;
            this.commandNewGame();
            this._seledted = true;
        }
    };

    Scene_Title.prototype.createGameStartSprite = function() {
        this._gameStartSprite = new Sprite_GameStart();
        this._gameStartSprite.draw();
        this.addChild(this._gameStartSprite);
    };

    Scene_Title.prototype.isTriggered = function() {
        return Input.isTriggered('ok') || TouchInput.isTriggered();
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
        this.y = Graphics.height - 160;
        this._opacity_shift = -2;
    };

    Sprite_GameStart.prototype.draw = function() {
        var height = 52;
        var fontFace = parameters['FontFace'];
        var text = parameters['PressStart'];

        this.bitmap = new Bitmap(Graphics.width, height);
        if (fontFace) this.bitmap.fontFace = fontFace;
        this.bitmap.fontSize = height;
        this.bitmap.fontItalic = true;
        this.bitmap.drawText(text, 0, 0, Graphics.width, height, 'center');
    };

    Sprite_GameStart.prototype.update = function() {
        this.opacity += this._opacity_shift;
        (this.opacity <= 128 || this.opacity >= 255) && (this._opacity_shift *= -1);
    };
})();