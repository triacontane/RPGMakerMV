/*=============================================================================
 BattleLogWithSe.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2018/08/14 効果音のインデックスに制御文字が使えるよう修正
 1.0.0 2018/08/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BattleLogWithSePlugin
 * @author triacontane
 *
 * @param soundEffectList
 * @desc 制御文字「\se[n]」で指定する効果音のリストです。一覧の左に表示されている数字を制御文字で指定してください。
 * @default []
 * @type struct<AudioSe>[]
 *
 * @help BattleLogWithSe.js
 *
 * バトルログの表示中に効果音を演奏できます。
 * パラメータ「効果音リスト」にて効果音を登録した上で
 * ログに表示する文章に以下の制御文字を指定してください。
 *
 * \se[n] n : パラメータで指定した効果音の番号(1～)
 * 例：\se[3]
 *
 * 番号を変数の値から指定する場合は以下の通りです。
 * \se[\v[1]]
 *
 * ※このプラグインはバトルログ用です。文章の表示では使えません。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc バトルログのSE演奏プラグイン
 * @author トリアコンタン
 *
 * @param soundEffectList
 * @text 効果音リスト
 * @desc 制御文字「\se[n]」で指定する効果音のリストです。一覧の左に表示されている数字を制御文字で指定してください。
 * @default []
 * @type struct<AudioSe>[]
 *
 * @help BattleLogWithSe.js
 *
 * バトルログの表示中に効果音を演奏できます。
 * パラメータ「効果音リスト」にて効果音を登録した上で
 * ログに表示する文章に以下の制御文字を指定してください。
 *
 * \se[n] n : パラメータで指定した効果音の番号(1～)
 * 例：\se[3]
 *
 * 番号を変数の値から指定する場合は以下の通りです。
 * \se[\v[1]]
 *
 * ※このプラグインはバトルログ用です。文章の表示では使えません。
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

    var param = createPluginParameter('BattleLogWithSe');
    if (!param.soundEffectList) {
        param.soundEffectList = [];
    }

    /**
     * Window_BattleLog 効果音を演奏します。
     */
    var _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function(text) {
        this.convertEscapeCharacters(text).replace(/\x1bSE\[(\d+)]/gi, function() {
            var index = parseInt(arguments[1]) - 1;
            var se = param.soundEffectList[index];
            if (se) {
                AudioManager.playSe(se);
            }
            return '';
        }.bind(this));
        arguments[0] = text.replace(/\\SE\[.+]/gi, '');
        _Window_BattleLog_addText.apply(this, arguments);
    }
})();
