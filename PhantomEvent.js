/*=============================================================================
 PhantomEvent.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.6.1 2021/05/11 1.5.0の修正により、パーティメンバーが0人になるとエラーになる問題を修正
 1.6.0 2021/05/04 アクターごとに可視距離のレートを指定できる機能を追加
 1.5.1 2021/03/28 ヘルプ微修正
 1.5.0 2021/03/28 MZで動作するよう修正
 1.4.0 2019/01/27 本来の設定とは逆に、近づくほど透明度を上げられる機能を追加
 1.3.0 2018/11/18 イベントとの距離が一定以内の場合にセルフスイッチをONにする機能を追加
 1.2.1 2018/11/11 一部、無駄な処理を行っていたのを修正
 1.2.0 2018/11/11 全イベントの不可視化を無効にできるスイッチの追加
 1.1.0 2018/11/11 最小不透明度を設定できる機能を追加
 1.0.0 2018/11/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ファントムイベントプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PhantomEvent.js
 * @base PluginCommonBase
 * @orderAfter EventLabel
 * @author トリアコンタン
 *
 * @param invisibleDistance
 * @text 不可視距離
 * @desc 指定範囲を超えてから完全に見えなくなるまでのマス数です。
 * @default 3
 * @type number
 * @min 1
 *
 * @param visibleSelfSwitch
 * @text 可視化セルフスイッチ
 * @desc 指定したセルフスイッチがONのとき、イベントの不可視化が無効になります。
 * @default
 * @type select
 * @option none
 * @value
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @param visibleSwitch
 * @text 可視化スイッチ
 * @desc 指定したIDのスイッチがONのとき、全イベントの不可視化が無効になります。
 * @default 0
 * @type switch
 *
 * @param minimumOpacity
 * @text 最小不透明度
 * @desc どれだけ離れても最低限、以下の不透明度を保ちます。(0-255)
 * @default 0
 * @type number
 * @min 0
 * @max 255
 *
 * @param visibleRate
 * @text 可視レート対象
 * @desc アクターごとの可視レートを指定した場合の取得対象です。
 * @default leader
 * @type select
 * @option 先頭のみ
 * @value leader
 * @option 全員
 * @value all
 *
 * @help PhantomEvent.js
 *
 * 指定範囲より遠くにあるイベントの不透明度を徐々に下げて最終的に不可視にします。
 * 画面表示以外は特に変化はありません。
 * イベントのメモ欄に以下の通り入力してください。
 * <可視距離:3>  // 3マス以上離れると見えなくなります。
 * <透明度反転>  // 本来の設定とは逆に近づくほど透明度が上がります。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 先頭のアクターによって可視距離のレートを変えられます。
 * 特徴を有するデータベース(※)に以下の通り指定してください。
 * <可視距離倍率:150> // 可視距離が1.5倍になります。
 + <VisibleDistanceRate:150> // 同上
 * ※ アクター、職業、武器、防具、ステートが該当します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * Game_Map
     * ピクセル単位での距離を取得します。
     */
    Game_Map.prototype.realDistance = function(x1, y1, x2, y2) {
        return Math.abs(this.realDeltaX(x1, x2)) + Math.abs(this.realDeltaY(y1, y2));
    };

    Game_Map.prototype.realDeltaX = function(x1, x2) {
        let result      = (x1 - x2) * this.tileWidth();
        const realWidth = this.width() * this.tileWidth();
        if (this.isLoopHorizontal() && Math.abs(result) > realWidth / 2) {
            if (result < 0) {
                result += realWidth;
            } else {
                result -= realWidth;
            }
        }
        return result;
    };

    Game_Map.prototype.realDeltaY = function(y1, y2) {
        let result       = (y1 - y2) * this.tileHeight();
        const realHeight = this.height() * this.tileHeight();
        if (this.isLoopVertical() && Math.abs(result) > realHeight / 2) {
            if (result < 0) {
                result += realHeight;
            } else {
                result -= realHeight;
            }
        }
        return result;
    };

    Game_Actor.prototype.findVisibleDistanceRate = function () {
        let result = 0;
        this.traitObjects().forEach(obj => {
            const rate = PluginManagerEx.findMetaValue(obj, ['可視距離倍率', 'VisibleDistanceRate']);
            if (rate) {
                result = Math.max(result, rate);
            }
        });
        return result / 100;
    };

    Game_Party.prototype.findVisibleDistanceRate = function () {
        const actors = param.visibleRate === 'leader' ? this.members().filter((a, i) => i === 0) : this.members();
        let result = 0;
        actors.forEach(actor => {
            result = Math.max(result, actor.findVisibleDistanceRate());
        });
        return result || 1;
    };

    /**
     * Game_CharacterBase
     * 不透明度に不可視情報を反映させます。
     */
    const _Game_CharacterBase_opacity      = Game_CharacterBase.prototype.opacity;
    Game_CharacterBase.prototype.opacity = function() {
        const opacity        = _Game_CharacterBase_opacity.apply(this, arguments);
        const phantomOpacity = this.getPhantomOpacity();
        return phantomOpacity !== 1 ? Math.floor(opacity * phantomOpacity) : opacity;
    };

    Game_CharacterBase.prototype.getPhantomOpacity = function() {
        return 1;
    };

    /**
     * Game_Event
     * イベントの不可視距離を取得します。
     */
    const _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function() {
        _Game_Event_initialize.apply(this, arguments);
        this._visibleDistance = this.findPhantomMeta(['可視距離', 'VisibleDistance']) * $gameMap.tileWidth() || 0;
        this._opacityReverse  = this.findPhantomMeta(['透明度反転', 'OpacityReverse']);
    };

    Game_Event.prototype.findPhantomMeta = function(names) {
        return PluginManagerEx.findMetaValue(this.event(), names);
    };

    Game_Event.prototype.getDistanceFromPlayer = function() {
        return $gameMap.realDistance(this._realX, this._realY, $gamePlayer._realX, $gamePlayer._realY);
    };

    Game_Event.prototype.isPhantom = function() {
        return this._visibleDistance > 0 && !this.isValidVisibleSelfSwitch() && !this.isValidVisibleSwitch();
    };

    Game_Event.prototype.isValidVisibleSelfSwitch = function() {
        const key = [$gameMap.mapId(), this.eventId(), param.visibleSelfSwitch];
        return param.visibleSelfSwitch && $gameSelfSwitches.value(key);
    };

    Game_Event.prototype.isValidVisibleSwitch = function() {
        return param.visibleSwitch && $gameSwitches.value(param.visibleSwitch);
    };

    Game_Event.prototype.getPhantomOpacity = function() {
        if (!this.isPhantom()) {
            return 1;
        }
        let d = this.getDistanceFromPlayer() -
            Math.floor(this._visibleDistance * $gameParty.findVisibleDistanceRate());
        if (this._opacityReverse) {
            d *= -1;
        }
        const opacity = 1 - d / ((param.invisibleDistance || 1) * $gameMap.tileWidth());
        return opacity.clamp(param.minimumOpacity / 256, 1);
    };

    const _Spriteset_Map_updateEventLabel = Spriteset_Map.prototype.updateEventLabel
    Spriteset_Map.prototype.updateEventLabel = function() {
        _Spriteset_Map_updateEventLabel.apply(this, arguments);
        Object.keys(this._eventLabelSprites).forEach(key => {
            const sprite = this._eventLabelSprites[key];
            sprite.opacity = sprite.event().getPhantomOpacity() * 256;
        });
    };
})();
