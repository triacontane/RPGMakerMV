//=============================================================================
// PerformanceRefine.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.0.1 2016/09/19 作成途中
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc パフォーマンス計測プラグイン
 * @author トリアコンタン
 *
 * @help パフォーマンスに問題が発生したときに調査するための
 * プラグインです。作成途中です。
 *
 * ・現状の機能
 * シーンをcreateする際の時間を計測します。
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

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    var _Scene_Base_create = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        SceneManager.calcTimeName = getClassName(this) + '.create()';
        console.time(SceneManager.calcTimeName);
        _Scene_Base_create.apply(this, arguments);
    };

    var _SceneManager_onSceneCreate = SceneManager.onSceneCreate;
    SceneManager.onSceneCreate = function() {
        _SceneManager_onSceneCreate.apply(this, arguments);
        console.timeEnd(this.calcTimeName);
    };
})();

