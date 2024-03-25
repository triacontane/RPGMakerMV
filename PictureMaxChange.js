/*=============================================================================
 PictureMaxChange.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ピクチャ表示最大数変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureMaxChange.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param maxPicture
 * @text ピクチャ最大数
 * @desc 同時に表示できるピクチャの最大数(デフォルト100)です。
 * @default 100
 * @type number
 *
 * @help PictureMaxChange.js
 *
 * ピクチャの最大表示数を変更します。
 * ただし、100より大きい値をピクチャ番号として指定したい場合は、
 * 別のプラグインと併用するかスクリプトで指定してください。
 *
 * PictureControlExtend.js
 * 操作対象のピクチャをコマンドから指定するプラグイン
 *
 * EventParamReplace.js
 * 次に実行するイベントパラメータを差し替えられるプラグイン
 *
 * また、100より大きい値を指定する場合は、制作するゲームの
 * パフォーマンスには十分注意してください。
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

    const _Game_Screen_maxPictures = Game_Screen.prototype.maxPictures;
    Game_Screen.prototype.maxPictures = function() {
        const size = _Game_Screen_maxPictures.apply(this, arguments);
        return param.maxPicture | size;
    };
})();
