//=============================================================================
// MoveSpeedChangeByRegion.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2018/02/15 フォロワーを連れているときにフォロワーの移動速度がおかしくなる問題を修正
// 1.0.0 2018/02/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MoveSpeedChangeByRegionPlugin
 * @author triacontane
 *
 * @param slowlyTerrainTags
 * @desc 移動中に速度が低下する地形タグです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param fasterTerrainTags
 * @desc 移動中に速度が上昇する地形タグです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param slowlyRegions
 * @desc 移動中に速度が低下するリージョンです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param fasterRegions
 * @desc 移動中に速度が上昇するリージョンです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param deltaSpeed
 * @desc 速度が上昇、低下するときの変化量です。
 * @default 1
 * @type number
 *
 * @help MoveSpeedChangeByRegion.js
 *
 * 指定した地形もしくはリージョンに乗っている間だけキャラクターの移動速度を
 * 自動的に上昇もしくは低下させます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 地形による速度変化プラグイン
 * @author トリアコンタン
 *
 * @param slowlyTerrainTags
 * @text 速度低下地形
 * @desc 移動中に速度が低下する地形タグです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param fasterTerrainTags
 * @text 速度上昇地形
 * @desc 移動中に速度が上昇する地形タグです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param slowlyRegions
 * @text 速度低下リージョン
 * @desc 移動中に速度が低下するリージョンです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param fasterRegions
 * @text 速度上昇リージョン
 * @desc 移動中に速度が上昇するリージョンです。複数指定できます。
 * @default
 * @type number[]
 *
 * @param deltaSpeed
 * @text 速度変化量
 * @desc 速度が上昇、低下するときの変化量です。
 * @default 1
 * @type number
 *
 * @help MoveSpeedChangeByRegion.js
 *
 * 指定した地形もしくはリージョンに乗っている間だけキャラクターの移動速度を
 * 自動的に上昇もしくは低下させます。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(MoveSpeedChangeByRegion)
     * @returns {any} Created parameter
     */
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

    var param = createPluginParameter('MoveSpeedChangeByRegion');
    if (!param.slowlyTerrainTags) {
        param.slowlyTerrainTags = [];
    }
    if (!param.fasterTerrainTags) {
        param.fasterTerrainTags = [];
    }
    if (!param.slowlyRegions) {
        param.slowlyRegions = [];
    }
    if (!param.fasterRegions) {
        param.fasterRegions = [];
    }

    //=============================================================================
    // Game_CharacterBase
    //  地形による速度変化を設定
    //=============================================================================
    var _Game_CharacterBase_realMoveSpeed      = Game_CharacterBase.prototype.realMoveSpeed;
    Game_CharacterBase.prototype.realMoveSpeed = function() {
        return _Game_CharacterBase_realMoveSpeed.apply(this, arguments) +
            this.changeSpeedByTerrainTags() + this.changeSpeedByRegions();
    };

    Game_CharacterBase.prototype.changeSpeedByTerrainTags = function() {
        var terrainTag = this.terrainTag();
        var speed      = 0;
        if (param.slowlyTerrainTags.contains(terrainTag)) {
            speed -= this.getDeltaSpeed();
        }
        if (param.fasterTerrainTags.contains(terrainTag)) {
            speed += this.getDeltaSpeed();
        }
        return speed;
    };

    Game_CharacterBase.prototype.changeSpeedByRegions = function() {
        var region = this.regionId();
        var speed  = 0;
        if (param.slowlyRegions.contains(region)) {
            speed -= this.getDeltaSpeed();
        }
        if (param.fasterRegions.contains(region)) {
            speed += this.getDeltaSpeed();
        }
        return speed;
    };

    Game_CharacterBase.prototype.getDeltaSpeed = function() {
        return param.deltaSpeed;
    };

    //=============================================================================
    // Game_Follower
    //  実移動速度を再定義
    //=============================================================================
    Game_Follower.prototype.realMoveSpeed = function() {
        return _Game_CharacterBase_realMoveSpeed.apply(this, arguments);
    };
})();

