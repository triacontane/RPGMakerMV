/*=============================================================================
 NewGameSe.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2018/11/23 ニューゲーム以外でも専用効果音が演奏できるよう修正
 1.0.0 2018/08/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc NewGameSePlugin
 * @author triacontane
 *
 * @param soundEffect
 * @desc ニューゲーム選択時の効果音情報です。
 * @default
 * @type struct<AudioSe>
 *
 * @param includeContinue
 * @desc コンティニュー、オプション選択時も専用効果音を演奏します。
 * @default false
 * @type boolean
 *
 * @help NewGameSe.js
 *
 * ニューゲーム選択時のみ専用の効果音を演奏します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ニューゲーム専用効果音プラグイン
 * @author トリアコンタン
 *
 * @param soundEffect
 * @text 効果音
 * @desc ニューゲーム選択時の効果音情報です。
 * @default
 * @type struct<AudioSe>
 *
 * @param includeContinue
 * @text コンティニューも含む
 * @desc コンティニュー、オプション選択時も専用効果音を演奏します。
 * @default false
 * @type boolean
 *
 * @help NewGameSe.js
 *
 * ニューゲーム選択時のみ専用の効果音を演奏します。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~AudioSe:
 * @param name
 * @desc ファイル名称です。
 * @default
 * @require 1
 * @dir audio/se/
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

    var param = createPluginParameter('NewGameSe');

    var _Window_TitleCommand_playOkSound = Window_TitleCommand.prototype.playOkSound;
    Window_TitleCommand.prototype.playOkSound = function() {
        if (param.soundEffect && this.isNeedTitleSound()) {
            AudioManager.playStaticSe(param.soundEffect);
        } else {
            _Window_TitleCommand_playOkSound.apply(this, arguments);
        }
    };

    Window_TitleCommand.prototype.isNeedTitleSound = function() {
        return this.currentSymbol() === 'newGame' || param.includeContinue
    };
})();
