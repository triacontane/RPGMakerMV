//=============================================================================
// UseOnlyOneSave.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/11/10 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc UseOnlyOneSavePlugin
 * @author triacontane
 *
 * @help UseOnlyOneSave.js
 *
 * ロードもしくはセーブ時に各画面を経由せず、ファイル1のみを
 * 常に使用するように変更します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 単一セーブデータプラグイン
 * @author トリアコンタン
 *
 * @help UseOnlyOneSave.js
 *
 * ロードもしくはセーブ時に各画面を経由せず、ファイル1のみを
 * 常に使用するように変更します。
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

    //=============================================================================
    // SceneManager
    //  セーブ画面もしくはロード画面への遷移を中止します。
    //=============================================================================
    var _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        if (sceneClass === Scene_Save || sceneClass === Scene_Load) {
            var sceneFile = new sceneClass();
            sceneFile.onSavefileOk();
            return;
        }
        _SceneManager_goto.apply(this, arguments);
    };

    //=============================================================================
    // Scene_File
    //  セーブファイルIDを1に限定します。
    //=============================================================================
    Scene_File.prototype.savefileId = function() {
        return 1;
    };
})();

