//=============================================================================
// AltGlossary.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2024/09/19 カテゴリウィンドウのカーソルを移動したとき、用語ウィンドウをリフレッシュするよう修正
// 1.2.0 2023/07/09 MZで動作するよう修正
// 1.1.0 2018/01/21 項目の揃えを設定できる機能を追加
// 1.0.0 2018/01/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 用語辞典レイアウト変更プラグイン
 * @target MZ 
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AltGlossary.js
 * @base SceneGlossary
 * @orderAfter SceneGlossary
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
 * カテゴリウィンドウを画面上部に表示して、用語ウィンドウを画面下部に表示します。
 *
 * このプラグインにはプラグインコマンドはありません。
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

    const _Scene_Glossary_createGlossaryWindow = Scene_Glossary.prototype.createGlossaryWindow;
    Scene_Glossary.prototype.createGlossaryWindow = function() {
        if ($gameParty.isUseGlossaryCategory()) {
            const height = Window_GlossaryCategory.prototype.windowHeight.call(Window_GlossaryCategory.prototype);
            this._glossaryWindow = new Window_Glossary($gameParty.getGlossaryListWidth(), this.mainAreaTop() + height, this._helpWindow);
            this.addWindow(this._glossaryWindow);
        } else {
            _Scene_Glossary_createGlossaryWindow.apply(this, arguments);
        }
    };

    const _Scene_Glossary_createGlossaryCategoryWindow = Scene_Glossary.prototype.createGlossaryCategoryWindow;
    Scene_Glossary.prototype.createGlossaryCategoryWindow = function() {
        _Scene_Glossary_createGlossaryCategoryWindow.apply(this, arguments);
        this._glossaryCategoryWindow.y = this.mainAreaTop();
    };

    const _Window_GlossaryCategory_initialize = Window_GlossaryCategory.prototype.initialize;
    Window_GlossaryCategory.prototype.initialize = function(glWindow) {
        _Window_GlossaryCategory_initialize.apply(this, arguments);
        this.move(0, 0, Graphics.boxWidth, this.windowHeight());
        this.refresh();
    };

    const _Window_GlossaryCategory_select = Window_GlossaryCategory.prototype.select;
    Window_GlossaryCategory.prototype.select = function(index) {
        _Window_GlossaryCategory_select.apply(this, arguments);
        if (index >= 0) {
            this._glossaryListWindow.refresh();
        }
    };

    Window_GlossaryCategory.prototype.windowHeight = function() {
        return this.fittingHeight(param.categoryRows || 2);
    };

    Window_GlossaryCategory.prototype.maxCols = function() {
        return param.categoryColumns || 4;
    };

    const _Window_GlossaryCategory_hide = Window_GlossaryCategory.prototype.hide;
    Window_GlossaryCategory.prototype.hide = function() {
        if (!$gameParty.isUseGlossaryCategory()) {
            _Window_GlossaryCategory_hide.apply(this, arguments);
        }
    };

    Window_GlossaryCategory.prototype.drawTextExIfNeed = function(text, x, y, maxWidth) {
        const align = param.categoryAlign;
        if (text.match(/\\/)) {
            if (align && align !== 'left') {
                const width = this.drawTextEx(text, x, -this.lineHeight());
                x += (maxWidth - width - this.padding) / (align === 'center' ? 2 : 1);
            }
            this.drawTextEx(text, x, y);
        } else {
            this.drawText(text, x, y, maxWidth - this.padding, align);
        }
    };

    Window_GlossaryList.prototype.hide = function() {};
})();

