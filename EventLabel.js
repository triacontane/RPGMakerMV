/*=============================================================================
 EventLabel.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2020/09/26 1.1.0でイベントIDを0で指定していた場合に表示されない問題を修正
 1.1.1 2020/09/26 ラベル表示条件のヘルプを書き忘れていたので追加
 1.1.0 2020/09/26 ラベルの表示条件にスイッチ、セルフスイッチを追加
                  コマンドで他のイベントのラベルを表示、非表示できる機能を追加
 1.0.2 2020/09/26 英語版のヘルプにベースプラグインの説明を追記
 1.0.1 2020/09/18 英語版のヘルプを作成
 1.0.0 2020/09/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc EventLabelPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventLabel.js
 * @author triacontane
 * @base PluginCommonBase
 *
 * @param showDefault
 * @desc You don't need to set anything up to see the label in the event name.
 * @default false
 * @type boolean
 *
 * @param hideNoImage
 * @desc If the image of the event is not specified, the label will not be displayed either.
 * @default true
 * @type boolean
 *
 * @param hideNameEv
 * @desc When the default display is enabled, events whose event name begins with "EV" are not labeled.
 * @default true
 * @type boolean
 *
 * @param fontSize
 * @desc The font size of the label.
 * @default 16
 *
 * @param backColor
 * @desc The background color of the label.
 * @default rgba(0,0,0,0.5)
 *
 * @param padding
 * @desc The padding of the label.
 * @default 2
 *
 * @command SHOW_LABEL
 * @text Show label
 * @desc Displays the label of the event. If you specify empty, the label is cleared.
 *
 * @arg eventId
 * @text Event ID
 * @desc Target event id.
 * @default 0
 *
 * @arg text
 * @text Label text
 * @desc Label text
 * @default
 * @type multiline_string
 *
 * @arg fontSize
 * @text Font size
 * @desc The font size of the label.
 * @default 0
 *
 * @help EventLabel.js
 *　
 * The label appears at the top of the event. Specify the following in the memo field.
 * <LB:name> // The label [name] will be displayed on top of the event.
 * <LB> // the label will be displayed with the event name.
 * <LB_No> // the label will not be displayed. (When "Show by Default" is enabled.)
 * <LB_X:-4> // Shifts the label's position in the X direction.
 * <LB_Y:-4> // Shifts the label's position in the Y direction.
 * <LB_S:1>  // The label is displayed when the switch [1] is ON.
 * <LB_S:A>  // The label is displayed when the self-switch [A] is ON.
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 * The "PluginCommonBase.js" is here.
 * (MZ install path)dlc/BasicResources/plugins/official/PluginCommonBase.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc イベントラベルプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventLabel.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param showDefault
 * @text デフォルトで表示
 * @desc 何も設定しなくてもイベント名でラベルが表示されます。
 * @default false
 * @type boolean
 *
 * @param hideNoImage
 * @text 画像がなければ表示しない
 * @desc イベントの画像が指定されていないとラベルも表示されなくなります。
 * @default true
 * @type boolean
 *
 * @param hideNameEv
 * @text EVはデフォルト表示しない
 * @desc デフォルト表示が有効なとき、イベント名が「EV」で始まるイベントはラベル表示しません。
 * @default true
 * @type boolean
 *
 * @param fontSize
 * @text フォントサイズ
 * @desc ラベルのフォントサイズです。
 * @default 16
 *
 * @param backColor
 * @text 背景カラー
 * @desc ラベルの背景色です。赤、緑、青、不透明度の順で設定します。
 * @default rgba(0,0,0,0.5)
 *
 * @param padding
 * @text 余白
 * @desc ラベルの余白です。
 * @default 2
 * 
 * @command SHOW_LABEL
 * @text ラベル表示
 * @desc イベントのラベルを表示します。空を指定するとラベルが消去されます。マップ移動で元に戻ります。
 *
 * @arg eventId
 * @text イベントID
 * @desc ラベルを表示するイベントIDです。0を指定するとコマンドを実行したイベントになります。
 * @default 0
 *
 * @arg text
 * @text ラベルテキスト
 * @desc ラベルテキストです。
 * @default 
 * @type multiline_string
 *
 * @arg fontSize
 * @text フォントサイズ
 * @desc ラベルのフォントサイズです。0を指定した場合、デフォルトサイズになります。
 * @default 0
 *
 * @help EventLabel.js
 *　
 * イベントの上部にラベルを表示します。メモ欄に以下の通り指定してください。
 * <LB:name> // ラベル[name]が表示されます。
 * <LB>      // イベント名でラベルが表示されます。
 * <LB_No>   // ラベルが表示されなくなります。(『デフォルトで表示』が有効な場合)
 * <LB_X:4>  // ラベルのX方向の位置をずらします。
 * <LB_Y:-4> // ラベルのY方向の位置をずらします。
 * <LB_S:1>  // スイッチ[1]がONのときラベル表示します。
 * <LB_S:A>  // セルフスイッチ[A]がONのときラベル表示します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    PluginManager.registerCommand(PluginManagerEx.findPluginName(script), 'SHOW_LABEL', function(args) {
        const id = PluginManagerEx.convertVariables(args.eventId) || this.eventId();
        const event = $gameMap.event(id);
        if (event) {
            event.setEventLabel(args.text, PluginManagerEx.convertVariables(args.fontSize));
        }
    });

    /**
     * Game_Event
     */
    const _Game_Event_initialize    = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function() {
        _Game_Event_initialize.apply(this, arguments);
        this._labelText = this.findLabelName();
        this._labelSize = param.fontSize || 16;
        this._labelX = PluginManagerEx.findMetaValue(this.event(), 'LB_X') || 0;
        this._labelY = PluginManagerEx.findMetaValue(this.event(), 'LB_Y') || 0;
        this._labelSwitch = PluginManagerEx.findMetaValue(this.event(), 'LB_S') || null;
    };

    Game_Event.prototype.findLabelX = function() {
        return this.screenX() + this._labelX;
    };

    Game_Event.prototype.findLabelY = function() {
        return this.screenY() + this._labelY - $gameMap.tileHeight();
    };

    Game_Event.prototype.findLabelZ = function() {
        return this.screenZ() + 1;
    };

    Game_Event.prototype.findLabelName = function() {
        const metaLabel = PluginManagerEx.findMetaValue(this.event(), 'LB');
        if (metaLabel && metaLabel !== true) {
            return metaLabel;
        } else {
            return param.showDefault || metaLabel ? this.findLabelEventName() : null;
        }
    };

    Game_Event.prototype.findLabelEventName = function() {
        if (PluginManagerEx.findMetaValue(this.event(), 'LB_No')) {
            return null;
        }
        const name = this.event().name;
        if (param.hideNameEv && name.match(/^EV/g)) {
            return null;
        } else {
            return name;
        }
    };

    Game_Event.prototype.setEventLabel = function(text, size) {
        this._labelText = text;
        if (size > 0) {
            this._labelSize = size;
        }
    };

    Game_Event.prototype.getEventLabel = function() {
        if (this.isValidEventLabel()) {
            return {text: this._labelText, size: this._labelSize};
        } else {
            return null;
        }
    };

    Game_Event.prototype.isValidEventLabel = function() {
        return this._labelText && !this._erased &&
            !this.isHideLabelBecauseOfNoImage() && this.isNearTheScreen() &&
            this.isValidEventLabelSwitch();
    };

    Game_Event.prototype.isValidEventLabelSwitch = function() {
        if (!this._labelSwitch) {
            return true;
        } else if (isFinite(this._labelSwitch)) {
            return $gameSwitches.value(this._labelSwitch);
        } else {
            const key = [this._mapId, this._eventId, this._labelSwitch.toUpperCase()];
            return $gameSelfSwitches.value(key);
        }
    };

    Game_Event.prototype.isHideLabelBecauseOfNoImage = function() {
        return param.hideNoImage && !this._characterName && !this._tileId;
    };

    /**
     * Spriteset_Map
     */
    const _Spriteset_Map_initialize    = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map_initialize.apply(this, arguments);
        this._eventLabelSprites = {};
    };

    const _Spriteset_Map_update    = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.apply(this, arguments);
        this.updateEventLabel();
    };

    Spriteset_Map.prototype.updateEventLabel = function() {
        for (const event of $gameMap.events()) {
            if (event.getEventLabel()) {
                this.addEventLabel(event.eventId());
            } else {
                this.removeEventLabel(event.eventId());
            }
        }
    };

    Spriteset_Map.prototype.addEventLabel = function(id) {
        if (this._eventLabelSprites[id]) {
            return;
        }
        const sprite                = new Sprite_EventLabel(id);
        this._eventLabelSprites[id] = sprite
        this._tilemap.addChild(sprite);
    };

    Spriteset_Map.prototype.removeEventLabel = function(id) {
        if (!this._eventLabelSprites[id]) {
            return;
        }
        this._tilemap.removeChild(this._eventLabelSprites[id]);
        delete this._eventLabelSprites[id];
    };

    /**
     * Sprite_EventLabel
     */
    class Sprite_EventLabel extends Sprite {
        constructor(eventId) {
            super();
            this._eventId = eventId;
            this._text    = null;
            this._size    = 0;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.update();
        }

        update() {
            super.update();
            const event = this.event();
            if (!event) {
                return;
            }
            this.updateLabel(event);
            this.updatePosition(event);
        }

        updatePosition(event) {
            this.x = event.findLabelX();
            this.y = event.findLabelY() - this.bitmap.height / 2;
            this.z = event.findLabelZ();
        }

        updateLabel(event) {
            const label   = event.getEventLabel();
            if (!label) {
                return;
            }
            const newText = PluginManagerEx.convertEscapeCharacters(label.text);
            if (this._text !== newText || this._size !== label.size) {
                this._text = newText;
                this._size = label.size;
                this.refresh();
            }
        }

        event() {
            return $gameMap.event(this._eventId);
        }

        refresh() {
            const dummyWindow = new Window_Dummy();
            this.bitmap       = dummyWindow.createTextBitmap(this._text, this._size);
        }
    }

    /**
     * Window_Dummy
     */
    class Window_Dummy extends Window_Base {
        constructor() {
            super(new Rectangle());
        }

        createTextBitmap(text, fontSize) {
            this._fontSize = fontSize;
            this.resetFontSettings();
            const bitmapSize = this.textSizeEx(text);
            const p = param.padding || 0;
            this.padding     = 0;
            this.move(0, 0, bitmapSize.width + p * 2, bitmapSize.height + p * 2);
            this.createContents();
            this.contents.fillAll(param.backColor || 'rgba(0,0,0,0.5)');
            this.drawTextEx(text, p, p, bitmapSize.width + p * 2);
            const bitmap  = this.contents;
            this.contents = null;
            this.destroy();
            return bitmap;
        }

        resetFontSettings() {
            super.resetFontSettings();
            this.contents.fontSize = this._fontSize;
        }
    }
})();
