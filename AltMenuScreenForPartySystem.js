//=============================================================================
// AltMenuScreenForPartySystem.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/05/17 ヘルプウィンドウが抜けていたので追加
// 1.0.0 2017/05/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AltMenuScreenForPartySystemPlugin
 * @author triacontane
 *
 * @param bgBitmapPartySystem
 * @desc パーティ編成画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @help YEP_PartySystem.jsとAltMenuScreen3.jsとの間の
 * メニューレイアウトの違いを吸収します。
 * YEP_PartySystemと一緒に使用し、かつ同プラグインより
 * 下に配置してください。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc パーティ編成の透明化プラグイン
 * @author トリアコンタン
 *
 * @param bgBitmapPartySystem
 * @desc パーティ編成画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @help YEP_PartySystem.jsとAltMenuScreen3.jsとの間の
 * メニューレイアウトの違いを吸収します。
 * YEP_PartySystemと一緒に使用し、かつ同プラグインより
 * 下に配置してください。
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
    var pluginName = 'AltMenuScreenForPartySystem';

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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                 = {};
    param.bgBitmapPartySystem = getParamString(['bgBitmapPartySystem']);

    var _Scene_Party_create      = Scene_Party.prototype.create;
    Scene_Party.prototype.create = function() {
        _Scene_Party_create.apply(this, arguments);
        this.setWindowBackThrough();
    };

    Scene_Party.prototype.setWindowBackThrough = function() {
        if (this._helpWindow) {
            this._helpWindow.opacity = 0;
        }
        if (this._commandWindow) {
            this._commandWindow.opacity = 0;
        }
        if (this._partyWindow) {
            this._partyWindow.opacity   = 0;
        }
        if (this._listWindow) {
            this._listWindow.opacity    = 0;
        }
        if (this._detailWindow) {
            this._detailWindow.opacity  = 0;
        }
    };

    var _Scene_Party_createBackground      = Scene_Party.prototype.createBackground;
    Scene_Party.prototype.createBackground = function() {
        if (param.bgBitmapPartySystem) {
            this._backgroundSprite        = new Sprite();
            this._backgroundSprite.bitmap = ImageManager.loadPicture(param.bgBitmapPartySystem);
            this.addChild(this._backgroundSprite);
            return;
        }
        _Scene_Party_createBackground.apply(this, arguments);
    };
})();

