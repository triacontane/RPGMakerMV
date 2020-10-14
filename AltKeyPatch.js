/*=============================================================================
 AltKeyPatch.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/10/15 MZ対応版作成
 1.0.0 2020/10/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc AltKeyPatchPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AltKeyPatch.js
 * @author triacontane
 *
 * @help AltKeyPatch.js
 *
 * In RPGMaker MV/MZ, the Ctrl and Alt keys have the same behavior.
 * It is designed to be assigned.
 * In this patch, it is separated and pressing the Alt key no
 * longer behaves like the Ctrl key.
 *
 * Instead, the content of the code "alt" is assigned.
 * (This is used when you can specify the contents of the code as a plugin)
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc Altキー分離パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AltKeyPatch.js
 * @author トリアコンタン
 *
 * @help AltKeyPatch.js
 * ツクールMV/MZでは、CtrlキーとAltキーには同一の動作が
 * 割り当てられる仕様になっています。
 * 本パッチではそれを分離し、Altキーを押下してもCtrlキーの挙動をしなくなります。
 *
 * 代わりに『alt』というコードの内容が割り当てられます。
 * （プラグイン等で指定可能な場合に使います）
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    Input.keyMapper[18] = 'alt';
})();
