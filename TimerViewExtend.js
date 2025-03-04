/*=============================================================================
 TimerViewExtend.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2025/03/05 アウトラインカラーが正しく設定できない問題を修正
                  アウトライン幅を設定できる機能を追加
 1.1.0 2024/03/11 フォントサイズを変数指定したとき即時反映されるよう修正
 1.0.0 2023/11/29 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイマー表示拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerViewExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param fontFace
 * @text フォント
 * @desc タイマーのフォントです。別途フォントロードプラグインが必要です。
 * @default
 * @type string
 *
 * @param fontSize
 * @text フォントサイズ
 * @desc タイマーのフォントサイズです。
 * @default 0
 * @type number
 *
 * @param fontColor
 * @text フォントカラー
 * @desc タイマーのフォントカラーです。システム色もしくはCSS形式で直接指定します。
 * @default 0
 * @type color
 *
 * @param outlineColor
 * @text アウトラインカラー
 * @desc タイマーのアウトラインカラーです。システム色もしくはCSS形式で直接指定します。
 * @default 0
 * @type color
 *
 * @param outlineWidth
 * @text アウトライン幅
 * @desc タイマーのアウトライン幅です。0を指定するとアウトライン無しになります。
 * @default 3
 * @type number
 *
 * @param format
 * @text フォーマット
 * @desc タイマーの表示形式です。%1が残りの分です。%2が残りの秒です。
 * @default %1:%2
 *
 * @param basePosition
 * @text ベース表示位置
 * @desc タイマーのベース表示位置です。
 * @default upperCenter
 * @type select
 * @option 中央上
 * @value upperCenter
 * @option 左上
 * @value upperLeft
 * @option 右上
 * @value upperRight
 * @option 中央下
 * @value lowerCenter
 * @option 左下
 * @value lowerLeft
 * @option 右下
 * @value lowerRight
 *
 * @param offsetX
 * @text X座標調整値
 * @desc タイマーのX座標の調整値です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param offsetY
 * @text Y座標調整値
 * @desc タイマーのY座標の調整値です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param timerWidth
 * @text タイマー横幅
 * @desc タイマーの横幅です。0を指定するとデフォルトの幅になります。
 * @default 0
 * @type number
 *
 * @param timerHeight
 * @text タイマー高さ
 * @desc タイマーの高さです。0を指定するとデフォルトの幅になります。
 * @default 0
 * @type number
 *
 * @param visibilitySwitchId
 * @text 表示スイッチ
 * @desc 指定した番号のスイッチがONのときのみタイマーが表示されます。0を指定するとデフォルト仕様（動いているときだけ表示）です。
 * @default 0
 * @type switch
 *
 * @help TimerViewExtend.js
 *
 * タイマーのフォントや表示位置など表示に関わる部分を仕様変更できます。
 * タイマー自体の仕様には干渉しません。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Sprite_Timer_createBitmap = Sprite_Timer.prototype.createBitmap;
    Sprite_Timer.prototype.createBitmap = function() {
        _Sprite_Timer_createBitmap.apply(this, arguments);
        if (param.timerWidth || param.timerHeight) {
            const w = param.timerWidth || this.bitmap.width;
            const h = param.timerHeight || this.bitmap.height;
            this.bitmap = new Bitmap(w, h);
        }
        this.redraw();
    };

    const _Sprite_Timer_redraw = Sprite_Timer.prototype.redraw;
    Sprite_Timer.prototype.redraw = function() {
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        const outlineColor = param.outlineColor;
        if (outlineColor) {
            this.bitmap.outlineColor = ColorManager.cssColor(outlineColor);
        }
        const fontColor = param.fontColor;
        if (fontColor) {
            this.bitmap.textColor = ColorManager.cssColor(fontColor);
        }
        this.bitmap.outlineWidth = param.outlineWidth || 0;
        _Sprite_Timer_redraw.apply(this, arguments);
    };

    ColorManager.cssColor = function(color) {
        return isFinite(color) ? this.textColor(color) : color;
    };

    const _Sprite_Timer_fontFace = Sprite_Timer.prototype.fontFace;
    Sprite_Timer.prototype.fontFace = function() {
        const font = _Sprite_Timer_fontFace.apply(this, arguments);
        return param.fontFace || font;
    };

    const _Sprite_Timer_fontSize = Sprite_Timer.prototype.fontSize;
    Sprite_Timer.prototype.fontSize = function() {
        const size = _Sprite_Timer_fontSize.apply(this, arguments);
        return param.fontSize || size;
    };

    const _Sprite_Timer_updatePosition = Sprite_Timer.prototype.updatePosition;
    Sprite_Timer.prototype.updatePosition = function() {
        _Sprite_Timer_updatePosition.apply(this, arguments);
        const rightX = Graphics.width - this.bitmap.width;
        const lowerY = Graphics.height - this.bitmap.height;
        switch (param.basePosition) {
            case 'upperCenter':
                this.x = rightX / 2;
                this.y = 0;
                break;
            case 'upperLeft':
                this.x = 0;
                this.y = 0;
                break;
            case 'upperRight':
                this.x = rightX;
                this.y = 0;
                break;
            case 'lowerCenter':
                this.x = rightX / 2;
                this.y = lowerY;
                break;
            case 'lowerLeft':
                this.x = 0;
                this.y = lowerY;
                break;
            case 'lowerRight':
                this.x = rightX;
                this.y = lowerY;
                break;
        }
        this.x += param.offsetX || 0;
        this.y += param.offsetY || 0;
    };

    const _Sprite_Timer_timerText = Sprite_Timer.prototype.timerText;
    Sprite_Timer.prototype.timerText = function() {
        const text = _Sprite_Timer_timerText.apply(this, arguments);
        if (!param.format) {
            return text;
        }
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return param.format.format(min.padZero(2), sec.padZero(2));
    };

    const _Sprite_Timer_updateVisibility = Sprite_Timer.prototype.updateVisibility;
    Sprite_Timer.prototype.updateVisibility = function() {
        _Sprite_Timer_updateVisibility.apply(this, arguments);
        if (param.visibilitySwitchId) {
            this.visible = $gameSwitches.value(param.visibilitySwitchId);
        }
    };
})();
