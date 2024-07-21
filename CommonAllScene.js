/*=============================================================================
 CommonAllScene.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/07/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 全シーン実行コモンイベントプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CommonAllScene.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param commonEventId
 * @text コモンイベントID
 * @desc 実行するコモンイベントIDです。
 * @default 1
 * @type common_event
 *
 * @command emptyCommand
 * @text プラグインコマンド実行
 * @desc 空のプラグインコマンドを実行します。実行内容はユーザ各自で記述してください。
 *
 * @help CommonAllScene.js
 *
 * 指定したコモンイベントを全てのシーンで繰り返し実行します。
 * ただし、文章の表示など使えないコマンドが多数あります。
 * 主に変数やスイッチの状態を最新に常に維持したい場合などに使用します。
 *
 * 対象のコモンイベントのトリガーは「なし」に指定してください。
 * 「並列処理」などに指定すると、デフォルトの並列処理コモンと
 * 重複して実行されてしまいます。
 *
 * パフォーマンス上の理由からスクリプトの多用は推奨されません。
 * 任意のコードを実行したい場合、空のプラグインコマンドを提供しているので
 * 所定の箇所にコードを記述のうえ使用できます。
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

    PluginManagerEx.registerCommand(script, 'emptyCommand', args => {
        // ここに実行内容を定義します。
    });

    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        _SceneManager_initialize.apply(this, arguments);
        this._commonEvent = new Game_AllSceneCommonEvent(param.commonEventId);
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function() {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene && this._scene.isStarted() && $dataSystem) {
            this._commonEvent.update();
        }
    };

    class Game_AllSceneCommonEvent extends Game_CommonEvent {
        constructor(commonEventId) {
            super(commonEventId);
        }

        isActive() {
            return true;
        }
    }
})();
