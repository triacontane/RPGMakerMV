/*=============================================================================
 EventReSpawn.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2021/10/05 1.2.0の機能でイベントを配置したとき、イベント画像が2つ重なって表示されてしまう問題を修正
 1.2.0 2021/09/16 リージョンを配置するだけでマップイベントやテンプレートイベントのコピーを自動配置できる機能を追加
 1.1.1 2021/05/07 動的生成イベントに対してアニメーションを再生中に『イベントの消去』を実行するとエラーになる問題を修正
 1.1.0 2021/01/04 イベント動的生成時の座標指定に変数を指定するプラグインパラメータを追加
 1.0.3 2020/11/30 英訳版ヘルプをご提供いただいて追加
 1.0.2 2020/11/19 イベント、プレイヤーと重ならない生成条件が正常に機能していなかった問題を修正
 1.0.1 2020/08/26 ベースプラグインの説明を追加
 1.0.0 2020/07/25 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc Event Dynamic Generation
 * @author Triacontane
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventReSpawn.js
 *
 * @param keepSelfSwitch
 * @text Self Switch maintenance
 * @desc If enabled, it will no longer clear the Self Switch when moving locations. If the event clearing is performed, it will be cleared.
 * @default false
 * @type boolean
 *
 * @param variableSpawnEventId
 * @text Generated Event ID storage variables
 * @desc The ID of the last generated event is stored in the specified variable.
 * @default 0
 * @type variable
 *
 * @command MAKE
 * @text Event Generation
 * @desc Generate dynamic events.
 *
 * @arg id
 * @text Event ID
 * @desc The event ID or name of the source of the copy. A number will be interpreted as an ID.
 * @default 1
 * @type string
 *
 * @arg x
 * @text X-coordinate
 * @desc The X coordinate of the destination.
 * @default 1
 * @type number
 *
 * @arg y
 * @text Y-coordinate
 * @desc The Y coordinate of the copy destination.
 * @default 1
 * @type number
 *
 * @arg xByVariableId
 * @text X-coordinate variable id (When using variable specification)
 * @desc Specifies the ID of the variable in which the value to set the X coordinate of the copy destination is stored. If 0 is specified, the variable specification is not used.
 * @default 0
 * @type number
 *
 * @arg yByVariableId
 * @text Y-coordinate variable id (When using variable specification)
 * @desc Specifies the ID of the variable in which the value to set the Y coordinate of the copy destination is stored. If 0 is specified, the variable specification is not used.
 * @default 0
 * @type number
 *
 * @arg template
 * @text Template Generation
 * @desc Generate template events when enabled. A separate template event plugin is required.
 * @default false
 * @type boolean
 *
 * @command MAKE_RANDOM
 * @text Conditional Random Generation
 * @desc Generate events dynamically at random locations according to the conditions you specify. If there is no possible location for generation, no generation will take place.
 *
 * @arg id
 * @text Event ID
 * @desc The event ID or name of the source of the copy. A number will be interpreted as an ID.
 * @default 1
 * @type string
 *
 * @arg passable
 * @text Passable tiles only
 * @desc Only passable tiles are event-generated.
 * @default false
 * @type boolean
 *
 * @arg screen
 * @text Conditions on the screen
 * @desc Generate only in or off screen.
 * @default 0
 * @type select
 * @option Do not judge
 * @value 0
 * @option In Screen
 * @value 1
 * @option Off-screen (more than 2 squares away from the screen display border)
 * @value 2
 *
 * @arg overlap
 * @text Character and positional overlap
 * @desc Generate avoidance of an already existing event or player position.
 * @default 0
 * @type select
 * @option Do not judge
 * @value 0
 * @option Player and non-overlapping
 * @value 1
 * @option Events and non-overlapping
 * @value 2
 * @option Neither the event nor the player overlap
 * @value 3
 *
 * @arg terrainTags
 * @text Terrain Tag
 * @desc Generate only for the specified terrain tag.
 * @default []
 * @type number[]
 *
 * @arg regions
 * @text Region
 * @desc Generate only for the specified region.
 * @default []
 * @type number[]
 *
 * @arg template
 * @text Template Generation
 * @desc Generate template events when enabled. TemplateEvent.js is required.
 * @default false
 * @type boolean
 *
 * @arg algorithm
 * @text Generation Algorithm
 * @desc How to determine the generated coordinates. If there are not many tiles that meet the criteria, the Find from the top left is faster.
 * @default 0
 * @type select
 * @option Find at random locations (fast when there are many candidates for generating positions)
 * @value 0
 * @option Find them in order from the top left (fast if there are few candidates for the generated positions)
 * @value 1
 *
 * @help EventReSpawn.js
 *
 * Copy and dynamically generate and place events on the map.
 * Placement locations can be directly specified or randomly placed at locations that meet the criteria.
 *
 * The copied temporary events are completely deleted by the event command
 * "Erase Event", freeing up space for objects and sprites to be used.
 * Self Switches are managed individually and are initialized each time they are generated.
 *
 * Template events can be generated dynamically on the map when combined 
 * with the separately published template event plugin(TemplateEvent.js).
 *
 * In addition, you can place events and template events by simply placing regions on the map.
 * You can place events and template events by simply placing regions on the map.
 * You can also place events and template events by simply placing regions on the map.
 * The tags in the note of the source event.
 * Place a copy of the event in the square where you placed the region [1].
 * <CP:1>
 *
 * You need the base plugin "PluginCommonBase.js" to use this plugin.
 * The "PluginCommonBase.js" is stored in the following folder under the installation folder of RPG Maker MZ.
 * dlc/BasicResources/plugins/official
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */

/*:ja
 * @plugindesc イベント動的生成プラグイン
 * @author トリアコンタン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventReSpawn.js
 *
 * @param keepSelfSwitch
 * @text セルフスイッチ維持
 * @desc 有効にすると場所移動時にセルフスイッチをクリアしなくなります。イベントの消去を実行した場合はクリアされます。
 * @default false
 * @type boolean
 *
 * @param variableSpawnEventId
 * @text 生成イベントIDの格納変数
 * @desc 最後に生成したイベントのIDが指定した変数に格納されます。
 * @default 0
 * @type variable
 *
 * @command MAKE
 * @text イベント生成
 * @desc 動的イベントを生成します。
 *
 * @arg id
 * @text イベントID
 * @desc コピー元のイベントIDもしくは名前です。数値を指定するとIDとして解釈されます。
 * @default 1
 * @type string
 *
 * @arg x
 * @text X座標
 * @desc コピー先のX座標です。
 * @default 1
 * @type number
 *
 * @arg y
 * @text Y座標
 * @desc コピー先のY座標です。
 * @default 1
 * @type number
 *
 * @arg xByVariableId
 * @text X座標変数ID
 * @desc コピー先のX座標を設定するための値が格納された変数のIDを指定します。0を指定した場合、変数指定を使用しません。
 * @default 0
 * @type variable
 *
 * @arg yByVariableId
 * @text Y座標変数ID
 * @desc コピー先のY座標を設定するための値が格納された変数のIDを指定します。0を指定した場合、変数指定を使用しません。
 * @default 0
 * @type variable
 *
 * @arg template
 * @text テンプレート生成
 * @desc 有効にするとテンプレートイベントを生成します。別途テンプレートイベントプラグインが必要です。
 * @default false
 * @type boolean
 *
 * @command MAKE_RANDOM
 * @text 条件付きランダム生成
 * @desc 指定した条件に従ってランダム位置にイベントを動的生成します。生成可能な場所がなければ生成は行われません。
 *
 * @arg id
 * @text イベントID
 * @desc コピー元のイベントIDもしくは名前です。数値を指定するとIDとして解釈されます。
 * @default 1
 * @type string
 *
 * @arg passable
 * @text 通行可能タイルのみ
 * @desc 通行可能タイルのみにイベント生成されます。
 * @default false
 * @type boolean
 *
 * @arg screen
 * @text 画面に関する条件
 * @desc 画面内もしくは画面外にのみ生成します。
 * @default 0
 * @type select
 * @option 判定しない
 * @value 0
 * @option 画面内
 * @value 1
 * @option 画面外(画面の表示境界から2マス以上離れている)
 * @value 2
 *
 * @arg overlap
 * @text キャラクターとの位置重複
 * @desc 既にあるイベントもしくはプレイヤーの位置を避けて生成します。
 * @default 0
 * @type select
 * @option 判定しない
 * @value 0
 * @option プレイヤーと重複しない
 * @value 1
 * @option イベントと重複しない
 * @value 2
 * @option どちらとも重複しない
 * @value 3
 *
 * @arg terrainTags
 * @text 地形タグ
 * @desc 指定した地形タグに対してのみ生成します。
 * @default []
 * @type number[]
 *
 * @arg regions
 * @text リージョン
 * @desc 指定したリージョンに対してのみ生成します。
 * @default []
 * @type number[]
 *
 * @arg template
 * @text テンプレート生成
 * @desc 有効にするとテンプレートイベントを生成します。別途テンプレートイベントプラグインが必要です。
 * @default false
 * @type boolean
 *
 * @arg algorithm
 * @text 生成アルゴリズム
 * @desc 生成座標を決定する方法です。全タイルのうち条件を満たすタイルが少ない場合は『左上から探す』の方が高速になります。
 * @default 0
 * @type select
 * @option ランダム位置で探す(生成位置の候補が多い場合に高速)
 * @value 0
 * @option 左上から順番に探す(生成位置の候補が少ない場合に高速)
 * @value 1
 *
 * @help EventReSpawn.js
 *
 * マップ上のイベントをコピーして動的に生成し、配置します。
 * 配置場所は直接指定するか、条件を満たす場所にランダム配置できます。
 *
 * コピーした一時イベントは、イベントコマンド「イベントの一時消去」によって
 * 完全に削除され、オブジェクトとスプライトの使用領域を解放します。
 * セルフスイッチは個別に管理され、生成されるたびに初期化されます。
 *
 * 別途公開しているテンプレートイベントプラグインと組み合わせると
 * テンプレートイベントをマップ上に動的生成できます。
 *
 * さらに、マップにリージョンを配置するだけでイベントやテンプレートイベントを
 * 配置できます。コピー元イベントのメモ欄にタグを記述してください。
 * ・リージョン[1]を配置したマスにイベントのコピーを配置
 * <CP:1>
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

/**
 * 動的生成イベントを扱うクラスです。
 * @constructor
 */
function Game_PrefabEvent() {
    this.initialize.apply(this, arguments);
}

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    const searchDataItem = function(dataArray, columnName, columnValue) {
        let result = 0;
        dataArray.some(dataItem => {
            if (dataItem && dataItem[columnName] === columnValue) {
                result = dataItem;
                return true;
            }
            return false;
        });
        return result;
    };

    PluginManagerEx.registerCommand(script, 'MAKE', function(args) {
        const template = args.template;
        const xByVariableId = args.xByVariableId;
        const yByVariableId = args.yByVariableId;
        const x = xByVariableId != null && xByVariableId > 0 ? $gameVariables.value(xByVariableId) : args.x;
        const y = yByVariableId != null && yByVariableId > 0 ? $gameVariables.value(yByVariableId) : args.y;
        $gameMap.spawnEvent(this.getEventIdForEventReSpawn(args.id, template), x, y, template);
    });

    PluginManagerEx.registerCommand(script, 'MAKE_RANDOM', function(args) {
        const template = args.template;
        $gameMap.spawnEventRandom(this.getEventIdForEventReSpawn(args.id, template), args, template, args.algorithm);
    });

    Game_Interpreter.prototype.getEventIdForEventReSpawn = function(idOrName, isTemplate) {
        let id = 0;
        if (!isNaN(idOrName)) {
            id = idOrName;
        } else {
            const dataList = isTemplate ? $dataTemplateEvents : $dataMap.events;
            const event    = searchDataItem(dataList, 'name', idOrName);
            id             = event ? event.id : 0;
        }
        return id > 0 ? id : this._eventId;
    };

    //=============================================================================
    // Game_Map
    //  イベントのスポーン処理を追加定義します。
    //=============================================================================
    const _Game_Map_setupEvents    = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        if ($gamePlayer.isNeedMapReload()) {
            this.unlinkPrefabEvents();
        }
        _Game_Map_setupEvents.apply(this, arguments);
        this._eventIdSequence = this._events.length || 1;
        this.setupInitialSpawnEvents();
    };

    Game_Map.prototype.setupInitialSpawnEvents = function() {
        const spawnMap = this.createSpawnMap();
        if (spawnMap.size <= 0) {
            return;
        }
        for (let x = 0; x <= this.width(); x++) {
            for (let y = 0; y <= this.height(); y++) {
                const regionId = this.regionId(x, y);
                if (spawnMap.has(regionId)) {
                    const spawn = spawnMap.get(regionId);
                    this.spawnEvent(spawn.id, x, y, spawn.template);
                    this._events[this._lastSpawnEventId].setSpritePrepared();
                }
            }
        }
    };

    Game_Map.prototype.createSpawnMap = function() {
        const spawnMap = new Map();
        this._events.forEach(event => {
            if (event.hasTemplate && event.hasTemplate()) {
                return;
            }
            this.appendSpawnMap(event.event(), spawnMap,false);
        });
        if (typeof $dataTemplateEvents !== "undefined") {
            $dataTemplateEvents.forEach(template => {
                this.appendSpawnMap(template, spawnMap,true);
            });
        }
        return spawnMap;
    };

    Game_Map.prototype.appendSpawnMap = function(event, spawnMap, isTemplate) {
        if (!event) {
            return;
        }
        const regionId = PluginManagerEx.findMetaValue(event, 'CP');
        if (regionId) {
            spawnMap.set(regionId, {id:event.id, template:isTemplate});
        }
    };

    Game_Map.prototype.spawnEvent = function(originalEventId, x, y, isTemplate) {
        if (this.isExistEventData(originalEventId, isTemplate) && $gameMap.isValid(x, y)) {
            const eventId = this.getEventIdSequence();
            if (!isTemplate) {
                const originalEvent = this.event(originalEventId);
                if (this.isTemplateSpawn(originalEventId)) {
                    isTemplate      = true;
                    originalEventId = originalEvent.getTemplateId();
                }
                if (originalEvent.isPrefab()) {
                    originalEventId = originalEvent.getOriginalEventId();
                }
            }
            const event = new Game_PrefabEvent(this._mapId, eventId, originalEventId, x, y, isTemplate);
            this.setLastSpawnEventId(eventId);
            this._events[eventId]  = event;
        } else {
            throw new Error('無効なイベントIDもしくは座標のためイベントを作成できませんでした。');
        }
    };

    Game_Map.prototype.isTemplateSpawn = function(originalEventId) {
        const event = this.event(originalEventId);
        return event.hasTemplate && event.hasTemplate();
    };

    Game_Map.prototype.setLastSpawnEventId = function(value) {
        this._lastSpawnEventId = value;
        if (param.variableSpawnEventId > 0) {
            $gameVariables.setValue(param.variableSpawnEventId, value);
        }
    };

    // Called by Script
    Game_Map.prototype.getLastSpawnEventId = function() {
        return this._lastSpawnEventId;
    };

    Game_Map.prototype.isExistEventData = function(eventId, isTemplate) {
        return isTemplate ? !!$dataTemplateEvents[eventId] : !!this.event(eventId);
    };

    Game_Map.prototype.spawnEventRandom = function(originalEventId, conditionMap, isTemplate, algorithm) {
        const conditions = [];
        conditions.push(this.isValid.bind(this));
        if (conditionMap.passable) {
            conditions.push(this.isErsCheckAnyDirectionPassable.bind(this));
        }
        if (conditionMap.screen) {
            conditions.push(this.isErsCheckScreenInOut.bind(this, conditionMap.screen));
        }
        if (conditionMap.overlap) {
            conditions.push(this.isErsCheckCollidedSomeone.bind(this, conditionMap.overlap));
        }
        if (conditionMap.terrainTags && conditionMap.terrainTags.length > 0) {
            conditions.push(this.isErsCheckTerrainTag.bind(this, conditionMap.terrainTags));
        }
        if (conditionMap.regions && conditionMap.regions.length > 0) {
            conditions.push(this.isErsCheckRegionId.bind(this, conditionMap.regions));
        }
        const position = this.getConditionalValidPosition(conditions, algorithm);
        if (position) {
            this.spawnEvent(originalEventId, position.x, position.y, isTemplate);
        } else {
            console.log(conditionMap);
            console.warn('座標の取得に失敗しました。');
        }
    };

    const _Game_Map_eraseEvent    = Game_Map.prototype.eraseEvent;
    Game_Map.prototype.eraseEvent = function(eventId) {
        _Game_Map_eraseEvent.apply(this, arguments);
        if (this._events[eventId].isExtinct()) {
            delete this._events[eventId];
        }
    };

    Game_Map.prototype.getEventIdSequence = function() {
        return this._eventIdSequence++;
    };

    Game_Map.prototype.getPrefabEvents = function() {
        return this.events().filter(function(event) {
            return event.isPrefab();
        });
    };

    Game_Map.prototype.resetSelfSwitchForPrefabEvent = function() {
        this.getPrefabEvents().forEach(function(prefabEvent) {
            prefabEvent.eraseSelfSwitch();
        });
    };

    Game_Map.prototype.restoreLinkPrefabEvents = function() {
        if (!this.isSameMapReload()) return;
        this.getPrefabEvents().forEach(function(prefabEvent) {
            prefabEvent.linkEventData();
        });
    };

    Game_Map.prototype.unlinkPrefabEvents = function() {
        this.getPrefabEvents().forEach(function(prefabEvent) {
            prefabEvent.unlinkEventData();
        });
    };

    Game_Map.prototype.isSameMapReload = function() {
        return !$gamePlayer.isTransferring() || this.mapId() === $gamePlayer.newMapId();
    };

    Game_Map.prototype.getConditionalValidPosition = function(conditions, algorithm) {
        if (algorithm === 0) {
            let x, y, count = 0;
            do {
                x = Math.randomInt($dataMap.width);
                y = Math.randomInt($dataMap.height);
            } while (!conditions.every(this.checkValidPosition.bind(this, x, y)) && ++count < 1000);
            return count < 1000 ? {x: x, y: y} : null;
        } else {
            const positions = [];
            for (let ix = 0; ix < $dataMap.width; ++ix) for (let iy = 0; iy < $dataMap.height; ++iy) {
                if (conditions.every(this.checkValidPosition.bind(this, ix, iy))) {
                    positions.push({x: ix, y: iy});
                }
            }
            return positions.length ? positions[Math.randomInt(positions.length)] : null;
        }
    };

    Game_Map.prototype.checkValidPosition = function(x, y, condition) {
        return condition(x, y);
    };

    Game_Map.prototype.isErsCheckAnyDirectionPassable = function(x, y) {
        return [2, 4, 6, 8].some(function(direction) {
            return $gamePlayer.isMapPassable(x, y, direction);
        });
    };

    Game_Map.prototype.isErsCheckScreenInOut = function(type, x, y) {
        return type === 1 ? this.isErsCheckInnerScreen(x, y) : this.isErsCheckOuterScreen(x, y);
    };

    Game_Map.prototype.isErsCheckInnerScreen = function(x, y) {
        const ax = this.adjustX(x);
        const ay = this.adjustY(y);
        return ax >= 0 && ay >= 0 && ax <= this.screenTileX() - 1 && ay <= this.screenTileY() - 1;
    };

    Game_Map.prototype.isErsCheckOuterScreen = function(x, y) {
        const ax = this.adjustX(x);
        const ay = this.adjustY(y);
        return ax < -1 || ay < -1 || ax > this.screenTileX() || ay > this.screenTileY();
    };

    Game_Map.prototype.isErsCheckCollidedSomeone = function(type, x, y) {
        if ((type === 1 || type === 3) && $gamePlayer.isCollided(x, y)) {
            return false;
        }
        if ((type === 2 || type === 3) && $gameMap.eventIdXy(x, y) > 0) {
            return false;
        }
        return true;
    };

    Game_Map.prototype.isErsCheckTerrainTag = function(type, x, y) {
        return type.some(function(id) {
            return id === this.terrainTag(x, y);
        }, this);
    };

    Game_Map.prototype.isErsCheckRegionId = function(type, x, y) {
        return type.some(function(id) {
            return id === this.regionId(x, y);
        }, this);
    };

    //=============================================================================
    // Game_CharacterBase
    //   プレハブイベントとそうでないキャラクターを区別します。
    //=============================================================================
    Game_CharacterBase.prototype.isPrefab = function() {
        return false;
    };

    Game_CharacterBase.prototype.isExtinct = function() {
        return this.isPrefab() && this._erased;
    };

    //=============================================================================
    // Game_PrefabEvent
    //  動的に生成されるイベントオブジェクトです。
    //=============================================================================
    Game_PrefabEvent.prototype             = Object.create(Game_Event.prototype);
    Game_PrefabEvent.prototype.constructor = Game_PrefabEvent;

    Game_PrefabEvent.prototype.initialize = function(mapId, eventId, originalEventId, x, y, isTemplate) {
        this._originalEventId = originalEventId;
        this._eventId         = eventId;
        this._isTemplate      = isTemplate;
        this.linkEventData();
        Game_Event.prototype.initialize.call(this, mapId, eventId);
        if (typeof Yanfly !== 'undefined' && Yanfly.SEL) {
            $gameTemp._bypassLoadLocation = true;
            this.locateWithoutStraighten(x, y);
            $gameTemp._bypassLoadLocation = undefined;
        } else {
            this.locateWithoutStraighten(x, y);
        }
        this._spritePrepared = false;
    };

    Game_PrefabEvent.prototype.locateWithoutStraighten = function(x, y) {
        this.setPosition(x, y);
        this.refreshBushDepth();
    };

    // for TemplateEvent.js
    Game_PrefabEvent.prototype.generateTemplateId = function(event) {
        return this._isTemplate ? this._originalEventId : null;
    };

    Game_PrefabEvent.prototype.linkEventData = function() {
        $dataMap.events[this._eventId] = (this._isTemplate ?
            $dataTemplateEvents[this._originalEventId] : $dataMap.events[this._originalEventId]);
    };

    Game_PrefabEvent.prototype.unlinkEventData = function() {
        $dataMap.events[this._eventId] = null;
    };

    Game_PrefabEvent.prototype.isPrefab = function() {
        return true;
    };

    Game_PrefabEvent.prototype.erase = function() {
        Game_Event.prototype.erase.call(this);
        this.eraseSelfSwitch();
        delete $dataMap.events[this._eventId];
    };

    Game_PrefabEvent.prototype.isSpritePrepared = function() {
        return this._spritePrepared;
    };

    Game_PrefabEvent.prototype.setSpritePrepared = function() {
        this._spritePrepared = true;
    };

    Game_PrefabEvent.prototype.eraseSelfSwitch = function() {
        ['A', 'B', 'C', 'D'].forEach(function(swCode) {
            const key = [this._mapId, this._eventId, swCode];
            $gameSelfSwitches.setValue(key, undefined);
        }.bind(this));
    };

    Game_PrefabEvent.prototype.getOriginalEventId = function() {
        return this._originalEventId;
    };

    Game_Event.prototype.getOriginalEventId = function() {
        return 0;
    };

    Game_Player.prototype.isNeedMapReload = function() {
        return this._needsMapReload;
    };

    //=============================================================================
    // Sprite
    //  SpriteIDの付与に使用するカウンターを取得します。
    //=============================================================================
    Sprite.getCounter = function() {
        return this._counter;
    };

    //=============================================================================
    // Sprite_Character
    //  対象キャラクターの消去判定を追加定義します。
    //=============================================================================
    Sprite_Character.prototype.isCharacterExtinct = function() {
        return this._character.isExtinct();
    };

    //=============================================================================
    // Spriteset_Map
    //  プレハブイベントのスプライトを管理します。
    //=============================================================================
    const _Spriteset_Map_createCharacters    = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        this._prefabSpriteId = Sprite.getCounter() + 1;
        _Spriteset_Map_createCharacters.apply(this, arguments);
    };

    const _Spriteset_Map_update    = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.apply(this, arguments);
        this.updatePrefabEvent();
    };

    Spriteset_Map.prototype.updatePrefabEvent = function() {
        $gameMap.getPrefabEvents().forEach(function(event) {
            if (!event.isSpritePrepared()) {
                this.makePrefabEventSprite(event);
            }
        }.bind(this));
        // アニメーション再生中に対象の動的イベントを消去するとエラーになるので暫定対策
        // 万一、アニメーションが常に再生され続ける環境だとスプライトの消去が永久に行われない可能性がある。
        if (this.isAnimationPlaying()) {
            return;
        }
        for (let i = 0, n = this._characterSprites.length; i < n; i++) {
            if (this._characterSprites[i].isCharacterExtinct()) {
                this.removePrefabEventSprite(i--);
                n--;
            }
        }
    };

    Spriteset_Map.prototype.makePrefabEventSprite = function(event) {
        event.setSpritePrepared();
        const sprite    = new Sprite_Character(event);
        sprite.spriteId = this._prefabSpriteId;
        this._characterSprites.push(sprite);
        this._tilemap.addChild(sprite);
        if (this._minimap && this._minimap.addObjectSprites) {
            this._minimap.addObjectSprites(event);
        }
        // Resolve conflict by MOG_EventText.js
        if (this._etextField) {
            this.refresh_event_text_field();
        }
    };

    // Resolve conflict by MOG_EventText.js
    Spriteset_Map.prototype.refresh_event_text_field = function() {
        for (let i = 0; i < this._characterSprites.length; i++) {
            if (!this._sprite_char_text[i]) {
                this._sprite_char_text[i] = new Sprite_CharText(this._characterSprites[i]);
                this._etextField.addChild(this._sprite_char_text[i]);
            }
        }
    };

    Spriteset_Map.prototype.removePrefabEventSprite = function(index) {
        const sprite = this._characterSprites[index];
        this._characterSprites.splice(index, 1);
        this._tilemap.removeChild(sprite);
        // Resolve conflict by MOG_EventText.js
        if (this._sprite_char_text && this._sprite_char_text[index]) {
            this._etextField.removeChild(this._sprite_char_text[index]);
            this._sprite_char_text.splice(index, 1);
        }
    };

    //=============================================================================
    // Scene_Map
    //  場所移動時にセルフスイッチの情報を初期化します。
    //=============================================================================
    const _Scene_Map_create    = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.apply(this, arguments);
        if (this._transfer && !param.keepSelfSwitch) {
            $gameMap.resetSelfSwitchForPrefabEvent();
        }
    };

    //=============================================================================
    // DataManager
    //  マップデータのロード完了時にプレハブイベントのリンク先を復元します。
    //=============================================================================
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad        = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (object === $dataMap && $gameMap) $gameMap.restoreLinkPrefabEvents();
    };

    if (typeof Window_EventMiniLabel !== 'undefined') {
        const _Window_EventMiniLabel_gatherDisplayData    = Window_EventMiniLabel.prototype.gatherDisplayData;
        Window_EventMiniLabel.prototype.gatherDisplayData = function() {
            if (!this._character.event()) {
                return;
            }
            _Window_EventMiniLabel_gatherDisplayData.apply(this, arguments);
        };
    }
})();

