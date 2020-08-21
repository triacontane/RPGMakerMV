/*=============================================================================
 ShopBgm.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/08/21 MZ用にヘルプ修正
 1.0.0 2020/03/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ShopBgmPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopBgm.js
 * @author triacontane
 *
 * @param list
 * @desc List of shop BGM.
 * @default []
 * @type struct<BGM>[]
 *
 * @help ShopBgm.js
 *
 * When transitioning to the shop screen,
 * you can change the background music that flows automatically.
 *
 * When you return to the map,
 * the background music of the map is played again.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc お店BGMプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopBgm.js
 * @author トリアコンタン
 *
 * @param list
 * @text BGMリスト
 * @desc お店BGMの一覧です。スイッチ条件を指定すれば状況に応じてBGMを変更できます。一覧の上の方が優先されます。
 * @default []
 * @type struct<BGM>[]
 *
 * @help ShopBgm.js
 *
 * ショップ画面に遷移したとき、自働で流れるBGMを変更できます。
 * マップに戻るとマップのBGMが再度演奏されます。
 *
 * BGMは複数指定可能でスイッチにより演奏するBGMを
 * 使い分けることもできます。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~BGM:
 * @param name
 * @desc ファイル名称です。
 * @default
 * @require 1
 * @dir audio/bgm/
 * @type file
 *
 * @param volume
 * @desc ボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @desc ピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @desc 左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @param switchId
 * @desc 指定した場合、このスイッチがONのときのみBGMが変更されます。
 * @default 0
 * @type switch
 */

(function() {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
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

    var param = createPluginParameter('ShopBgm');
    param.list = param.list || [];

    var _SceneManager_changeScene = SceneManager.changeScene;
    SceneManager.changeScene = function() {
        if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
            this.refreshShopBgm();
        }
        _SceneManager_changeScene.apply(this, arguments);
    };

    SceneManager.refreshShopBgm = function() {
        if (this._scene instanceof Scene_Shop && this._mapBgmForShop) {
            AudioManager.replayBgm(this._mapBgmForShop);
            this._mapBgmForShop = null;
        }
        if (this._nextScene instanceof Scene_Shop) {
            var bgm = this.findShopBgm();
            if (bgm) {
                this._mapBgmForShop = AudioManager.saveBgm();
                AudioManager.playBgm(bgm);
            }
        }
    };

    SceneManager.findShopBgm = function() {
        return param.list.filter(function(bgm) {
            return !bgm.switchId || $gameSwitches.value(bgm.switchId);
        })[0];
    };
})();
