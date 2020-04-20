//=============================================================================
// KMS_Minimap.js
//  last update: 2020/04/21
//=============================================================================

/*:
 * @plugindesc
 * [v0.2.0a] Display minimap.
 *
 * @author TOMY (Kamesoft)
 *
 * @param Map rect
 * @default 524, 32, 260, 200
 * @desc
 * Specify minimap position and its size.
 * Format: X, Y, Width, Height
 *
 * @param Grid size
 * @default 10
 * @desc Grid size of the minimap in pixel.
 *
 * @param Blink time
 * @default 180
 * @desc Blinking interval of icons on the minimap in frames.
 *
 * @param Foreground color
 * @default rgba(224, 224, 240, 0.6)
 * @desc
 * Format: rgba(Red, Green, Blue, Alpha)
 *
 * @param Background color
 * @default rgba(0, 0, 160, 0.6)
 * @desc
 * Format: rgba(Red, Green, Blue, Alpha)
 *
 * @param Mask style
 * @default 0
 * @desc
 * Mask style for minimap.
 * 0: None  1: Ellipse  2: Rounded rectangle  3, 4: Hex
 *
 * @param Mask radius
 * @default 48
 * @desc
 * The radius of each of the corners.
 * (Rounded rectangle style only)
 *
 * @help
 * ## Disable minimap
 *
 * Add <NoMinimap> to the note field in a map, the minimap will be disabled on that map.
 *
 *
 * ## Plugin command
 *
 * Minimap show     # Show minimap. If <NoMinimap> is specified, the minimap can't be shown.
 * Minimap hide     # Hide minimap.
 * Minimap refresh  # Redraw minimap.
 *
 * @requiredAssets img/system/MinimapPlayerIcon
 * @requiredAssets img/system/MinimapObjectIcon
 */

/*:ja
 * @plugindesc
 * [v0.2.0a] 画面上にミニマップを表示します。
 *
 * @author TOMY (Kamesoft)
 *
 * @param Map rect
 * @default 524, 32, 260, 200
 * @desc
 * ミニマップの表示位置とサイズをピクセル単位で指定します。
 * 書式: X, Y, 幅, 高さ
 *
 * @param Grid size
 * @default 10
 * @desc ミニマップの 1 マスのサイズをピクセル単位で指定します。
 *
 * @param Blink time
 * @default 180
 * @desc ミニマップ上のアイコンを点滅させる時間をフレーム単位で指定します。
 *
 * @param Foreground color
 * @default rgba(224, 224, 240, 0.6)
 * @desc
 * ミニマップの通行可能領域の色を CSS カラーで指定します。
 * 書式: rgba(赤, 緑, 青, 不透明度)
 *
 * @param Background color
 * @default rgba(0, 0, 160, 0.6)
 * @desc
 * ミニマップの通行不可領域の色を CSS カラーで指定します。
 * 書式: rgba(赤, 緑, 青, 不透明度)
 *
 * @param Mask style
 * @default 0
 * @desc
 * ミニマップの表示領域のマスク方法を指定します。
 * 0: なし  1: 楕円  2: 角丸矩形  3: 六角形1  4: 六角形2
 *
 * @param Mask radius
 * @default 48
 * @desc
 * 角丸矩形マスクを指定した場合の、角の丸め具合を指定します。
 *
 * @help
 * ## ミニマップの非表示
 *
 * マップのメモ欄に <NoMinimap> を追加すると、そのマップではミニマップが表示されなくなります。
 *
 *
 * ## プラグインコマンド
 *
 * Minimap show     # ミニマップを表示します。<NoMinimap> を指定したマップでは表示できません。
 * Minimap hide     # ミニマップを隠します。
 * Minimap refresh  # ミニマップを再描画します。
 *
 * @requiredAssets img/system/MinimapPlayerIcon
 * @requiredAssets img/system/MinimapObjectIcon
 */

var KMS = KMS || {};

(function()
{

'use strict';

KMS.imported = KMS.imported || {};
KMS.imported['Minimap'] = true;

/**
 * 矩形を表す文字列を解析
 */
var parseRect = function(str)
{
    var rectReg = /([-]?\d+),\s*([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)/;
    var rect = new PIXI.Rectangle(524, 32, 260, 200);
    var match = rectReg.exec(str);
    if (match)
    {
        rect.x      = Number(match[1]);
        rect.y      = Number(match[2]);
        rect.width  = Number(match[3]);
        rect.height = Number(match[4]);
    }

    return rect;
};

var pluginParams = PluginManager.parameters('KMS_Minimap');
var Params = {};
Params.mapRect = parseRect(pluginParams['Map rect']);
Params.gridSize = Number(pluginParams['Grid size'] || 10);
Params.blinkTime = Number(pluginParams['Blink time'] || 180);
Params.foregroundColor = pluginParams['Foreground color'] || 'rgba(224, 224, 240, 0.6)';
Params.backgroundColor = pluginParams['Background color'] || 'rgba(  0,   0, 160, 0.6)';
Params.playerIconImage = pluginParams['Player icon'] || 'MinimapPlayerIcon';
Params.objectIconImage = pluginParams['Object icon'] || 'MinimapObjectIcon';
Params.displayTileImage = pluginParams['Display tile'];
Params.maskStyle = Number(pluginParams['Mask style'] || 0);
Params.maskRadius = Number(pluginParams['Mask radius'] || 48);

var Minimap = {};
Minimap.passageCacheCountMax = 5;
Minimap.regex = {
    wallEvent: /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:壁|障害物|WALL)>/i,
    moveEvent: /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:移動|MOVE)>/i,
    person:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:人物|PERSON)\s*(\d+)>/i,
    object:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*OBJ(?:ECT)?\s*(\d+)>/i
};
Minimap.keysRequireNumber = [ 'person', 'object' ];
Minimap.dirFlags = { down: 0x01, left: 0x02, right: 0x04, up: 0x08 };
Minimap.maskStyles = { none: 0, ellipse: 1, roundedRect: 2, hex1: 3, hex2: 4 };


/**
 * 指定した円に内接する正 n 角形の塗り潰し
 */
var fillRegularPolygon = function(graphics, x, y, width, height, startRad, vertexCount)
{
    if (vertexCount < 1)
    {
        return;
    }

    var points = [];
    for (var i = 0; i < vertexCount; i++)
    {
        var angle = i * Math.PI * 2 / vertexCount - Math.PI / 2 + startRad;
        points.push(x + Math.cos(angle) * width);
        points.push(y + Math.sin(angle) * height);
    }

    graphics.drawPolygon(points);
};


//-----------------------------------------------------------------------------
// Plugin commands

var _KMS_Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    _KMS_Game_Interpreter_pluginCommand.call(this, command, args);

    if (command !== 'Minimap')
    {
        return;
    }

    switch (args[0])
    {
    case 'show':
        $gameSystem.setMinimapEnabled(true);
        break;
    case 'hide':
        $gameSystem.setMinimapEnabled(false);
        break;
    case 'refresh':
        $gameMap.refreshMinimapCache();
        break;
    default:
        // 不明なコマンド
        console.log('[Minimap %1] Unknown command.'.format(args[0]));
        break;
    }
};


//-----------------------------------------------------------------------------
// Tilemap

Tilemap.prototype.getTileCount = function()
{
    return {
        x: Math.ceil(this._width  / this._tileWidth)  + 1,
        y: Math.ceil(this._height / this._tileHeight) + 1
    };
};


//-----------------------------------------------------------------------------
// Game_Temp

var _KMS_Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function()
{
    _KMS_Game_Temp_initialize.call(this);

    this._minimapPassageCache     = [];
    this._minimapCacheRefreshFlag = false;
};

Object.defineProperty(Game_Temp.prototype, 'minimapCacheRefreshFlag', {
    get: function()
    {
        return this._minimapCacheRefreshFlag;
    },
    set: function(value)
    {
        this._minimapCacheRefreshFlag = value;
    },
    configurable: true
});

Game_Temp.prototype.getMinimapPassageCache = function(mapId)
{
    return null;
};

/**
 * 通行可否キャッシュの登録
 */
Game_Temp.prototype.registerMinimapPassageCache = function(mapId, passage)
{
    // 最新のキャッシュは先頭に置く
    var newCache = [ { mapId: mapId, passage: passage } ].concat(
        this._minimapPassageCache.filter(function(cache)
        {
            return cache.mapId !== mapId;
        }));

    // しばらく参照されていないキャッシュは消す
    this._minimapPassageCache = newCache.slice(0, Minimap.passageCacheCountMax);
};

/**
 * 通行可否キャッシュの取得
 */
Game_Temp.prototype.getMinimapPassageCache = function(mapId)
{
    for (var i = 0; i < this._minimapPassageCache.length; i++)
    {
        var tempCache = this._minimapPassageCache[i];
        if (tempCache.mapId !== mapId)
        {
            continue;
        }

        if (i > 0)
        {
            // 取得したキャッシュは先頭に移す
            this.registerMinimapPassageCache(mapId, tempCache);

        }
        return tempCache;
    }

    return null;
};

/**
 * 通行可否キャッシュをクリア
 */
Game_Temp.prototype.clearMinimapPassageCache = function(mapId)
{
    this._minimapPassageCache     = [];
    this._minimapCacheRefreshFlag = true;
};


//-----------------------------------------------------------------------------
// Game_System

/**
 * ミニマップの有効状態を取得
 */
Game_System.prototype.isMinimapEnabled = function()
{
    return this._minimapEnabled != null ? this._minimapEnabled : true;
};

/**
 * ミニマップの有効状態を設定
 */
Game_System.prototype.setMinimapEnabled = function(enabled)
{
    this._minimapEnabled = !!enabled;
};


//-----------------------------------------------------------------------------
// Game_Map

var _KMS_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId)
{
    _KMS_Game_Map_setup.call(this, mapId);

    this.setupMinimap();
};

/**
 * ミニマップに関する設定
 */
Game_Map.prototype.setupMinimap = function()
{
    this._minimapEnabled = !$dataMap.meta.NoMinimap;
};

/**
 * ミニマップの表示可否を取得
 */
Game_Map.prototype.isMinimapEnabled = function()
{
    return this._minimapEnabled;
};

/**
 * ミニマップのキャッシュを再構築
 */
Game_Map.prototype.refreshMinimapCache = function()
{
    $gameTemp.clearMinimapPassageCache();
};


//-----------------------------------------------------------------------------
// Game_Character

Game_Character.prototype.isMinimapAttributeDirty = function()
{
    // 何もしない
};

Game_Character.prototype.setMinimapAttributeDirty = function()
{
    // 何もしない
};

Game_Character.prototype.clearMinimapAttributeDirty = function()
{
    // 何もしない
};


//-----------------------------------------------------------------------------
// Game_Event

var _KMS_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function()
{
    _KMS_Game_Event_setupPage.call(this);

    this.setupMinimapAttribute();
};

/**
 * ミニマップ用属性の設定
 */
Game_Event.prototype.setupMinimapAttribute = function()
{
    this._minimapAttribute = { dirty: true, wall: false, move: false, person: -1, object: -1 };

    var isComment = function(command)
    {
        return command && (command.code === 108 || command.code === 408);
    };

    // 注釈以外に達するまで解析
    var page = this.page();
    if (!page)
    {
        return;
    }

    var commands = page.list;
    var index    = 0;
    var command  = commands[index++];
    while (isComment(command))
    {
        var comment = command.parameters[0];

        this._minimapAttribute.wall |= Minimap.regex.wallEvent.test(comment);
        this._minimapAttribute.move |= Minimap.regex.moveEvent.test(comment);
        Minimap.keysRequireNumber.forEach(function(key)
        {
            var match = Minimap.regex[key].exec(comment);
            if (match)
            {
                this._minimapAttribute[key] = Number(match[1]);
            }
        }, this);

        command = commands[index++];
    }
};

Game_Event.prototype.isMinimapAttributeDirty = function()
{
    return this._minimapAttribute.dirty;
};

Game_Event.prototype.setMinimapAttributeDirty = function()
{
    this._minimapAttribute.dirty = true;
};

Game_Event.prototype.clearMinimapAttributeDirty = function()
{
    this._minimapAttribute.dirty = false;
};

Game_Event.prototype.isMinimapWall = function()
{
    return this._minimapAttribute.wall;
};

Game_Event.prototype.isMinimapMove = function()
{
    return this._minimapAttribute.move;
};

Game_Event.prototype.minimapPersonType = function()
{
    return this._minimapAttribute.person;
};

Game_Event.prototype.minimapObjectType = function()
{
    return this._minimapAttribute.object;
};


//-----------------------------------------------------------------------------
// Game_Vehicle

/**
 * 現在のマップに存在するか
 */
Game_Vehicle.prototype.isInCurrentMap = function()
{
    return this._mapId === $gameMap.mapId();
};


//-----------------------------------------------------------------------------
// Game_MinimapPassageCache

function Game_MinimapPassageCache()
{
    this.initialize.apply(this, arguments);
};

Game_MinimapPassageCache.prototype.initialize = function(map, grid)
{
    this._mapId = map.mapId();
    this._width = map.width();
    this._height = map.height();
    this._grid = grid;
    this._blockCount = {
        x: Math.floor((this._width  + grid.x - 1) / grid.x),
        y: Math.floor((this._height + grid.y - 1) / grid.y)
    };

    // 各タイルの通行可否フラグ
    this._flags = new Array(this._width * this._height);

    // チェック済みブロックフラグ
    this._blockChecked = new Array(this._blockCount.x * this._blockCount.y);
};

/**
 * ブロック数の取得
 */
Game_MinimapPassageCache.prototype.getBlockCount = function()
{
    return this._blockCount;
};

/**
 * ブロックチェック済み判定
 */
Game_MinimapPassageCache.prototype.isBlockChecked = function(bx, by)
{
    return this._blockChecked[bx + by * this._blockCount.y];
};

/**
 * ブロックチェック済みフラグの設定
 */
Game_MinimapPassageCache.prototype.setBlockChecked = function(bx, by, checked)
{
    this._blockChecked[bx + by * this._blockCount.y] = checked;
};

/**
 * 通行フラグの取得
 */
Game_MinimapPassageCache.prototype.getFlag = function(x, y)
{
    if ($gameMap.isLoopHorizontal())
    {
        x = (x + this._width) % this._width;
    }
    else if (x < 0 || x >= this._width)
    {
        return 0;
    }

    if ($gameMap.isLoopVertical())
    {
        y = (y + this._height) % this._height;
    }
    else if (y < 0 || y >= this._height)
    {
        return 0;
    }

    return this._flags[x + y * this._width];
};

/**
 * 通行フラグの設定
 */
Game_MinimapPassageCache.prototype.setFlag = function(x, y, flag)
{
    this._flags[x + y * this._width] = flag;
};

/**
 * 指定位置が通行可能か
 */
Game_MinimapPassageCache.prototype.isPassable = function(x, y)
{
    return this.getFlag(x, y) !== 0;
};

/**
 * 指定方向への通行が可能か
 */
Game_MinimapPassageCache.prototype.isPassableDir = function(x, y, dir)
{
    var flag = this.getFlag(x, y);
    switch (dir)
    {
        case 2: return (flag & Minimap.dirFlags.down)  !== 0;
        case 4: return (flag & Minimap.dirFlags.left)  !== 0;
        case 6: return (flag & Minimap.dirFlags.right) !== 0;
        case 8: return (flag & Minimap.dirFlags.up)    !== 0;
        default: return false;
    }
};


//-----------------------------------------------------------------------------
// Sprite_Minimap
//
// ミニマップ用のスプライトです。

function Sprite_Minimap()
{
    this.initialize.apply(this, arguments);
}

Sprite_Minimap.prototype = Object.create(Sprite_Base.prototype);
Sprite_Minimap.prototype.constructor = Sprite_Minimap;

Sprite_Minimap.prototype.initialize = function()
{
    Sprite_Base.prototype.initialize.call(this);

    var rect = Params.mapRect;
    this._gridNumber = {
        x: Math.floor((rect.width + Params.gridSize - 1) / Params.gridSize),
        y: Math.floor((rect.height + Params.gridSize - 1) / Params.gridSize),
    };
    this._drawGridNumber = { x: this._gridNumber.x + 2, y: this._gridNumber.y + 2 };
    this._drawRange = { begin: new PIXI.Point(0, 0), end: new PIXI.Point(0, 0) };

    this._lastPosition = new Point($gamePlayer.x, $gamePlayer.y);
    this._scrollDiff = new Point();

    this.createSubSprites();

    this._baseOpacity = 255;
    this.setColorTone([-64, -64, 128, 64]);

    this.move(rect.x, rect.y);
};

/**
 * 内部のスプライトを作成
 */
Sprite_Minimap.prototype.createSubSprites = function()
{
    this._bitmapSize = {
        width: (this._gridNumber.x + 2) * Params.gridSize,
        height: (this._gridNumber.y + 2) * Params.gridSize
    };

    this.createBaseSprite();
    this.createPassageSprite();
    this.createObjectSprites();
    this.createPlayerSprite();
};

/**
 * ベース部分のスプライトを作成
 */
Sprite_Minimap.prototype.createBaseSprite = function()
{
    var rect = Params.mapRect;

    this._baseSprite = new Sprite();
    this._baseSprite.bitmap = new Bitmap(rect.width, rect.height);
    this._baseSprite.bitmap.fillAll(Params.backgroundColor);

    this.addChild(this._baseSprite);

    if (Params.displayTileImage)
    {
        this._tilemap = Graphics.isWebGL() ?
            new ShaderTilemap() :
            new Tilemap();

        // 軽量化のためにタイルのアニメーションを切る
        this._tilemap.update = null;

        this.addChild(this._tilemap);
    }

    this.applyMask(rect);
};


/**
 * マスクの適用
 */
Sprite_Minimap.prototype.applyMask = function(rect)
{
    this._maskGraphic = new PIXI.Graphics();
    this._maskGraphic.beginFill(0x000000);

    switch (Params.maskStyle)
    {
        case Minimap.maskStyles.ellipse:
            this._maskGraphic.drawEllipse(rect.width / 2, rect.height / 2, rect.width / 2, rect.height / 2);
            break;

        case Minimap.maskStyles.roundedRect:
            this._maskGraphic.drawRoundedRect(0, 0, rect.width, rect.height, 64);
            break;

        case Minimap.maskStyles.hex1:
        case Minimap.maskStyles.hex2:
            fillRegularPolygon(
                this._maskGraphic,
                rect.width / 2,
                rect.height / 2,
                rect.width / 2,
                rect.height / 2,
                (Params.maskStyle === Minimap.maskStyles.hex1) ? 0 : (Math.PI / 2),
                6);
            break;

        default:
            this._maskGraphic.drawRect(0, 0, rect.width, rect.height);
            break;
    }

    this._maskGraphic.endFill();

    this.addChild(this._maskGraphic);
    this.mask = this._maskGraphic;
};

/**
 * 通行可能領域スプライトの作成
 */
Sprite_Minimap.prototype.createPassageSprite = function()
{
    this._passageSprite = new Sprite_MinimapPassage(this._bitmapSize.width, this._bitmapSize.height);

    this.updateScroll();

    this.addChild(this._passageSprite);
};

/**
 * オブジェクトスプライトの作成
 */
Sprite_Minimap.prototype.createObjectSprites = function()
{
    this._objectSprites = [];

    var objects = $gameMap.events().concat($gameMap.vehicles());
    objects.forEach(function(obj)
    {
        var sprite = new Sprite_MinimapIcon();
        sprite.setObject(obj);

        this._objectSprites.push(sprite);
        this.addChild(sprite);
    }, this);
};

/**
 * 現在位置スプライトの作成
 */
Sprite_Minimap.prototype.createPlayerSprite = function()
{
    var rect = Params.mapRect;

    this._playerSprite = new Sprite_MinimapIcon();
    this._playerSprite.bitmap = ImageManager.loadSystem(Params.playerIconImage);
    this._playerSprite.x = rect.width / 2;
    this._playerSprite.y = rect.height / 2;

    this.addChild(this._playerSprite);
};

/**
 * 全体の不透明度を設定
 */
Sprite_Minimap.prototype.setWholeOpacity = function(baseOpacity)
{
    this.opacity = this._baseOpacity * baseOpacity / 255;
};

/**
 * ミニマップ位置の移動
 */
Sprite_Minimap.prototype.move = function(x, y)
{
    this.x = x;
    this.y = y;
};

Sprite_Minimap.prototype.isNeedUpdate = function()
{
    return this.visible && this.opacity > 0;
};

Sprite_Minimap.prototype.update = function()
{
    Sprite_Base.prototype.update.call(this);

    this.updateVisibility();

    if ($gameTemp.minimapCacheRefreshFlag)
    {
        $gameTemp.minimapCacheRefreshFlag = false;
        this.refreshPassageTable();
    }

    if (!this.isNeedUpdate())
    {
        return;
    }

    this.updatePosition();
    this.updateTilemap();
    this.updatePassageSprite();
    this.updateObjectSprites();
    this.updatePlayerSprite();
};

/**
 * 可視状態の更新
 */
Sprite_Minimap.prototype.updateVisibility = function()
{
    this.visible =
        $gameSystem.isMinimapEnabled() &&
        $gameMap.isMinimapEnabled();
};

/**
 * 描画範囲の更新
 */
Sprite_Minimap.prototype.updateDrawRange = function()
{
    var range = {
        x: Math.floor(this._drawGridNumber.x / 2),
        y: Math.floor(this._drawGridNumber.y / 2)
    };
    this._drawRange.begin.x = $gamePlayer.x - range.x;
    this._drawRange.begin.y = $gamePlayer.y - range.y;
    this._drawRange.end.x   = $gamePlayer.x + range.x;
    this._drawRange.end.y   = $gamePlayer.y + range.y;
};

/**
 * タイルマップの表示領域を更新
 */
Sprite_Minimap.prototype.updateTilemap = function()
{
    if (!this._tilemap)
    {
        return;
    }

    this._tilemap.origin.x =
        ($gamePlayer._realX - this._tileCount.x / 2.0 + 1.5) * $gameMap.tileWidth();
    this._tilemap.origin.y =
        ($gamePlayer._realY - this._tileCount.y / 2.0 + 1.5) * $gameMap.tileHeight();
};

/**
 * 通行可能領域スプライトの更新
 */
Sprite_Minimap.prototype.updatePassageSprite = function()
{
    // TODO: 実装
};

/**
 * オブジェクトスプライトの更新
 */
Sprite_Minimap.prototype.updateObjectSprites = function()
{
    this._objectSprites.forEach(function(sprite)
    {
        var obj = sprite.getObject();
        if (!obj || !this.isInDrawRange(obj.x - 1, obj.y - 1))
        {
            sprite.visible = false;
            return;
        }

        sprite.updatePosition(this._drawRange.begin, this._scrollDiff);
    }, this);
};

/**
 * 現在位置スプライトの更新
 */
Sprite_Minimap.prototype.updatePlayerSprite = function()
{
    // スプライトの向きを設定
    var angle;
    if (KMS.imported['3DVehicle'] && $gameMap.is3DMode())
    {
        angle = -$gameMap.get3DPlayerAngle();
    }
    else
    {
        switch ($gamePlayer.direction())
        {
            case 2:  angle = Math.PI; break;
            case 4:  angle = Math.PI * 3 / 2; break;
            case 6:  angle = Math.PI / 2; break;
            case 8:  angle = 0; break;
            default: angle = 0; break;
        }
    }
    this._playerSprite.rotation = angle;
};

/**
 * ミニマップの再構築
 */
Sprite_Minimap.prototype.refresh = function()
{
    this.updatePosition();
    this.refreshTilemap();
    this.refreshParameters();
    this.refreshMapImage();
};

/**
 * タイルマップの再構築
 */
Sprite_Minimap.prototype.refreshTilemap = function()
{
    if (!this._tilemap)
    {
        return;
    }

    var rect = Params.mapRect;
    var baseSize = {
        width:  Math.floor(rect.width  * $gameMap.tileWidth()  / Params.gridSize),
        height: Math.floor(rect.height * $gameMap.tileHeight() / Params.gridSize)
    };

    // タイルマップのパラメータを設定
    this._tilemap.tileWidth  = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.width      = baseSize.width;
    this._tilemap.height     = baseSize.height;
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap   = $gameMap.isLoopVertical();

    var scaleX = Params.mapRect.width / this._tilemap.width;
    var scaleY = Params.mapRect.height / this._tilemap.height;
    this._tilemap.scale.x = scaleX;
    this._tilemap.scale.y = scaleY;
    this._tilemap.x += this._tilemap._margin * scaleX;
    this._tilemap.y += this._tilemap._margin * scaleY;
    //this._tilemap.width += this._tilemap._margin * 2;
    //this._tilemap.height += this._tilemap._margin * 2;

    Spriteset_Map.prototype.loadTileset.call(this);

    // タイルマップを再描画するために update を呼ぶ
    (Graphics.isWebGL() ? ShaderTilemap : Tilemap)
        .prototype.update.call(this._tilemap);

    this._tileCount = this._tilemap.getTileCount();
};

/**
 * ミニマップ用パラメータの再構築
 */
Sprite_Minimap.prototype.refreshParameters = function()
{
    this.updateDrawRange();
    this.refreshPassageTable();
};

/**
 * 通行フラグテーブルの更新
 */
Sprite_Minimap.prototype.refreshPassageTable = function()
{
    this._passageCache = this.getPassageTableCache();
};

/**
 * 現在のマップに対応する通行フラグキャッシュを取得
 */
Sprite_Minimap.prototype.getPassageTableCache = function()
{
    return new Game_MinimapPassageCache($gameMap, this._drawGridNumber);
};

/**
 * マップ画像の再構築
 */
Sprite_Minimap.prototype.refreshMapImage = function()
{
    this.drawMap();
};

/**
 * 指定した座標が含まれるブロックの通行フラグをスキャン
 */
Sprite_Minimap.prototype.scanPassage = function(x, y)
{
    var mapWidth  = $gameMap.width();
    var mapHeight = $gameMap.height();
    if ($gameMap.isLoopHorizontal())
    {
        x = (x + mapWidth) % mapWidth;
    }
    if ($gameMap.isLoopVertical())
    {
        y = (y + mapHeight) % mapHeight;
    }

    var blocks = this._passageCache.getBlockCount();
    var bx = Math.floor(x / this._drawGridNumber.x);
    var by = Math.floor(y / this._drawGridNumber.y);

    if (bx < 0 || bx >= blocks.x || by < 0 || by >= blocks.y)
    {
        // マップ範囲外
        return;
    }

    if (this._passageCache.isBlockChecked(bx, by))
    {
        // 探索済み
        return;
    }

    var range = {
        x: {
            begin: bx * this._drawGridNumber.x,
            end:   (bx + 1) * this._drawGridNumber.x
        },
        y: {
            begin: by * this._drawGridNumber.y,
            end:   (by + 1) * this._drawGridNumber.y
        }
    };

    // 探索範囲内の通行テーブルを生成
    for (var ty = range.y.begin; ty < range.y.end; ty++)
    {
        if (ty < 0 || ty >= mapHeight)
        {
            continue;
        }

        for (var tx = range.x.begin; tx < range.x.end; tx++)
        {
            if (tx < 0 || tx >= mapWidth)
            {
                continue;
            }

            // 通行方向フラグの作成
            // (方向は 2, 4, 6, 8)
            var flag = 0;
            for (var i = 0; i < 4; i++)
            {
                var dir = (i + 1) * 2;
                if ($gameMap.isPassable(tx, ty, dir))
                {
                    flag |= 1 << (dir / 2 - 1);
                }
            }
            this._passageCache.setFlag(tx, ty, flag);
        }
    }

    this._passageCache.setBlockChecked(bx, by, true);
};

/**
 * プレイヤー周囲の通行フラグテーブルを更新
 */
Sprite_Minimap.prototype.updateAroundPassageTable = function()
{
    var gx = this._drawGridNumber.x;
    var gy = this._drawGridNumber.y;
    var dx = $gamePlayer.x - Math.floor(gx / 2);
    var dy = $gamePlayer.y - Math.floor(gy / 2);
    this.scanPassage(dx, dy);
    this.scanPassage(dx + gx, dy);
    this.scanPassage(dx, dy + gy);
    this.scanPassage(dx + gx, dy + gy);
};

/**
 * プレイヤー位置の更新
 */
Sprite_Minimap.prototype.updatePosition = function()
{
    this._scrollDiff.x = ($gamePlayer._realX - $gamePlayer.x) * Params.gridSize;
    this._scrollDiff.y = ($gamePlayer._realY - $gamePlayer.y) * Params.gridSize;
    this.updateScroll();

    if (this._lastPosition.x !== $gamePlayer.x ||
        this._lastPosition.y !== $gamePlayer.y)
    {
        this.updateDrawRange();
        this.drawMap();
        this._lastPosition.x = $gamePlayer.x;
        this._lastPosition.y = $gamePlayer.y;
    }
};

/**
 * スクロール処理
 */
Sprite_Minimap.prototype.updateScroll = function()
{
    var offset = {
        x: Math.floor((Params.gridSize) * 1.5) + this._scrollDiff.x,
        y: Math.floor((Params.gridSize) * 1.5) + this._scrollDiff.y
    };
    var rect = Params.mapRect;
    this._passageSprite.setFrame(offset.x, offset.y, rect.width, rect.height);
};

/**
 * 描画範囲か判定
 */
Sprite_Minimap.prototype.isInDrawRange = function(x, y)
{
    var begin = this._drawRange.begin;
    var end   = this._drawRange.end;

    var dx = x;
    if ($gameMap.isLoopHorizontal())
    {
        dx = (dx + $gameMap.width()) % $gameMap.width();
    }

    var dy = y;
    if ($gameMap.isLoopVertical())
    {
        dy = (dy + $gameMap.height()) % $gameMap.height();
    }

    return x >= begin.x && x <= end.x &&
        y >= begin.y && y <= end.y;
};

/**
 * マップの範囲内か判定
 */
Sprite_Minimap.prototype.isInMapRange = function(x, y)
{
    return x >= 0 && x < $gameMap.width() &&
        y >= 0 && y < $gameMap.height();
};

/**
 * マップ画像の描画
 */
Sprite_Minimap.prototype.drawMap = function()
{
    this.updateAroundPassageTable();

    var bitmap = this._passageSprite.bitmap;
    bitmap.clear();
    this.drawMapForeground(bitmap);
};

/**
 * 移動可能領域の描画
 */
Sprite_Minimap.prototype.drawMapForeground = function(bitmap)
{
    for (var y = this._drawRange.begin.y; y < this._drawRange.end.y; y++)
    {
        for (var x = this._drawRange.begin.x; x < this._drawRange.end.x; x++)
        {
            this.drawMapForegroundGrid(bitmap, Math.floor(x), Math.floor(y));
        }
    }
};

/**
 * 移動可能グリッドの描画
 */
Sprite_Minimap.prototype.drawMapForegroundGrid = function(bitmap, x, y)
{
    var passage = this._passageCache;
    if (!passage.isPassable(x, y))
    {
        return;
    }

    var dx = (x - this._drawRange.begin.x) * Params.gridSize;
    var dy = (y - this._drawRange.begin.y) * Params.gridSize;
    var dw = Params.gridSize;
    var dh = Params.gridSize;

    if (!passage.isPassableDir(x, y, 2))  // 下方向移動不可
    {
        dh -= 1;
    }
    if (!passage.isPassableDir(x, y, 4))  // 左方向移動不可
    {
        dx += 1;
        dw -= 1;
    }
    if (!passage.isPassableDir(x, y, 6))  // 右方向移動不可
    {
        dw -= 1;
    }
    if (!passage.isPassableDir(x, y, 8))  // 上方向移動不可
    {
        dy += 1;
        dh -= 1;
    }
    bitmap.fillRect(dx, dy, dw, dh, Params.foregroundColor);
};


//-----------------------------------------------------------------------------
// Sprite_MinimapPassage
//
// ミニマップ上の通行可能領域表示用スプライトです。

function Sprite_MinimapPassage()
{
    this.initialize.apply(this, arguments);
}

Sprite_MinimapPassage.prototype = Object.create(Sprite.prototype);
Sprite_MinimapPassage.prototype.constructor = Sprite_MinimapPassage;

Sprite_MinimapPassage.prototype.initialize = function(width, height)
{
    Sprite.prototype.initialize.call(this);

    this.bitmap = new Bitmap(width, height);
};


//-----------------------------------------------------------------------------
// Sprite_MinimapIcon
//
// ミニマップ上のアイコン用スプライトです。

function Sprite_MinimapIcon()
{
    this.initialize.apply(this, arguments);
}

Sprite_MinimapIcon.prototype = Object.create(Sprite.prototype);
Sprite_MinimapIcon.prototype.constructor = Sprite_MinimapIcon;

Sprite_MinimapIcon.prototype.initialize = function()
{
    Sprite.prototype.initialize.call(this);

    this.bitmap   = ImageManager.loadSystem(Params.objectIconImage);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this._object        = null;
    this._lastIconIndex = -1;
    this._blinkDuration = 0;
};

/**
 * 表示準備ができているか
 */
Sprite_MinimapIcon.prototype.isReady = function()
{
    return this.bitmap && this.bitmap.isReady();
};

/**
 * 追従するオブジェクトの取得
 */
Sprite_MinimapIcon.prototype.getObject = function()
{
    return this._object;
};

/**
 * 追従するオブジェクトの設定
 */
Sprite_MinimapIcon.prototype.setObject = function(object)
{
    this._object = object;
    if (object)
    {
        this.bitmap = ImageManager.loadSystem(Params.objectIconImage);
        this.updateIconInfo();
    }

    this.refresh();
};

/**
 * 表示位置の更新
 *
 * @param {Point} begin      - ミニマップの表示開始座標
 * @param {Point} scrollDiff - 位置補正のためのマップスクロール量
 */
Sprite_MinimapIcon.prototype.updatePosition = function(begin, scrollDiff)
{
    var x = (this._object.x - begin.x - 1) * Params.gridSize;
    var y = (this._object.y - begin.y - 1) * Params.gridSize;
    this.x = x - scrollDiff.x;
    this.y = y - scrollDiff.y;

    if (KMS.imported['AreaEvent'])
    {
        // 表示サイズに応じた位置補正
        this.x += this._iconSize * (this.scale.x - 1.0) / 2;
        this.y += this._iconSize * (this.scale.y - 1.0) / 2;
    }
};

/**
 * アイコン情報の更新
 */
Sprite_MinimapIcon.prototype.updateIconInfo = function()
{
    if (!this.isReady())
    {
        this._iconSize    = null;
        this._iconColumns = null;
        return;
    }

    this._iconSize    = Math.floor(this.bitmap.height / 3);
    this._iconColumns = Math.floor(this.bitmap.width / this._iconSize);
};

/**
 * リフレッシュ
 */
Sprite_MinimapIcon.prototype.refresh = function()
{
    this._lastIconIndex = -1;
};

/**
 * オブジェクト更新
 */
Sprite_MinimapIcon.prototype.update = function()
{
    Sprite.prototype.update.call(this);

    this.updateImage();
    this.updateBlink();
};

/**
 * 表示する画像の更新
 */
Sprite_MinimapIcon.prototype.updateImage = function()
{
    if (!this._object)
    {
        return;
    }

    if (!this._iconColumns)
    {
        this.updateIconInfo();
    }

    var iconIndex = this.getCurrentIconIndex();
    if (iconIndex >= 0)
    {
        if (iconIndex !== this._lastIconIndex || this._object.isMinimapAttributeDirty())
        {
            this.setIconIndex(iconIndex);
        }
    }
    else
    {
        this._lastIconIndex = iconIndex;
        this.visible = false;
    }
};

/**
 * 現在のオブジェクトに対応するオブジェクトアイコン番号の取得
 */
Sprite_MinimapIcon.prototype.getCurrentIconIndex = function()
{
    if (!(this._object && this.isReady()))
    {
        return -1;
    }

    if (this._object instanceof Game_Vehicle)
    {
        return this.getCurrentIconIndexForVehicle();
    }
    else
    {
        return this.getCurrentIconIndexForEvent();
    }
};

/**
 * 現在のイベントに対応するアイコン番号の取得
 */
Sprite_MinimapIcon.prototype.getCurrentIconIndexForEvent = function()
{
    var obj = this._object;

    if (obj.isMinimapMove())
    {
        return 0;
    }
    else if (obj.minimapPersonType() >= 0)
    {
        // person は 2 行目
        return this._iconColumns + obj.minimapPersonType();
    }
    else if (obj.minimapObjectType() >= 0)
    {
        // object は 3 行目
        return this._iconColumns * 2 + obj.minimapObjectType();
    }
    else
    {
        return -1;
    }
};

/**
 * 現在の乗り物に対応するアイコン番号の取得
 */
Sprite_MinimapIcon.prototype.getCurrentIconIndexForVehicle = function()
{
    var obj = this._object;

    if (!obj.isInCurrentMap())
    {
        return -1;
    }
    else if (obj.isBoat())
    {
        return $gamePlayer.isInBoat() ? -1 : 1;
    }
    else if (obj.isShip())
    {
        return $gamePlayer.isInShip() ? -1 : 2;
    }
    else if (obj.isAirship())
    {
        return $gamePlayer.isInAirship() ? -1 : 3;
    }
    else
    {
        // 不明な乗り物
        return -1;
    }
};

/**
 * オブジェクトアイコン番号の設定
 */
Sprite_MinimapIcon.prototype.setIconIndex = function(iconIndex)
{
    this.setFrame(
        (iconIndex % this._iconColumns) * this._iconSize,
        Math.floor(iconIndex / this._iconColumns) * this._iconSize,
        this._iconSize,
        this._iconSize);
    this.updateDisplaySize();

    this._object.clearMinimapAttributeDirty();
    this._lastIconIndex = iconIndex;
    this.visible = true;
};

/**
 * オブジェクトアイコン表示サイズの更新
 */
Sprite_MinimapIcon.prototype.updateDisplaySize = function()
{
    if (!KMS.imported['AreaEvent'] ||
        !(this._object instanceof Game_Event))
    {
        return;
    }

    var area = this._object.getEventTriggerArea();
    this.scale.x = area.width;
    this.scale.y = area.height;
};

/**
 * 明滅エフェクトの更新
 */
Sprite_MinimapIcon.prototype.updateBlink = function()
{
    this._blinkDuration = (this._blinkDuration + 1) % Params.blinkTime;

    var alpha = 128 * (Math.sin(this._blinkDuration * Math.PI * 2 / Params.blinkTime) + 1);
    var color = [255, 255, 255, alpha];
    this.setBlendColor(color);
};


//-----------------------------------------------------------------------------
// Spriteset_Map

var _KMS_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function()
{
    _KMS_Spriteset_Map_createUpperLayer.call(this);

    this.createMinimap();
};

/**
 * ミニマップの作成
 */
Spriteset_Map.prototype.createMinimap = function()
{
    this._minimap = new Sprite_Minimap();
    this._minimap.refresh();
    this.addChild(this._minimap);
};

var _KMS_Spriteset_Map = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function()
{
    _KMS_Spriteset_Map.call(this);

    this.updateMinimap();
};

/**
 * ミニマップの更新
 */
Spriteset_Map.prototype.updateMinimap = function()
{
    this._minimap.setWholeOpacity(255 - this._fadeSprite.opacity);
    this._minimap.update();
};

})();
