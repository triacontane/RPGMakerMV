/*=============================================================================
 StateAffectedSe.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ステートSE演奏プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateAffectedSe.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param stateSeList
 * @text ステートSEリスト
 * @desc ステートと演奏するSEの組み合わせのリストです。
 * @default []
 * @type struct<AUDIO>[]
 *
 * @help StateAffectedSe.js
 *
 * ステートが有効になったタイミングでSEを演奏します。
 * すでに対象ステートに掛かっている場合は演奏されません。
 * パラメータからステートと演奏SEの組み合わせを登録してください。
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

/*~struct~AUDIO:
 * @param stateId
 * @text ステートID
 * @desc SEを演奏する対象のステートです。
 * @default 1
 * @type state
 *
 * @param name
 * @text ファイル名
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stateSeList) {
        return;
    }

    AudioManager.playStateSe = function (stateId) {
        param.stateSeList.filter(audio => audio.stateId === stateId).forEach(audio => this.playSe(audio));
    }

    const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        AudioManager.playStateSe(stateId);
    };
})();
