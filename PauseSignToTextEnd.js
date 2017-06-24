//=============================================================================
// PauseSignToTextEnd.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2017/06/24 有効、無効を切り替えるスイッチを追加
// 1.1.0 2017/04/23 ポーズサインを非表示にできるスイッチを追加
// 1.0.0 2017/01/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc PauseSignToTextEndPlugin
 * @author triacontane
 *
 * @param ValidateSwitchId
 * @type number
 * @desc When the specified switch is ON, the pause sign is displayed at the end. When it is 0, it is always displayed at the end.
 * @default 0
 *
 * @param InvisibleSwitchId
 * @type number
 * @desc When the specified switch is ON, the pause sign is no longer displayed.
 * @default 0
 *
 * @help Message window pause sign
 * It will appear at the end of the text.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ポーズサインの末尾表示プラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチ番号
 * @type number
 * @desc 指定したスイッチがONのときポーズサインが末尾に表示されます。0の場合は常に末尾に表示されます。
 * @default 0
 *
 * @param 非表示スイッチ番号
 * @type number
 * @desc 指定したスイッチがONのときポーズサインが表示されなくなります。
 * @default 0
 *
 * @help メッセージウィンドウのポーズサインが
 * テキストの末尾に表示されるようになります。
 *
 * ただし、フキダシウィンドウプラグインが有効になっている場合は
 * そちらを優先します。
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
    var pluginName    = 'PauseSignToTextEnd';

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
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.invisibleSwitchId = getParamNumber(['InvisibleSwitchId', '非表示スイッチ番号'], 0);
    param.validateSwitchId  = getParamNumber(['ValidateSwitchId', '有効スイッチ番号'], 0);

    //=============================================================================
    // Window_Message
    //  ポーズサインの位置を変更します。
    //=============================================================================
    var _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if ((!this.isPopup || !this.isPopup()) && this.isValidPauseSignTextEnd()) {
            this.setPauseSignToTextEnd();
        } else {
            this._refreshPauseSign();
        }
    };

    Window_Message.prototype.isValidPauseSignTextEnd = function() {
        return !param.validateSwitchId || $gameSwitches.value(param.validateSwitchId);
    };

    Window_Message.prototype.isVisiblePauseSign = function() {
        return !$gameSwitches.value(param.invisibleSwitchId);
    };

    Window_Message.prototype.setPauseSignToTextEnd = function() {
        var textState = this._textState;
        var x = this.padding + textState.x;
        var y = this.padding + textState.y + textState.height;
        this._windowPauseSignSprite.anchor.x = 0;
        this._windowPauseSignSprite.anchor.y = 1;
        this._windowPauseSignSprite.move(x, y);
    };

    var _Window_Message__updatePauseSign = Window_Message.prototype._updatePauseSign;
    Window_Message.prototype._updatePauseSign = function() {
        _Window_Message__updatePauseSign.apply(this, arguments);
        this._windowPauseSignSprite.visible = this.isVisiblePauseSign();
    };
})();
