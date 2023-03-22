//=============================================================================
// DynamicActorGraphic.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.6.2 2023/03/22 2.6.1の修正方針が不十分だった問題を修正
// 2.6.1 2023/03/16 動的グラフィックが設定されているとき各種ゲージの増減が一瞬で行われてしまう現象を修正
// 2.6.0 2022/08/18 動的グラフィックの条件にモーション条件を追加
// 2.5.1 2021/10/01 データベースの防具選択で武器の一覧が表示されていた問題を修正
// 2.5.0 2021/10/01 指定したタグが職業、武器、防具、ステートに記載されている場合にグラフィックを変更できる機能を追加
// 2.4.0 2021/10/01 指定した武器、防具、職業が有効な場合にグラフィックを変更できる機能を追加
// 2.3.0 2021/05/23 戦闘中であることを条件にグラフィックを変更できる機能を追加
// 2.2.0 2021/05/19 ダッシュ中であることを条件にグラフィックを変更できる機能を追加
// 2.1.1 2021/05/19 グラフィック変更条件の変数の型指定がスイッチになっていた問題を修正
// 2.1.0 2021/05/19 グラフィック変更条件に変数を追加
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
 * @param weapon
 * @text 武器条件
 * @desc 指定した武器を装備した場合にグラフィック変更
 * @default 0
 * @type weapon
 *
 * @param armor
 * @text 防具条件
 * @desc 指定した防具を装備した場合にグラフィック変更
 * @default 0
 * @type armor
 *
 * @param gameClass
 * @text 職業条件
 * @desc 指定した職業に就いた場合にグラフィック変更
 * @default 0
 * @type class
 *
 * @param tag
 * @text メモタグ条件
 * @desc 職業、武器、防具、ステートのいずれかで指定したタグ<xxx>がメモ欄に存在する場合にグラフィック変更
 * @default
 *
 * @param dashing
 * @text ダッシュ中条件
 * @desc ダッシュ中の場合にグラフィック変更
 * @default false
 * @type boolean
 *
 * @param inBattle
 * @text 戦闘中条件
 * @desc 戦闘中の場合にグラフィック変更
 * @default false
 * @type boolean
 *
 * @param motion
 * @text モーション条件
 * @desc アクターが指定モーションを取っている間、グラフィック変更
 * @default
 * @type select
 * @option なし
 * @value
 * @option 前進
 * @value walk
 * @option 待機
 * @value wait
 * @option 詠唱待機
 * @value chant
 * @option 防御
 * @value guard
 * @option ダメージ
 * @value damage
 * @option 回避
 * @value evade
 * @option 突き
 * @value thrust
 * @option 振り
 * @value swing
 * @option 飛び道具
 * @value missile
 * @option 汎用スキル
 * @value skill
 * @option 魔法
 * @value spell
 * @option アイテム
 * @value item
 * @option 逃走
 * @value escape
 * @option 勝利
 * @value victory
 * @option 瀕死
 * @value dying
 * @option 状態異常
 * @value abnormal
 * @option 睡眠
 * @value sleep
 * @option 戦闘不能
 * @value dead
 *
 * @param switchId
 * @text スイッチ条件
 * @desc 指定したスイッチがONの場合にグラフィック変更
 * @default 0
 * @type switch
 *
 * @param variableId
 * @text 変数条件
 * @desc 指定した変数が「比較方法」と「変数値」で指定した条件を満たす場合にグラフィック変更
 * @default 0
 * @type variable
 *
 * @param compareType
 * @text 比較方法
 * @desc 変数条件で指定した変数の比較方法です。
 * @default 0
 * @type select
 * @option 等しい
 * @value 0
 * @option 以上
 * @value 1
 * @option 以下
 * @value 2
 * @option より大きい
 * @value 3
 * @option より小さい
 * @value 4
 * @option 等しくない
 * @value 5
 *
 * @param operand
 * @text 変数値
 * @desc 変数条件で指定した変数の比較値です。変数と比較したい場合は制御文字を記入してください。
 * @default 0
 * @type number
 * @min -9999999
 * @max 9999999
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
        const serialize = this.createGraphicSerialize();
        this.initCustomGraphic();
        param.list.filter(item => this.isValidCustomGraphic(item))
            .forEach(item => this.setCustomGraphic(item));
        if (serialize !== this.createGraphicSerialize()) {
            $gamePlayer.requestRefresh();
            $gameTemp.requestBattleRefresh();
        }
    };

    Game_Actor.prototype.createGraphicSerialize = function() {
        return `${this.characterName()}:${this.characterIndex()}:${this.faceName()}:${this.faceIndex()}:${this.battlerName()}`;
    };

    Game_Actor.prototype.isValidCustomGraphic = function(item) {
        const conditions = []
        conditions.push(() => item.id === this.actorId());
        conditions.push(() => !item.hpRate || item.hpRate / 100 >= this.hpRate());
        conditions.push(() => !item.state || this.isStateAffected(item.state));
        conditions.push(() => !item.weapon || this.isEquipped($dataWeapons[item.weapon]));
        conditions.push(() => !item.armor || this.isEquipped($dataArmors[item.armor]));
        conditions.push(() => !item.gameClass || this.isClass($dataClasses[item.gameClass]));
        conditions.push(() => !item.tag || this.hasMemoTag(item.tag));
        conditions.push(() => !item.switchId || $gameSwitches.value(item.switchId));
        conditions.push(() => !item.variableId || this.isValidVariable(item.variableId, item.compareType, item.operand));
        conditions.push(() => !item.dashing || $gamePlayer.isDashing());
        conditions.push(() => !item.inBattle || $gameParty.inBattle());
        conditions.push(() => !item.motion || this.isMotionTypeValid(item.motion));
        return conditions.every(condition => condition());
    };

    Game_Actor.prototype.hasMemoTag = function(name) {
        return this.traitObjects().some(obj => PluginManagerEx.findMetaValue(obj, name));
    };

    Game_Actor.prototype.isValidVariable = function(id, type, operand) {
        const value = $gameVariables.value(id);
        switch (type) {
            case 0: // Equal to
                return value === operand;
            case 1: // Greater than or Equal to
                return value >= operand;
            case 2: // Less than or Equal to
                return value <= operand;
            case 3: // Greater than
                return value > operand;
            case 4: // Less than
                return value < operand;
            default: // Not Equal to
                return value !== operand;
        }
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

    Game_Actor.prototype.requestPictureMotion = function(motionType) {
        this._pictureMotion = motionType;
        this._motionFrame = Graphics.frameCount;
    };

    Game_Actor.prototype.clearPictureMotion = function() {
        this._pictureMotion = '';
        this._motionFrame = 0;
    };

    Game_Actor.prototype.isMotionTypeValid = function(motionType) {
        if (this._pictureMotion !== motionType) {
            return false;
        }
        if (Sprite_Actor.MOTIONS[motionType].loop) {
            return true;
        }
        if (this._motionFrame && this._motionFrame + 30 > Graphics.frameCount) {
            return true;
        }
        this.clearPictureMotion();
        return false;
    };

    Game_Actor.prototype.updateMotionGraphic = function() {
        if (!this._pictureMotion) {
            return;
        }
        this.refreshCustomGraphic();
    };

    const _Game_Actor_performDamage = Game_Actor.prototype.performDamage;
    Game_Actor.prototype.performDamage = function() {
        _Game_Actor_performDamage.apply(this, arguments);
        this.requestPictureMotion('damage');
    };

    const _Game_Actor_performAction = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        _Game_Actor_performAction.apply(this, arguments);
        this._performAction = true;
    };

    const _Game_Actor_performActionEnd = Game_Actor.prototype.performActionEnd;
    Game_Actor.prototype.performActionEnd = function() {
        _Game_Actor_performActionEnd.apply(this, arguments);
        this._performAction = false;
    };

    const _Game_Battler_requestMotion = Game_Battler.prototype.requestMotion;
    Game_Battler.prototype.requestMotion = function(motionType) {
        _Game_Battler_requestMotion.apply(this, arguments);
        if (this instanceof Game_Actor) {
            this.requestPictureMotion(motionType);
        }
    };

    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.apply(this, arguments);
        if (this instanceof Game_Actor) {
            this.clearPictureMotion();
        }
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

    const _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
    Game_Player.prototype.updateDashing = function() {
        const prev = this._dashing;
        _Game_Player_updateDashing.apply(this, arguments);
        if (prev !== this._dashing) {
            $gameParty.refreshMemberCustomGraphic();
        }
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

    const _Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function(motionType) {
        if (this._actor) {
            const newMotion = Sprite_Actor.MOTIONS[motionType];
            if (this._motion !== newMotion) {
                this._actor.requestPictureMotion(motionType);
            }
        }
        _Sprite_Actor_startMotion.apply(this, arguments);
    };

    const _Sprite_Actor_updateMotion = Sprite_Actor.prototype.updateMotion;
    Sprite_Actor.prototype.updateMotion = function() {
        _Sprite_Actor_updateMotion.apply(this, arguments);
        if (this._actor) {
            this._actor.updateMotionGraphic();
        }
    };
})();
