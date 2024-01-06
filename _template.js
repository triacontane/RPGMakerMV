/*=============================================================================
 ${NAME}.js
----------------------------------------------------------------------------
 (C)${YEAR} Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 ${DATE} 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ${NAME}プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/${NAME}.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param param
 * @text パラメータ名称
 * @desc パラメータ説明
 * @default
 * @type struct<TEST>[]
 *
 * @command command
 * @text コマンド名称
 * @desc コマンド説明
 *
 * @arg arg
 * @text 引数名称
 * @desc 引数説明
 * @default
 * @type number
 *
 * @help ${NAME}.js
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

/*~struct~AudioSe:
 * @param name
 * @text ファイル名称
 * @desc ファイル名称です。
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text ボリューム
 * @desc ボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 左右バランス
 * @desc 左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*~struct~Color:
 * @param red
 * @text 赤色
 * @desc フラッシュの赤色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param green
 * @text 緑色
 * @desc フラッシュの緑色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param blue
 * @text 青色
 * @desc フラッシュの青色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param alpha
 * @text 強さ
 * @desc フラッシュの強さです。
 * @default 0
 * @type number
 * @max 255
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'command', args => {

    });
})();
