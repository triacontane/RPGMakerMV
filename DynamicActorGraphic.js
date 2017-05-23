//=============================================================================
// DynamicActorGraphic.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/05/24 特定のスイッチがONのときにグラフィックを変更する機能を追加
// 1.0.2 2017/02/07 端末依存の記述を削除
// 1.0.1 2017/01/21 ステートアイコンの並び順が逆になっていた不具合を修正
// 1.0.0 2016/12/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DynamicActorGraphicPlugin
 * @author triacontane
 *
 * @help アクターの歩行、顔、バトルグラフィックを動的に変化させます。
 * HPの残量、特定のステート有効時、スイッチON時に変化します。
 *
 * スイッチによる変動はメニュー画面の切り替えもしくはマップ移動後に有効になります。
 *
 * アクターのメモ欄に以下の通り入力してください。
 * <DAG_CHARACTER_HP50:test,2> # HP残量50%以下でtest.pngの2番目の画像を
 *                             # 歩行グラフィックに指定します。(HPは10%刻みで指定)
 * <DAG_FACE_HP10:test,2>      # HP残量10%以下でtest.pngの2番目の画像を
 *                             # 顔グラフィックに指定します。
 * <DAG_BATTLER_HP30:test>     # HP残量30%以下でtest.pngを
 *                             # バトラーグラフィックに指定します。
 * <DAG_CHARACTER_ST5:test,2>  # ステート[5]有効時にtest.pngの2番目の画像を
 *                             # 歩行グラフィックに指定します。
 * <DAG_FACE_ST5:test,2>       # ステート[5]有効時にtest.pngの2番目の画像を
 *                             # 顔グラフィックに指定します。
 * <DAG_BATTLER_ST5:test>      # ステート[5]有効時にtest.pngを
 *                             # バトラーグラフィックに指定します。
 * <DAG_CHARACTER_SWITCH1:test, 2> # スイッチ[1]ON時にtest.pngの2番目の画像を
 *                                 # 歩行グラフィックに指定します。
 * <DAG_FACE_SWITCH1:test,2>       # スイッチ[1]ON時にtest.pngの2番目の画像を
 *                                 # 顔グラフィックに指定します。
 * <DAG_BATTLER_SWITCH1:test>      # スイッチ[1]ON時にtest.pngを
 *                                 # バトラーグラフィックに指定します。
 *
 * 注意！　キャッシュされていない画像に変更した場合、JSの非同期読み込みの仕様で
 * 画像がチラついたり、ただしく表示されない場合があります。
 * 当プラグインでは特に対策は行っていないので、専用の対策プラグインを使うか
 * 事前にイベントコマンドなどでキャッシュを行っていただくようお願いします。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アクターグラフィックの動的設定プラグイン
 * @author トリアコンタン
 *
 * @help アクターの歩行、顔、バトルグラフィックを動的に変化させます。
 * HPの残量、特定のステート有効時、スイッチON時に変化します。
 *
 * スイッチによる変動はメニュー画面の切り替えもしくはマップ移動後に有効になります。
 *
 * アクターのメモ欄に以下の通り入力してください。
 * <DAG_CHARACTER_HP50:test,2> # HP残量50%以下でtest.pngの2番目の画像を
 *                             # 歩行グラフィックに指定します。(HPは10%刻みで指定)
 * <DAG_FACE_HP10:test,2>      # HP残量10%以下でtest.pngの2番目の画像を
 *                             # 顔グラフィックに指定します。
 * <DAG_BATTLER_HP30:test>     # HP残量30%以下でtest.pngを
 *                             # バトラーグラフィックに指定します。
 * <DAG_CHARACTER_ST5:test,2>  # ステート[5]有効時にtest.pngの2番目の画像を
 *                             # 歩行グラフィックに指定します。
 * <DAG_FACE_ST5:test,2>       # ステート[5]有効時にtest.pngの2番目の画像を
 *                             # 顔グラフィックに指定します。
 * <DAG_BATTLER_ST5:test>      # ステート[5]有効時にtest.pngを
 *                             # バトラーグラフィックに指定します。
 * <DAG_CHARACTER_SWITCH1:test, 2> # スイッチ[1]ON時にtest.pngの2番目の画像を
 *                                 # 歩行グラフィックに指定します。
 * <DAG_FACE_SWITCH1:test,2>       # スイッチ[1]ON時にtest.pngの2番目の画像を
 *                                 # 顔グラフィックに指定します。
 * <DAG_BATTLER_SWITCH1:test>      # スイッチ[1]ON時にtest.pngを
 *                                 # バトラーグラフィックに指定します。
 *
 * 注意！　キャッシュされていない画像に変更した場合、JSの非同期読み込みの仕様で
 * 画像がチラついたり、ただしく表示されない場合があります。
 * 当プラグインでは特に対策は行っていないので、専用の対策プラグインを使うか
 * 事前にイベントコマンドなどでキャッシュを行っていただくようお願いします。
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
    var metaTagPrefix = 'DAG_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getArgArrayString = function(args) {
        var values = args.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // Game_Actor
    //  アクターグラフィックを動的に差し替えます。
    //=============================================================================
    var _Game_Actor_refresh    = Game_Actor.prototype.refresh;
    Game_Actor.prototype.refresh = function() {
        _Game_Actor_refresh.apply(this, arguments);
        this.refreshCustomGraphic();
    };

    Game_Actor.prototype.recoverAll = function() {
        Game_BattlerBase.prototype.recoverAll.apply(this, arguments);
        this.refreshCustomGraphic();
    };

    Game_Actor.prototype.refreshCustomGraphic = function() {
        this.initCustomGraphic();
        this.refreshCustomGraphicForState();
        this.refreshCustomGraphicForHpRate();
        this.refreshCustomGraphicForSwitch();
        $gamePlayer.refresh();
    };

    Game_Actor.prototype.refreshCustomGraphicForState = function() {
        var actor = this.actor();
        this.getSortedStates().forEach(function(stateId) {
            this.setCharacterCustom(getMetaValue(actor, 'CHARACTER_ST' + String(stateId)));
            this.setFaceCustom(getMetaValue(actor, 'FACE_ST' + String(stateId)));
            this.setBattlerCustom(getMetaValue(actor, 'BATTLER_ST' + String(stateId)));
        }, this);
    };

    Game_Actor.prototype.refreshCustomGraphicForHpRate = function() {
        var actor = this.actor();
        for (var hpRate = 10; hpRate <= 100; hpRate += 10) {
            if (this.hpRate() > hpRate / 100) continue;
            this.setCharacterCustom(getMetaValue(actor, 'CHARACTER_HP' + String(hpRate)));
            this.setFaceCustom(getMetaValue(actor, 'FACE_HP' + String(hpRate)));
            this.setBattlerCustom(getMetaValue(actor, 'BATTLER_HP' + String(hpRate)));
        }
    };

    Game_Actor.prototype.refreshCustomGraphicForSwitch = function() {
        var actor = this.actor();
        Object.keys(actor.meta).forEach(function(metaName) {
            metaName.replace(/CHARACTER_SWITCH(\d+)/i, function() {
                if ($gameSwitches.value(getArgNumber(arguments[1]))) {
                    this.setCharacterCustom(getMetaValue(actor, arguments[0]));
                }
            }.bind(this));
            metaName.replace(/FACE_SWITCH(\d+)/i, function() {
                if ($gameSwitches.value(getArgNumber(arguments[1]))) {
                    this.setFaceCustom(getMetaValue(actor, arguments[0]));
                }
            }.bind(this));
            metaName.replace(/BATTLER_SWITCH(\d+)/i, function() {
                if ($gameSwitches.value(getArgNumber(arguments[1]))) {
                    this.setBattlerCustom(getMetaValue(actor, arguments[0]));
                }
            }.bind(this));
        }.bind(this));
    };

    Game_Actor.prototype.getSortedStates = function() {
        return this._states.clone().sort(this.compareOrderStateIdPriority.bind(this));
    };

    Game_Actor.prototype.compareOrderStateIdPriority = function(stateIdA, stateIdB) {
        return $dataStates[stateIdB].priority - $dataStates[stateIdA].priority;
    };

    Game_Actor.prototype.initCustomGraphic = function() {
        this._characterNameCustom  = null;
        this._characterIndexCustom = null;
        this._faceNameCustom       = null;
        this._faceIndexCustom      = null;
        this._battlerNameCustom    = null;
    };

    Game_Actor.prototype.setCharacterCustom = function(metaValue) {
        if (!metaValue || this._characterNameCustom) return;
        var metaValueArray       = getArgArrayString(metaValue);
        this._characterNameCustom  = metaValueArray[0];
        this._characterIndexCustom = getArgNumber(metaValueArray[1], 0, 7);
    };

    Game_Actor.prototype.setFaceCustom = function(metaValue) {
        if (!metaValue || this._faceNameCustom) return;
        var metaValueArray  = getArgArrayString(metaValue);
        this._faceNameCustom  = metaValueArray[0];
        this._faceIndexCustom = getArgNumber(metaValueArray[1], 0, 7);
    };

    Game_Actor.prototype.setBattlerCustom = function(metaValue) {
        if (!metaValue || this._battlerNameCustom) return;
        this._battlerNameCustom  = metaValue;
    };

    var _Game_Actor_characterName    = Game_Actor.prototype.characterName;
    Game_Actor.prototype.characterName = function() {
        return this._characterNameCustom || _Game_Actor_characterName.apply(this, arguments);
    };

    var _Game_Actor_characterIndex    = Game_Actor.prototype.characterIndex;
    Game_Actor.prototype.characterIndex = function() {
        return this._characterIndexCustom || _Game_Actor_characterIndex.apply(this, arguments);
    };

    var _Game_Actor_faceName    = Game_Actor.prototype.faceName;
    Game_Actor.prototype.faceName = function() {
        return this._faceNameCustom || _Game_Actor_faceName.apply(this, arguments);
    };

    var _Game_Actor_faceIndex    = Game_Actor.prototype.faceIndex;
    Game_Actor.prototype.faceIndex = function() {
        return this._faceIndexCustom || _Game_Actor_faceIndex.apply(this, arguments);
    };

    var _Game_Actor_battlerName    = Game_Actor.prototype.battlerName;
    Game_Actor.prototype.battlerName = function() {
        return this._battlerNameCustom || _Game_Actor_battlerName.apply(this, arguments);
    };

    //=============================================================================
    // Game_Party
    //  メンバーのグラフィックを動的に差し替えます。
    //=============================================================================
    Game_Party.prototype.refreshMemberCustomGraphic = function() {
        this.members().forEach(function(actor) {
            actor.refreshCustomGraphic();
        });
    };

    //=============================================================================
    // Game_Map
    //  場所移動時にアクターグラフィックを更新します。
    //=============================================================================
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        $gameParty.refreshMemberCustomGraphic();
        _Game_Map_setup.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Map
    //  作成時にアクターグラフィックを更新します。
    //=============================================================================
    var _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        $gameParty.refreshMemberCustomGraphic();
        _Scene_Map_create.apply(this, arguments);
    };

    //=============================================================================
    // Scene_MenuBase
    //  作成時にアクターグラフィックを更新します。
    //=============================================================================
    var _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function() {
        $gameParty.refreshMemberCustomGraphic();
        _Scene_MenuBase_create.apply(this, arguments);
    };
})();



