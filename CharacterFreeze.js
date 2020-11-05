//=============================================================================
// CharacterFreeze.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.1 2020/11/05 変数の宣言誤りを修正
// 2.1.0 2020/11/05 並列処理のマップイベント実行も停止できる機能を追加
// 2.0.2 2020/10/10 MZ版としてリファクタリング。一部機能を削減
// 2.0.1 2020/10/10 簡易的な英語ヘルプを整備
// 2.0.0 2020/10/10 パラメータ構造を変更
//                  停止時にアニメーションも停止できる機能を追加
// 1.1.1 2020/07/19 停止スイッチをONにした直後に戦闘を開始しかつ逃走した場合、もともと演奏していたBGMが再生されない問題を修正
// 1.1.0 2017/03/03 停止中にピクチャを表示する機能、BGMの音量を変化する機能を追加
// 1.0.0 2017/03/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CharacterFreeze
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CharacterFreeze.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param freezeSwitchId
 * @desc This is the switch ID that triggers a full stop of the character.
 * @default
 * @type switch
 *
 * @param freezePictureId
 * @desc This is the picture number for displaying the picture when it is stopped.
 * @default 0
 * @type number
 *
 * @param freezePictureName
 * @desc The name of the picture file to be displayed when stopped.
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param freezePictureX
 * @desc X-coordinate of the picture to be displayed while stopped.
 * @default 0
 * @type number
 * @min -2000
 *
 * @param freezePictureY
 * @desc The Y-coordinate of the picture to be displayed while stopped.
 * @default 0
 * @type number
 * @min -2000
 *
 * @param freezePictureOpacity
 * @desc The opacity of the picture to be displayed while stopped.
 * @default 255
 * @max 255
 * @type number
 *
 * @param freezePictureBlendMode
 * @desc This is a method of composing a picture to be displayed while stopped.
 * @default 0
 * @type select
 * @option 0
 * @option 1
 * @option 2
 * @option 3
 *
 * @param freezeBgmVolume
 * @desc This is the ratio of the BGM volume when the music is stopped. It will be multiplied by the original volume.
 * @default 100
 * @type number
 *
 * @param freezeParallelMapEvent
 * @desc When stopped, parallel map events processing are stopped at the same time.
 * @default false
 * @type boolean
 *
 * @help All autonomous movement and animation of events will be stopped.
 * At the same time, the player will not be able to move.
 * Turning the switch ON will stop the event, and turning it OFF will restart it.
 *
 * Also, while the game is stopped, a special picture can be displayed and
 * the volume of the BGM can be adjusted.
 */
/*:ja
 * @plugindesc キャラクター停止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CharacterFreeze.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param freezeSwitchId
 * @text 停止スイッチID
 * @desc キャラクターを全停止させるトリガーになるスイッチIDです。
 * @default
 * @type switch
 *
 * @param freezePictureId
 * @text 停止中ピクチャID
 * @desc 停止中にピクチャを表示する場合のピクチャ番号です。
 * @default 0
 * @type number
 *
 * @param freezePictureName
 * @text 停止中ピクチャ名
 * @desc 停止中に表示するピクチャファイル名です。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param freezePictureX
 * @text 停止中ピクチャX座標
 * @desc 停止中に表示するピクチャのX座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param freezePictureY
 * @text 停止中ピクチャY座標
 * @desc 停止中に表示するピクチャのY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param freezePictureOpacity
 * @text 停止中ピクチャ不透明度
 * @desc 停止中に表示するピクチャの不透明度です。
 * @default 255
 * @max 255
 * @type number
 *
 * @param freezePictureBlendMode
 * @text 停止中ピクチャ合成方法
 * @desc 停止中に表示するピクチャの合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 *
 * @param freezeBgmVolume
 * @text 停止中BGM音量
 * @desc 停止中のBGM音量の倍率です。もとの音量に対して乗算されます。
 * @default 100
 * @type number
 *
 * @param freezeParallelMapEvent
 * @text 並列マップイベント停止
 * @desc 停止中、並列処理のマップイベントも実行も同時に停止します。
 * @default false
 * @type boolean
 *
 * @help イベントの自律移動とアニメーションを全停止します。
 * 同時にプレイヤーも動けなくなります。
 * パラメータで指定したスイッチをONにすると停止、OFFにすると再開します。
 *
 * また停止中に専用のピクチャを表示したり、BGMの音量を調整したりできます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Map
    //  フリーズ時に専用のピクチャを表示します。
    //=============================================================================
    const _Game_Map_update      = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.apply(this, arguments);
        this.updateFreeze();
    };

    Game_Map.prototype.updateFreeze = function() {
        if (this.isFreeze() && !this._lastFreeze) {
            this.startFreeze();
        }
        if (!this.isFreeze() && this._lastFreeze) {
            this.finishFreeze();
        }
        this._lastFreeze = this.isFreeze();
    };

    Game_Map.prototype.startFreeze = function() {
        if (param.freezePictureId) {
            this.showFreezePicture();
        }
        if (param.freezeBgmVolume) {
            let oldBgm = AudioManager.saveBgm();
            if (SceneManager.isNextScene(Scene_Battle)) {
                oldBgm = BattleManager._mapBgm;
            }
            const freezeVolume = oldBgm.volume * param.freezeBgmVolume / 100;
            const freezeBgm = {name:oldBgm.name, volume:freezeVolume, pitch:oldBgm.pitch, pan:oldBgm.pan};
            if (SceneManager.isNextScene(Scene_Battle)) {
                BattleManager._mapBgm = freezeBgm;
            } else {
                AudioManager.playBgm(freezeBgm);
            }
            this._preFreezeVolume = oldBgm.volume;
        }
    };

    Game_Map.prototype.showFreezePicture = function() {
        const id = param.freezePictureId;
        const name = param.freezePictureName;
        const x = param.freezePictureX || 0;
        const y = param.freezePictureY || 0;
        const opacity = param.freezePictureOpacity || 255;
        const blendName = param.freezePictureBlendMode;
        $gameScreen.showPicture(id, name, 0, x, y, 100, 100, opacity, blendName);
    };

    Game_Map.prototype.finishFreeze = function() {
        if (param.freezePictureId) {
            $gameScreen.erasePicture(param.freezePictureId);
        }
        if (param.freezeBgmVolume) {
            const bgm = AudioManager.saveBgm();
            bgm.volume = this._preFreezeVolume;
            AudioManager.playBgm(bgm);
            this._preFreezeVolume = null;
        }
    };

    Game_Map.prototype.isFreeze = function() {
        return $gameSwitches.value(param.freezeSwitchId);
    };

    var _Game_Event_updateParallel = Game_Event.prototype.updateParallel;
    Game_Event.prototype.updateParallel = function() {
        if (param.freezeParallelMapEvent && this.isFreeze()) {
            return;
        }
        _Game_Event_updateParallel.apply(this, arguments);
    };

    //=============================================================================
    // Game_CharacterBase
    //  フリーズ時にイベントとプレイヤーの動きを止めます。
    //=============================================================================
    Game_CharacterBase.prototype.isFreeze = function() {
        return $gameMap.isFreeze();
    };

    const _Game_CharacterBase_update      = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        if (this.isFreeze()) return;
        _Game_CharacterBase_update.apply(this, arguments);
    };

    const _Game_Player_canMove      = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return !this.isFreeze() && _Game_Player_canMove.apply(this, arguments);
    };
})();

