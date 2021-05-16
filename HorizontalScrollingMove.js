//=============================================================================
// HorizontalScrollingMove.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2021/05/17 MZで動作するようリファクタリング
// 1.2.1 2021/05/17 プレイヤーの初期の向きを下から右に変更
// 1.2.0 2019/07/20 画像のみ向き制限する仕様を追加
// 1.1.0 2017/07/25 上向きを許容するパラメータを追加
// 1.0.0 2017/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 横スクロール移動プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HorizontalScrollingMove.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param validSwitchId
 * @text 有効スイッチ番号
 * @desc 横スクロール移動が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @param validUpPlayer
 * @text プレイヤー上向き許容
 * @desc プレイヤーが上下に移動するときは上向きを許容します。
 * @default false
 * @type boolean
 *
 * @param validUpEvent
 * @text イベント上向き許容
 * @desc イベントが上下に移動するときは上向きを許容します。
 * @default false
 * @type boolean
 *
 * @param imageOnly
 * @text 画像のみ向き制限
 * @desc グラフィックのみ向きを左右に限定し、キャラクターの実体は通常通り向き変更します。
 * @default false
 * @type boolean
 *
 * @help HorizontalScrollingMove.js
 * 
 * キャラクターが移動する際の向きを左右に限定します。
 * 主に横スクロールのゲームにおけるキャラ移動を想定しています。
 * ただし、梯子属性のタイルでは例外的に上を向きます。
 *
 * 指定したスイッチがONのときのみ有効です。
 * 
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * This plugin is released under the MIT License.
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_CharacterBase
    //  横移動時に別の方向を向こうとした場合、矯正します。
    //=============================================================================
    if (!param.imageOnly) {
        const _Game_CharacterBase_setDirection      = Game_CharacterBase.prototype.setDirection;
        Game_CharacterBase.prototype.setDirection = function(d) {
            const prevDirection = this.direction();
            _Game_CharacterBase_setDirection.apply(this, arguments);
            if (this.isHorizontalMove()) {
                this.modifyDirectionForHorizontalMove(prevDirection);
            }
        };

        Game_CharacterBase.prototype.modifyDirectionForHorizontalMove = function(prevDirection) {
            if (this.isNeedModifyDirection() && !this.isOnLadder() && !this.isDirectionFixed()) {
                this._direction = prevDirection;
            }
        };
    }

    Game_CharacterBase.prototype.isHorizontalMove = function() {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };

    Game_CharacterBase.prototype.isNeedModifyDirection = function() {
        return this.direction() === 2 || (this.isNeedModifyUpper() && this.direction() === 8);
    };

    Game_CharacterBase.prototype.isNeedModifyUpper = function() {
        return false;
    };

    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.apply(this, arguments);
        if (this.isHorizontalMove()) {
            this._direction = 6;
        }
    };

    Game_Player.prototype.isNeedModifyUpper= function() {
        return !param.validUpPlayer;
    };

    Game_Follower.prototype.isNeedModifyUpper= function() {
        return !param.validUpPlayer;
    };

    Game_Event.prototype.isNeedModifyUpper = function() {
        return !param.validUpEvent;
    };

    if (param.imageOnly) {
        const _Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
        Sprite_Character.prototype.characterPatternY = function() {
            const result = _Sprite_Character_characterPatternY.apply(this, arguments);
            if (this._character.isHorizontalMove() && this._character.isNeedModifyDirection() && this._prevPatternY) {
                return this._prevPatternY;
            }
            this._prevPatternY = result;
            return result;
        };
    }
})();

