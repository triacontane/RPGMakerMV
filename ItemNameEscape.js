//=============================================================================
// ItemNameEscape.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2015/12/24 マップデータが歯抜けになっている場合に発生するエラーを対応
// 1.0.0 2015/12/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin of item name escape
 * @author triacontane
 *
 * @help Plugin of item name escape
 * Usable escape code : \V, \N, \P, \G
 * Target : name, description
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 項目名の制御文字適用プラグイン
 * @author トリアコンタン
 *
 * @help データベースの項目に制御文字が使えるようになります。
 * 利用可能な制御文字は以下の通りです。
 * 　\V, \N, \P, \G
 *
 * 対象項目は項目は以下の通りです。
 * 　「名称」「説明文」
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

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(window));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(window));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        }.bind(window));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : '';
        }.bind(window));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // DataManager
    //  データベースの「名称」と「説明文」に制御文字を適用します。
    //=============================================================================
    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (Array.isArray(object) && object !== $dataMapInfos) {
            for (var i = 1; i < object.length; i++) {
                var data = object[i];
                if (data != null) {
                    if (data.name && data.name.match(/\\/g)) data.preName = data.name;
                    if (data.description && data.description.match(/\\/g)) data.preDescription = data.description;
                }
            }
        }
    };

    DataManager.databaseEscape = function() {
        for (var i = 0; i < this._databaseFiles.length; i++) {
            var object = window[this._databaseFiles[i].name];
            if (Array.isArray(object) && object !== $dataMapInfos) {
                for (var j = 1; j < object.length; j++) {
                    if (object[j] != null) this.convertName(object[j]);
                }
            }
        }
    };

    DataManager.convertName = function(data) {
        if (data.preName != null) data.name = convertEscapeCharacters(data.preName);
        if (data.preDescription != null) data.description = convertEscapeCharacters(data.preDescription);
    };

    //=============================================================================
    // Scene_Boot
    //  ゲーム開始時にデータベースの制御文字を適用する処理を追加定義します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        DataManager.databaseEscape();
    };

    //=============================================================================
    // Game_Map
    //  マップリフレッシュ時にデータベースの制御文字を適用する処理を追加定義します。
    //=============================================================================
    var _Game_Map_refresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.call(this);
        DataManager.databaseEscape();
    };
})();

