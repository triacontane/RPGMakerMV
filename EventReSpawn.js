/*=============================================================================
 EventReSpawn.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/08/26 ベースプラグインの説明を追加
 1.0.0 2020/07/25 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
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
        $gameMap.spawnEvent(this.getEventIdForEventReSpawn(args.id, template), args.x, args.y, template);
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
        if (conditionMap.collided) {
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

