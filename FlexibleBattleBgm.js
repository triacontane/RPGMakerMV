/*=============================================================================
 FlexibleBattleBgm.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/01/12 敵グループIDの範囲指定機能を追加
 1.0.0 2024/01/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 敵グループごとの戦闘BGM設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FlexibleBattleBgm.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param bgmList
 * @text BGMリスト
 * @desc 演奏するBGMの設定リストです。
 * @default []
 * @type struct<AudioBgm>[]
 *
 * @help FlexibleBattleBgm.js
 *
 * 戦闘BGMを敵グループごとに設定できます。
 * この設定はシステムの戦闘BGM設定より優先されます。
 * ボス用の敵グループにはボス用のBGMを自動で演奏する等の使い方ができます。
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

/*~struct~AudioBgm:
 *
 * @param label
 * @text ラベル
 * @desc ラベルです。識別用の設定値でありプラグインからは参照されません。
 *
 * @param troopList
 * @text 敵グループリスト
 * @desc 対象のBGMを演奏する敵グループの一覧です。
 * @default []
 * @type troop[]
 *
 * @param startTroopId
 * @text 敵グループID(開始)
 * @desc 対象のBGMを演奏する敵グループを範囲指定したいときのIDの開始値です。
 * @default 0
 * @type troop
 *
 * @param endTroopId
 * @text 敵グループID(終了)
 * @desc 対象のBGMを演奏する敵グループを範囲指定したいときのIDの終了値です。
 * @default 0
 * @type troop
 *
 * @param name
 * @text ファイル名称
 * @desc ファイル名称です。
 * @default
 * @dir audio/bgm/
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
    if (!param.bgmList) {
        param.bgmList = [];
    }

    const _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function() {
        _BattleManager_playBattleBgm.apply(this, arguments);
        $gameTroop.playTroopBattleBgm();
    };

    Game_Troop.prototype.playTroopBattleBgm = function() {
        const bgm = param.bgmList.find(bgm => this.isFlexibleBattleBgm(bgm));
        if (bgm) {
            AudioManager.playBgm(bgm);
        }
    };

    Game_Troop.prototype.isFlexibleBattleBgm = function(bgm) {
        return bgm.troopList.includes(this._troopId) ||
            (bgm.startTroopId <= this._troopId && bgm.endTroopId >= this._troopId);
    };
})();
