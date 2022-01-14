//=============================================================================
// MapNameExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.4 2022/01/14 表示遅延を設定しかつ背景画像を指定したとき、背景画像がマップ名表示前に表示されてしまう問題を修正
// 1.3.3 2021/11/05 実名表示が無効な場合でも、表示名が空だと表示されてしまう問題を修正
// 1.3.2 2021/11/04 背景画像を指定したとき、メニューを閉じた時などに背景が一瞬表示される問題を修正
// 1.3.1 2021/06/26 マップ名ウィンドウの横幅設定が機能していなかった問題を修正
// 1.3.0 2021/06/25 MZ向けに再作成
// 1.2.0 2019/11/18 総フレーム数にInfinityを設定した場合の挙動を自然なものに変更
//                  遅延機能をイベントコマンドの「マップ名表示」をONにした場合にも適用されるよう修正
// 1.1.0 2019/11/17 マップ名表示を指定したフレーム数だけ遅延させる機能を追加
// 1.0.1 2017/04/06 イベントテストを実行すると、数秒経過後にエラーが発生する問題の修正
// 1.0.0 2017/03/20 MapNameWindow.jsから流用作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップ名表示拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MapNameExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param positionX
 * @text X座標
 * @desc X座標を指定する場合は入力してください。
 * @default 0
 * @type number
 *
 * @param positionY
 * @text Y座標
 * @desc Y座標を指定する場合は入力してください。
 * @default 0
 * @type number
 *
 * @param moveXInFade
 * @text フェード中移動X
 * @desc フェードイン、アウト中に移動するX方向のピクセル数です。
 * @default 0
 * @type number
 *
 * @param moveYInFace
 * @text フェード中移動Y
 * @desc フェードイン、アウト中に移動するY方向のピクセル数です。
 * @default 0
 * @type number
 *
 * @param allDuration
 * @text 総フレーム数
 * @desc マップ名が表示されて消えるまでの総フレーム数です。ずっと表示させたい場合「Infinity」と入力してください。
 * @default 300
 * @type number
 * @min 1
 *
 * @param fadeInSpeed
 * @text フェードイン速度
 * @desc マップ名のフェードイン速度です。（デフォルト16）
 * @default 0
 * @type number
 *
 * @param viewDelay
 * @text 表示遅延
 * @desc マップ名の表示を指定したフレーム数だけ遅らせます。
 * @default 0
 * @type number
 *
 * @param width
 * @text 横幅
 * @desc 横幅を指定する場合は入力してください。
 * @default 0
 * @type number
 *
 * @param showWindow
 * @text ウィンドウ表示
 * @desc マップ名表示をウィンドウ化します。
 * @default false
 * @type boolean
 *
 * @param backgroundImage
 * @text 背景画像
 * @desc 専用の背景画像(img/pictures)のファイル名を指定します。拡張子不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param showReal
 * @text 実名表示
 * @desc エディタの「表示名」が未指定の場合、ツリー表示される「実名」でマップ名を表示します。
 * @default false
 * @type boolean
 *
 * @param useControlCharacter
 * @text 制御文字使用
 * @desc マップ名表示に制御文字を使用可能にします。マップ名の表示幅を自動調整する機能は無効になり、強制左揃えになります。
 * @default false
 * @type boolean
 *
 * @help MapNameExtend.js
 *
 * マップ名表示機能を拡張します。
 *
 * 機能一覧
 * 1. マップ背景をウィンドウ化したり、任意のピクチャに変えたりできます。
 * 2. 表示位置や移動方法、フェード速度などを細かく指定できます。
 * 3. マップ名に制御文字を使えるようになります。
 * 4. 二つの以上のマップ名を連続で表示できます。
 * 5. マップ名をエディタでツリー表示される「実名」で表示できます。
 *
 * 4.の機能を利用する場合、マップ名のメモ欄に以下の通り入力してください。
 * <MapName2:aaa>  # マップ名の表示後に「aaa」が追加表示されます。
 * <マップ名2:aaa> # 同上
 * ※ 3つ以上表示させたい場合は「<MNE_MapName3:aaa>」で表示できます。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // ローカル変数
    //=============================================================================
    const local          = {};
    local.mapNameIndex = 0;

    //=============================================================================
    // Game_Map
    //  連続マップ表示に対応します。
    //=============================================================================
    const _Game_Map_displayName      = Game_Map.prototype.displayName;
    Game_Map.prototype.displayName = function() {
        const index = local.mapNameIndex + 1;
        if (index > 1 && $dataMap.meta) {
            return PluginManagerEx.findMetaValue($dataMap, ['マップ名' + index, 'MapName' + index]);
        } else {
            return _Game_Map_displayName.apply(this, arguments) || this.getRealMapName();
        }
    };

    Game_Map.prototype.getRealMapName = function() {
        return param.showReal && $dataMapInfos[this._mapId] ? $dataMapInfos[this._mapId].name : '';
    };

    //=============================================================================
    // Window_MapName
    //  表示方法を全体的に拡張します。
    //=============================================================================
    const _Window_MapName_initialize      = Window_MapName.prototype.initialize;
    Window_MapName.prototype.initialize = function(rect) {
        if (param.width) {
            rect.width = param.width;
        }
        _Window_MapName_initialize.apply(this, arguments);
        this._originalX    = this.x;
        this._originalY    = this.y;
        local.mapNameIndex = 0;
        this.createBackground();
        this.updatePlacementInit();
    };

    Window_MapName.prototype.createBackground = function() {
        if (!param.backgroundImage) return;
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadPicture(param.backgroundImage);
        this._backSprite.bitmap.addLoadListener(()=> {
            this._backSprite.x = this.width / 2 - this._backSprite.width / 2;
            this._backSprite.y = this.height / 2 - this._backSprite.height / 2;
        });
        this._backSprite.visible = false;
        this._backSprite.opacity = 0;
        this.addChildToBack(this._backSprite);
    };

    const _Window_MapName_updateFadeIn      = Window_MapName.prototype.updateFadeIn;
    Window_MapName.prototype.updateFadeIn = function() {
        if (param.viewDelay > 0 && this.updateDelay()) {
            this._showCount++;
            return;
        }
        const opacity = this.contentsOpacity;
        _Window_MapName_updateFadeIn.apply(this, arguments);
        this.updateOpacity(opacity + param.fadeInSpeed);
        this.updatePlacementInFading(opacity);
    };

    Window_MapName.prototype.flash = function() {
        if (!this.isNeverHide()) {
            return;
        }
        if ($gameMap.isNameDisplayEnabled()) {
            this.open();
            while(this.contentsOpacity < 255) {
                this.updateFadeIn();
            }
        }
        this._showCount = Infinity;
    };

    Window_MapName.prototype.isNeverHide = function() {
        return !isFinite(param.allDuration)
    };

    Window_MapName.prototype.updateDelay = function() {
        this._delayCount = (this._delayCount || 0) + 1;
        return this._delayCount < param.viewDelay;
    };

    const _Window_MapName_updateFadeOut      = Window_MapName.prototype.updateFadeOut;
    Window_MapName.prototype.updateFadeOut = function() {
        const opacity = this.contentsOpacity;
        this._delayCount = 0;
        _Window_MapName_updateFadeOut.apply(this, arguments);
        this.updateOpacity(opacity - param.fadeInSpeed);
        this.updatePlacementInFading(opacity);
        if (opacity > 0 && this.contentsOpacity === 0) {
            this.reOpen();
        }
    };

    Window_MapName.prototype.updateOpacity = function(opacity) {
        if (param.fadeInSpeed > 0) {
            this.contentsOpacity = opacity;
        }
        if (this.isWindow()) {
            this.opacity = this.contentsOpacity;
        }
        if (this._backSprite) {
            this._backSprite.opacity = this.contentsOpacity;
        }
    };

    Window_MapName.prototype.updatePlacementInit = function() {
        this.x = (param.positionX ? param.positionX : this._originalX);
        this.y = (param.positionY ? param.positionY : this._originalY);
    };

    Window_MapName.prototype.updatePlacementInFading = function(oldOpacity) {
        if (oldOpacity !== this.contentsOpacity) {
            this.x += param.moveXInFade || 0;
            this.y += param.moveYInFace || 0;
        }
    };

    const _Window_MapName_drawBackground      = Window_MapName.prototype.drawBackground;
    Window_MapName.prototype.drawBackground = function(x, y, width, height) {
        if (this.isWindow() || this._backSprite) return;
        _Window_MapName_drawBackground.apply(this, arguments);
    };

    const _Window_MapName_refresh      = Window_MapName.prototype.refresh;
    Window_MapName.prototype.refresh = function() {
        _Window_MapName_refresh.apply(this, arguments);
        this.visible = !!$gameMap.displayName();
    };

    const _Window_MapName_open      = Window_MapName.prototype.open;
    Window_MapName.prototype.open = function() {
        _Window_MapName_open.apply(this, arguments);
        if (param.allDuration > 0) {
            this._showCount = param.allDuration / 2;
        }
        this.updatePlacementInit();
        if (this._backSprite) {
            this._backSprite.visible = true;
        }
    };

    const _Window_MapName_hide = Window_MapName.prototype.hide;
    Window_MapName.prototype.hide = function() {
        if (this.isNeverHide()) {
            return;
        }
        _Window_MapName_hide.apply(this, arguments);
    };

    Window_MapName.prototype.reOpen = function() {
        local.mapNameIndex++;
        if ($gameMap.displayName()) {
            this.open();
        } else {
            local.mapNameIndex = 0;
        }
    };

    Window_MapName.prototype.isWindow = function() {
        return param.showWindow;
    };

    const _Window_MapName_drawText      = Window_MapName.prototype.drawText;
    Window_MapName.prototype.drawText = function(text, x, y, maxWidth, align) {
        if (param.useControlCharacter) {
            this.drawTextEx(text, x, y);
        } else {
            _Window_MapName_drawText.apply(this, arguments);
        }
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.apply(this, arguments);
        if (!this._transfer) {
            this._mapNameWindow.flash();
        }
    };
})();

