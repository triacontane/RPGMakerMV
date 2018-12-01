//=============================================================================
// TitleNewGameOnly.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.0 2018/12/01 スタート文字列のY座標を調整できるようにしました。
// 2.0.0 2017/03/01 セーブファイルが存在する場合の動作を3通りから選択できる機能を追加
// 1.3.0 2017/06/12 型指定機能に対応
// 1.2.0 2016/12/25 専用のスタート効果音を設定できる機能を追加
// 1.1.0 2016/03/10 セーブが存在する場合、通常のウィンドウを開く機能を追加
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/10/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ニューゲームオンリープラグイン
 * @author トリアコンタン
 *
 * @param startString
 * @text スタート文字列
 * @desc スタートを促すための文字列です。
 * @default Press Start
 *
 * @param font
 * @text フォント情報
 * @desc スタート文字列のフォント名です。(指定する場合のみ)
 * @default
 * @type struct<Font>
 *
 * @param fileExistAction
 * @text ファイル存在時の動作
 * @desc セーブが存在する場合の動作を選択します。
 * @default 0
 * @type select
 * @option 0 : 無条件でニューゲームを開始する。
 * @value 0
 * @option 1 : 通常のウィンドウを表示する。
 * @value 1
 * @option 2 : 最新のセーブデータを自動ロードする。
 * @value 2
 *
 * @param soundEffect
 * @text 開始効果音
 * @desc スタートしたときの効果音情報です。指定しない場合はシステム効果音の決定が演奏されます。
 * @default
 * @type struct<AudioSe>
 *
 * @param adjustY
 * @text Y座標調整値
 * @desc スタート文字列の表示Y座標を補正します。
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
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

    var param = createPluginParameter('TitleNewGameOnly');

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
        this.updateNewGameOnly();
    };

    var _Scene_Title_terminate      = Scene_Title.prototype.terminate;
    Scene_Title.prototype.terminate = function() {
        _Scene_Title_terminate.apply(this, arguments);
        if (this._sceneLoad) {
            this._sceneLoad.terminate();
        }
    };

    Scene_Title.prototype.updateNewGameOnly = function() {
        if (this._commandWindowClose) {
            this._commandWindow.openness -= 64;
        }
        if (!this._seledted && this.isTriggered()) {
            this.commandNewGameOnly();
        }
    };

    Scene_Title.prototype.commandNewGameOnly = function() {
        this.playStartSe();
        if (this.isContinueEnabled()) {
            if (param.fileExistAction === 2) {
                var result      = DataManager.loadGame(DataManager.latestSavefileId());
                this._sceneLoad = new Scene_Load();
                if (result) {
                    this._sceneLoad.onLoadSuccess();
                    this.fadeOutAll();
                } else {
                    this._sceneLoad.onLoadFailure();
                }
            } else {
                this._commandWindow.activate();
                this._gameStartSprite.visible = false;
                this._commandWindowClose      = false;
                this._commandWindow.visible   = true;
            }
        } else {
            this._gameStartSprite.opacity_shift *= 16;
            this.commandNewGame();
        }
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

    Scene_Title.prototype.isContinueEnabled = function() {
        return param.fileExistAction > 0 && DataManager.isAnySavefileExists();
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

    Sprite_GameStart.DEFALT_FONT = {size: 52, bold: false, italic: true, color: 'rgba(255,255,255,1.0)'};

    Sprite_GameStart.prototype             = Object.create(Sprite_Base.prototype);
    Sprite_GameStart.prototype.constructor = Sprite_GameStart;

    Sprite_GameStart.prototype.initialize = function() {
        Sprite_Base.prototype.initialize.call(this);
        this.y             = Graphics.height - 160 + (param.adjustY || 0);
        this.opacity_shift = -2;
    };

    Sprite_GameStart.prototype.draw = function() {
        var font    = param.font || Sprite_GameStart.DEFALT_FONT;
        this.bitmap = new Bitmap(Graphics.width, font.size);
        if (font.name) {
            this.bitmap.fontFace = fontFace;
        }
        this.bitmap.fontSize   = font.size;
        this.bitmap.fontItalic = font.italic;
        this.bitmap.fontBold   = font.bold;
        this.bitmap.textColor  = font.color;
        this.bitmap.drawText(param.startString, 0, 0, Graphics.width, font.size, 'center');
    };

    Sprite_GameStart.prototype.update = function() {
        this.opacity += this.opacity_shift;
        if (this.opacity <= 128 || this.opacity >= 255) this.opacity_shift *= -1;
    };
})();
