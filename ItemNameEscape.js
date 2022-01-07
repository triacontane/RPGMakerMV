//=============================================================================
// ItemNameEscape.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2022/01/07 戦闘中に変更した変数がその戦闘中に開いたスキルやアイテム一覧に反映されない問題を修正
//                  パフォーマンス対策
// 1.1.1 2021/11/22 既存データをロードした直後だと、何らかの変数操作が実行されるまで変数値の制御文字が反映されない問題を修正
// 1.1.0 2021/11/22 MZで動作するよう修正
// 1.0.1 2015/12/24 マップデータが歯抜けになっている場合に発生するエラーを対応
// 1.0.0 2015/12/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 項目名の制御文字適用プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemNameEscape.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ItemNameEscape.js
 *
 * データベースの項目に制御文字が使えるようになります。
 * 利用可能な制御文字は以下の通りです。
 * 　\V, \N, \P, \G
 *
 * 対象項目は項目は以下の通りです。
 * 　「名称」「説明文」
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

    //=============================================================================
    // DataManager
    //  データベースの「名称」と「説明文」に制御文字を適用します。
    //=============================================================================
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function (object) {
        _DataManager_onLoad.apply(this, arguments);
        if (Array.isArray(object) && object !== $dataMapInfos) {
            for (let i = 1; i < object.length; i++) {
                const data = object[i];
                if (data != null) {
                    if (data.name && data.name.match(/\\/g)) data.preName = data.name;
                    if (data.description && data.description.match(/\\/g)) data.preDescription = data.description;
                }
            }
        }
    };

    DataManager.databaseEscape = function () {
        for (let i = 0; i < this._databaseFiles.length; i++) {
            const object = window[this._databaseFiles[i].name];
            if (Array.isArray(object) && object !== $dataMapInfos) {
                for (let j = 1; j < object.length; j++) {
                    if (object[j] != null) this.convertName(object[j]);
                }
            }
        }
    };

    DataManager.convertName = function (data) {
        if (data.preName != null) {
            data.name = PluginManagerEx.convertEscapeCharacters(data.preName);
        }
        if (data.preDescription != null) {
            data.description = PluginManagerEx.convertEscapeCharacters(data.preDescription);
        }
    };

    //=============================================================================
    // Scene_Base
    //  ゲーム開始時にデータベースの制御文字を適用する処理を追加定義します。
    //=============================================================================
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.call(this);
        DataManager.databaseEscape();
    };

    //=============================================================================
    // Game_Map
    //  マップリフレッシュ時にデータベースの制御文字を適用する処理を追加定義します。
    //=============================================================================
    const _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function () {
        _Scene_MenuBase_create.apply(this, arguments);
        DataManager.databaseEscape();
    };

    const _Scene_Battle_create = Scene_Battle.prototype.create;
    Scene_Battle.prototype.create = function () {
        _Scene_Battle_create.apply(this, arguments);
        DataManager.databaseEscape();
    };

    const _Window_SkillList_refresh = Window_SkillList.prototype.refresh;
    Window_SkillList.prototype.refresh = function () {
        _Window_SkillList_refresh.apply(this, arguments);
        DataManager.databaseEscape();
    };

    const _Window_ItemList_refresh = Window_ItemList.prototype.refresh;
    Window_ItemList.prototype.refresh = function () {
        _Window_ItemList_refresh.apply(this, arguments);
        DataManager.databaseEscape();
    };
})();

