//=============================================================================
// CharacterFreeze.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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

/*:ja
 * @plugindesc キャラクター停止プラグイン
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
 * @param freezeAnimation
 * @text アニメーション停止
 * @desc 停止時、アニメーションの再生も同時に停止します。
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
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('CharacterFreeze');

    //=============================================================================
    // Game_Map
    //  フリーズ時に専用のピクチャを表示します。
    //=============================================================================
    var _Game_Map_update      = Game_Map.prototype.update;
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
            var oldBgm = AudioManager.saveBgm();
            if (SceneManager.isNextScene(Scene_Battle)) {
                oldBgm = BattleManager._mapBgm;
            }
            var freezeVolume = oldBgm.volume * param.freezeBgmVolume / 100;
            var freezeBgm = {name:oldBgm.name, volume:freezeVolume, pitch:oldBgm.pitch, pan:oldBgm.pan};
            if (SceneManager.isNextScene(Scene_Battle)) {
                BattleManager._mapBgm = freezeBgm;
            } else {
                AudioManager.playBgm(freezeBgm);
            }
            this._preFreezeVolume = oldBgm.volume;
        }
    };

    Game_Map.prototype.showFreezePicture = function() {
        var id = param.freezePictureId;
        var name = param.freezePictureName;
        var x = param.freezePictureX || 0;
        var y = param.freezePictureY || 0;
        var opacity = param.freezePictureOpacity || 255;
        var blendName = param.freezePictureBlendMode;
        $gameScreen.showPicture(id, name, 0, x, y, 100, 100, opacity, blendName);
    };

    Game_Map.prototype.finishFreeze = function() {
        if (param.freezePictureId) {
            $gameScreen.erasePicture(param.freezePictureId);
        }
        if (param.freezeBgmVolume) {
            var bgm = AudioManager.saveBgm();
            bgm.volume = this._preFreezeVolume;
            AudioManager.playBgm(bgm);
            this._preFreezeVolume = null;
        }
    };

    Game_Map.prototype.isFreeze = function() {
        return $gameSwitches.value(param.freezeSwitchId);
    };

    //=============================================================================
    // Game_CharacterBase
    //  フリーズ時にイベントとプレイヤーの動きを止めます。
    //=============================================================================
    Game_CharacterBase.prototype.isFreeze = function() {
        return $gameMap.isFreeze();
    };

    var _Game_CharacterBase_update      = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        if (this.isFreeze()) return;
        _Game_CharacterBase_update.apply(this, arguments);
    };

    var _Game_Player_canMove      = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return !this.isFreeze() && _Game_Player_canMove.apply(this, arguments);
    };

    var _Sprite_Animation_update = Sprite_Animation.prototype.update;
    Sprite_Animation.prototype.update = function() {
        if ($gameMap.isFreeze() && param.freezeAnimation) {
            return;
        }
        _Sprite_Animation_update.apply(this, arguments);
    };
})();

