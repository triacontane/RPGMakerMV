/*=============================================================================
 IconDescription.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2023/08/20 アイコンが一度表示され消去された後もクリック判定残ってしまう場合がある問題を修正
 1.0.1 2023/07/29 表示位置の微調整
 1.0.0 2023/07/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アイコン説明プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/IconDescription.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param list
 * @text アイコン説明リスト
 * @desc アイコン説明のリストです。
 * @default []
 * @type struct<Description>[]
 *
 * @param fontSize
 * @text フォントサイズ
 * @desc アイコン説明ウィンドウのフォントサイズです。0を指定するとデフォルトのサイズになります。
 * @default 22
 * @type number
 *
 * @param padding
 * @text 余白
 * @desc アイコン説明ウィンドウの余白です。0を指定するとデフォルトの余白になります。
 * @default 8
 * @type number
 *
 * @param backOpacity
 * @text 背景不透明度
 * @desc アイコン説明ウィンドウの背景不透明度です。0を指定するとデフォルトの不透明度になります。
 * @default 0
 * @type number
 *
 * @param triggerType
 * @text トリガータイプ
 * @desc アイコン説明ウィンドウを表示するトリガーです。
 * @default click
 * @type select
 * @option クリック
 * @value click
 * @option 押し続け
 * @value press
 *
 * @param se
 * @text 効果音
 * @desc アイコン説明ウィンドウを表示する際に演奏する効果音です。
 * @default
 * @type struct<SE>
 *
 * @help IconDescription.js
 *
 * アイコンの説明テキストをポップアップ表示できます。
 * アイコンをクリックするか、押し続けることでポップアップが表示されます。
 * メッセージウィンドウやステータスウィンドウなど、デフォルトの方法で
 * 表示されたあらゆるアイコンがポップアップ対象になりますが
 * 他のプラグインによって表示されたアイコンは表示できるとは限りません。
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

/*~struct~Description:
 * @param iconIndex
 * @text アイコン
 * @desc 説明を表示するアイコンのインデックスです。
 * @default 1
 * @type icon
 *
 * @param caption
 * @text 説明テキスト
 * @desc アイコンの説明文です。制御文字が使えます。
 * @default
 * @type multiline_string
 */

/*~struct~SE:
 *
 * @param name
 * @text SEファイル名
 * @desc SEのファイル名です。
 * @require 1
 * @dir audio/se/
 * @type file
 * @default
 *
 * @param volume
 * @text SEボリューム
 * @desc SEのボリュームです。
 * @type number
 * @default 90
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text SEピッチ
 * @desc SEのピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text SEバランス
 * @desc SEの左右バランスです。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    function findIconCaptionParam(iconIndex) {
        return param.list.find(desc => desc.iconIndex === iconIndex);
    }

    const _Window_Base_drawIcon = Window_Base.prototype.drawIcon;
    Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
        _Window_Base_drawIcon.apply(this, arguments);
        this.appendIconMap(iconIndex, x, y);
    };

    const _Window_Selectable_refresh = Window_Selectable.prototype.refresh;
    Window_Selectable.prototype.refresh = function() {
        if (this._iconMap) {
            this._iconMap.clear();
        }
        _Window_Selectable_refresh.apply(this, arguments);
    };

    Window_Base.prototype.appendIconMap = function(iconIndex, x, y) {
        if (!findIconCaptionParam(iconIndex)) {
            return;
        }
        if (!this._iconMap) {
            this._iconMap = new Map();
        }
        this._iconMap.set(`${x}:${y}`, {index: iconIndex, x: x + this.padding, y: y + this.padding});
    };

    const _Window_Base_update = Window_Base.prototype.update;
    Window_Base.prototype.update = function() {
        _Window_Base_update.apply(this, arguments);
        if (this._iconMap && this.isOpen() && this.visible) {
            this.updateIconCaption();
        }
    };

    Window_Base.prototype.updateIconCaption = function() {
        if (SceneManager.isTriggeredIconCaption()) {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            const localPos = this.worldTransform.applyInverse(touchPos);
            const rect = new Rectangle(0, 0, ImageManager.iconWidth, ImageManager.iconHeight);
            const icon = Array.from(this._iconMap.values()).find(icon => {
                rect.x = icon.x;
                rect.y = icon.y;
                return rect.contains(localPos.x, localPos.y);
            });
            if (icon) {
                const worldPos = this.worldTransform.apply(new Point(0, 0));
                const x = worldPos.x + icon.x;
                const y = worldPos.y + icon.y;
                SceneManager.addIconCaption(icon.index, x, y);
            }
        }
    }

    const _Sprite_StateIcon_update = Sprite_StateIcon.prototype.update;
    Sprite_StateIcon.prototype.update = function() {
        _Sprite_StateIcon_update.apply(this, arguments);
        this.updateIconCaption();
    };

    Sprite_StateIcon.prototype.updateIconCaption = function() {
        if (SceneManager.isTriggeredIconCaption() && this.isBeingTouched()) {
            const localPos = new Point(-this.anchor.x * this.width, -this.anchor.y * this.height);
            const worldPos = this.worldTransform.apply(localPos);
            SceneManager.addIconCaption(this._iconIndex, worldPos.x, worldPos.y);
        }
    };

    Sprite_StateIcon.prototype.isBeingTouched = function() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    };

    Sprite_StateIcon.prototype.hitTest = function(x, y) {
        const rect = new Rectangle(
            -this.anchor.x * this.width,
            -this.anchor.y * this.height,
            this.width,
            this.height
        );
        return rect.contains(x, y);
    };

    SceneManager.isTriggeredIconCaption = function() {
        if (param.triggerType === 'press') {
            return TouchInput.isPressed();
        } else {
            return TouchInput.isTriggered();
        }
    };

    SceneManager.isCanceledIconCaption = function() {
        if (!this.isExistIconCaption()) {
            return false;
        }
        if (param.triggerType === 'press') {
            return !TouchInput.isPressed();
        } else {
            return TouchInput.isTriggered();
        }
    };

    SceneManager.isExistIconCaption = function() {
        return !!this._iconCaption;
    }

    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        _SceneManager_updateMain.apply(this, arguments);
        if (this.isCanceledIconCaption()) {
            this.removeIconCaption();
        }
    };

    SceneManager.addIconCaption = function(index, x, y) {
        if (!findIconCaptionParam(index)) {
            return;
        }
        if (this._iconCaption?.isSameCaption(index, x, y)) {
            return;
        }
        this.removeIconCaption();
        if (param.se) {
            AudioManager.playSe(param.se);
        }
        this._iconCaption = new Window_IconCaption(index, x, y);
        this._scene.addChild(this._iconCaption);
        TouchInput.update();
    };

    SceneManager.removeIconCaption = function() {
        if (!this._iconCaption) {
            return;
        }
        this._scene.removeChild(this._iconCaption);
        this._iconCaption = null;
    };

    const _SceneManager_onSceneTerminate = SceneManager.onSceneTerminate;
    SceneManager.onSceneTerminate = function() {
        _SceneManager_onSceneTerminate.apply(this, arguments);
        this.removeIconCaption();
    };

    const _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        if (SceneManager.isExistIconCaption()) {
            return;
        }
        _Window_Selectable_processTouch.apply(this, arguments);
    };

    const _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        if (SceneManager.isExistIconCaption()) {
            return;
        }
        return _Window_Message_isTriggered.apply(this, arguments);
    };

    class Window_IconCaption extends Window_Base {
        constructor(index, x, y) {
            super(new Rectangle(x, y + ImageManager.iconHeight, 1, 1));
            this._index = index;
            this._x = x;
            this._y = y;
            this.setup();
        }

        isSameCaption(index, x, y) {
            return this._index === index && this._x === x && this._y === y;
        }

        setup() {
            const text = findIconCaptionParam(this._index).caption;
            const rect = this.textSizeEx(text);
            this.updatePadding();
            this.width = rect.width + this.padding * 2;
            this.height = rect.height + this.padding * 2;
            this.createContents();
            this.drawTextEx(text, 0, 0);
            if (this.y + this.height > Graphics.height) {
                this.y -= this.height + ImageManager.iconHeight;
            }
            if (this.x + this.width > Graphics.width) {
                this.x = Math.max(0, Graphics.width - this.width);
            }
            this.hide();
        }

        update() {
            super.update();
            if (this.windowskin.isReady()) {
                this.show();
            }
        }

        resetFontSettings() {
            super.resetFontSettings();
            if (param.fontSize) {
                this.contents.fontSize = param.fontSize;
            }
        }

        updatePadding() {
            super.updatePadding();
            if (param.padding) {
                this.padding = param.padding;
            }
        }

        updateBackOpacity() {
            super.updateBackOpacity();
            if (param.backOpacity) {
                this.backOpacity = param.backOpacity;
            }
        }

        updateIconCaption() {}
    }
    window.Window_IconCaption = Window_IconCaption;
})();
