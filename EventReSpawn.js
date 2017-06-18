//=============================================================================
// EventReSpawn.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.3 2017/06/18 コピー対象のイベントを変数から指定する際、変数に文字列が入っていると正しく取得できない問題を修正（by 奏ねこま氏）
// 1.5.2 2017/05/28 イベントを配置したときアニメパターンが一瞬だけ初期化されてしまう問題を修正
// 1.5.1 2017/04/23 イベントを生成するプラグインコマンドで制御文字が無効になっていた問題を修正
// 1.5.0 2017/01/19 イベント生成の際にIDだけでなくイベント名の一致するイベントを動的生成できる機能を追加
// 1.4.4 2017/01/13 動的イベントの一時消去時にバルーンやアニメーションを表示中だった場合に表示が残ってしまう問題を修正
// 1.4.3 2017/01/12 1.4.2の対策に漏れがあったため再修正
// 1.4.2 2017/01/12 プロジェクトを再保存してバージョンIDが変化した場合は動的生成イベントを復元しないよう修正
// 1.4.1 2016/12/28 YEP_SaveEventLocations.jsとの競合を解消
// 1.4.0 2016/12/25 最後に動的生成したイベントのイベントIDを取得できるコマンドを追加
// 1.3.1 2016/11/08 動的イベント生成中に同一マップに場所移動するとエラーが発生する現象を修正
// 1.3.0 2016/11/03 ランダム生成機能で各種引数で文字で設定できる機能を追加＋境界値まわりのバグ修正（by くらむぼん氏）
// 1.2.0 2016/09/06 場所移動時、生成イベントを引き継いでしまう不具合を修正
//                  プラグインコマンド実行時にイベントIDを0にすることで「このイベント」を複製できる機能を追加
// 1.1.1 2016/08/11 動的イベント生成中にセーブした場合にロードできなくなる不具合を修正
// 1.1.0 2016/08/10 テンプレートイベントプラグインとの連携で、テンプレートマップからイベントを生成する機能を追加
//                  生成場所を条件付きランダムで設定できる機能を追加
// 1.0.1 2016/08/09 イベント生成後にメニューを開いて戻ってくるとエラーが発生する現象の修正
// 1.0.0 2016/08/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc イベント動的生成プラグイン
 * @author トリアコンタン
 *
 * @help イベントをコピーして動的に生成します。
 * コピーした一時イベントは、イベントコマンド「イベントの一時消去」によって
 * 完全に削除され、オブジェクトとスプライトの使用領域を解放します。
 * セルフスイッチは個別に管理され、生成されるたびに初期化されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ERS_生成 1 5 10 # イベントID[1]のイベントをコピーしてX[5] Y[10]に配置
 * ERS_MAKE 1 5 10 # 同上
 *
 * イベントIDを「0」にすると実行中のイベント（このイベント）を複製します。
 *
 * ●追加機能●
 * イベントIDに「文字列」を指定するとイベント名が一致するイベントを
 * 複製対象にします。(対象が複数存在する場合は一番小さいIDになります)
 *
 * ERS_生成 aaa 5 10 # イベント名[aaa]のイベントをコピーしてX[5] Y[10]に配置
 * ERS_MAKE aaa 5 10 # 同上
 *
 * 他のプラグインコマンドも同様です。
 *
 * 生成位置をランダムにすることもできます。ただのランダムではなく
 * 以下の補助条件を指定したうえでのランダムです。
 *  a. 通行可能かどうか(0:判定なし 1:通行可能タイルのみ)
 *  b. 画面内 or 画面外(0:判定なし 1:画面内 2:画面外)
 *  c. 他のキャラとの重なり(0:判定なし 1:プレイヤー 2:イベント 3:両方)
 *  d. 地形タグ(0:判定なし 1..:指定した地形タグ)
 *  e. リージョン(0:判定なし 1..:指定したリージョン)
 *
 * ERS_ランダム生成 1 1 2 3 5 4 # イベントID[1]のイベントを下記の条件(※)で配置
 * ERS_MAKE_RANDOM 1 1 2 3 5 4  # 同上
 * ※ 通行可能かつ画面外かつプレイヤーもしくはイベントが存在せず
 *    地形タグが「5」でリージョンが「4」の位置の中からランダム
 *
 * また特に、a.b.c.の条件指定がやりにくかったため文章による指定も可能にしました。
 * 上記の条件は以下のように書き換えることができます。（順番入れ替えは不可）
 *
 * ERS_ランダム生成 1 通行可能タイルのみ 画面外 両方 5 4
 * ERS_MAKE_RANDOM 1 passonly offscreen both 5 4
 *
 * 以下は同じ意味で用いることが出来る同義語リストです。
 * 判定なし 条件なし none
 * 通行可能タイルのみ 通行のみ passonly
 * 画面内 onscreen screen
 * 画面外 offscreen
 * プレイヤー player
 * イベント event
 * 両方 both
 *
 * 最後に動的生成したイベントのイベントIDを取得できます。
 * 指定した番号の変数に格納されます。
 *
 * ERS_最終生成イベントID取得 10  # 最後に生成したイベントIDを変数[10]に設定
 * ERS_GET_LAST_SPAWN_EVENT_ID 10 # 同上
 *
 * イベントIDを「0」にすると実行中のイベント（このイベント）を複製します。
 *
 * ・他プラグインとの連携
 * テンプレートイベントプラグイン「TemplateEvent.js」と組み合わせると
 * テンプレートマップに定義したイベントを直接、マップに生成することができます。
 * 「TemplateEvent.js」を適用せずにコマンドを実行するとエラーになります。
 *
 * ERS_テンプレート生成 1 5 10 # テンプレートマップのイベントID[1]を生成します。
 * ERS_MAKE_TEMPLATE 1 5 10    # 同上
 *
 * ERS_テンプレートランダム生成 1 1 2 3 5 4 # テンプレート[1]をランダム生成
 * ERS_MAKE_TEMPLATE_RANDOM 1 1 2 3 5 4     # 同上
 * ※ 補助条件に関しては「ERS_ランダム生成」と同様です。
 *
 * 「TemplateEvent.js」取得元
 * https://github.com/triacontane/RPGMakerMV
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_PrefabEvent() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var metaTagPrefix = 'ERS_';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || makeRandomCompatible[arg] || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var makeRandomCompatible = {
        none: 0,
        判定なし: 0,
        条件なし: 0,
        passonly: 1,
        通行可能タイルのみ: 1,
        通行のみ: 1,
        screen: 1,
        onscreen: 1,
        画面内: 1,
        offscreen: 2,
        画面外: 2,
        player: 1,
        プレイヤー: 1,
        event: 2,
        イベント: 2,
        both: 3,
        両方: 3,
    };

    //=============================================================================
    // DataManager
    //  データ検索用の共通処理です。
    //=============================================================================
    if (!DataManager.searchDataItem) {
        DataManager.searchDataItem = function(dataArray, columnName, columnValue) {
            var result = 0;
            dataArray.some(function(dataItem) {
                if (dataItem && dataItem[columnName] === columnValue) {
                    result = dataItem;
                    return true;
                }
                return false;
            });
            return result;
        };
    }

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        try {
            this.pluginCommandEventReSpawn(command.replace(commandPrefix, ''), args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandEventReSpawn = function(command, args, extend) {
        switch (getCommandName(command)) {
            case '生成' :
            case 'MAKE' :
                var x = getArgNumber(args[1]);
                var y = getArgNumber(args[2]);
                $gameMap.spawnEvent(this.getEventIdForEventReSpawn(args[0], extend), x, y, extend);
                break;
            case 'ランダム生成' :
            case 'MAKE_RANDOM' :
                var conditionMap        = {};
                conditionMap.passable   = getArgNumber(args[1], 0);
                conditionMap.screen     = getArgNumber(args[2], 0);
                conditionMap.collided   = getArgNumber(args[3], 0);
                conditionMap.terrainTag = getArgNumber(args[4], 0);
                conditionMap.regionId   = getArgNumber(args[5], 0);
                $gameMap.spawnEventRandom(this.getEventIdForEventReSpawn(args[0], extend), conditionMap, extend);
                break;
            case 'テンプレート生成' :
            case 'MAKE_TEMPLATE' :
                this.pluginCommandEventReSpawn('MAKE', args, true);
                break;
            case 'テンプレートランダム生成' :
            case 'MAKE_TEMPLATE_RANDOM' :
                this.pluginCommandEventReSpawn('MAKE_RANDOM', args, true);
                break;
            case '最終生成イベントID取得' :
            case 'GET_LAST_SPAWN_EVENT_ID' :
                var eventId = $gameMap.getLastSpawnEventId();
                $gameVariables.setValue(getArgNumber(args[0], 0), eventId);
                break;
        }
    };

    Game_Interpreter.prototype.getEventIdForEventReSpawn = function(arg, isTemplate) {
        var id = 0;
        if (!isNaN(convertEscapeCharacters(arg))) {
            id = getArgNumber(arg, 0);
        } else {
            var event = DataManager.searchDataItem(isTemplate ? $dataTemplateEvents : $dataMap.events, 'name', convertEscapeCharacters(arg));    // modified by nekoma.
            id = event ? event.id : 0;
        }
        return id > 0 ? id : this._eventId;
    };

    //=============================================================================
    // Game_Map
    //  イベントのスポーン処理を追加定義します。
    //=============================================================================
    var _Game_Map_setupEvents      = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        if ($gamePlayer.isNeedMapReload()) {
            this.unlinkPrefabEvents();
        }
        _Game_Map_setupEvents.apply(this, arguments);
        this._eventIdSequence = this._events.length;
    };

    Game_Map.prototype.spawnEvent = function(originalEventId, x, y, isTemplate) {
        if (this.isExistEventData(originalEventId, isTemplate) && $gameMap.isValid(x, y)) {
            var eventId = this.getEventIdSequence();
            var event   = new Game_PrefabEvent(this._mapId, eventId, originalEventId, x, y, isTemplate);
            this._lastSpawnEventId = eventId;
            this._events.push(event);
        } else {
            throw new Error('無効なイベントIDもしくは座標のためイベントを作成できませんでした。');
        }
    };

    Game_Map.prototype.getLastSpawnEventId = function() {
        return this._lastSpawnEventId;
    };

    Game_Map.prototype.isExistEventData = function(eventId, isTemplate) {
        return isTemplate ? !!$dataTemplateEvents[eventId] : !!this.event(eventId);
    };

    Game_Map.prototype.spawnEventRandom = function(originalEventId, conditionMap, isTemplate) {
        var conditions = [];
        conditions.push(this.isValid.bind(this));
        if (conditionMap.passable) {
            conditions.push(this.isErsCheckAnyDirectionPassable.bind(this));
        }
        if (conditionMap.screen) {
            conditions.push(this.isErsCheckScreenInOut.bind(this, conditionMap.screen));
        }
        if (conditionMap.collided) {
            conditions.push(this.isErsCheckCollidedSomeone.bind(this, conditionMap.collided));
        }
        if (conditionMap.terrainTag) {
            conditions.push(this.isErsCheckTerrainTag.bind(this, conditionMap.terrainTag));
        }
        if (conditionMap.regionId) {
            conditions.push(this.isErsCheckRegionId.bind(this, conditionMap.regionId));
        }
        var position = this.getConditionalValidPosition(conditions);
        if (position) {
            this.spawnEvent(originalEventId, position.x, position.y, isTemplate);
        } else {
            console.log(conditionMap);
            throw new Error('座標の取得に失敗しました。');
        }
    };

    var _Game_Map_eraseEvent      = Game_Map.prototype.eraseEvent;
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

    Game_Map.prototype.getConditionalValidPosition = function(conditions) {
        var x, y, count = 0;
        do {
            x = Math.randomInt($dataMap.width);
            y = Math.randomInt($dataMap.height);
        } while (!conditions.every(this.checkValidPosition.bind(this, x, y)) && ++count < 1000);
        return count < 1000 ? {x: x, y: y} : null;
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
        var ax = this.adjustX(x);
        var ay = this.adjustY(y);
        return ax >= 0 && ay >= 0 && ax <= this.screenTileX() - 1 && ay <= this.screenTileY() - 1;
    };

    Game_Map.prototype.isErsCheckOuterScreen = function(x, y) {
        var ax = this.adjustX(x);
        var ay = this.adjustY(y);
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
        return type === this.terrainTag(x, y);
    };

    Game_Map.prototype.isErsCheckRegionId = function(type, x, y) {
        return type === this.regionId(x, y);
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
            var key = [this._mapId, this._eventId, swCode];
            $gameSelfSwitches.setValue(key, undefined);
        }.bind(this));
    };

    //=============================================================================
    // Game_Player
    //  プロジェクト再保存によるマップリロードかどうかの判定を取得します。
    //=============================================================================
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

    Sprite_Character.prototype.endAllEffect = function() {
        this.endBalloon();
        this.endAnimation();
    };

    Sprite_Character.prototype.endAnimation = function() {
        if (this._animationSprites.length > 0) {
            var sprites = this._animationSprites.clone();
            this._animationSprites = [];
            sprites.forEach(function(sprite) {
                sprite.remove();
            });
        }
    };

    //=============================================================================
    // Spriteset_Map
    //  プレハブイベントのスプライトを管理します。
    //=============================================================================
    var _Spriteset_Map_createCharacters      = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        this._prefabSpriteId = Sprite.getCounter() + 1;
        _Spriteset_Map_createCharacters.apply(this, arguments);
    };

    var _Spriteset_Map_update      = Spriteset_Map.prototype.update;
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
        for (var i = 0, n = this._characterSprites.length; i < n; i++) {
            if (this._characterSprites[i].isCharacterExtinct()) {
                this.removePrefabEventSprite(i--);
                n--;
            }
        }
    };

    Spriteset_Map.prototype.makePrefabEventSprite = function(event) {
        event.setSpritePrepared();
        var sprite      = new Sprite_Character(event);
        sprite.spriteId = this._prefabSpriteId;
        this._characterSprites.push(sprite);
        this._tilemap.addChild(sprite);
    };

    Spriteset_Map.prototype.removePrefabEventSprite = function(index) {
        var sprite = this._characterSprites[index];
        this._characterSprites.splice(index, 1);
        sprite.endAllEffect();
        this._tilemap.removeChild(sprite);
    };

    //=============================================================================
    // Scene_Map
    //  場所移動時にセルフスイッチの情報を初期化します。
    //=============================================================================
    var _Scene_Map_create      = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.apply(this, arguments);
        if (this._transfer) {
            $gameMap.resetSelfSwitchForPrefabEvent();
        }
    };

    //=============================================================================
    // DataManager
    //  マップデータのロード完了時にプレハブイベントのリンク先を復元します。
    //=============================================================================
    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad      = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (object === $dataMap && $gameMap) $gameMap.restoreLinkPrefabEvents();
    };
})();

