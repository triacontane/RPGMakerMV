/*=============================================================================
 EventStartSe.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/10/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc イベント起動効果音プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventStartSe.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param soundList
 * @text サウンドリスト
 * @desc イベント起動時のサウンド一覧です。
 * @default []
 * @type struct<SE>[]
 *
 * @help EventStartSe.js
 *
 * 決定ボタンでイベントを起動したときに自動で指定SEを演奏します。
 * SEはパラメータで設定します。
 *
 * 識別子[id1]の効果音を演奏します。
 * <StartSe:id1>
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
 * @param id
 * @text 識別子
 * @desc イベントのメモ欄に指定する値です。この値を空欄にしたデータを登録するとメモ欄指定なしでも演奏されます。
 * @default id1
 *
 * @param switchId
 * @text スイッチ番号
 * @desc 指定したスイッチがONのときだけ効果音が演奏されます。指定がない場合は常に演奏されます。
 * @default 0
 * @type switch
 *
 * @param name
 * @text ファイル名
 * @desc 演奏するSEのファイル名です。
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text 音量
 * @desc 演奏するSEの音量です。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 演奏するSEのピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 左右バランス
 * @desc 演奏するSEの左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.soundList) {
        param.soundList = [];
    }

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        _Game_Event_start.apply(this, arguments);
        if (this.isTriggerIn([0])) {
            this.playStartUpSe();
        }
    };

    Game_Event.prototype.playStartUpSe = function() {
        const id = PluginManagerEx.findMetaValue(this.event(), ['StartSe']);
        param.soundList.filter(item => this.isValidSe(item, id)).forEach(item => {
            AudioManager.playSe(item);
        });
    };

    Game_Event.prototype.isValidSe = function(item, id) {
        if (item.switchId && !$gameSwitches.value(item.switchId)) {
            return false;
        } else {
            return !item.id || item.id === id;
        }
    };
})();
