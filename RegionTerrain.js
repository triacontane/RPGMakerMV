//=============================================================================
// RegionTerrain.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2016/12/10 機能を大幅に追加し、有効/無効にするリージョンIDおよび地形タグを複数指定できるようになりました。
// 1.0.0 2016/01/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Region set terrain attribute
 * @author triacontane
 *
 * @param LadderRegionId
 * @desc 梯子属性を付与するリージョンID。カンマ区切りで数字を指定してください。（以下同様）例：1,2,3
 * @default
 *
 * @param BushRegionId
 * @desc 茂み属性を付与するリージョンID
 * @default
 *
 * @param CounterRegionId
 * @desc カウンター属性を付与するリージョンID
 * @default
 *
 * @param DamageFloorRegionId
 * @desc ダメージ床属性を付与するリージョンID
 * @default
 *
 * @param LadderDisRegionId
 * @desc 梯子属性を無効化するリージョンID
 * @default
 *
 * @param BushDisRegionId
 * @desc 茂み属性を無効化するリージョンID
 * @default
 *
 * @param CounterDisRegionId
 * @desc カウンター属性を無効化するリージョンID
 * @default
 *
 * @param DamageFloorDisRegionId
 * @desc ダメージ床属性を無効化するリージョンID
 * @default
 *
 * @param LadderTerrain
 * @desc 梯子属性を付与する地形タグ
 * @default
 *
 * @param BushTerrain
 * @desc 茂み属性を付与する地形タグ
 * @default
 *
 * @param CounterTerrain
 * @desc カウンター属性を付与する地形タグ
 * @default
 *
 * @param DamageFloorTerrain
 * @desc ダメージ床属性を付与する地形タグ
 * @default
 *
 * @param LadderDisTerrain
 * @desc 梯子属性を無効化する地形タグ
 * @default
 *
 * @param BushDisTerrain
 * @desc 茂み属性を無効化する地形タグ
 * @default
 *
 * @param CounterDisTerrain
 * @desc カウンター属性を無効化する地形タグ
 * @default
 *
 * @param DamageFloorDisTerrain
 * @desc ダメージ床属性を無効化する地形タグ
 * @default
 *
 * @help Region set terrain attribute
 * Ladder, Bush, Counter, DamageFloor
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイル属性付与プラグイン
 * @author トリアコンタン
 *
 * @param 梯子ID
 * @desc 梯子属性を付与するリージョンID。カンマ区切りで数字を指定してください。（以下同様）例：1,2,3
 * @default
 *
 * @param 茂みID
 * @desc 茂み属性を付与するリージョンID
 * @default
 *
 * @param カウンターID
 * @desc カウンター属性を付与するリージョンID
 * @default
 *
 * @param ダメージ床ID
 * @desc ダメージ床属性を付与するリージョンID
 * @default
 *
 * @param 梯子無効ID
 * @desc 梯子属性を無効化するリージョンID
 * @default
 *
 * @param 茂み無効ID
 * @desc 茂み属性を無効化するリージョンID
 * @default
 *
 * @param カウンター無効ID
 * @desc カウンター属性を無効化するリージョンID
 * @default
 *
 * @param ダメージ床無効ID
 * @desc ダメージ床属性を無効化するリージョンID
 * @default
 *
 * @param 梯子地形
 * @desc 梯子属性を付与する地形タグ
 * @default
 *
 * @param 茂み地形
 * @desc 茂み属性を付与する地形タグ
 * @default
 *
 * @param カウンター地形
 * @desc カウンター属性を付与する地形タグ
 * @default
 *
 * @param ダメージ床地形
 * @desc ダメージ床属性を付与する地形タグ
 * @default
 *
 * @param 梯子無効地形
 * @desc 梯子属性を無効化する地形タグ
 * @default
 *
 * @param 茂み無効地形
 * @desc 茂み属性を無効化する地形タグ
 * @default
 *
 * @param カウンター無効地形
 * @desc カウンター属性を無効化する地形タグ
 * @default
 *
 * @param ダメージ床無効地形
 * @desc ダメージ床属性を無効化する地形タグ
 * @default
 *
 * @help 指定したリージョンもしくは地形タグに対して
 * 以下のタイル属性を付与もしくは無効化します。
 * ・梯子
 * ・茂み
 * ・カウンター
 * ・ダメージ床
 *
 * 値はカンマ区切りで複数指定が可能です。
 * 指定しない場合はパラメータを空にしてください。
 *
 * 無効設定と有効設定が重複した場合、無効設定が優先されます。
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
    const pluginName = 'RegionTerrain';

    const getParamString = function(paramNames) {
        const value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getParamArrayString = function(paramNames) {
        const values = getParamString(paramNames).split(',');
        for (let i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    const getParamArrayNumber = function(paramNames, min, max) {
        const values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (let i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramLadderRegionId         = getParamArrayNumber(['梯子ID', 'LadderRegionId']);
    const paramBushRegionId           = getParamArrayNumber(['茂みID', 'BushRegionId']);
    const paramCounterRegionId        = getParamArrayNumber(['カウンターID', 'CounterRegionId']);
    const paramDamageFloorRegionId    = getParamArrayNumber(['ダメージ床ID', 'DamageFloorRegionId']);
    const paramLadderTerrain          = getParamArrayNumber(['梯子地形', 'LadderTerrain']);
    const paramBushTerrain            = getParamArrayNumber(['茂み地形', 'BushTerrain']);
    const paramCounterTerrain         = getParamArrayNumber(['カウンター地形', 'CounterTerrain']);
    const paramDamageFloorTerrain     = getParamArrayNumber(['ダメージ床地形', 'DamageFloorTerrain']);
    const paramLadderDisRegionId      = getParamArrayNumber(['梯子無効ID', 'LadderDisRegionId']);
    const paramBushDisRegionId        = getParamArrayNumber(['茂み無効ID', 'BushDisRegionId']);
    const paramCounterDisRegionId     = getParamArrayNumber(['カウンター無効ID', 'CounterDisRegionId']);
    const paramDamageFloorDisRegionId = getParamArrayNumber(['ダメージ床無効ID', 'DamageFloorDisRegionId']);
    const paramLadderDisTerrain       = getParamArrayNumber(['梯子無効地形', 'LadderDisTerrain']);
    const paramBushDisTerrain         = getParamArrayNumber(['茂み無効地形', 'BushDisTerrain']);
    const paramCounterDisTerrain      = getParamArrayNumber(['カウンター無効地形', 'CounterDisTerrain']);
    const paramDamageFloorDisTerrain  = getParamArrayNumber(['ダメージ床無効地形', 'DamageFloorDisTerrain']);

    const _Game_Map_isLadder    = Game_Map.prototype.isLadder;
    Game_Map.prototype.isLadder = function(x, y) {
        if (this.isDisLadderOfRegion(x, y)) return false;
        if (this.isLadderOfRegion(x, y)) return true;
        return _Game_Map_isLadder.apply(this, arguments);
    };

    Game_Map.prototype.isLadderOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramLadderRegionId.contains(regionId) || paramLadderTerrain.contains(terrainTag);
    };

    Game_Map.prototype.isDisLadderOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramLadderDisRegionId.contains(regionId) || paramLadderDisTerrain.contains(terrainTag);
    };

    const _Game_Map_isBush    = Game_Map.prototype.isBush;
    Game_Map.prototype.isBush = function(x, y) {
        if (this.isDisBushOfRegion(x, y)) return false;
        if (this.isBushOfRegion(x, y)) return true;
        return _Game_Map_isBush.apply(this, arguments);
    };

    Game_Map.prototype.isBushOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramBushRegionId.contains(regionId) || paramBushTerrain.contains(terrainTag);
    };

    Game_Map.prototype.isDisBushOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramBushDisRegionId.contains(regionId) || paramBushDisTerrain.contains(terrainTag);
    };

    const _Game_Map_isCounter    = Game_Map.prototype.isCounter;
    Game_Map.prototype.isCounter = function(x, y) {
        if (this.isDisCounterOfRegion(x, y)) return false;
        if (this.isCounterOfRegion(x, y)) return true;
        return _Game_Map_isCounter.apply(this, arguments);
    };

    Game_Map.prototype.isCounterOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramCounterRegionId.contains(regionId) || paramCounterTerrain.contains(terrainTag);
    };

    Game_Map.prototype.isDisCounterOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramCounterDisRegionId.contains(regionId) || paramCounterDisTerrain.contains(terrainTag);
    };

    const _Game_Map_isDamageFloor    = Game_Map.prototype.isDamageFloor;
    Game_Map.prototype.isDamageFloor = function(x, y) {
        if (this.isDisDamageFloorOfRegion(x, y)) return false;
        if (this.isDamageFloorOfRegion(x, y)) return true;
        return _Game_Map_isDamageFloor.apply(this, arguments);
    };

    Game_Map.prototype.isDamageFloorOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramDamageFloorRegionId.contains(regionId) || paramDamageFloorTerrain.contains(terrainTag);
    };

    Game_Map.prototype.isDisDamageFloorOfRegion = function(x, y) {
        const regionId   = this.regionId(x, y);
        const terrainTag = this.terrainTag(x, y);
        return paramDamageFloorDisRegionId.contains(regionId) || paramDamageFloorDisTerrain.contains(terrainTag);
    };
})();

