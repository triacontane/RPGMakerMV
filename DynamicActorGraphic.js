//=============================================================================
// DynamicActorGraphic.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2021/03/21 MZ向けに全面的に修正
// 1.2.3 2020/06/06 必要ない場合はプレイヤーをリフレッシュしないよう修正
// 1.2.2 2020/04/21 NpcFollower.jsと併用したときに発生する循環参照を解消
// 1.2.1 2018/11/18 ヘルプの記述を修正
// 1.2.0 2018/11/18 プレイヤーの残MPに応じてグラフィックを変更する機能を追加
// 1.1.0 2017/05/24 特定のスイッチがONのときにグラフィックを変更する機能を追加
// 1.0.2 2017/02/07 端末依存の記述を削除
// 1.0.1 2017/01/21 ステートアイコンの並び順が逆になっていた不具合を修正
// 1.0.0 2016/12/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DynamicActorGraphicPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicActorGraphic.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param list
 * @text List
 * @desc List of image files and conditions to be changed.
 * @default []
 * @type struct<ACTOR>[]
 *
 * @command REFRESH
 * @text Refresh
 * @desc Image changes made by the switch will be reflected immediately.
 *
 * @help Dynamically changes the actor's walk, face,
 * and battle graphics according to the conditions.
 * Set the image and conditions from the parameters.
 * Changes when HP is remaining, when certain states are enabled,
 * and when switches are turned on.
 *
 * The change by the switch will take effect after switching
 * the menu screen or moving the map.
 * If you want it to take effect immediately,
 * you can refresh it from the plugin command.
 *
 * MIT License
 */
/*:ja
 * @plugindesc アクターグラフィックの動的設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicActorGraphic.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param list
 * @text 設定リスト
 * @desc 変更する画像ファイルと条件のリストです。条件を満たした画像が複数ある場合は、リストの下が優先されます。
 * @default []
 * @type struct<ACTOR>[]
 *
 * @command REFRESH
 * @text リフレッシュ
 * @desc スイッチによる画像変更を即座に反映させます。
 *
 * @help アクターの歩行、顔、バトルグラフィックを条件に応じて動的に変化させます。
 * パラメータから画像と条件を設定してください。
 * HPの残量、特定のステート有効時、スイッチON時に変化します。
 * スイッチによる変化はメニュー画面の切り替えまたはマップ移動後に有効になります。
 * すぐに反映させたい場合はプラグインコマンドからリフレッシュしてください。
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

/*~struct~ACTOR:
 *
 * @param id
 * @text アクターID
 * @desc 対象となるアクターIDです。
 * @default 0
 * @type actor
 *
 * @param name
 * @text 名称
 * @desc 識別用の名称です。特に意味はありません。
 * @default
 *
 * @param faceImage
 * @text フェイス画像
 * @desc 条件を満たしたときに変更するフェイスグラフィックです。
 * @default
 * @type file
 * @dir img/faces
 *
 * @param faceIndex
 * @text フェイス番号
 * @desc 条件を満たしたときに変更するフェイスグラフィックのインデックスです。0から7までの値を指定します。
 * @default 0
 * @type number
 *
 * @param characterImage
 * @text キャラクター画像
 * @desc 条件を満たしたときに変更するキャラクターグラフィックです。
 * @default
 * @type file
 * @dir img/characters
 *
 * @param characterIndex
 * @text キャラクター番号
 * @desc 条件を満たしたときに変更するフェイスグラフィックのインデックスです。0から7までの値を指定します。
 * @default 0
 * @type number
 *
 * @param battlerImage
 * @text バトラー画像
 * @desc 条件を満たしたときに変更するバトラーグラフィックです。
 * @default
 * @type file
 * @dir img/sv_actors
 *
 * @param hpRate
 * @text HP条件
 * @desc HPが指定した割合(%)を下回った場合にグラフィック変更
 * @default 0
 * @type number
 * @max 100
 *
 * @param state
 * @text ステート条件
 * @desc 指定したステートが有効になった場合にグラフィック変更
 * @default 0
 * @type state
 *
 * @param switchId
 * @text スイッチ条件
 * @desc 指定したスイッチがONの場合にグラフィック変更
 * @default 0
 * @type switch
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.list) {
        return;
    }

    PluginManagerEx.registerCommand(script, 'REFRESH', args => {
        $gameParty.refreshMemberCustomGraphic();
        $gameTemp.requestBattleRefresh();
    });

    //=============================================================================
    // Game_Actor
    //  アクターグラフィックを動的に差し替えます。
    //=============================================================================
    const _Game_Actor_refresh    = Game_Actor.prototype.refresh;
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
        param.list.filter(item => this.isValidCustomGraphic(item))
            .forEach(item => this.setCustomGraphic(item));
        if (this.isChangeCharacterImage()) {
            $gamePlayer.requestRefresh();
        }
        if (this.isChangeFaceImage()) {
            $gameTemp.requestBattleRefresh();
        }
    };

    Game_Actor.prototype.isValidCustomGraphic = function(item) {
        const conditions = []
        conditions.push(() => item.id === this.actorId());
        conditions.push(() => !item.hpRate || item.hpRate / 100 >= this.hpRate());
        conditions.push(() => !item.state || this.isStateAffected(item.state));
        conditions.push(() => !item.switchId || $gameSwitches.value(item.switchId));
        return conditions.every(condition => condition());
    };

    Game_Actor.prototype.setCustomGraphic = function(item) {
        if (item.faceImage) {
            this._faceNameCustom  = item.faceImage;
            this._faceIndexCustom = item.faceIndex;
        }
        if (item.characterImage) {
            this._characterNameCustom  = item.characterImage;
            this._characterIndexCustom = item.characterIndex;
        }
        if (item.battlerImage) {
            this._battlerNameCustom = item.battlerImage;
        }
    };

    Game_Actor.prototype.initCustomGraphic = function() {
        this._characterNameCustom  = null;
        this._characterIndexCustom = null;
        this._faceNameCustom       = null;
        this._faceIndexCustom      = null;
        this._battlerNameCustom    = null;
    };

    Game_Actor.prototype.isChangeCharacterImage = function() {
        return this._characterNameCustom !== null || this._characterIndexCustom !== null;
    };

    Game_Actor.prototype.isChangeFaceImage = function() {
        return this._faceNameCustom !== null || this._faceIndexCustom !== null;
    };

    const _Game_Actor_characterName    = Game_Actor.prototype.characterName;
    Game_Actor.prototype.characterName = function() {
        return this._characterNameCustom || _Game_Actor_characterName.apply(this, arguments);
    };

    const _Game_Actor_characterIndex    = Game_Actor.prototype.characterIndex;
    Game_Actor.prototype.characterIndex = function() {
        return this._characterIndexCustom || _Game_Actor_characterIndex.apply(this, arguments);
    };

    const _Game_Actor_faceName    = Game_Actor.prototype.faceName;
    Game_Actor.prototype.faceName = function() {
        return this._faceNameCustom || _Game_Actor_faceName.apply(this, arguments);
    };

    const _Game_Actor_faceIndex    = Game_Actor.prototype.faceIndex;
    Game_Actor.prototype.faceIndex = function() {
        return this._faceIndexCustom || _Game_Actor_faceIndex.apply(this, arguments);
    };

    const _Game_Actor_battlerName    = Game_Actor.prototype.battlerName;
    Game_Actor.prototype.battlerName = function() {
        return this._battlerNameCustom || _Game_Actor_battlerName.apply(this, arguments);
    };

    //=============================================================================
    // Game_Player
    //  リフレッシュ要求に応じてリフレッシュします。
    //=============================================================================
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function() {
        _Game_Player_update.apply(this, arguments);
        if (this._needsRefresh) {
            this._needsRefresh = false;
            this.refresh();
        }
    };

    Game_Player.prototype.requestRefresh = function() {
        this._needsRefresh = true;
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
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        $gameParty.refreshMemberCustomGraphic();
        _Game_Map_setup.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Map
    //  作成時にアクターグラフィックを更新します。
    //=============================================================================
    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        $gameParty.refreshMemberCustomGraphic();
        _Scene_Map_create.apply(this, arguments);
    };

    //=============================================================================
    // Scene_MenuBase
    //  作成時にアクターグラフィックを更新します。
    //=============================================================================
    const _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function() {
        $gameParty.refreshMemberCustomGraphic();
        _Scene_MenuBase_create.apply(this, arguments);
    };
})();
