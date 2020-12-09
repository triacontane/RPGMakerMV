/*=============================================================================
 PressAnyButton.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2020/12/09 英語ヘルプを追加
                  決定ボタンのみを許容する設定を追加
 1.0.0 2020/12/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc PressAnyButtonPlugin
 * @author triacontane
 *
 * @param startText
 * @text Start Text
 * @desc The text to display to prompt you to start.
 * @default Press Any Button
 *
 * @param soundEffect
 * @text Start SE
 * @desc The sound effect information at the start. If not specified, the system sound effect decision is played.
 * @default
 * @type struct<AudioSe>
 *
 * @param font
 * @text Font
 * @desc The font of the start string. (Only if specified)
 * @default
 * @type struct<Font>
 *
 * @param adjustY
 * @desc Correct the display Y coordinate of the start string.
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param decisionOnly
 * @desc Display the window only when the decision button is pressed.
 * @default false
 * @type boolean
 *
 * Show the text without immediately bringing up a
 * command window in the title screen.
 * Press any key, and a normal window will appear.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc PressAnyButtonプラグイン
 * @author トリアコンタン
 *
 * @param startText
 * @text スタート文字列
 * @desc スタートを促すために表示するテキストです。
 * @default Press Any Button
 *
 * @param soundEffect
 * @text 開始効果音
 * @desc スタートしたときの効果音情報です。指定しない場合はシステム効果音の決定が演奏されます。
 * @default
 * @type struct<AudioSe>
 *
 * @param font
 * @text フォント情報
 * @desc スタート文字列のフォント名です。(指定する場合のみ)
 * @default
 * @type struct<Font>
 *
 * @param adjustY
 * @text Y座標調整値
 * @desc スタート文字列の表示Y座標を補正します。
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param decisionOnly
 * @text 決定ボタンのみ許容
 * @desc 決定ボタンが押されたときのみウィンドウを表示します。
 * @default false
 * @type boolean
 *
 * @help PressAnyButton.js
 *
 * タイトル画面ですぐにコマンドウィンドウを出さずにテキストを表示します。
 * 何らかのキーを押下すると、通常のウィンドウが表示されます。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~AudioSe:
 * @param name
 * @desc ファイル名称です。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @desc ボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @desc ピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @desc 左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*~struct~Font:
 * @param name
 * @desc 名称です。指定しない場合は空欄です。
 * @default
 *
 * @param size
 * @desc サイズです。
 * @default 53
 * @type number
 *
 * @param bold
 * @desc 太字にします。
 * @default false
 * @type boolean
 *
 * @param italic
 * @desc イタリック体にします。
 * @default true
 * @type boolean
 *
 * @param color
 * @desc カラー情報です。
 * @default rgba(255,255,255,1.0)
 */

(function() {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('PressAnyButton');

    //=============================================================================
    // Scene_Title
    //  コマンドウィンドウを無効化し、代わりにゲームスタート文字列を表示させます。
    //=============================================================================
    var _Scene_TitleCreate       = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_TitleCreate.apply(this, arguments);
        this._commandWindow.setHandler('cancel', this.onCancelCommand.bind(this));
        this.createGameStartSprite();
        this.onCancelCommand();
    };

    var _Scene_TitleUpdate       = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_TitleUpdate.apply(this, arguments);
        this.updatePressAnyButton();
    };

    Scene_Title.prototype.updatePressAnyButton = function() {
        if (this._commandWindowClose) {
            this._commandWindow.openness -= 64;
        }
        if (!this._seledted && this.isAnyButtonTriggered()) {
            this.onPressStart();
        }
    };

    Scene_Title.prototype.onPressStart = function() {
        this.playStartSe();
        this._commandWindow.activate();
        this._gameStartSprite.visible = false;
        this._commandWindowClose      = false;
        this._commandWindow.visible   = true;
        this._seledted = true;
    };

    Scene_Title.prototype.playStartSe = function() {
        if (param.soundEffect) {
            AudioManager.playSe(param.soundEffect);
        } else {
            SoundManager.playOk();
        }
    };

    Scene_Title.prototype.onCancelCommand = function() {
        this._commandWindow.deactivate();
        this._seledted                = false;
        this._gameStartSprite.visible = true;
        this._commandWindowClose      = true;
        this._commandWindow.visible   = false;
    };

    Scene_Title.prototype.createGameStartSprite = function() {
        this._gameStartSprite = new Sprite_GameStart();
        this._gameStartSprite.draw();
        this.addChild(this._gameStartSprite);
    };

    Scene_Title.prototype.isAnyButtonTriggered = function() {
        if (param.decisionOnly) {
            return Input.isTriggered('ok') || TouchInput.isTriggered();
        } else {
            return Input.isAnyTriggered() || Input.isAnyGamePadTriggered() || TouchInput.isTriggered();
        }
    };

    Input.isAnyTriggered = function() {
        return Object.keys(this.keyMapper).some(function(keyCode) {
            return this.isTriggered(this.keyMapper[keyCode]);
        }.bind(this));
    };

    Input.isAnyGamePadTriggered = function() {
        return Object.keys(this.gamepadMapper).some(function(keyCode) {
            return this.isTriggered(this.gamepadMapper[keyCode]);
        }.bind(this));
    };

    //=============================================================================
    // Sprite_GameStart
    //  ゲームスタート文字列を描画するスプライトを表示します。
    //=============================================================================
    class Sprite_GameStart extends Sprite {
        constructor() {
            super();
            this.y = Graphics.height - 160 + (param.adjustY || 0);
            this._opacityShift = -2;
        }

        draw() {
            var font = param.font || {size: 52, bold: false, italic: true, color: 'rgba(255,255,255,1.0)'};
            this.bitmap = new Bitmap(Graphics.width, font.size);
            if (font.name) {
                this.bitmap.fontFace = fontFace;
            }
            this.bitmap.fontSize   = font.size;
            this.bitmap.fontItalic = font.italic;
            this.bitmap.fontBold   = font.bold;
            this.bitmap.textColor  = font.color;
            this.bitmap.drawText(param.startText, 0, 0, Graphics.width, font.size, 'center');
        }

        update() {
            this.opacity += this._opacityShift;
            if (this.opacity <= 128 || this.opacity >= 255) {
                this._opacityShift *= -1;
            }
        }
    }
})();
