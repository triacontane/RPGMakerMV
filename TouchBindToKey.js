//=============================================================================
// TouchBindToKey.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc タッチ入力のキーバインドプラグイン
 * @author トリアコンタン
 *
 * @param 左クリックで有効になるボタン
 * @desc パラメータ説明
 * @default デフォルト値
 *
 * @help タッチおよびマウスクリックを特定のキーに紐付けます。
 * 紐付けた場合、タッチおよびクリックのもともとの動作は無効になります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'TouchBindToKey';

    var TouchInput_update = TouchInput.update;
    TouchInput.update = function() {
        this._triggered = false;
        this._cancelled = false;
        this._released = false;
    };
})();

