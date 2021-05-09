/*=============================================================================
 ChoiceByPicture.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/05/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ピクチャ選択肢プラグイン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceByPicture.js
 * @author トリアコンタン
 *
 * @param defaultInfo
 * @text デフォルト情報
 * @desc プラグインコマンド実行時のデフォルト基本情報です。
 * @default {}
 * @type struct<Basic>
 * 
 * @command SETUP
 * @text ピクチャ選択肢セットアップ
 * @desc ピクチャ選択肢の情報をセットアップします。選択肢の表示の直前に指定します。
 *
 * @arg basicInfo
 * @text 基本情報
 * @desc ピクチャ選択肢の基本情報です。
 * @default {}
 * @type struct<Basic>
 *
 * @arg imageList
 * @text 個別ピクチャファイル一覧
 * @desc 選択肢ごとの専用ピクチャファイルの一覧です。選択肢に文字列ではなく個別の画像を使いたい場合に使用します。
 * @default []
 * @type struct<Picture>[]
 *
 * @help ChoiceByPicture.js
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Basic:
 *
 * @param layout
 * @text レイアウト
 * @desc 選択肢ピクチャの配置方法です。
 * @default vertical
 * @type select
 * @option 縦に並べる
 * @value vertical
 * @option 横に並べる
 * @value horizontal
 *
 * @param focusImage
 * @text フォーカス時画像
 * @desc 選択肢にフォーカスが当たっているときの画像ファイルです。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param nonFocusImage
 * @text 非フォーカス時画像
 * @desc 選択肢にフォーカスが当たっていないときの画像ファイルです。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param focusScale
 * @text フォーカス拡大率
 * @desc 選択肢にフォーカスが当たっているときの画像ファイルの表示倍率です。
 * @default 120
 * @type number
 * @max 200
 *
 * @param textDrawing
 * @text テキスト描画
 * @desc 選択肢テキストを描画します。
 * @default true
 * @type boolean
 *
 * @param textSize
 * @text テキストサイズ
 * @desc 選択肢テキストを描画する場合のフォントサイズです。0を指定するとメインフォントのサイズになります。
 * @default 0
 * @type number
 */

/*~struct~Picture:
 *
 * @param focusImage
 * @text フォーカス時画像ファイル
 * @desc 選択肢にフォーカスが当たっているときの画像ファイルです。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param nonFocusImage
 * @text 非フォーカス時画像ファイル
 * @desc 選択肢にフォーカスが当たっていないときの画像ファイルです。
 * @default
 * @type file
 * @dir img/pictures
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'SETUP', args => {
        $gameMessage.setupChoicePicture(args);
    });

    Game_Message.prototype.setupChoicePicture = function (param) {
        this._choicePicture = param;
    };

    Game_Message.prototype.findChoicePicture = function () {
        return this._choicePicture;
    };

    const _Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
    Scene_Message.prototype.createAllWindows = function () {
        _Scene_Message_createAllWindows.apply(this, arguments);
        this._choiceSprite = new SpriteChoicePicture();
        this.addChild(this._choiceSprite);
        this._choiceListWindow.setChoiceSprite(this._choiceSprite);
    };

    /**
     * Window_ChoiceList
     */
    Window_ChoiceList.prototype.setChoiceSprite = function (sprite) {
        this._choiceSprite = sprite;
    };

    const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function () {
        const choicePicture = $gameMessage.findChoicePicture();
        if (choicePicture) {
            this._choiceSprite.setup(choicePicture, this);
        }
        _Window_ChoiceList_start.apply(this, arguments);
    };

    const _Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
    Window_ChoiceList.prototype.callOkHandler = function () {
        _Window_ChoiceList_callOkHandler.apply(this, arguments);
        this._choiceSprite.clearAll();
    };

    const _Window_ChoiceList_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler;
    Window_ChoiceList.prototype.callCancelHandler = function () {
        _Window_ChoiceList_callCancelHandler.apply(this, arguments);
        this._choiceSprite.clearAll();
    };

    const _Window_ChoiceList_maxCols = Window_ChoiceList.prototype.maxCols;
    Window_ChoiceList.prototype.maxCols = function() {
        if (this._choiceSprite && this._choiceSprite.isValid()) {
            return this._choiceSprite.findCols();
        } else {
            return _Window_ChoiceList_maxCols.apply(this, arguments);
        }
    };

    /**
     * SpriteChoicePicture
     * 選択肢スプライト
     */
    class SpriteChoicePicture extends Sprite {
        setup(paramItem, choiceWindow) {
            this._param = paramItem;
            this._window = choiceWindow;
            $gameMessage.choices().forEach((choice, index) => {
                const child = new SpriteChoiceChildPicture();
                child.setupChild(choice, paramItem, index, this._window);
                this.addChild(child);
            });
            this.setupPosition();
        }

        setupPosition() {
            this._position = ChoicePositionBase.createInstance(this.children);
        }

        clearAll() {
            this.children.forEach(sprite => sprite.destroyIfNeed());
            this.children = [];
        }

        isValid() {
            return this.children.length > 0;
        }

        findCols() {
            return this._position.findCols(this.children.length);
        }

        update() {
            super.update();
            if (this._position) {
                this._position.update(this._window.index());
            }
            this.updateScale();
        }

        updateScale() {
            this.children.forEach((sprite, index) => {
                if (this._window.index() === index) {
                    sprite.updateActive();
                } else {
                    sprite.updateNonActive();
                }
            });
        }
    }

    /**
     * SpriteChoiceChildPicture
     * 選択肢の要素スプライト
     */
    class SpriteChoiceChildPicture extends Sprite_Clickable {
        setupChild(choiceText, paramItem, index, choiceWindow) {
            this._basic = paramItem.basicInfo;
            this._originalImage = paramItem.imageList[index];
            this._index = index;
            this._window = choiceWindow;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            if (this.findBasic('textDrawing')) {
                this.createTextSprite(choiceText);
            }
            this.changeBackImage(this.findBasic('nonFocusImage'));
        }

        getIndex() {
            return this._index;
        }

        onMouseEnter() {
            this._window.select(this._index);
        }

        onClick() {
            this._window.processOk();
        }

        createTextSprite(choiceText) {
            this._textSprite = new Sprite();
            const dummy = new Window_Dummy();
            this._textSprite.bitmap = dummy.createBitmap(choiceText, this.findBasic('textSize'));
            this._textSprite.anchor.x = 0.5;
            this._textSprite.anchor.y = 0.5;
            this.addChild(this._textSprite);
        }

        findBasic(propName) {
            return this._basic.hasOwnProperty(propName) ? this._basic[propName] : param.defaultInfo[propName];
        }

        changeBackImage(fileName) {
            const bitmap = ImageManager.loadPicture(fileName);
            bitmap.addLoadListener(() => this.bitmap = bitmap);
        }

        updateActive() {
            const scale = this.findBasic('focusScale');
            this.scale.x = scale / 100;
            this.scale.y = scale / 100;
            if (this._originalImage) {
                this.findBasic(this._originalImage['focusImage']);
            } else {
                this.changeBackImage(this.findBasic('focusImage'));
            }
        }

        updateNonActive() {
            this.scale.x = 1.0;
            this.scale.y = 1.0;
            if (this._originalImage) {
                this.findBasic(this._originalImage['nonFocusImage']);
            } else {
                this.changeBackImage(this.findBasic('nonFocusImage'));
            }
        }

        destroyIfNeed() {
            if (this._textSprite) {
                this._textSprite.destroy();
            }
        }
    }

    /**
     * ChoicePositionBase
     * 選択肢スプライトのポジショニングを管理する基底クラス
     */
    class ChoicePositionBase {
        static createInstance(sprites) {
            const layout = sprites[0].findBasic('layout');
            let instance;
            switch (layout) {
                case 'horizontal':
                    instance = new ChoicePositionHorizontal();
                    break;
                default:
                    instance = new ChoicePositionVertical();
                    break;
            }
            instance.init(sprites);
            return instance;
        }

        init(sprites) {
            this._sprites = sprites;
            this._frameCount = 0;
            this._index = 0;
            this._newIndex = 0;
        }

        findCols(){}

        update(index) {
            this._frameCount++;
            this._newIndex = index;
            const state = {
                count: this._sprites.length,
                centerX: Graphics.width / 2,
                centerY: Graphics.height / 2
            }
            this._sprites.forEach(sprite => {
                this.updateChild(sprite, state);
            });
            this._index = index;
        }

        updateChild(sprite, state) {}
    }

    /**
     * ChoicePositionVertical
     * 縦方向のポジショニングを管理するクラス
     */
    class ChoicePositionVertical extends ChoicePositionBase {
        findCols() {
            return 1;
        }

        updateChild(sprite, state) {
            const position = sprite.getIndex() * 2 + 1 - state.count;
            sprite.x = state.centerX;
            sprite.y = state.centerY + position * state.centerY / state.count;
        }
    }

    /**
     * ChoicePositionHorizontal
     * 横方向のポジショニングを管理するクラス
     */
    class ChoicePositionHorizontal extends ChoicePositionBase {
        findCols() {
            return this._sprites.length;
        }

        updateChild(sprite, state) {
            const position = sprite.getIndex() * 2 + 1 - state.count;
            sprite.x = state.centerX + position * state.centerX / state.count;
            sprite.y = state.centerY;
        }
    }

    /**
     * Window_Dummy
     * 動的文字列ピクチャ描画用のダミーウィンドウ
     */
    class Window_Dummy extends Window_Base {
        constructor() {
            super(new Rectangle());
        }

        createBitmap(text, fontSize) {
            this._size = fontSize;
            const rect = this.textSizeEx(text);
            this.createContents();
            this.contents = new Bitmap(rect.width, rect.height);
            this.drawTextEx(text, 0, 0, rect.width);
            return this.contents;
        }

        resetFontSettings() {
            super.resetFontSettings();
            if (this._size) {
                this.contents.fontSize = this._size;
            }
        }
    }
})();
