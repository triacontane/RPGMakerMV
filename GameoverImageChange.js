/*=============================================================================
 GameoverImageChange.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2020/08/21 MEの代わりにBGMを演奏できる機能を追加
                  MEのピッチと位相が正常に設定されない問題を修正
 1.0.1 2020/08/18 英語ヘルプ作成
 1.0.0 2020/08/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc GameoverImageChangePlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GameoverImageChange.js
 * @author triacontane
 *
 * @param gameoverList
 * @text List of images and MEs
 * @desc This is the list that sets the game over image and ME change conditions.
 * @default []
 * @type struct<Record>[]
 *
 * @help GameoverImageChange.js
 *
 * Change the game over image and ME to suit the situation.
 * Set the image, ME, and conditional switch.
 * You can set multiple images, and when multiple conditions are met,
 * the setting above the list takes precedence.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ゲームオーバー画像変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GameoverImageChange.js
 * @author トリアコンタン
 *
 * @param gameoverList
 * @text 画像とMEのリスト
 * @desc ゲームオーバー画像およびMEの変更条件を設定するリストです。
 * @default []
 * @type struct<Record>[]
 *
 * @help GameoverImageChange.js
 *
 * ゲームオーバー時の画像およびMEを状況に応じて変更します。
 * 画像、ME、そして条件となるスイッチを設定してください。
 * 画像は複数設定でき、複数の条件を満たしたときはリストの上の設定が優先されます。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Record:
 * @param ImageFile
 * @desc This is the game over image that will be displayed when the specified switch is ON.
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param AudioFile
 * @desc This is the file name of the ME file to be played when the switch specified by the condition is ON.
 * @default
 * @require 1
 * @dir audio/me/
 * @type file
 *
 * @param SwitchId
 * @desc The switch is used to display the specified image or ME.
 * @default 1
 * @type switch
 */

/*~struct~Record:ja
 * @param ImageFile
 * @text 画像ファイル
 * @desc 条件で指定したスイッチがONのときに表示されるゲームオーバー画像です。指定しなかった場合はデフォルト画像が表示されます。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param AudioFile
 * @text MEファイル
 * @desc 条件で指定したスイッチがONのときに演奏されるMEのファイル名です。指定しなかった場合はデフォルトMEが演奏されます。
 * @default
 * @require 1
 * @dir audio/me/
 * @type file
 *
 * @param AudioBgmFile
 * @text BGMファイル
 * @desc MEの代わりにBGMを演奏します。指定するとMEは演奏されなくなります。
 * @default
 * @require 1
 * @dir audio/bgm/
 * @type file
 *
 * @param SwitchId
 * @text スイッチ番号
 * @desc 指定した画像、MEを表示するための条件となるスイッチです。
 * @default 1
 * @type switch
 */

(function () {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function (pluginName) {
        var paramReplacer = function (key, value) {
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
        var parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('GameoverImageChange');
    if (!param.gameoverList) {
        param.gameoverList = [];
    }

    var _Scene_Gameover_playGameoverMusic = Scene_Gameover.prototype.playGameoverMusic;
    Scene_Gameover.prototype.playGameoverMusic = function() {
        _Scene_Gameover_playGameoverMusic.apply(this, arguments);
        var data = this.findGameoverData();
        if (data && (data.AudioFile || data.AudioBgmFile)) {
            this.playGameoverCustomMusic(data.AudioFile, data.AudioBgmFile);
        }
    };

    Scene_Gameover.prototype.playGameoverCustomMusic = function(name, bgmName) {
        AudioManager.stopMe();
        var defaultMe = $dataSystem.gameoverMe;
        var audio = {
            name: bgmName || name,
            volume: defaultMe.volume,
            pitch: defaultMe.pitch,
            pan: defaultMe.pan
        }
        if (bgmName) {
            AudioManager.playBgm(audio);
        } else {
            AudioManager.playMe(audio);
        }
    };

    var _Scene_Gameover_createBackground = Scene_Gameover.prototype.createBackground;
    Scene_Gameover.prototype.createBackground = function() {
        _Scene_Gameover_createBackground.apply(this, arguments);
        var data = this.findGameoverData();
        if (data && data.ImageFile) {
            this.changeCustomBackground(data.ImageFile);
        }
    };

    Scene_Gameover.prototype.changeCustomBackground = function(name) {
        this._backSprite.bitmap = ImageManager.loadSystem(name);
    };

    Scene_Gameover.prototype.findGameoverData = function() {
        return param.gameoverList.filter(function (item) {
            return $gameSwitches.value(item.SwitchId);
        })[0];
    };
})();
