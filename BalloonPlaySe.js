//=============================================================================
// BalloonPlaySe.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/10/29 MZで動作するよう修正
// 1.0.0 2017/12/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc フキダシアイコンのSE演奏プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonPlaySe.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param SwitchId
 * @text 有効スイッチ番号
 * @desc プラグインの機能を有効にするスイッチ番号です。0にすると無条件で演奏されます。
 * @default 0
 * @type switch
 *
 * @param SeInfo
 * @text 効果音情報
 * @desc フキダシアイコン表示時に演奏される効果音情報です。対象のアイコンおよび対応する効果音を選択してください。
 * @default
 * @type struct<SE>[]
 *
 * @help BalloonPlaySe.js
 *
 * フキダシアイコンが表示される瞬間に、
 * パラメータで指定した効果音を自動で演奏します。
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

/*~struct~SE:
 *
 * @param Balloon
 * @text フキダシアイコン
 * @desc SEを演奏する対象のフキダシアイコンです。
 * (1:びっくり 2:はてな 3:音符 4:ハート 5:怒り....)
 * @default 1
 * @type select
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザ定義1
 * @value 11
 * @option ユーザ定義2
 * @value 12
 * @option ユーザ定義3
 * @value 13
 * @option ユーザ定義4
 * @value 14
 * @option ユーザ定義5
 * @value 15
 *
 * @param name
 * @text SEファイル名
 * @desc SEのファイル名です。
 * @require 1
 * @dir audio/se/
 * @type file
 * @default
 *
 * @param volume
 * @text SEボリューム
 * @desc SEのボリュームです。
 * @type number
 * @default 90
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text SEピッチ
 * @desc SEのピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text SEバランス
 * @desc SEの左右バランスです。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.SeInfo) {
        param.SeInfo = [];
    }

    //=============================================================================
    // Sprite_Balloon
    //  フキダシアイコン表示時にSEを演奏します。
    //=============================================================================
    const _Sprite_Balloon_setup = Sprite_Balloon.prototype.setup;
    Sprite_Balloon.prototype.setup = function(targetSprite, balloonId) {
        _Sprite_Balloon_setup.apply(this, arguments);
        if (this.isNeedPlayBalloonSe()) {
            this.playBalloonSe(balloonId);
        }
    };

    Sprite_Balloon.prototype.playBalloonSe = function(balloonId) {
        const balloonSe = param.SeInfo.find(info => info.Balloon === balloonId);
        if (balloonSe) {
            AudioManager.playSe(balloonSe);
        }
    };

    Sprite_Balloon.prototype.isNeedPlayBalloonSe = function() {
        return (!param.SwitchId || $gameSwitches.value(param.SwitchId));
    };
})();

