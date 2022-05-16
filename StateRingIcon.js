//=============================================================================
// StateRingIcon.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.7.0 2022/05/16 リングアイコン全体を一時的に非表示にできるスイッチを追加
// 2.6.0 2022/03/29 ターン数表示に数字フォントを使用できる機能を追加
// 2.5.0 2021/09/11 敵と味方のステート一列表示の基準を別々に設定できるよう修正
// 2.4.6 2021/04/07 2.4.1の修正で敵キャラのリングアイコンY座標が調整できなくなっていた問題を修正
//                  2.4.1の修正でフロントビューの場合に、アクターのリングアイコンを表示しない設定が機能しない問題を修正
// 2.4.5 2021/03/30 グローバル向けヘルプが正常に読み込まれていなかった問題を修正
// 2.4.4 2021/03/28 ターン数が0の場合は表示しないよう修正
// 2.4.3 2021/03/28 サイドビュー時にアクターにリングステートを表示すると、重ね合わせ画像が表示されなくなる問題を修正
// 2.4.2 2021/03/27 2.4.1の修正で複数メンバーがいる場合に表示位置が重なってしまう問題を修正
// 2.4.1 2021/03/27 フロントビューの場合も位置調整ができるよう修正
// 2.4.0 2021/03/26 MZで動作するよう全面的に修正
// 2.3.1 2021/03/09 アクターのステートアイコンの拡大率がアクター自身の拡大率に影響を受けないよう修正
// 2.3.0 2021/01/24 敵キャラのリングアイコン表示位置を調整できる機能を追加
// 2.2.0 2021/01/13 指定したアイコンインデックスをリングアイコンの表示対象外にできる機能を追加
// 2.1.3 2020/03/13 2.1.2の競合対策にフォントサイズとアイコンごとのターン数表示の有無の設定を反映
// 2.1.2 2020/03/11 MOG_BattleHud.jsでステートアイコンの表示モード(View Mode)を1(ラインモード：アイコン1列に表示)にした場合もターン数表示できるよう修正
// 2.1.1 2019/02/01 味方リングアイコンかつターン数表示を有効にした場合、リングアイコンとステータスウィンドウの両方にターン数を表示させるよう仕様変更
// 2.1.0 2019/11/20 リングアイコンの拡大率を設定できる機能を追加
// 2.0.1 2019/10/14 MOG_BattleHud.jsと併用したときもアイコンごとにターン数表示の有無が反映されるよう競合解消
// 2.0.0 2019/09/15 アイコンごとにターン数表示の有無を設定できる機能を追加
//                  パラメータ構造の変更(パラメータの再設定が必要です)
// 1.8.0 2019/08/12 味方に掛けられたステートもリング表示できる機能を追加
// 1.7.0 2019/07/15 他のプラグインとの競合対策でターン数の表示値を補正できる機能を追加
// 1.6.1 2018/12/07 1.6.0で一部処理に誤りがあったので修正
// 1.6.0 2018/12/06 BMSP_StateDisplayExtension.jsと共存できる機能を追加
// 1.5.2 2018/09/10 StateRolling.jsとの連携時、アクターのアイコン表示はStateRolling.jsを優先するよう修正
// 1.5.1 2018/08/30 StateRolling.jsとの競合を解消
// 1.5.0 2018/06/17 パラメータの型指定機能に対応
//                  ステートの解除タイミングが「行動終了時」の場合の表示ターン数を1加算しました。
// 1.4.1 2018/06/10 1.4.0の修正でステートアイコンが変化したときに常に先頭のターンが表示される問題を修正
// 1.4.0 2018/06/04 Battle_Hud使用時にも味方のステートターン数が表示される機能を追加
// 1.3.3 2018/03/11 YEP_BuffsStatesCore.jsとの競合を解消
// 1.3.2 2017/06/22 一度に複数のステートが解除された場合に一部アイコンが正しく消去されない問題を修正
// 1.3.1 2017/05/05 残りターン数のフォントサイズ指定機能を追加
// 1.3.0 2017/05/05 味方の残りターン数も表示する機能を追加
// 1.2.1 2017/05/05 1.2.0の機能でプラグイン等の機能により残りターン数が小数になった場合に切り上げする仕様を追加
// 1.2.0 2017/05/04 ステートおよびバフの残りターン数を表示する機能を追加
// 1.1.0 2017/02/28 ステートアイコンを横に並べる機能を追加。ステート数によって演出を分けることもできます。
// 1.0.0 2016/08/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc StateRingIconPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateRingIcon.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param RadiusX
 * @desc The value of the horizontal radius.
 * @default 64
 * @type number
 *
 * @param RadiusY
 * @desc The value of the vertical radius.
 * @default 16
 * @type number
 *
 * @param ScaleX
 * @desc The horizontal scale of the icon.
 * @default 100
 * @type number
 *
 * @param ScaleY
 * @desc The vertical scale of the icon.
 * @default 100
 * @type number
 *
 * @param CycleDuration
 * @desc The time (number of frames) it takes for the icon to rotate around the screen.
 * @default 120
 * @type number
 *
 * @param LineViewLimit
 * @desc If the number of states is less than or equal to this value, it will be displayed in a single column.
 * @default 1
 * @type number
 *
 * @param Reverse
 * @desc The direction of rotation will be counterclockwise.
 * @default false
 * @type boolean
 *
 * @param ShowTurnCount
 * @desc Displays the number of turns remaining in the state. It is displayed for both friend and foe.
 * @default true
 * @type boolean
 *
 * @param IconIndexWithoutRing
 * @desc This is an "icon index" that is not subject to the ring display.
 * @default []
 * @type string[]
 *
 * @param IconIndexWithoutShowTurns
 * @desc The "icon index" is excluded from the display of the number of state-turns.
 * @default []
 * @type string[]
 *
 * @param TurnCountX
 * @desc Adjusts the X coordinate display position of the number of turns.
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnCountY
 * @desc Adjusts the Y coordinate display position of the number of turns.
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnAdjustment
 * @desc Corrects the displayed value of the number of turns.
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param UseNumberFont
 * @default false
 * @type boolean
 *
 * @param FontSize
 * @desc The font size of the remaining turns display.
 * @default 24
 * @type number
 *
 * @param ActorRingIcon
 * @desc The state icons of allies will also be displayed as rings.
 * @default true
 * @type boolean
 *
 * @param ActorRingIconX
 * @desc X of the actor state icon.
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param ActorRingIconY
 * @desc Y of the actor state icon.
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param EnemyRingIconX
 * @desc X of the enemy state icon.
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param EnemyRingIconY
 * @desc Y of the enemy state icon.
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param IconHideSwitch
 * @desc When the switch is ON, the ring icon is hidden.
 * @default 0
 * @type switch
 *
 * @help StateRingIcon.js
 *
 * You can rotate the state icons of enemy characters
 * when multiple states are enabled clockwise to display
 * them in a ring or in a row.
 *
 * If you want to adjust the position of the ring state
 * for each enemy character, write the following
 * in the note of the database.
 * <RingStateX:0>
 * <RingStateY:0>
 *
 */

/*:ja
 * @plugindesc リングステートプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateRingIcon.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param RadiusX
 * @text X半径
 * @desc 横方向の半径の値です。
 * @default 64
 * @type number
 *
 * @param RadiusY
 * @text Y半径
 * @desc 縦方向の半径の値です。
 * @default 16
 * @type number
 *
 * @param ScaleX
 * @text X拡大率
 * @desc アイコンの横方向の拡大率です。
 * @default 100
 * @type number
 *
 * @param ScaleY
 * @text Y拡大率
 * @desc アイコンの縦方向の拡大率です。
 * @default 100
 * @type number
 *
 * @param CycleDuration
 * @text 周期
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。0に指定すると回転しなくなります。
 * @default 120
 * @type number
 *
 * @param LineViewLimit
 * @text 一列配置上限(敵キャラ)
 * @desc 敵キャラのステート数がこの値以下の場合はリングアイコンではなく1列で表示されます。0にすると常に1列表示になります。
 * @default 1
 * @type number
 *
 * @param LineViewLimitActor
 * @text 一列配置上限(アクター)
 * @desc アクターのステート数がこの値以下の場合はリングアイコンではなく1列で表示されます。0にすると常に1列表示になります。
 * @default 1
 * @type number
 *
 * @param Reverse
 * @text 反時計回り
 * @desc 回転方向が反時計回りになります。
 * @default false
 * @type boolean
 *
 * @param ShowTurnCount
 * @text ターン数表示
 * @desc ステートの残りターン数を表示します。敵味方両方に表示されます。
 * @default true
 * @type boolean
 *
 * @param IconIndexWithoutRing
 * @text 表示対象外アイコン
 * @desc リング表示の対象外になる「アイコンインデックス」です。
 * @default []
 * @type string[]
 *
 * @param IconIndexWithoutShowTurns
 * @text ターン数表示対象外アイコン
 * @desc ステートターン数の表示対象外になる「アイコンインデックス」です。
 * @default []
 * @type string[]
 *
 * @param TurnCountX
 * @text ターン数X座標
 * @desc ターン数のX座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnCountY
 * @text ターン数Y座標
 * @desc ターン数のY座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnAdjustment
 * @text ターン数補正
 * @desc ターン数の表示値を補正します。他のプラグインとの組み合わせで数値がズレる場合にのみ変更してください。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param UseNumberFont
 * @text 数字フォントを使用
 * @desc ターン数の利用フォントに数字フォントを使用します。
 * @default false
 * @type boolean
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc 残りターン数表示のフォントサイズです。
 * @default 24
 * @type number
 *
 * @param ActorRingIcon
 * @text 味方リングアイコン
 * @desc 味方のステートアイコンもリング表示にします。サイドビューとフロントビューとで表示位置が異なります。
 * @default true
 * @type boolean
 *
 * @param ActorRingIconX
 * @text 味方リングアイコンX座標
 * @desc 味方のステートアイコンのX座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param ActorRingIconY
 * @text 味方リングアイコンY座標
 * @desc 味方のステートアイコンのY座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param EnemyRingIconX
 * @text 敵リングアイコンX座標
 * @desc 敵のステートアイコンのX座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param EnemyRingIconY
 * @text 敵リングアイコンY座標
 * @desc 敵のステートアイコンのY座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param IconHideSwitch
 * @text アイコン非表示スイッチ
 * @desc 指定したスイッチがONのとき、リングアイコンが非表示になります。
 * @default 0
 * @type switch
 *
 * @help StateRingIcon.js
 *
 * ステートが複数有効になった場合のステートアイコンを時計回りに
 * 回転させてリング表示したり一列に並べて表示したりできます。
 *
 * また、各ステートの残りターンを表示することもできます。
 * ・ステート解除のタイミングが「なし」でない場合のみ表示されます。
 * ・コアスクリプトで管理しているターン数の都合上、ステート解除のタイミングが
 * 　「行動終了時」の場合、設定したターン数よりも1大きい数から表示されます。
 *
 * 敵キャラ単位でリングステートの位置を調整する場合はデータベースのメモ欄に
 * 以下の通り記述してください。
 * <RingStateX:0>
 * <RingStateY:0>
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

/**
 * Sprite_StateIconChild
 * ステートアイコンを回転表示させるためのクラスです。
 * @constructor
 */
function Sprite_StateIconChild() {
    this.initialize.apply(this, arguments);
}

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_BattlerBase
    //  ステートの残りターン数を取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getStateTurns = function() {
        const stateTurns = this.states().map(function(state) {
            if (state.iconIndex <= 0) {
                return null;
            } else if (state.autoRemovalTiming <= 0) {
                return '';
            } else {
                return Math.ceil(this._stateTurns[state.id]) + (state.autoRemovalTiming === 1 ? 1 : 0);
            }
        }, this);
        return stateTurns.filter(function(turns) {
            return turns !== null;
        });
    };

    Game_BattlerBase.prototype.getBuffTurns = function() {
        return this._buffTurns.filter(function(turns, index) {
            return this._buffs[index] !== 0;
        }, this);
    };

    Game_BattlerBase.prototype.getAllTurns = function() {
        return this.getStateTurns().concat(this.getBuffTurns()).map(function(turn) {
            return turn + param.TurnAdjustment;
        });
    };

    Game_Battler.prototype.findRingStateX = function() {
        return 0;
    };

    Game_Battler.prototype.findRingStateY = function() {
        return 0;
    };

    Game_Enemy.prototype.findRingStateX = function() {
        const x = PluginManagerEx.findMetaValue(this.enemy(), 'RingStateX');
        return x || param.EnemyRingIconX || 0;
    };

    Game_Enemy.prototype.findRingStateY = function() {
        const y = PluginManagerEx.findMetaValue(this.enemy(), 'RingStateY');
        return y || param.EnemyRingIconY || 0;
    };

    Game_Actor.prototype.findRingStateX = function() {
        return param.ActorRingIconX || 0;
    };

    Game_Actor.prototype.findRingStateY = function() {
        return param.ActorRingIconY || 0;
    };

    const _Sprite_Enemy_updateStateSprite = Sprite_Enemy.prototype.updateStateSprite;
    Sprite_Enemy.prototype.updateStateSprite = function() {
        const prevY = this._stateIconSprite.y;
        _Sprite_Enemy_updateStateSprite.apply(this, arguments);
        this._stateIconSprite.y += prevY;
    }

    if (param.ActorRingIcon) {
        const _Sprite_Actor_createStateSprite = Sprite_Actor.prototype.createStateSprite;
        Sprite_Actor.prototype.createStateSprite = function() {
            _Sprite_Actor_createStateSprite.apply(this, arguments);
            this._stateIconSprite = new Sprite_StateIcon();
            this._stateIconSprite.setActorRing();
            this._mainSprite.addChild(this._stateIconSprite);
        };

        const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
        Sprite_Actor.prototype.setBattler = function(battler) {
            _Sprite_Actor_setBattler.apply(this, arguments);
            this._stateIconSprite.setup(battler);
        };

        const _Sprite_Actor_update = Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update = function() {
            _Sprite_Actor_update.apply(this, arguments);
            this.updateStateSprite();
        }

        const _Window_StatusBase_placeStateIcon = Window_StatusBase.prototype.placeStateIcon;
        Window_StatusBase.prototype.placeStateIcon = function(actor, x, y) {
            _Window_StatusBase_placeStateIcon.apply(this, arguments);
            const key = "actor%1-stateIcon".format(actor.actorId());
            const sprite = this._additionalSprites[key];
            if (sprite && sprite.hasRingState()) {
                sprite.saveOriginalPosition();
                this.addChild(sprite);
            }
        }

        Sprite_Actor.prototype.updateStateSprite = function() {
            this._stateIconSprite.y -= Math.round((this._mainSprite.height + 40) * 0.9);
            if (this._stateIconSprite.y < 20 - this.y) {
                this._stateIconSprite.y = 20 - this.y;
            }
            if (this.scale.x !== 1.0) {
                this._stateIconSprite.scale.x = 1.0 / this.scale.x;
            }
            if (this.scale.y !== 1.0) {
                this._stateIconSprite.scale.y = 1.0 / this.scale.y;
            }
        };
    }

    //=============================================================================
    // Sprite_StateIcon
    //  ステートアイコンを回転させます。
    //=============================================================================
    const _Sprite_StateIcon_initMembers      = Sprite_StateIcon.prototype.initMembers;
    Sprite_StateIcon.prototype.initMembers = function() {
        _Sprite_StateIcon_initMembers.apply(this, arguments);
        this._icons        = [];
        this._iconsSprites = [];
    };

    const _Sprite_StateIcon_update      = Sprite_StateIcon.prototype.update;
    Sprite_StateIcon.prototype.update = function() {
        if (!this.hasRingState()) {
            _Sprite_StateIcon_update.apply(this, arguments);
            return;
        }
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.getCycleDuration()) {
            this._animationCount = 0;
        }
        this.updateRingIcon();
    };

    Sprite_StateIcon.prototype.updateRingIcon = function() {
        let icons = [];
        if (this._battler && this._battler.isAlive()) {
            icons = this._battler.allIcons().filter(function(index) {
                return !param.IconIndexWithoutRing.contains(index);
            });
        }
        if (!this._icons.equals(icons)) {
            this._icons = icons;
            this.setupRingIcon();
        }
        this.x = (this._baseX || 0) + this._battler.findRingStateX();
        this.y = (this._baseY || 0) + this._battler.findRingStateY();
        if (param.IconHideSwitch) {
            this.visible = !$gameSwitches.value(param.IconHideSwitch);
        }
        this.updateRingIconChild();
    };

    Sprite_StateIcon.prototype.updateRingIconChild = function() {
        if (this.isRingView()) {
            this.updateRingPosition();
        } else {
            this.updateNormalPosition();
        }
        if (this._battler && param.ShowTurnCount) {
            this.updateTurns();
        }
        this._sortChildren();
    };

    Sprite_StateIcon.prototype.isRingView = function() {
        if (!this._battler) {
            return false;
        }
        const limit = this._battler.isActor() ? param.LineViewLimitActor : param.LineViewLimit;
        if (limit === 0) {
            return false;
        } else {
            return this._iconsSprites.length > limit;
        }
    };

    Sprite_StateIcon.prototype.updateRingPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setRingPosition(this.getIconRadian(index));
        }, this);
    };

    Sprite_StateIcon.prototype.updateNormalPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setNormalPosition(index, this._iconsSprites.length);
        }, this);
    };

    Sprite_StateIcon.prototype.updateTurns = function() {
        const turns = this._battler.getAllTurns();
        this._icons.forEach(function(icon, index) {
            this._iconsSprites[index].setIconTurn(turns[index]);
        }, this);
    };

    Sprite_StateIcon.prototype.getIconRadian = function(index) {
        let radian = (this._animationCount / this.getCycleDuration() + index / this._iconsSprites.length) * Math.PI * 2;
        if (param.Reverse) radian *= -1;
        return radian;
    };

    Sprite_StateIcon.prototype.getCycleDuration = function() {
        return param.CycleDuration || Infinity;
    };

    Sprite_StateIcon.prototype.setupRingIcon = function() {
        this._icons.forEach(function(icon, index) {
            if (!this._iconsSprites[index]) this.makeNewIcon(index);
            this._iconsSprites[index].setIconIndex(icon);
        }, this);
        const spriteLength = this._iconsSprites.length;
        for (let i = this._icons.length; i < spriteLength; i++) {
            this.popIcon();
        }
    };

    Sprite_StateIcon.prototype.makeNewIcon = function(index) {
        const iconSprite            = new Sprite_StateIconChild();
        this._iconsSprites[index] = iconSprite;
        this.addChild(iconSprite);
    };

    Sprite_StateIcon.prototype.popIcon = function() {
        const removedSprite = this._iconsSprites.pop();
        this.removeChild(removedSprite);
    };

    Sprite_StateIcon.prototype._sortChildren = function() {
        this.children.sort(this._compareChildOrder.bind(this));
    };

    Sprite_StateIcon.prototype._compareChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    Sprite_StateIcon.prototype.setActorRing = function() {
        this._actorRing = true;
    };

    Sprite_StateIcon.prototype.hasRingState = function() {
        if (!this._battler) {
            return false;
        } else if (this._battler.isEnemy()) {
            return true;
        } else if (param.ActorRingIcon) {
            return this._actorRing || !$gameSystem.isSideView();
        } else {
            return false;
        }
    };

    Sprite_StateIcon.prototype.saveOriginalPosition = function() {
        this._baseX = this.x;
        this._baseY = this.y;
    };

    //=============================================================================
    // Sprite_StateIconChild
    //=============================================================================
    Sprite_StateIconChild.prototype             = Object.create(Sprite_StateIcon.prototype);
    Sprite_StateIconChild.prototype.constructor = Sprite_StateIconChild;

    Sprite_StateIconChild.prototype.initialize = function() {
        Sprite_StateIcon.prototype.initialize.call(this);
        this.visible     = false;
        this._turnSprite = null;
        this._turn       = 0;
        this.scale.x = this.getScaleX();
        this.scale.y = this.getScaleY();
    };

    Sprite_StateIconChild.prototype.getScaleX = function() {
        return (param.ScaleX || 100) / 100;
    };

    Sprite_StateIconChild.prototype.getScaleY = function() {
        return (param.ScaleY || 100) / 100;
    };

    Sprite_StateIconChild.prototype.update = function() {};

    Sprite_StateIconChild.prototype.setIconIndex = function(index) {
        this._iconIndex = index;
        this.updateFrame();
    };

    Sprite_StateIconChild.prototype.setIconTurn = function(turn) {
        this.makeTurnSpriteIfNeed();
        if (this._turn === turn) return;
        this._turn = turn;
        this.refreshIconTurn();
    };

    Sprite_StateIconChild.prototype.refreshIconTurn = function() {
        const bitmap = this._turnSprite.bitmap;
        bitmap.clear();
        if (param.IconIndexWithoutShowTurns.contains(this._iconIndex)) {
            return;
        }
        if (this._turn > 0) {
            bitmap.drawText(this._turn, 0, 0, bitmap.width, bitmap.height, 'center');
        }
    };

    Sprite_StateIconChild.prototype.makeTurnSpriteIfNeed = function() {
        if (this._turnSprite) return;
        const sprite           = new Sprite();
        sprite.bitmap          = new Bitmap(ImageManager.iconWidth, ImageManager.iconHeight);
        if (param.UseNumberFont) {
            sprite.bitmap.fontFace = $gameSystem.numberFontFace();
        }
        sprite.bitmap.smooth   = true;
        sprite.bitmap.fontSize = param.FontSize;
        sprite.x               = param.TurnCountX;
        sprite.y               = param.TurnCountY;
        this._turnSprite       = sprite;
        this.addChild(this._turnSprite);
    };

    Sprite_StateIconChild.prototype.setRingPosition = function(radian) {
        this.x       = Math.cos(radian) * param.RadiusX;
        this.y       = Math.sin(radian) * param.RadiusY;
        this.visible = true;
    };

    Sprite_StateIconChild.prototype.setNormalPosition = function(index, max) {
        this.x       = ((-max + 1) / 2 + index) * this.getIconWidth();
        this.y       = 0;
        this.visible = true;
    };

    Sprite_StateIconChild.prototype.getIconWidth = function() {
        return ImageManager.iconWidth * this.getScaleX();
    };
})();

