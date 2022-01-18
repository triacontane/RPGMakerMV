//=============================================================================
// ForegroundToParallax.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2022/01/18 指定したマップのみ遠景化する機能を追加
// 1.0.0 2017/06/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Foregroundの遠景化プラグイン
 * @author トリアコンタン
 *
 * @param validNoteTag
 * @text 指定した場合のみ有効
 * @desc ONにするとタグ<fgToParallax>を記載したマップでのみ遠景化が有効になります。
 * @default false
 * @type boolean
 *
 * @help 準公式プラグイン「Foreground.js」で表示する近景を遠景に切り替えます。
 * もともとの遠景の後ろ側に表示されるようになります。
 * 二種類の遠景を同時に表示させたい場合などにご使用ください。
 *
 * プラグイン管理画面でForeground.jsよりも下に配置してください。
 *
 * Foreground.jsはサンプルゲームなどに収録されています。
 *
 * パラメータ「指定した場合のみ有効」をONにすると、以下のタグを記載したマップのみ
 * 遠景化されます。
 * <fgToParallax>
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

    var param = createPluginParameter('ForegroundToParallax');

    var _Spriteset_Map_createForeground = Spriteset_Map.prototype.createForeground;
    Spriteset_Map.prototype.createForeground = function() {
        _Spriteset_Map_createForeground.apply(this, arguments);
        if (param.validNoteTag && $dataMap && !!$dataMap.meta.fgToParallax) {
            return;
        }
        this._baseSprite.removeChild(this._foreground);
        var newIndex = this._baseSprite.getChildIndex(this._parallax);
        this._baseSprite.addChildAt(this._foreground, newIndex);
    };
})();

