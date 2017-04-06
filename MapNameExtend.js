//=============================================================================
// MapNameExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/04/06 イベントテストを実行すると、数秒経過後にエラーが発生する問題の修正
// 1.0.0 2017/03/20 MapNameWindow.jsから流用作成
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MapNameWindowExtendPlugin
 * @author triacontane
 *
 * @param PositionX
 * @desc X座標を指定する場合は入力してください。
 * @default
 *
 * @param PositionY
 * @desc Y座標を指定する場合は入力してください。
 * @default
 *
 * @param MoveXInFade
 * @desc フェードイン、アウト中に移動するX方向のピクセル数です。
 * @default
 *
 * @param MoveYInFace
 * @desc フェードイン、アウト中に移動するY方向のピクセル数です。
 * @default
 *
 * @param AllDuration
 * @desc マップ名が表示されて消えるまでの総フレーム数です。（デフォルト300）
 * @default
 *
 * @param FadeInSpeed
 * @desc マップ名がフェードイン速度です。（デフォルト16）
 * @default
 *
 * @param Width
 * @desc 横幅を指定する場合は入力してください。
 * @default
 *
 * @param ShowWindow
 * @desc マップ名表示をウィンドウ化します。
 * @default OFF
 *
 * @param BackgroundImage
 * @desc 専用の背景画像(img/pictures)のファイル名を指定します。拡張子不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param ShowRealName
 * @desc エディタの「表示名」が未指定の場合、ツリー表示される「実名」でマップ名を表示します。
 * @default OFF
 *
 * @param UseControlCharacter
 * @desc マップ名表示に制御文字を使用可能にします。マップ名の表示幅を自動調整する機能は無効になり、強制左揃えになります。
 * @default OFF
 *
 * @help マップ名表示機能を拡張します。
 * MapNameWindow.jsの上位互換プラグインです。
 *
 * 機能一覧
 * 1. マップ背景をウィンドウ化したり、任意のピクチャに変えたりできます。
 * 2. 表示位置や移動方法、フェード速度などを細かく指定できます。
 * 3. マップ名に制御文字を使えるようになります。
 * 4. 二つの以上のマップ名を連続で表示できます。
 * 5. マップ名をエディタでツリー表示される「実名」で表示できます。
 *
 * 4.の機能を利用する場合、マップ名のメモ欄に以下の通り入力してください。
 * <MNE_MapName2:aaa>  # マップ名の表示後に「aaa」が追加表示されます。
 * <MNE_マップ名2:aaa> # 同上
 * ※ 3つ以上表示させたい場合は「<MNE_MapName3:aaa>」で表示できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マップ名表示拡張プラグイン
 * @author トリアコンタン
 *
 * @param X座標
 * @desc X座標を指定する場合は入力してください。
 * @default
 *
 * @param Y座標
 * @desc Y座標を指定する場合は入力してください。
 * @default
 *
 * @param フェード中移動X
 * @desc フェードイン、アウト中に移動するX方向のピクセル数です。
 * @default
 *
 * @param フェード中移動Y
 * @desc フェードイン、アウト中に移動するY方向のピクセル数です。
 * @default
 *
 * @param 総フレーム数
 * @desc マップ名が表示されて消えるまでの総フレーム数です。（デフォルト300）
 * @default
 *
 * @param フェードイン速度
 * @desc マップ名がフェードイン速度です。（デフォルト16）
 * @default
 *
 * @param 横幅
 * @desc 横幅を指定する場合は入力してください。
 * @default
 *
 * @param ウィンドウ表示
 * @desc マップ名表示をウィンドウ化します。
 * @default OFF
 *
 * @param 背景画像
 * @desc 専用の背景画像(img/pictures)のファイル名を指定します。拡張子不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 実名表示
 * @desc エディタの「表示名」が未指定の場合、ツリー表示される「実名」でマップ名を表示します。
 * @default OFF
 *
 * @param 制御文字使用
 * @desc マップ名表示に制御文字を使用可能にします。マップ名の表示幅を自動調整する機能は無効になり、強制左揃えになります。
 * @default OFF
 *
 * @help マップ名表示機能を拡張します。
 * MapNameWindow.jsの上位互換プラグインです。
 *
 * 機能一覧
 * 1. マップ背景をウィンドウ化したり、任意のピクチャに変えたりできます。
 * 2. 表示位置や移動方法、フェード速度などを細かく指定できます。
 * 3. マップ名に制御文字を使えるようになります。
 * 4. 二つの以上のマップ名を連続で表示できます。
 * 5. マップ名をエディタでツリー表示される「実名」で表示できます。
 *
 * 4.の機能を利用する場合、マップ名のメモ欄に以下の通り入力してください。
 * <MNE_MapName2:aaa>  # マップ名の表示後に「aaa」が追加表示されます。
 * <MNE_マップ名2:aaa> # 同上
 * ※ 3つ以上表示させたい場合は「<MNE_MapName3:aaa>」で表示できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'MapNameExtend';
    var metaTagPrefix = 'MNE_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null || text === true) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                 = {};
    param.positionX           = getParamNumber(['PositionX', 'X座標']);
    param.positionY           = getParamNumber(['PositionY', 'Y座標']);
    param.moveXInFade         = getParamNumber(['MoveXInFade', 'フェード中移動X']);
    param.moveYInFace         = getParamNumber(['MoveYInFace', 'フェード中移動Y']);
    param.allDuration         = getParamNumber(['AllDuration', '総フレーム数']);
    param.fadeInSpeed         = getParamNumber(['FadeInSpeed', 'フェードイン速度']);
    param.width               = getParamNumber(['Width', '横幅']);
    param.showWindow          = getParamBoolean(['ShowWindow', 'ウィンドウ表示']);
    param.useControlCharacter = getParamBoolean(['UseControlCharacter', '制御文字使用']);
    param.backgroundImage     = getParamString(['BackgroundImage', '背景画像']);
    param.showRealName        = getParamBoolean(['ShowRealName', '実名表示']);

    //=============================================================================
    // ローカル変数
    //=============================================================================
    var local          = {};
    local.mapNameIndex = 0;

    //=============================================================================
    // Game_Map
    //  連続マップ表示に対応します。
    //=============================================================================
    var _Game_Map_displayName      = Game_Map.prototype.displayName;
    Game_Map.prototype.displayName = function() {
        var index = local.mapNameIndex + 1;
        if (index > 1 && $dataMap.meta) {
            return getMetaValues($dataMap, ['マップ名' + index, 'MapName' + index]);
        } else {
            return _Game_Map_displayName.apply(this, arguments) || this.getRealMapName();
        }
    };

    Game_Map.prototype.getRealMapName = function() {
        return param.showRealName && $dataMapInfos[this._mapId] ? $dataMapInfos[this._mapId].name : '';
    };

    //=============================================================================
    // Window_MapName
    //  表示方法を全体的に拡張します。
    //=============================================================================
    var _Window_MapName_initialize      = Window_MapName.prototype.initialize;
    Window_MapName.prototype.initialize = function() {
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
        this._backSprite.bitmap.addLoadListener(function() {
            this._backSprite.x = this.windowWidth() / 2 - this._backSprite.width / 2;
            this._backSprite.y = this.windowHeight() / 2 - this._backSprite.height / 2;
        }.bind(this));
        this.addChildToBack(this._backSprite);
    };

    var _Window_MapName_updateFadeIn      = Window_MapName.prototype.updateFadeIn;
    Window_MapName.prototype.updateFadeIn = function() {
        var opacity = this.contentsOpacity;
        _Window_MapName_updateFadeIn.apply(this, arguments);
        this.updateOpacity(opacity + param.fadeInSpeed);
        this.updatePlacementInFace(opacity);
    };

    var _Window_MapName_updateFadeOut      = Window_MapName.prototype.updateFadeOut;
    Window_MapName.prototype.updateFadeOut = function() {
        var opacity = this.contentsOpacity;
        _Window_MapName_updateFadeOut.apply(this, arguments);
        this.updateOpacity(opacity - param.fadeInSpeed);
        this.updatePlacementInFace(opacity);
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

    Window_MapName.prototype.updatePlacementInFace = function(oldOpacity) {
        if (oldOpacity !== this.contentsOpacity) {
            this.x += param.moveXInFade || 0;
            this.y += param.moveYInFace || 0;
        }
    };

    var _Window_MapName_drawBackground      = Window_MapName.prototype.drawBackground;
    Window_MapName.prototype.drawBackground = function(x, y, width, height) {
        if (this.isWindow() || this._backSprite) return;
        _Window_MapName_drawBackground.apply(this, arguments);
    };

    var _Window_MapName_windowWidth      = Window_MapName.prototype.windowWidth;
    Window_MapName.prototype.windowWidth = function() {
        return param.width ? param.width : _Window_MapName_windowWidth.apply(this, arguments);
    };

    var _Window_MapName_refresh      = Window_MapName.prototype.refresh;
    Window_MapName.prototype.refresh = function() {
        _Window_MapName_refresh.apply(this, arguments);
        this.visible = !!$gameMap.displayName();
    };

    var _Window_MapName_open      = Window_MapName.prototype.open;
    Window_MapName.prototype.open = function() {
        _Window_MapName_open.apply(this, arguments);
        if (param.allDuration > 0) {
            this._showCount = param.allDuration / 2;
        }
        this.updatePlacementInit();
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

    var _Window_MapName_drawText      = Window_MapName.prototype.drawText;
    Window_MapName.prototype.drawText = function(text, x, y, maxWidth, align) {
        if (param.useControlCharacter) {
            this.drawTextEx(text, x, y);
        } else {
            _Window_MapName_drawText.apply(this, arguments);
        }
    };
})();

