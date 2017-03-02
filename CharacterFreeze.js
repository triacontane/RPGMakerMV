//=============================================================================
// CharacterFreeze.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/03/03 停止中にピクチャを表示する機能、BGMの音量を変化する機能を追加
// 1.0.0 2017/03/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CharacterFreezePlugin
 * @author triacontane
 *
 * @param FreezeSwitchId
 * @desc キャラクターを全停止されるトリガーになるスイッチIDです。
 * @default
 *
 * @param FreezePictureId
 * @desc 停止中にピクチャを表示する場合のピクチャ番号です。
 * @default 0
 *
 * @param FreezePictureName
 * @desc 停止中に表示するピクチャファイル名です。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param FreezeBgmVolume
 * @desc 停止中のBGM音量です。もとのBGMの音量も考慮されます。
 * @default 100
 *
 * @help イベントの自律移動とアニメーションを全停止します。
 * 同時にプレイヤーも動けなくなります。
 * パラメータで指定したスイッチをONにすると停止、OFFにすると再開します。
 *
 * また停止中に専用のピクチャを表示したり、BGMの音量を調整したりできます。
 * 主にイベント実装のメニューや戦闘への移行に使用します。
 * ピクチャの不透明度および合成方法を変更したい場合は、コードの「ユーザ定義領域」を
 * 変更してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc キャラクター停止プラグイン
 * @author トリアコンタン
 *
 * @param 停止スイッチID
 * @desc キャラクターを全停止されるトリガーになるスイッチIDです。
 * @default
 *
 * @param 停止中ピクチャID
 * @desc 停止中にピクチャを表示する場合のピクチャ番号です。
 * @default 0
 *
 * @param 停止中ピクチャ名
 * @desc 停止中に表示するピクチャファイル名です。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 停止中BGM音量
 * @desc 停止中のBGM音量の倍率です。もとの音量に対して乗算されます。
 * @default 100
 *
 * @help イベントの自律移動とアニメーションを全停止します。
 * 同時にプレイヤーも動けなくなります。
 * パラメータで指定したスイッチをONにすると停止、OFFにすると再開します。
 *
 * また停止中に専用のピクチャを表示したり、BGMの音量を調整したりできます。
 * 主にイベント実装のメニューや戦闘への移行に使用します。
 * ピクチャの不透明度および合成方法を変更したい場合は、コードの「ユーザ定義領域」を
 * 変更してください。
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
    var pluginName = 'CharacterFreeze';

    //=============================================================================
    // ユーザ定義領域
    //=============================================================================
    var userSetting = {
        pictureInfo: {
            opacity  : 255,
            blendMode: 0
        }
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param               = {};
    param.freezeSwitchId    = getParamNumber(['FreezeSwitchId', '停止スイッチID']);
    param.freezePictureId   = getParamNumber(['FreezePictureId', '停止中ピクチャID']);
    param.freezePictureName = getParamString(['FreezePictureName', '停止中ピクチャ名']);
    param.freezeBgmVolume    = getParamNumber(['FreezeBgmVolume', '停止中BGM音量']);

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
            var info = userSetting.pictureInfo;
            $gameScreen.showPicture(param.freezePictureId, param.freezePictureName,
                0, 0, 0, 100, 100, info.opacity, info.blendMode);
        }
        if (param.freezeBgmVolume) {
            var oldBgm = AudioManager.saveBgm();
            var freezeVolume = oldBgm.volume * param.freezeBgmVolume / 100;
            var freezeBgm = {name:oldBgm.name, volume:freezeVolume, pitch:oldBgm.pitch, pan:oldBgm.pan};
            AudioManager.playBgm(freezeBgm);
            this._preFreezeVolume = oldBgm.volume;
        }
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
})();

