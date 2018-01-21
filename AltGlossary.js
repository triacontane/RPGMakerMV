//=============================================================================
// AltGlossary.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2018/01/21 項目の揃えを設定できる機能を追加
// 1.0.0 2018/01/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AltGlossaryPlugin
 * @author triacontane
 *
 * @param categoryColumns
 * @desc カテゴリウィンドウの横方向の項目数です。
 * @default 4
 * @type number
 *
 * @param categoryRows
 * @desc カテゴリウィンドウの縦方向の項目数です。
 * @default 2
 * @type number
 *
 * @param categoryAlign
 * @desc カテゴリウィンドウの項目の揃えです。
 * @default left
 * @type select
 * @option left
 * @option center
 * @option right
 *
 * @help AltGlossary.js
 *
 * 用語辞典プラグイン「SceneGlossary.js」のレイアウトを変更します。
 * カテゴリウィンドウを画面上部に表示して、カテゴリとリストを
 * 表示に表示します。ヘルプウィンドウは非表示時となります。
 *
 * 用語辞典プラグインよりも下に配置してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 用語辞典レイアウト変更プラグイン
 * @author トリアコンタン
 *
 * @param categoryColumns
 * @text カテゴリ横項目数
 * @desc カテゴリウィンドウの横方向の項目数です。
 * @default 4
 * @type number
 *
 * @param categoryRows
 * @text カテゴリ縦項目数
 * @desc カテゴリウィンドウの縦方向の項目数です。
 * @default 2
 * @type number
 *
 * @param categoryAlign
 * @text カテゴリ項目揃え
 * @desc カテゴリウィンドウの項目の揃えです。
 * @default left
 * @type select
 * @option left
 * @option center
 * @option right
 *
 * @help AltGlossary.js
 *
 * 用語辞典プラグイン「SceneGlossary.js」のレイアウトを変更します。
 * カテゴリウィンドウを画面上部に表示して、カテゴリとリストを
 * 表示に表示します。ヘルプウィンドウは非表示時となります。
 *
 * 用語辞典プラグインよりも下に配置してください。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(AltGlossary)
     * @returns {any} Created parameter
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

    var param = createPluginParameter('AltGlossary');

    var _Scene_Glossary_createGlossaryWindow = Scene_Glossary.prototype.createGlossaryWindow;
    Scene_Glossary.prototype.createGlossaryWindow = function() {
        if ($gameParty.isUseGlossaryCategory()) {
            var height = Window_GlossaryCategory.prototype.windowHeight.call(Window_GlossaryCategory.prototype);
            this._glossaryWindow = new Window_Glossary($gameParty.getGlossaryListWidth(), height);
            this.addWindow(this._glossaryWindow);
        } else {
            _Scene_Glossary_createGlossaryWindow.apply(this, arguments);
        }
    };

    var _Window_GlossaryCategory_initialize = Window_GlossaryCategory.prototype.initialize;
    Window_GlossaryCategory.prototype.initialize = function(glWindow) {
        _Window_GlossaryCategory_initialize.apply(this, arguments);
        this.move(0, 0, SceneManager._boxWidth, this.windowHeight());
        this.refresh();
    };

    Window_GlossaryCategory.prototype.windowHeight = function() {
        return this.lineHeight() * (param.categoryRows || 2) + this.standardPadding() * 2;
    };

    Window_GlossaryCategory.prototype.maxCols = function() {
        return param.categoryColumns || 4;
    };

    var _Window_GlossaryCategory_hide = Window_GlossaryCategory.prototype.hide;
    Window_GlossaryCategory.prototype.hide = function() {
        if (!$gameParty.isUseGlossaryCategory()) {
            _Window_GlossaryCategory_hide.apply(this, arguments);
        }
    };

    Window_GlossaryCategory.prototype.drawTextExIfNeed = function(text, x, y, maxWidth) {
        var align = param.categoryAlign.toLowerCase();
        if (text.match(/\\/)) {
            if (align && align !== 'left') {
                var width = this.drawTextEx(text, x, -this.lineHeight());
                x += (maxWidth - width - this.textPadding()) / (align === 'center' ? 2 : 1);
            }
            this.drawTextEx(text, x, y);
        } else {
            this.drawText(text, x, y, maxWidth - this.textPadding(), align);
        }
    };

    Window_GlossaryList.prototype.hide = function() {};
})();

