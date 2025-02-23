/*=============================================================================
 FloorDamageCustomize.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2025/02/23 アニメーションにフォロワーを含める場合、床ダメージが無効なアクターにはアニメーションを表示しないよう修正
                  地形タグを0で指定した場合、全ての地形で無効になっていた問題を修正
 1.0.0 2024/01/04 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 床ダメージカスタマイズプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FloorDamageCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param floorDamageList
 * @text 床ダメージリスト
 * @desc 床ダメージの設定リストです。
 * @default []
 * @type struct<FloorDamage>[]
 *
 * @help FloorDamageCustomize.js
 *
 * 床ダメージの演出をカスタマイズします。
 * 地形タグごとに異なる画面フラッシュや効果音、アニメーションを再生できます。
 * MV方式のアニメーションを使ってキャラクターのフラッシュも可能です。
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

/*~struct~FloorDamage:
 * @param terrainTag
 * @text 地形タグ
 * @desc 条件となる地形タグです。0を指定すると全ての地形で有効になります。
 * @default 0
 * @type number
 *
 * @param animationId
 * @text アニメーションID
 * @desc ダメージ時に再生するアニメーションIDです。
 * @default 0
 * @type animation
 *
 * @param flashColor
 * @text フラッシュ色
 * @desc ダメージ時に画面をフラッシュさせます。
 * @default
 * @type struct<Color>
 *
 * @param se
 * @text 効果音
 * @desc ダメージ時に再生する効果音です。
 * @default
 * @type struct<AudioSe>

 * @param includeFollower
 * @text フォロワーを含める
 * @desc フォロワーにもアニメーションを適用します。
 * @default
 * @type select
 * @option 含めない
 * @value
 * @option 含める(同時再生)
 * @value same
 * @option 含める(ディレイ再生)
 * @value delay
 *
 */

/*~struct~AudioSe:
 * @param name
 * @text ファイル名称
 * @desc ファイル名称です。
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text ボリューム
 * @desc ボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 左右バランス
 * @desc 左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*~struct~Color:
 * @param red
 * @text 赤色
 * @desc フラッシュの赤色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param green
 * @text 緑色
 * @desc フラッシュの緑色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param blue
 * @text 青色
 * @desc フラッシュの青色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param alpha
 * @text 強さ
 * @desc フラッシュの強さです。
 * @default 0
 * @type number
 * @max 255
 *
 * @param duration
 * @text 時間
 * @desc フラッシュの時間(フレーム)です。
 * @default 8
 * @type number
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    let executeFrame = 0;
    const _Game_Actor_performMapDamage = Game_Actor.prototype.performMapDamage;
    Game_Actor.prototype.performMapDamage = function() {
        _Game_Actor_performMapDamage.apply(this, arguments);
        if ($gameParty.inBattle() || Graphics.frameCount === executeFrame) {
            return;
        }
        executeFrame = Graphics.frameCount;
        const tag = $gamePlayer.terrainTag();
        const list = param.floorDamageList.filter(item => !item.terrainTag || item.terrainTag === tag);
        if (list.length > 0) {
            $gameScreen.clearFlash();
            list.forEach(item => this.performMapDamageCustomize(item));
        }
    };

    Game_Actor.prototype.performMapDamageCustomize = function(item) {
        const targets = !!item.includeFollower ? this.performMapDamageTargets() : [$gamePlayer];
        if (item.includeFollower === 'delay') {
            $gameTemp.requestAnimation(targets, item.animationId, false);
        } else {
            targets.forEach(target => $gameTemp.requestAnimation([target], item.animationId));
        }
        const color = item.flashColor;
        if (color) {
            $gameScreen.startFlash([color.red, color.green, color.blue, color.alpha], color.duration);
        }
        const se = item.se;
        if (se) {
            AudioManager.playSe(se);
        }
    };

    Game_Actor.prototype.performMapDamageTargets = function() {
        const targets = $gamePlayer.followers().findValidData();
        if ($gameParty.leader().isValidFloorDamage()) {
            targets.unshift($gamePlayer);
        }
        return targets;
    };

    Game_Actor.prototype.isValidFloorDamage = function() {
        const floorDamage = Math.floor(this.basicFloorDamage() * this.fdr);
        return Math.min(floorDamage, this.maxFloorDamage()) > 0;
    };

    Game_Followers.prototype.findValidData = function() {
        return this._data.filter(actor => actor.isVisible() && actor.actor().isValidFloorDamage());
    };
})();
