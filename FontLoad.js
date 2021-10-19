//=============================================================================
// FontLoad.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2021/10/20 ヘルプ微修正
// 2.0.0 2021/06/05 MZで動作するよう再構築
// 1.1.1 2019/09/15 パラメータの型指定機能に対応
// 1.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 1.0.0 2016/06/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc フォントロードプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FontLoad.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param fontList
 * @text フォント一覧
 * @desc 使用するフォントの一覧です。
 * @default []
 * @type struct<Font>[]
 *
 * @help 指定したURLのフォントを指定した名前でロードします。
 * ロードするだけなので、基本的には他のプラグインやスクリプトと
 * 組み合わせて使用します。
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

/*~struct~Font:
 *
 * @param name
 * @text 名称
 * @desc 利用側から指定する際に使うフォントの名称です。省略するとフォントファイルから拡張子を除いた名称になります。
 * @default
 *
 * @param fileName
 * @text ファイル名
 * @desc フォントのファイル名です。fontフォルダ配下のwoffファイルを拡張子付きで指定してください。
 * @default
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
    Scene_Boot.prototype.loadGameFonts = function() {
        _Scene_Boot_loadGameFonts.apply(this, arguments);
        param.fontList.forEach(font => {
            const name = font.name || font.fileName.replace(/\..*/, '');
            FontManager.load(name, font.fileName);
        });
    };
})();

